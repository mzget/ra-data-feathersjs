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
var object_diff_1 = __importDefault(require("object-diff"));
var mapResquest_1 = require("./mapResquest");
var mapResponse_1 = require("./mapResponse");
var helper_1 = require("./helper");
function getIdKey(_a) {
    var resource = _a.resource, options = _a.options;
    return ((options[resource] && options[resource].id) || options.id || helper_1.defaultIdKey);
}
function deleteProp(obj, prop) {
    var res = Object.assign({}, obj);
    delete res[prop];
    return res;
}
function initFunction(_a) {
    var client = _a.client, options = _a.options, resource = _a.resource, params = _a.params;
    var idKey = getIdKey({ resource: resource, options: options });
    helper_1.dbg("resource=%o, params=%o, idKey=%o", resource, params, idKey);
    var service = client.service(resource);
    var query = {};
    return { idKey: idKey, service: service, query: query };
}
/**
 * DataProvider Interface
 */
var getList = function (client, options) { return function (resource, params) {
    var init = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    });
    return mapResquest_1.getListRequest({ options: options, params: params }, init);
}; };
var getOne = function (client, options) { return function (resource, params) {
    var idKey = getIdKey({ resource: resource, options: options });
    var service = client.service(resource);
    var restParams = deleteProp(params, helper_1.defaultIdKey);
    return service.get(params.id, restParams).then(function (response) { return ({
        data: __assign(__assign({}, response), { id: response[idKey] }),
        validUntil: undefined,
    }); });
}; };
var getMany = function (client, options) { return function (resource, params) {
    var _a = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    }), query = _a.query, service = _a.service, idKey = _a.idKey;
    var ids = params.ids || [];
    query[idKey] = { $in: ids };
    query.$limit = ids.length;
    return service
        .find({ query: query })
        .then(function (response) { return mapResponse_1.mapGetResponse(response, idKey); });
}; };
var getManyReference = function (client, options) { return function (resource, params) {
    var _a = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    }), query = _a.query, service = _a.service, idKey = _a.idKey;
    if (params.target && params.id) {
        query[params.target] = params.id;
    }
    return mapResquest_1.getListRequest({ options: options, params: params }, { query: query, service: service, idKey: idKey });
}; };
var create = function (client, options) { return function (resource, params) {
    var _a = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    }), query = _a.query, service = _a.service, idKey = _a.idKey;
    return service.create(params.data).then(function (response) { return ({
        data: __assign(__assign(__assign({}, params.data), response), { id: response[idKey] }),
    }); });
}; };
var update = function (client, options) { return function (resource, params) {
    var usePatch = !!options.usePatch;
    var _a = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    }), query = _a.query, service = _a.service, idKey = _a.idKey;
    if (usePatch) {
        var data = params.previousData
            ? object_diff_1.default(params.previousData, params.data)
            : params.data;
        return service.patch(params.id, data).then(function (response) { return ({
            data: __assign(__assign({}, response), { id: response[idKey] }),
        }); });
    }
    else {
        var data = idKey !== helper_1.defaultIdKey
            ? deleteProp(params.data, helper_1.defaultIdKey)
            : params.data;
        return service.update(params.id, data).then(function (response) { return ({
            data: __assign(__assign({}, response), { id: response[idKey] }),
        }); });
    }
}; };
var updateMany = function (client, options) { return function (resource, params) {
    var usePatch = !!options.usePatch;
    var _a = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    }), query = _a.query, service = _a.service, idKey = _a.idKey;
    if (usePatch) {
        var dataPatch_1 = params.previousData
            ? object_diff_1.default(params.previousData, params.data)
            : params.data;
        return Promise.all(params.ids.map(function (id) { return service.patch(id, dataPatch_1); })).then(function (response) { return ({ data: response.map(function (record) { return record[idKey]; }) }); });
    }
    var dataUpdate = idKey !== helper_1.defaultIdKey
        ? deleteProp(params.data, helper_1.defaultIdKey)
        : params.data;
    return Promise.all(params.ids.map(function (id) { return service.update(id, dataUpdate); })).then(function (response) { return ({ data: response.map(function (record) { return record[idKey]; }) }); });
}; };
var remove = function (client, options) { return function (resource, params) {
    var _a = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    }), query = _a.query, service = _a.service, idKey = _a.idKey;
    return service
        .remove(params.id)
        .then(function (response) { return ({ data: __assign(__assign({}, response), { id: response[idKey] }) }); });
}; };
var removeMany = function (client, options) { return function (resource, params) {
    var _a;
    var _b = initFunction({
        client: client,
        options: options,
        resource: resource,
        params: params,
    }), query = _b.query, service = _b.service, idKey = _b.idKey;
    if (!!options.useMulti && service.options.multi) {
        return service
            .remove(null, {
            query: (_a = {},
                _a[idKey] = {
                    $in: params.ids,
                },
                _a),
        })
            .then(function (response) { return ({ data: response.map(function (record) { return record[idKey]; }) }); });
    }
    return Promise.all(params.ids.map(function (id) { return service.remove(id); })).then(function (response) { return ({ data: response.map(function (record) { return record[idKey]; }) }); });
}; };
/**
 * React-Admin version 3 new dataProvider interface
 * @param client
 * @param options
 */
function restClient(client, options) {
    if (options === void 0) { options = {}; }
    return {
        getList: getList(client, options),
        getOne: getOne(client, options),
        getMany: getMany(client, options),
        getManyReference: getManyReference(client, options),
        create: create(client, options),
        update: update(client, options),
        updateMany: updateMany(client, options),
        delete: remove(client, options),
        deleteMany: removeMany(client, options),
    };
}
exports.default = restClient;
