"use strict";

require("core-js/modules/es6.symbol.js");
require("core-js/modules/es6.array.from.js");
require("core-js/modules/es6.string.iterator.js");
require("core-js/modules/es6.object.to-string.js");
require("core-js/modules/es6.array.iterator.js");
require("core-js/modules/web.dom.iterable.js");
require("core-js/modules/es6.string.includes.js");
require("core-js/modules/es7.array.includes.js");
require("core-js/modules/es6.promise.js");
var _promise = require("core-js/fn/promise");
var arr = Array.from({
  length: 3
}, function (_, i) {
  return i;
});
console.log(arr);
if (arr.includes(1)) {
  console.log("包含1");
}
var p = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(10);
  }, 1000);
});