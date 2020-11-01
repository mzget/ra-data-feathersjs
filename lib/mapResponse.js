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
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapGetResponse = void 0;
var helper_1 = require("./helper");
/**
 * Map Response
 */
function mapGetResponse(response, idKey) {
    var res;
    // support paginated and non paginated services
    if (!response.data) {
        response.total = response.length;
        res = response;
    }
    else {
        res = response.data;
    }
    response.data = res.map(function (_item) {
        var item = _item;
        if (idKey !== helper_1.defaultIdKey) {
            item.id = _item[idKey];
        }
        return _item;
    });
    return __assign(__assign({}, response), { validUntil: undefined });
}
exports.mapGetResponse = mapGetResponse;
