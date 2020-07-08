/**
 * Created by charnjeetelectrovese@gmail.com on 6/26/2020.
 */
import {postRequest} from '../libs/AxiosService.util';

export async function serviceCreateBatch(params) {
    return await postRequest('batch/create', params);
}

export async function serviceUpdateBatch(params) {
    return await postRequest('batch/update', params);
}

export async function serviceDeleteBatch(params) {
    return await postRequest('batch/delete', params);
}


export async function serviceGetBatch (params) {
    return await postRequest('batch', params);
}

export async function serviceGetBatchList (params) {
    return await postRequest('batch/list', params);
}

export async function serviceBatchCheck (params) {
    return await postRequest('batch/check', params);
}
