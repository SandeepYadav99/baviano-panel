/**
 * Created by charnjeetelectrovese@gmail.com on 6/26/2020.
 */
import {postRequest} from '../libs/AxiosService.util';

export async function serviceAssignBatch(params) {
    return await postRequest('plans/assign/batch', params);
}

export async function serviceGetPendingPlan(params) {
    return await postRequest('plans/pending', params);
}

