import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateCustomers(params) {
    return await formDataRequest('customers/create', params);
}
export async function serviceUpdateCustomers(params) {
    return await formDataRequest('customers/update', params);
}
export async function serviceChangeStatusCustomers(params) {
    return await postRequest('customers/change/status', params);
}
export async function serviceGetCustomers(params) {
    return await postRequest('customers', params);
}

export async function serviceGetCustomerSubscriptions(params) {
    return await postRequest('customers/subscriptions', params);
}

export async function serviceCustomerAddWallet(params) {
    return await postRequest('customers/wallet/add', params);
}
export async function serviceCustomerWalletTransactions(params) {
    return await postRequest('customers/wallet/transactions', params);
}


export async function serviceCustomerCouponsUsed(params) {
    return await postRequest('customers/coupons/used', params);
}
