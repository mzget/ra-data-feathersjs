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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = exports.defaultIdKey = exports.queryOperators = exports.dbg = void 0;
var debug_1 = __importDefault(require("debug"));
exports.dbg = debug_1.default("ra-data-feathers:rest-client");
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
