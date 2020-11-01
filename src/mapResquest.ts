import { dbg, defaultIdKey, queryOperators, flatten } from './helper';
import { mapGetResponse } from './mapResponse';

export function getListRequest({ options, params }, { query, service, idKey }) {
    const { page, perPage } = params.pagination || {};
    const { field, order } = params.sort || {};
    const additionalQueryOperators = options.customQueryOperators ?? [];
    const allUniqueQueryOperators = [
        ...new Set(queryOperators.concat(additionalQueryOperators)),
    ];
    dbg('field=%o, order=%o', field, order);
    if (perPage && page) {
        query.$limit = perPage;
        query.$skip = perPage * (page - 1);
    }
    if (order) {
        query.$sort = {
            [field === defaultIdKey ? idKey : field]: order === 'DESC' ? -1 : 1,
        };
    }
    Object.assign(
        query,
        params.filter ? flatten(params.filter, '', allUniqueQueryOperators) : {}
    );
    dbg('query=%o', query);
    return service
        .find({ query })
        .then((response) => mapGetResponse(response, idKey));
}
