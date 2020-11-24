import diff from "object-diff";
import { Application } from "@feathersjs/feathers";
import {
  CreateParams,
  CreateResult,
  DeleteManyParams,
  DeleteManyResult,
  DeleteParams,
  DeleteResult,
  GetListParams,
  GetListResult,
  GetManyParams,
  GetManyReferenceParams,
  GetManyReferenceResult,
  GetManyResult,
  GetOneParams,
  GetOneResult,
  UpdateManyParams,
  UpdateManyResult,
  UpdateParams,
  UpdateResult,
} from "react-admin";

import { getListRequest } from "./mapResquest";
import { mapGetResponse } from "./mapResponse";
import { defaultIdKey, dbg, queryOperators } from "./helper";

type ClientOptions = {
  id?: string; // If your database uses an id field other than 'id'. Optional.
  usePatch?: boolean; // Use PATCH instead of PUT for UPDATE requests. Optional.
  my_resource?: {
    // Options for individual resources can be set by adding an object with the same name. Optional.
    id: string; // If this specific table uses an id field other than 'id'. Optional.
  };
  /* Allows to use custom query operators from various feathers-database-adapters in GET_MANY calls.
   * Will be merged with the default query operators ['$gt', '$gte', '$lt', '$lte', '$ne', '$sort', '$or', '$nin', '$in']
   */
  customQueryOperators?: Array<any>;
  useMulti?: boolean;
};

function getIdKey({
  resource,
  options,
}: {
  resource: string;
  options: ClientOptions;
}) {
  return (
    (options[resource] && options[resource].id) || options.id || defaultIdKey
  );
}
function deleteProp(obj: any, prop: string) {
  const res = Object.assign({}, obj);
  delete res[prop];
  return res;
}
function initFunction({ client, options, resource, params }) {
  const idKey = getIdKey({ resource, options });
  dbg("resource=%o, params=%o, idKey=%o", resource, params, idKey);
  const service = client.service(resource);
  const query: any = {};

  return { idKey, service, query };
}

/**
 * DataProvider Interface
 */

const getList = (client: Application, options: ClientOptions) => (
  resource: string,
  params: GetListParams
): Promise<GetListResult<any>> => {
  const init = initFunction({
    client,
    options,
    resource,
    params,
  });

  return getListRequest({ options, params }, init);
};
const getOne = (client: Application, options: ClientOptions) => (
  resource: string,
  params: GetOneParams
): Promise<GetOneResult<any>> => {
  const idKey = getIdKey({ resource, options });
  const service = client.service(resource);

  const restParams = deleteProp(params, defaultIdKey);
  return service.get(params.id, restParams).then((response) => ({
    data: { ...response, id: response[idKey] },
    validUntil: undefined,
  }));
};
const getMany = (client: Application, options: ClientOptions) => (
  resource: string,
  params: GetManyParams
): Promise<GetManyResult<any>> => {
  const { query, service, idKey } = initFunction({
    client,
    options,
    resource,
    params,
  });

  const ids = params.ids || [];
  query[idKey] = { $in: ids };
  query.$limit = ids.length;
  return service
    .find({ query })
    .then((response) => mapGetResponse(response, idKey));
};
const getManyReference = (client: Application, options: ClientOptions) => (
  resource: string,
  params: GetManyReferenceParams
): Promise<GetManyReferenceResult<any>> => {
  const { query, service, idKey } = initFunction({
    client,
    options,
    resource,
    params,
  });

  if (params.target && params.id) {
    query[params.target] = params.id;
  }
  return getListRequest({ options, params }, { query, service, idKey });
};
const create = (client: Application, options: ClientOptions) => (
  resource: string,
  params: CreateParams
): Promise<CreateResult<any>> => {
  const { query, service, idKey } = initFunction({
    client,
    options,
    resource,
    params,
  });
  return service.create(params.data).then((response) => ({
    data: { ...params.data, ...response, id: response[idKey] },
  }));
};
const update = (client: Application, options: ClientOptions) => (
  resource: string,
  params: UpdateParams
): Promise<UpdateResult<any>> => {
  const usePatch = !!options.usePatch;
  const { query, service, idKey } = initFunction({
    client,
    options,
    resource,
    params,
  });

  if (usePatch) {
    const data = params.previousData
      ? diff(params.previousData, params.data)
      : params.data;
    return service.patch(params.id, data).then((response) => ({
      data: { ...response, id: response[idKey] },
    }));
  } else {
    const data =
      idKey !== defaultIdKey
        ? deleteProp(params.data, defaultIdKey)
        : params.data;
    return service.update(params.id, data).then((response) => ({
      data: { ...response, id: response[idKey] },
    }));
  }
};
const updateMany = (client: Application, options: ClientOptions) => (
  resource: string,
  params: (UpdateManyParams & Pick<UpdateParams, "previousData">) | any
): Promise<UpdateManyResult> => {
  const usePatch = !!options.usePatch;
  const { query, service, idKey } = initFunction({
    client,
    options,
    resource,
    params,
  });

  if (usePatch) {
    const dataPatch = params.previousData
      ? diff(params.previousData, params.data)
      : params.data;
    return Promise.all(
      params.ids.map((id) => service.patch(id, dataPatch))
    ).then((response: any[]) => ({
      data: response.map((record: any) => record[idKey]),
    }));
  }
  const dataUpdate =
    idKey !== defaultIdKey
      ? deleteProp(params.data, defaultIdKey)
      : params.data;
  return Promise.all(
    params.ids.map((id) => service.update(id, dataUpdate))
  ).then((response: any[]) => ({
    data: response.map((record) => record[idKey]),
  }));
};
const remove = (client: Application, options: ClientOptions) => (
  resource: string,
  params: DeleteParams
): Promise<DeleteResult<any>> => {
  const { query, service, idKey } = initFunction({
    client,
    options,
    resource,
    params,
  });
  return service
    .remove(params.id)
    .then((response) => ({ data: { ...response, id: response[idKey] } }));
};
const removeMany = (client: Application, options: ClientOptions) => (
  resource: string,
  params: DeleteManyParams
): Promise<DeleteManyResult> => {
  const { query, service, idKey } = initFunction({
    client,
    options,
    resource,
    params,
  });

  if (!!options.useMulti && service.options.multi) {
    return service
      .remove(null, {
        query: {
          [idKey]: {
            $in: params.ids,
          },
        },
      })
      .then((response) => ({ data: response.map((record) => record[idKey]) }));
  }
  return Promise.all(
    params.ids.map((id) => service.remove(id))
  ).then((response:Array<any>) => ({ data: response.map((record) => record[idKey]) }));
};

/**
 * React-Admin version 3 new dataProvider interface
 * @param client
 * @param options
 */
function restClient(client, options: ClientOptions = {}) {
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
export default restClient;
