import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateOrder(params) {
    return await formDataRequest('orders/create', params);
}
export async function serviceUpdateOrder(params) {
    return await formDataRequest('orders/update', params);
}

export async function serviceGetOrder(params) {
    return await postRequest('orders', params);
}


export async function serviceAcceptOrder(params) {
    return await postRequest('orders/accept', params);
}

export async function serviceRejectOrder(params) {
    return await postRequest('orders/reject', params);
}
export async function serviceAssignBatchToOrders(params) {
    return await postRequest('orders/assign/batch', params);
}
