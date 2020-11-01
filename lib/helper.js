"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.defaultIdKey = exports.queryOperators = exports.dbg = void 0;
var debug = console.info;
exports.dbg = function () {
    var msgs = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        msgs[_i] = arguments[_i];
    }
    return debug.apply(void 0, __spread(["ra-data-feathers:rest-client"], msgs));
};
exports.queryOperators = [
    "$gt",
    "$gte",
    "$lt",
    "$lte",
    "$ne",
    "$sort",
    "$or",
    "$nin",
    "$in",
];
exports.defaultIdKey = "id";
function flatten(object, prefix, stopKeys) {
    if (prefix === void 0) { prefix = ""; }
    if (stopKeys === void 0) { stopKeys = []; }
    return Object.keys(object).reduce(function (prev, element) {
        var _a;
        var hasNextLevel = object[element] &&
            typeof object[element] === "object" &&
            !Array.isArray(object[element]) &&
            !Object.keys(object[element]).some(function (key) { return stopKeys.includes(key); });
        return hasNextLevel
            ? __assign(__assign({}, prev), flatten(object[element], "" + prefix + element + ".", stopKeys)) : __assign(__assign({}, prev), (_a = {}, _a["" + prefix + element] = object[element], _a));
    }, {});
}
exports.flatten = flatten;
