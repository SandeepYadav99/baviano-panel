import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateAcceptedOrder(params) {
    return await formDataRequest('accepted/orders/create', params);
}
export async function serviceUpdateAcceptedOrder(params) {
    return await formDataRequest('accepted/orders/update', params);
}

export async function serviceGetAcceptedOrder(params) {
    return await postRequest('accepted/orders', params);
}


export async function serviceAcceptAcceptedOrder(params) {
    return await postRequest('accepted/orders/accept', params);
}

export async function serviceRejectAcceptedOrder(params) {
    return await postRequest('accepted/orders/reject', params);
}
