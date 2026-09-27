(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("electron-serve"));
	else if(typeof define === 'function' && define.amd)
		define(["electron-serve"], factory);
	else {
		var a = typeof exports === 'object' ? factory(require("electron-serve")) : factory(root["electron-serve"]);
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(global, (__WEBPACK_EXTERNAL_MODULE_electron_serve__) => {
return /******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "electron":
/*!***************************!*\
  !*** external "electron" ***!
  \***************************/
/***/ ((module) => {

module.exports = require("electron");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ "electron-serve":
/*!*********************************!*\
  !*** external "electron-serve" ***!
  \*********************************/
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_MODULE_electron_serve__;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./main/background.js ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! path */ "path");
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! electron */ "electron");
/* harmony import */ var electron__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(electron__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var electron_serve__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! electron-serve */ "electron-serve");
/* harmony import */ var electron_serve__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(electron_serve__WEBPACK_IMPORTED_MODULE_2__);
Object(function webpackMissingModule() { var e = new Error("Cannot find module './helpers'"); e.code = 'MODULE_NOT_FOUND'; throw e; }());




const isProd = "development" === 'production';
if (isProd) {
  electron_serve__WEBPACK_IMPORTED_MODULE_2___default()({
    directory: 'app'
  });
} else {
  electron__WEBPACK_IMPORTED_MODULE_1__.app.setPath('userData', `${electron__WEBPACK_IMPORTED_MODULE_1__.app.getPath('userData')} (development)`);
}
(async () => {
  await electron__WEBPACK_IMPORTED_MODULE_1__.app.whenReady();
  const mainWindow = Object(function webpackMissingModule() { var e = new Error("Cannot find module './helpers'"); e.code = 'MODULE_NOT_FOUND'; throw e; }())('main', {
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path__WEBPACK_IMPORTED_MODULE_0___default().join(__dirname, 'preload.js')
    }
  });
  if (isProd) {
    await mainWindow.loadURL('app://./index.html');
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }
})();
electron__WEBPACK_IMPORTED_MODULE_1__.app.on('window-all-closed', () => {
  electron__WEBPACK_IMPORTED_MODULE_1__.app.quit();
});
})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFja2dyb3VuZC5qcyIsIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0QsTzs7Ozs7Ozs7OztBQ1ZBLHFDOzs7Ozs7Ozs7O0FDQUEsaUM7Ozs7Ozs7Ozs7QUNBQSw0RDs7Ozs7O1VDQUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7Ozs7V0N0QkE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGlDQUFpQyxXQUFXO1dBQzVDO1dBQ0EsRTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBLEU7Ozs7O1dDUEEsd0Y7Ozs7O1dDQUE7V0FDQTtXQUNBO1dBQ0EsdURBQXVELGlCQUFpQjtXQUN4RTtXQUNBLGdEQUFnRCxhQUFhO1dBQzdELEU7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ053QjtBQUNnQjtBQUNMO0FBQ007QUFFekMsTUFBTUssTUFBTSxHQUFHQyxhQUFvQixLQUFLLFlBQVk7QUFFcEQsSUFBSUQsTUFBTSxFQUFFO0VBQ1ZGLHFEQUFLLENBQUM7SUFBRU0sU0FBUyxFQUFFO0VBQU0sQ0FBQyxDQUFDO0FBQzdCLENBQUMsTUFBTTtFQUNMUix5Q0FBRyxDQUFDUyxPQUFPLENBQUMsVUFBVSxFQUFFLEdBQUdULHlDQUFHLENBQUNVLE9BQU8sQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLENBQUM7QUFDckU7QUFFQSxDQUFDLFlBQVk7RUFDWCxNQUFNVix5Q0FBRyxDQUFDVyxTQUFTLENBQUMsQ0FBQztFQUVyQixNQUFNQyxVQUFVLEdBQUdULHdJQUFZLENBQUMsTUFBTSxFQUFFO0lBQ3RDVSxLQUFLLEVBQUUsSUFBSTtJQUNYQyxNQUFNLEVBQUUsR0FBRztJQUNYQyxjQUFjLEVBQUU7TUFDZEMsT0FBTyxFQUFFakIsZ0RBQVMsQ0FBQ21CLFNBQVMsRUFBRSxZQUFZO0lBQzVDO0VBQ0YsQ0FBQyxDQUFDO0VBRUYsSUFBSWQsTUFBTSxFQUFFO0lBQ1YsTUFBTVEsVUFBVSxDQUFDTyxPQUFPLENBQUMsb0JBQW9CLENBQUM7RUFDaEQsQ0FBQyxNQUFNO0lBQ0wsTUFBTUMsSUFBSSxHQUFHZixPQUFPLENBQUNnQixJQUFJLENBQUMsQ0FBQyxDQUFDO0lBQzVCLE1BQU1ULFVBQVUsQ0FBQ08sT0FBTyxDQUFDLG9CQUFvQkMsSUFBSSxHQUFHLENBQUM7SUFDckRSLFVBQVUsQ0FBQ1UsV0FBVyxDQUFDQyxZQUFZLENBQUMsQ0FBQztFQUN2QztBQUNGLENBQUMsRUFBRSxDQUFDO0FBRUp2Qix5Q0FBRyxDQUFDd0IsRUFBRSxDQUFDLG1CQUFtQixFQUFFLE1BQU07RUFDaEN4Qix5Q0FBRyxDQUFDeUIsSUFBSSxDQUFDLENBQUM7QUFDWixDQUFDLENBQUMsQyIsInNvdXJjZXMiOlsid2VicGFjazovL2VlYS1vcHRpbWl6ZXIvd2VicGFjay91bml2ZXJzYWxNb2R1bGVEZWZpbml0aW9uIiwid2VicGFjazovL2VlYS1vcHRpbWl6ZXIvZXh0ZXJuYWwgbm9kZS1jb21tb25qcyBcImVsZWN0cm9uXCIiLCJ3ZWJwYWNrOi8vZWVhLW9wdGltaXplci9leHRlcm5hbCBub2RlLWNvbW1vbmpzIFwicGF0aFwiIiwid2VicGFjazovL2VlYS1vcHRpbWl6ZXIvZXh0ZXJuYWwgdW1kIFwiZWxlY3Ryb24tc2VydmVcIiIsIndlYnBhY2s6Ly9lZWEtb3B0aW1pemVyL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2VlYS1vcHRpbWl6ZXIvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vZWVhLW9wdGltaXplci93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vZWVhLW9wdGltaXplci93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL2VlYS1vcHRpbWl6ZXIvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9lZWEtb3B0aW1pemVyLy4vbWFpbi9iYWNrZ3JvdW5kLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiB3ZWJwYWNrVW5pdmVyc2FsTW9kdWxlRGVmaW5pdGlvbihyb290LCBmYWN0b3J5KSB7XG5cdGlmKHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0Jylcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkocmVxdWlyZShcImVsZWN0cm9uLXNlcnZlXCIpKTtcblx0ZWxzZSBpZih0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpXG5cdFx0ZGVmaW5lKFtcImVsZWN0cm9uLXNlcnZlXCJdLCBmYWN0b3J5KTtcblx0ZWxzZSB7XG5cdFx0dmFyIGEgPSB0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBmYWN0b3J5KHJlcXVpcmUoXCJlbGVjdHJvbi1zZXJ2ZVwiKSkgOiBmYWN0b3J5KHJvb3RbXCJlbGVjdHJvbi1zZXJ2ZVwiXSk7XG5cdFx0Zm9yKHZhciBpIGluIGEpICh0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgPyBleHBvcnRzIDogcm9vdClbaV0gPSBhW2ldO1xuXHR9XG59KShnbG9iYWwsIChfX1dFQlBBQ0tfRVhURVJOQUxfTU9EVUxFX2VsZWN0cm9uX3NlcnZlX18pID0+IHtcbnJldHVybiAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJwYXRoXCIpOyIsIm1vZHVsZS5leHBvcnRzID0gX19XRUJQQUNLX0VYVEVSTkFMX01PRFVMRV9lbGVjdHJvbl9zZXJ2ZV9fOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7IGFwcCwgaXBjTWFpbiB9IGZyb20gJ2VsZWN0cm9uJztcbmltcG9ydCBzZXJ2ZSBmcm9tICdlbGVjdHJvbi1zZXJ2ZSc7XG5pbXBvcnQgeyBjcmVhdGVXaW5kb3cgfSBmcm9tICcuL2hlbHBlcnMnO1xuXG5jb25zdCBpc1Byb2QgPSBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nO1xuXG5pZiAoaXNQcm9kKSB7XG4gIHNlcnZlKHsgZGlyZWN0b3J5OiAnYXBwJyB9KTtcbn0gZWxzZSB7XG4gIGFwcC5zZXRQYXRoKCd1c2VyRGF0YScsIGAke2FwcC5nZXRQYXRoKCd1c2VyRGF0YScpfSAoZGV2ZWxvcG1lbnQpYCk7XG59XG5cbihhc3luYyAoKSA9PiB7XG4gIGF3YWl0IGFwcC53aGVuUmVhZHkoKTtcblxuICBjb25zdCBtYWluV2luZG93ID0gY3JlYXRlV2luZG93KCdtYWluJywge1xuICAgIHdpZHRoOiAxMjAwLFxuICAgIGhlaWdodDogODAwLFxuICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICBwcmVsb2FkOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAncHJlbG9hZC5qcycpLFxuICAgIH0sXG4gIH0pO1xuXG4gIGlmIChpc1Byb2QpIHtcbiAgICBhd2FpdCBtYWluV2luZG93LmxvYWRVUkwoJ2FwcDovLy4vaW5kZXguaHRtbCcpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHBvcnQgPSBwcm9jZXNzLmFyZ3ZbMl07XG4gICAgYXdhaXQgbWFpbldpbmRvdy5sb2FkVVJMKGBodHRwOi8vbG9jYWxob3N0OiR7cG9ydH0vYCk7XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgfVxufSkoKTtcblxuYXBwLm9uKCd3aW5kb3ctYWxsLWNsb3NlZCcsICgpID0+IHtcbiAgYXBwLnF1aXQoKTtcbn0pOyJdLCJuYW1lcyI6WyJwYXRoIiwiYXBwIiwiaXBjTWFpbiIsInNlcnZlIiwiY3JlYXRlV2luZG93IiwiaXNQcm9kIiwicHJvY2VzcyIsImVudiIsIk5PREVfRU5WIiwiZGlyZWN0b3J5Iiwic2V0UGF0aCIsImdldFBhdGgiLCJ3aGVuUmVhZHkiLCJtYWluV2luZG93Iiwid2lkdGgiLCJoZWlnaHQiLCJ3ZWJQcmVmZXJlbmNlcyIsInByZWxvYWQiLCJqb2luIiwiX19kaXJuYW1lIiwibG9hZFVSTCIsInBvcnQiLCJhcmd2Iiwid2ViQ29udGVudHMiLCJvcGVuRGV2VG9vbHMiLCJvbiIsInF1aXQiXSwic291cmNlUm9vdCI6IiJ9