import { defaultIdKey } from './helper';

/**
 * Map Response
 */
export function mapGetResponse(response, idKey) {
    let res;
    // support paginated and non paginated services
    if (!response.data) {
        response.total = response.length;
        res = response;
    } else {
        res = response.data;
    }
    response.data = res.map((_item) => {
        const item = _item;
        if (idKey !== defaultIdKey) {
            item.id = _item[idKey];
        }
        return _item;
    });
    return { ...response, validUntil: undefined };
}
