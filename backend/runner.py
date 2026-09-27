"""
runner.py — EEA Optimization Backend (FastAPI version).

API Endpoint:
    POST /api/process
    
Request Parameters (8 total):
    1. dri_file: UploadFile        (Form: DRI Analysis.xlsx)
    2. melt_op_file: UploadFile    (Form: Melt Operation.xlsx)
    3. melt_an_file: UploadFile    (Form: Melt Analysis.xlsx)
    4. slag_file: UploadFile       (Form: Slag Analysis.xlsx)
    5. waterCooling: JSON string   (Settings Tab 1)
    6. dustAnalysis: JSON string   (Settings Tab 2)
    7. additives: JSON string      (Settings Tab 3)
    8. gradeSpecs: JSON string     (Settings Tab 4)
    9. chemicalEnergy: JSON string (Settings Tab 5)
    10. longTermYield: JSON string (Settings Tab 6)
    11. thresholds: JSON string    (Settings Tab 7)
    12. start_heat, end_heat: optional range parameters

Response: {job_id, created_at, settings, rows, total}

The response is immediately available (no polling).
Results are also saved to ./results/<job_id>.json for inspection.
"""

import io
import json
import os
import uuid
from datetime import datetime

import uvicorn
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse

try:
    from openpyxl import Workbook
    HAS_OPENPYXL = True
except ImportError:
    HAS_OPENPYXL = False

app = FastAPI()

# CORS — the Next.js frontend (usually :3000 or the Electron renderer) calls
# this server (:5000) directly.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# In-memory "databases" (fine for a fake/dev backend — everything resets on
# restart, exactly like a mock should behave)
# ---------------------------------------------------------------------------
FILES = {}   # file_id -> {"uploaded_at": ..., "filenames": {...}}
JOBS = {}    # job_id  -> {"status", "progress", "progress_label", "summary", "error", "all_rows"}

RESULTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "results")
os.makedirs(RESULTS_DIR, exist_ok=True)

# The 7 settings tabs the frontend's Settings modal sends
SETTINGS_TABS = [
    "waterCooling",
    "dustAnalysis",
    "additives",
    "gradeSpecs",
    "chemicalEnergy",
    "longTermYield",
    "thresholds",
]

# Load fake data for responses
FAKE_DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fake_data.json")


def parse_settings(waterCooling, dustAnalysis, additives, gradeSpecs, chemicalEnergy, termYield, tolerance, chemicalEnergyRHS=''):
    """Parse individual settings parameters from form data."""
    def parse_json(value):
        if isinstance(value, str):
            try:
                return json.loads(value)
            except json.JSONDecodeError:
                return None
        return value
    
    return {
        "WaterCooling": parse_json(waterCooling) or [],
        "DustAnalysis": parse_json(dustAnalysis) or [],
        "Additives": parse_json(additives) or [],
        "GradeSpecification": parse_json(gradeSpecs) or [],
        "ChemicalEnergyThreshold": parse_json(chemicalEnergy) or [],
        "ChemicalEnergyRHS": parse_json(chemicalEnergyRHS) or {},
        "TermYield": parse_json(termYield) or [],
        "Tolerance": parse_json(tolerance) or {},
    }


def apply_settings_priority(rows, settings):
    """Apply Chemical Energy thresholds to calculate status.
    Uses ChemicalEnergyThreshold (EAF array) and ChemicalEnergyRHS (RHS object).
    """
    threshold_data = settings.get("ChemicalEnergyThreshold") or []
    rhs = settings.get("ChemicalEnergyRHS") or {}

    def to_float(v):
        try:
            return float(v)
        except (TypeError, ValueError):
            return None

    # Collect RHS values
    rhs_vals = [to_float(rhs.get(k)) for k in ("LtFirstThreshold", "LtSecondThreshold", "LtThirdThreshold", "GtThirdThreshold")]
    rhs_vals = [v for v in rhs_vals if v is not None]

    # Collect EAF threshold values
    eaf_vals = []
    for eaf in threshold_data:
        for k in ("FirstThreshold", "SecondThreshold", "ThirdThreshold"):
            v = to_float(eaf.get(k))
            if v is not None:
                eaf_vals.append(v)

    all_vals = rhs_vals + eaf_vals
    if not all_vals:
        return rows  # No thresholds provided, return as-is

    energy_threshold = sum(all_vals) / len(all_vals)

    out = []
    for r in rows:
        row = dict(r)
        # Compare HU (heat energy use) against energy threshold
        ratio = row.get("HU", 0) / energy_threshold if energy_threshold else 0
        if ratio <= 1.0:
            row["status"] = "PERFECT"
        elif ratio <= 1.15:
            row["status"] = "GOOD"
        else:
            row["status"] = "ACCEPTABLE"
        out.append(row)
    return out


def write_result_json(job_id, settings, rows, total):
    """Writes the per-job result file to ./results/<job_id>.json and
    returns the dict that was written (this is also what /api/status'
    "summary" field returns)."""
    payload = {
        "job_id": job_id,
        "created_at": datetime.utcnow().isoformat(),
        "settings": settings,
        "rows": rows,
        "total": total,
    }
    path = os.path.join(RESULTS_DIR, f"{job_id}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return payload

# ---------------------------------------------------------------------------
# Load the default fake dataset from fake_data.json (same folder as this
# file). Edit that JSON file whenever you want to change what shows up in
# the results table — no need to touch this script.
# ---------------------------------------------------------------------------
FAKE_DATA_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fake_data.json")

try:
    with open(FAKE_DATA_PATH, "r", encoding="utf-8") as f:
        FAKE_ROWS = json.load(f)["rows"]
except (FileNotFoundError, KeyError, json.JSONDecodeError) as e:
    print(f"[runner.py] WARNING: could not load {FAKE_DATA_PATH} ({e}). "
          f"Falling back to a single placeholder row.")
    FAKE_ROWS = [
        {"heat_no": 1001, "FZ": 1.0, "IO": 30.0, "FL": 4.0, "HU": 600.0, "status": "GOOD"}
    ]

# The fake "dataset" is assumed to span this heat-number range
FAKE_MIN_HEAT = min(r["heat_no"] for r in FAKE_ROWS)
FAKE_MAX_HEAT = max(r["heat_no"] for r in FAKE_ROWS)
def build_fake_workbook(rows):
    """Builds a minimal .xlsx in-memory from the fake rows (or a placeholder
    workbook if openpyxl isn't installed)."""
    if not HAS_OPENPYXL:
        return b"Fake results file - install openpyxl for a real .xlsx export."

    wb = Workbook()
    ws = wb.active
    ws.title = "Results"
    ws.append(["Heat No.", "FZ", "IO", "FL", "HU", "Status"])

    for row in rows:
        ws.append([row["heat_no"], row["FZ"], row["IO"], row["FL"], row["HU"], row["status"]])

    buffer = io.BytesIO()
    wb.save(buffer)
    return buffer.getvalue()


# ---------------------------------------------------------------------------
# ONE single endpoint — this is the whole API surface for input: 4 files +
# the range + the full 7-tab settings (8 parameter groups: 6 single tabs +
# the Chemical Energy tab's 2 sections — the RHS block above its table, and
# the 8-row EAF table itself). One multipart request in, one JSON result
# out — synchronously, no separate upload/validate/run/poll round-trip.
#
#     multipart/form-data fields:
#       dri_file, melt_op_file, melt_an_file, slag_file  (the 4 files)
#       settings     -> JSON string of the 7-tab settings object
#       start_heat, end_heat  -> optional strings, empty = whole dataset
#
#     Response: the same shape written to results/<job_id>.json, returned
#     immediately (no polling):
#       {job_id, created_at, settings, rows, total}
#       or, on a bad range: {success: false, error: "..."} (HTTP 400)
# ---------------------------------------------------------------------------
@app.post("/api/process")
async def process_all(
    dri_file: UploadFile = File(...),
    melt_op_file: UploadFile = File(...),
    melt_an_file: UploadFile = File(...),
    slag_file: UploadFile = File(...),
    waterCooling: str = Form("[]"),
    dustAnalysis: str = Form("[]"),
    additives: str = Form("[]"),
    gradeSpecs: str = Form("[]"),
    chemicalEnergy: str = Form("[]"),
    chemicalEnergyRHS: str = Form("{}"),
    longTermYield: str = Form("[]"),
    thresholds: str = Form("{}"),
    start_heat: str = Form(""),
    end_heat: str = Form(""),
):
    """
    Main processing endpoint.
    Takes 4 Excel files + 7 settings tabs (as JSON strings) + ChemicalEnergyRHS + optional range.
    Returns results immediately with job_id.
    """
    # Read uploaded files (proof of receipt)
    await dri_file.read()
    await melt_op_file.read()
    await melt_an_file.read()
    await slag_file.read()

    # Parse all settings tabs with new structure
    settings = parse_settings(
        waterCooling,
        dustAnalysis,
        additives,
        gradeSpecs,
        chemicalEnergy,
        longTermYield,
        thresholds,
        chemicalEnergyRHS,
    )

    # Apply range filter if provided
    if start_heat and end_heat:
        try:
            lo, hi = int(start_heat), int(end_heat)
        except (TypeError, ValueError):
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": "Heat numbers must be integers."},
            )
        if lo > hi:
            return JSONResponse(
                status_code=400,
                content={"success": False, "error": "Start heat cannot be greater than end heat."},
            )
        if lo < FAKE_MIN_HEAT - 500 or hi > FAKE_MAX_HEAT + 500:
            return JSONResponse(
                status_code=400,
                content={
                    "success": False,
                    "error": f"Range must be within the uploaded data (around {FAKE_MIN_HEAT}-{FAKE_MAX_HEAT}).",
                },
            )
        filtered = [r for r in FAKE_ROWS if lo <= r["heat_no"] <= hi]
    else:
        filtered = FAKE_ROWS

    all_rows = filtered if filtered else FAKE_ROWS
    all_rows = apply_settings_priority(all_rows, settings)
    total = len(all_rows)

    job_id = uuid.uuid4().hex
    result_payload = write_result_json(job_id, settings, all_rows, total)

    # Register in JOBS and FILES for later retrieval
    FILES[job_id] = {
        "uploaded_at": result_payload["created_at"],
        "filenames": {
            "dri_file": dri_file.filename,
            "melt_op_file": melt_op_file.filename,
            "melt_an_file": melt_an_file.filename,
            "slag_file": slag_file.filename,
        },
    }
    JOBS[job_id] = {
        "status": "done",
        "progress": 100,
        "progress_label": "Done",
        "summary": {"rows": all_rows, "total": total, "settings": settings},
        "error": None,
        "all_rows": all_rows,
        "result_path": os.path.join(RESULTS_DIR, f"{job_id}.json"),
    }

    return result_payload


# ---------------------------------------------------------------------------
# Save settings — saves the settings from frontend
# This is called when the user clicks "Save Changes" in the settings modal
# Settings are returned directly to frontend; no need to persist to disk
# ---------------------------------------------------------------------------
@app.post("/api/settings")
async def save_settings(settings: str = Form(...)):
    """Accept settings from frontend and return them (frontend handles persistence)"""
    try:
        parsed_settings = json.loads(settings)
        
        # Validate that all required tabs are present
        for tab in SETTINGS_TABS:
            if tab not in parsed_settings:
                return JSONResponse(
                    status_code=400,
                    content={"success": False, "error": f"Missing required tab: {tab}"},
                )
        
        return {"success": True, "settings": parsed_settings}
    except json.JSONDecodeError:
        return JSONResponse(
            status_code=400,
            content={"success": False, "error": "Invalid JSON format"},
        )


# ---------------------------------------------------------------------------
# Poll status — kept only so a job_id from /api/process can still be
# re-checked/re-fetched later (e.g. after a page reload). /api/process
# itself already returns the finished result directly, so the frontend does
# not need to poll after calling it.
# ---------------------------------------------------------------------------
@app.get("/api/status/{job_id}")
async def job_status(job_id: str):
    job = JOBS.get(job_id)

    if job is None:
        return JSONResponse(status_code=404, content={"error": "Job not found."})

    return {
        "status": job["status"],
        "progress": job["progress"],
        "progress_label": job["progress_label"],
        "summary": job["summary"],
        "error": job["error"],
    }


# ---------------------------------------------------------------------------
# 4b) Read the result JSON file straight off disk (results/<job_id>.json).
#     Same content as the "summary" field above; exposed separately so the
#     UI (or anything else) can fetch/re-read just the JSON file on demand.
# ---------------------------------------------------------------------------
@app.get("/api/results/{job_id}")
async def get_result_file(job_id: str):
    path = os.path.join(RESULTS_DIR, f"{job_id}.json")

    if not os.path.isfile(path):
        return JSONResponse(status_code=404, content={"error": "Result file not found."})

    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# 5) Save results locally (fake "Save As" dialog)
# ---------------------------------------------------------------------------
@app.get("/api/save_local/{job_id}")
async def save_local(job_id: str):
    job = JOBS.get(job_id)

    if job is None or job.get("status") != "done":
        return JSONResponse(
            status_code=404,
            content={"status": "error", "error": "Job not found or not finished yet."},
        )

    rows = job.get("all_rows", [])
    workbook_bytes = build_fake_workbook(rows)

    try:
        import tkinter as tk
        from tkinter import filedialog

        root = tk.Tk()
        root.withdraw()
        root.attributes("-topmost", True)
        path = filedialog.asksaveasfilename(
            title="Save Optimization Results",
            defaultextension=".xlsx",
            initialfile=f"optimization_results_{job_id[:8]}.xlsx",
            filetypes=[("Excel files", "*.xlsx")],
        )
        root.destroy()

        if not path:
            return {"status": "cancelled"}

        with open(path, "wb") as f:
            f.write(workbook_bytes)

        return {"status": "success", "path": path}

    except Exception:
        # No display / tkinter unavailable (e.g. running headless) — fall
        # back to writing into the current working directory so the flow
        # still completes instead of erroring out.
        fallback_name = f"optimization_results_{job_id[:8]}.xlsx"
        with open(fallback_name, "wb") as f:
            f.write(workbook_bytes)

        return {"status": "success", "path": fallback_name}


# ---------------------------------------------------------------------------
# 6) Download (declared in config/api.js; not called by the current UI, but
#    implemented for parity/future use)
# ---------------------------------------------------------------------------
@app.get("/api/download/{job_id}")
async def download(job_id: str):
    job = JOBS.get(job_id)

    if job is None or job.get("status") != "done":
        return JSONResponse(
            status_code=404,
            content={"error": "Job not found or not finished yet."},
        )

    rows = job.get("all_rows", [])
    workbook_bytes = build_fake_workbook(rows)

    return StreamingResponse(
        io.BytesIO(workbook_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={
            "Content-Disposition": f'attachment; filename="optimization_results_{job_id[:8]}.xlsx"'
        },
    )


# ---------------------------------------------------------------------------
# Credentials endpoint for login
# ---------------------------------------------------------------------------
@app.get("/api/credentials")
async def get_credentials():
    """Return credentials from frontend/env/credentials.json for authentication."""
    try:
        # Path to credentials file
        creds_path = os.path.join(
            os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
            "frontend",
            "env",
            "credentials.json"
        )
        
        if os.path.exists(creds_path):
            with open(creds_path, "r", encoding="utf-8") as f:
                credentials = json.load(f)
                return credentials
        else:
            return JSONResponse(
                status_code=404,
                content={"error": "Credentials file not found"}
            )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": str(e)}
        )


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("=" * 60)
    print(" FAKE backend (FastAPI) — no real calculations are performed.")
    print(" Listening on http://127.0.0.1:5000")
    print("=" * 60)
    uvicorn.run(app, host="127.0.0.1", port=5000)