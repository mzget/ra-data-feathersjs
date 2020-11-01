"use strict";
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
exports.getListRequest = void 0;
var helper_1 = require("./helper");
var mapResponse_1 = require("./mapResponse");
function getListRequest(_a, _b) {
    var _c;
    var _d;
    var options = _a.options, params = _a.params;
    var query = _b.query, service = _b.service, idKey = _b.idKey;
    var _e = params.pagination || {}, page = _e.page, perPage = _e.perPage;
    var _f = params.sort || {}, field = _f.field, order = _f.order;
    var additionalQueryOperators = (_d = options.customQueryOperators) !== null && _d !== void 0 ? _d : [];
    var allUniqueQueryOperators = __spread(new Set(helper_1.queryOperators.concat(additionalQueryOperators)));
    helper_1.dbg('field=%o, order=%o', field, order);
    if (perPage && page) {
        query.$limit = perPage;
        query.$skip = perPage * (page - 1);
    }
    if (order) {
        query.$sort = (_c = {},
            _c[field === helper_1.defaultIdKey ? idKey : field] = order === 'DESC' ? -1 : 1,
            _c);
    }
    Object.assign(query, params.filter ? helper_1.flatten(params.filter, '', allUniqueQueryOperators) : {});
    helper_1.dbg('query=%o', query);
    return service
        .find({ query: query })
        .then(function (response) { return mapResponse_1.mapGetResponse(response, idKey); });
}
exports.getListRequest = getListRequest;
