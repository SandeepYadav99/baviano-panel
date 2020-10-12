/**
 * Created by charnjeetelectrovese@gmail.com on 12/19/2019.
 */
import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateDriver(params) {
    return await formDataRequest('drivers/create', params);
}

export async function serviceUpdateDriver(params) {
    return await formDataRequest('drivers/update', params);
}

export async function serviceDeleteDriver(params) {
    return await formDataRequest('drivers/delete', params);
}

export async function serviceGetDriverBatchesList(params) {
    return await postRequest('/drivers/batches', params);
}
export async function serviceGetDriverSupportList(params) {
    return await postRequest('/drivers/support/messages', params);
}
export async function serviceGetDriverMonthJobs(params) {
    return await postRequest('/drivers/month/jobs', params);
}


export async function serviceGetDrivers (params) {
    return await postRequest('drivers', params);
}

export async function serviceGetDriversList (params) {
    return await postRequest('drivers/list', params);
}

export async function serviceDriverCheck (params) {
    return await postRequest('drivers/check', params);
}

export async function serviceGetOnlineDrivers(params) {
    return await postRequest('drivers/online', params);
}

export async function serviceGetReferredList(params) {
    return await postRequest('drivers/referred', params);
}

export async function serviceGetDriverMonthlyDeliveries(params) {
    return await postRequest('drivers/month/deliveries', params);
}

