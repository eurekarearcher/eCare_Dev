(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[42],{

/***/ "./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ecare-app/Main.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ecare-app/Main.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  data() {\n    return {\n      slide_group_model: false\n    };\n  }\n\n});\n\n//# sourceURL=webpack:///./src/components/ecare-app/Main.vue?./node_modules/cache-loader/dist/cjs.js??ref--13-0!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"aaa67490-vue-loader-template\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ecare-app/Main.vue?vue&type=template&id=6c65970e&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"aaa67490-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/ecare-app/Main.vue?vue&type=template&id=6c65970e& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function () {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"v-container\",\n    [\n      _c(\n        \"v-sheet\",\n        [\n          _c(\"v-img\", {\n            attrs: { src: __webpack_require__(/*! @/assets/eurekare-logo.jpg */ \"./src/assets/eurekare-logo.jpg\"), width: \"240\" },\n          }),\n        ],\n        1\n      ),\n      _c(\"v-divider\"),\n      _c(\n        \"v-row\",\n        { attrs: { \"no-gutters\": \"\", dense: \"\" } },\n        [\n          _c(\n            \"v-col\",\n            {\n              staticClass: \"pl-8\",\n              attrs: { cols: \"12\", sm: \"12\", md: \"8\", lg: \"8\" },\n            },\n            [\n              _c(\n                \"v-sheet\",\n                [\n                  _c(\n                    \"h1\",\n                    { staticClass: \"text-h1 font-weight-regular my-3\" },\n                    [_vm._v(\" eCare\")]\n                  ),\n                  _c(\"h4\", { staticClass: \"teal--text my-3\" }, [\n                    _vm._v(\" Eurekare Corporation \"),\n                  ]),\n                  _c(\n                    \"v-btn\",\n                    {\n                      staticClass: \"teal white--text my-3\",\n                      attrs: {\n                        href:\n                          _vm.$services.base_url.cms +\n                          \"/resources/apk_files/download_apk.php\",\n                      },\n                    },\n                    [_vm._v(\" Download APK \")]\n                  ),\n                  _c(\n                    \"v-sheet\",\n                    { staticClass: \"d-flex justify-start align-end my-3\" },\n                    [\n                      _c(\n                        \"v-icon\",\n                        { staticClass: \"mr-2\", attrs: { medium: \"\" } },\n                        [_vm._v(\" mdi mdi-cellphone-link \")]\n                      ),\n                      _c(\n                        \"h4\",\n                        { staticClass: \"text-body-2 font-weight-regular\" },\n                        [_vm._v(\" This app is available on android device \")]\n                      ),\n                    ],\n                    1\n                  ),\n                ],\n                1\n              ),\n              _c(\"v-divider\"),\n              _c(\n                \"v-slide-group\",\n                {\n                  staticClass: \"pa-4\",\n                  attrs: { \"active-class\": \"success\", \"show-arrows\": \"\" },\n                  model: {\n                    value: _vm.slide_group_model,\n                    callback: function ($$v) {\n                      _vm.slide_group_model = $$v\n                    },\n                    expression: \"slide_group_model\",\n                  },\n                },\n                _vm._l(6, function (data) {\n                  return _c(\"v-slide-item\", {\n                    key: data,\n                    scopedSlots: _vm._u(\n                      [\n                        {\n                          key: \"default\",\n                          fn: function (ref) {\n                            var toggle = ref.toggle\n                            return [\n                              _c(\n                                \"v-sheet\",\n                                { staticClass: \"ma-4\", on: { click: toggle } },\n                                [\n                                  _c(\"v-img\", {\n                                    attrs: {\n                                      src: __webpack_require__(\"./src/assets/ecare-app sync recursive ^\\\\.\\\\/ecare.*\\\\.png$\")(\"./ecare\" +\n                                        data +\n                                        \".png\"),\n                                      width: \"200\",\n                                    },\n                                  }),\n                                ],\n                                1\n                              ),\n                            ]\n                          },\n                        },\n                      ],\n                      null,\n                      true\n                    ),\n                  })\n                }),\n                1\n              ),\n              _c(\"v-sheet\", { staticClass: \"my-8\" }, [\n                _c(\"h4\", { staticClass: \"text-body-1 font-weight-medium\" }, [\n                  _vm._v(\" About this app \"),\n                ]),\n                _c(\"p\", { staticClass: \"text-body-2\" }, [\n                  _vm._v(\n                    \" This application enables effortless QR Code creation and facilitates the registration of your family members into the eCare System. Additionally, you can securely access your electronic medical records through the app and virtually consult with your preferred doctor. Our primary objectives is to ensure the security and well-being of your family's health. \"\n                  ),\n                ]),\n              ]),\n              _c(\"v-sheet\", { staticClass: \"my-8\" }, [\n                _c(\"h4\", { staticClass: \"text-body-1 font-weight-medium\" }, [\n                  _vm._v(\" How it works \"),\n                ]),\n                _c(\"p\", { staticClass: \"text-body-2\" }, [\n                  _vm._v(\n                    \" eCare App creates seamless connection to our eCare web-based application located in registered medical facilities. Using the app, scan the QR Code to initiate a medical transaction. \"\n                  ),\n                ]),\n              ]),\n              _c(\"v-sheet\", { staticClass: \"my-8\" }, [\n                _c(\"h4\", { staticClass: \"text-body-1 font-weight-medium\" }, [\n                  _vm._v(\" Data safety \"),\n                ]),\n                _c(\"p\", { staticClass: \"text-body-2\" }, [\n                  _vm._v(\n                    \" Safety starts with understanding how developers collect and share your data. Data Privacy and security practices may vary based on your use, region and age. The developer provided this information and may update it over time. \"\n                  ),\n                ]),\n              ]),\n            ],\n            1\n          ),\n          _vm.$vuetify.breakpoint.mdAndUp\n            ? _c(\n                \"v-col\",\n                { attrs: { cols: \"12\", sm: \"12\", md: \"4\", lg: \"4\" } },\n                [\n                  _c(\"v-img\", {\n                    attrs: { src: __webpack_require__(/*! @/assets/heroes_health.jpg */ \"./src/assets/heroes_health.jpg\") },\n                  }),\n                ],\n                1\n              )\n            : _vm._e(),\n        ],\n        1\n      ),\n    ],\n    1\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./src/components/ecare-app/Main.vue?./node_modules/cache-loader/dist/cjs.js?%7B%22cacheDirectory%22:%22node_modules/.cache/vue-loader%22,%22cacheIdentifier%22:%22aaa67490-vue-loader-template%22%7D!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--1-0!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./src/assets/ecare-app sync recursive ^\\.\\/ecare.*\\.png$":
/*!******************************************************!*\
  !*** ./src/assets/ecare-app sync ^\.\/ecare.*\.png$ ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("var map = {\n\t\"./ecare1.png\": \"./src/assets/ecare-app/ecare1.png\",\n\t\"./ecare2.png\": \"./src/assets/ecare-app/ecare2.png\",\n\t\"./ecare3.png\": \"./src/assets/ecare-app/ecare3.png\",\n\t\"./ecare4.png\": \"./src/assets/ecare-app/ecare4.png\",\n\t\"./ecare5.png\": \"./src/assets/ecare-app/ecare5.png\",\n\t\"./ecare6.png\": \"./src/assets/ecare-app/ecare6.png\",\n\t\"./ecare7.png\": \"./src/assets/ecare-app/ecare7.png\"\n};\n\n\nfunction webpackContext(req) {\n\tvar id = webpackContextResolve(req);\n\treturn __webpack_require__(id);\n}\nfunction webpackContextResolve(req) {\n\tif(!__webpack_require__.o(map, req)) {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t}\n\treturn map[req];\n}\nwebpackContext.keys = function webpackContextKeys() {\n\treturn Object.keys(map);\n};\nwebpackContext.resolve = webpackContextResolve;\nmodule.exports = webpackContext;\nwebpackContext.id = \"./src/assets/ecare-app sync recursive ^\\\\.\\\\/ecare.*\\\\.png$\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app_sync_^\\.\\/ecare.*\\.png$?");

/***/ }),

/***/ "./src/assets/ecare-app/ecare1.png":
/*!*****************************************!*\
  !*** ./src/assets/ecare-app/ecare1.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/ecare1.0aa730d7.png\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app/ecare1.png?");

/***/ }),

/***/ "./src/assets/ecare-app/ecare2.png":
/*!*****************************************!*\
  !*** ./src/assets/ecare-app/ecare2.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/ecare2.f9d4f6ae.png\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app/ecare2.png?");

/***/ }),

/***/ "./src/assets/ecare-app/ecare3.png":
/*!*****************************************!*\
  !*** ./src/assets/ecare-app/ecare3.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/ecare3.ae72c7de.png\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app/ecare3.png?");

/***/ }),

/***/ "./src/assets/ecare-app/ecare4.png":
/*!*****************************************!*\
  !*** ./src/assets/ecare-app/ecare4.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/ecare4.76914124.png\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app/ecare4.png?");

/***/ }),

/***/ "./src/assets/ecare-app/ecare5.png":
/*!*****************************************!*\
  !*** ./src/assets/ecare-app/ecare5.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/ecare5.68432262.png\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app/ecare5.png?");

/***/ }),

/***/ "./src/assets/ecare-app/ecare6.png":
/*!*****************************************!*\
  !*** ./src/assets/ecare-app/ecare6.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/ecare6.1cf8735e.png\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app/ecare6.png?");

/***/ }),

/***/ "./src/assets/ecare-app/ecare7.png":
/*!*****************************************!*\
  !*** ./src/assets/ecare-app/ecare7.png ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/ecare7.0fa856c3.png\";\n\n//# sourceURL=webpack:///./src/assets/ecare-app/ecare7.png?");

/***/ }),

/***/ "./src/assets/eurekare-logo.jpg":
/*!**************************************!*\
  !*** ./src/assets/eurekare-logo.jpg ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/eurekare-logo.721bdacd.jpg\";\n\n//# sourceURL=webpack:///./src/assets/eurekare-logo.jpg?");

/***/ }),

/***/ "./src/assets/heroes_health.jpg":
/*!**************************************!*\
  !*** ./src/assets/heroes_health.jpg ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__.p + \"img/heroes_health.38a27c16.jpg\";\n\n//# sourceURL=webpack:///./src/assets/heroes_health.jpg?");

/***/ }),

/***/ "./src/components/ecare-app/Main.vue":
/*!*******************************************!*\
  !*** ./src/components/ecare-app/Main.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _Main_vue_vue_type_template_id_6c65970e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Main.vue?vue&type=template&id=6c65970e& */ \"./src/components/ecare-app/Main.vue?vue&type=template&id=6c65970e&\");\n/* harmony import */ var _Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Main.vue?vue&type=script&lang=js& */ \"./src/components/ecare-app/Main.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n/* harmony import */ var _node_modules_vuetify_loader_lib_runtime_installComponents_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vuetify-loader/lib/runtime/installComponents.js */ \"./node_modules/vuetify-loader/lib/runtime/installComponents.js\");\n/* harmony import */ var _node_modules_vuetify_loader_lib_runtime_installComponents_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vuetify_loader_lib_runtime_installComponents_js__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var vuetify_lib_components_VBtn__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! vuetify/lib/components/VBtn */ \"./node_modules/vuetify/lib/components/VBtn/index.js\");\n/* harmony import */ var vuetify_lib_components_VGrid__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! vuetify/lib/components/VGrid */ \"./node_modules/vuetify/lib/components/VGrid/index.js\");\n/* harmony import */ var vuetify_lib_components_VDivider__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! vuetify/lib/components/VDivider */ \"./node_modules/vuetify/lib/components/VDivider/index.js\");\n/* harmony import */ var vuetify_lib_components_VIcon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! vuetify/lib/components/VIcon */ \"./node_modules/vuetify/lib/components/VIcon/index.js\");\n/* harmony import */ var vuetify_lib_components_VImg__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! vuetify/lib/components/VImg */ \"./node_modules/vuetify/lib/components/VImg/index.js\");\n/* harmony import */ var vuetify_lib_components_VSheet__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! vuetify/lib/components/VSheet */ \"./node_modules/vuetify/lib/components/VSheet/index.js\");\n/* harmony import */ var vuetify_lib_components_VSlideGroup__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! vuetify/lib/components/VSlideGroup */ \"./node_modules/vuetify/lib/components/VSlideGroup/index.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _Main_vue_vue_type_template_id_6c65970e___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _Main_vue_vue_type_template_id_6c65970e___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* vuetify-loader */\n\n\n\n\n\n\n\n\n\n\n\n_node_modules_vuetify_loader_lib_runtime_installComponents_js__WEBPACK_IMPORTED_MODULE_3___default()(component, {VBtn: vuetify_lib_components_VBtn__WEBPACK_IMPORTED_MODULE_4__[\"VBtn\"],VCol: vuetify_lib_components_VGrid__WEBPACK_IMPORTED_MODULE_5__[\"VCol\"],VContainer: vuetify_lib_components_VGrid__WEBPACK_IMPORTED_MODULE_5__[\"VContainer\"],VDivider: vuetify_lib_components_VDivider__WEBPACK_IMPORTED_MODULE_6__[\"VDivider\"],VIcon: vuetify_lib_components_VIcon__WEBPACK_IMPORTED_MODULE_7__[\"VIcon\"],VImg: vuetify_lib_components_VImg__WEBPACK_IMPORTED_MODULE_8__[\"VImg\"],VRow: vuetify_lib_components_VGrid__WEBPACK_IMPORTED_MODULE_5__[\"VRow\"],VSheet: vuetify_lib_components_VSheet__WEBPACK_IMPORTED_MODULE_9__[\"VSheet\"],VSlideGroup: vuetify_lib_components_VSlideGroup__WEBPACK_IMPORTED_MODULE_10__[\"VSlideGroup\"],VSlideItem: vuetify_lib_components_VSlideGroup__WEBPACK_IMPORTED_MODULE_10__[\"VSlideItem\"]})\n\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"src/components/ecare-app/Main.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./src/components/ecare-app/Main.vue?");

/***/ }),

/***/ "./src/components/ecare-app/Main.vue?vue&type=script&lang=js&":
/*!********************************************************************!*\
  !*** ./src/components/ecare-app/Main.vue?vue&type=script&lang=js& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js??ref--13-0!../../../node_modules/babel-loader/lib!../../../node_modules/cache-loader/dist/cjs.js??ref--1-0!../../../node_modules/vue-loader/lib??vue-loader-options!./Main.vue?vue&type=script&lang=js& */ \"./node_modules/cache-loader/dist/cjs.js?!./node_modules/babel-loader/lib/index.js!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ecare-app/Main.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_cache_loader_dist_cjs_js_ref_13_0_node_modules_babel_loader_lib_index_js_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./src/components/ecare-app/Main.vue?");

/***/ }),

/***/ "./src/components/ecare-app/Main.vue?vue&type=template&id=6c65970e&":
/*!**************************************************************************!*\
  !*** ./src/components/ecare-app/Main.vue?vue&type=template&id=6c65970e& ***!
  \**************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_aaa67490_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_template_id_6c65970e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/cache-loader/dist/cjs.js?{\"cacheDirectory\":\"node_modules/.cache/vue-loader\",\"cacheIdentifier\":\"aaa67490-vue-loader-template\"}!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/cache-loader/dist/cjs.js??ref--1-0!../../../node_modules/vue-loader/lib??vue-loader-options!./Main.vue?vue&type=template&id=6c65970e& */ \"./node_modules/cache-loader/dist/cjs.js?{\\\"cacheDirectory\\\":\\\"node_modules/.cache/vue-loader\\\",\\\"cacheIdentifier\\\":\\\"aaa67490-vue-loader-template\\\"}!./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/cache-loader/dist/cjs.js?!./node_modules/vue-loader/lib/index.js?!./src/components/ecare-app/Main.vue?vue&type=template&id=6c65970e&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_aaa67490_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_template_id_6c65970e___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_cache_loader_dist_cjs_js_cacheDirectory_node_modules_cache_vue_loader_cacheIdentifier_aaa67490_vue_loader_template_node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_cache_loader_dist_cjs_js_ref_1_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Main_vue_vue_type_template_id_6c65970e___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./src/components/ecare-app/Main.vue?");

/***/ })

}]);