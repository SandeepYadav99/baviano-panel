/**
 * Created by charnjeetelectrovese@gmail.com on 6/29/2020.
 */
import {postRequest} from '../libs/AxiosService.util';

export async function serviceGetBatchProcessing(params) {
    return await postRequest('batch/orders', params);
}
export async function serviceAssignDriverToJob(params) {
    return await postRequest('batch/assign/driver', params);
}

export async function serviceGetFreeDrivers(params) {
    return await postRequest('batch/free/driver', params);
}

export async function serviceGetBatchDriverAssigned(params) {
    return await postRequest('batch/assigned/driver', params);
}
