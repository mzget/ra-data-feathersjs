import { Application } from "@feathersjs/feathers";
import { CreateParams, CreateResult, DeleteManyParams, DeleteManyResult, DeleteParams, DeleteResult, GetListParams, GetListResult, GetManyParams, GetManyReferenceParams, GetManyReferenceResult, GetManyResult, GetOneParams, GetOneResult, UpdateManyResult, UpdateParams, UpdateResult } from "react-admin";
declare type ClientOptions = {
    id?: string;
    usePatch?: boolean;
    my_resource?: {
        id: string;
    };
    customQueryOperators?: Array<any>;
    useMulti?: boolean;
};
/**
 * React-Admin version 3 new dataProvider interface
 * @param client
 * @param options
 */
declare function restClient(client: Application, options?: ClientOptions): {
    getList: (resource: string, params: GetListParams) => Promise<GetListResult<any>>;
    getOne: (resource: string, params: GetOneParams) => Promise<GetOneResult<any>>;
    getMany: (resource: string, params: GetManyParams) => Promise<GetManyResult<any>>;
    getManyReference: (resource: string, params: GetManyReferenceParams) => Promise<GetManyReferenceResult<any>>;
    create: (resource: string, params: CreateParams) => Promise<CreateResult<any>>;
    update: (resource: string, params: UpdateParams) => Promise<UpdateResult<any>>;
    updateMany: (resource: string, params: any) => Promise<UpdateManyResult>;
    delete: (resource: string, params: DeleteParams) => Promise<DeleteResult<any>>;
    deleteMany: (resource: string, params: DeleteManyParams) => Promise<DeleteManyResult>;
};
export default restClient;
//# sourceMappingURL=restClientDataProvider.d.ts.map