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

export async function serviceGetCustomersDownload(params) {
    return await postRequest('customers/download', params);
}


export async function serviceGetCustomerSubscriptions(params) {
    return await postRequest('customers/subscriptions', params);
}

export async function serviceCustomerAddWallet(params) {
    return await postRequest('customers/wallet/add', params);
}
export async function serviceCustomerDeductPacking(params) {
    return await postRequest('customers/packing/deduct', params);
}

export async function serviceCustomerGetMonthOrders(params) {
    return await postRequest('customers/month/orders', params);
}

export async function serviceCustomerWalletTransactions(params) {
    return await postRequest('customers/wallet/transactions', params);
}

export async function serviceCustomerReferred(params) {
    return await postRequest('customers/referred', params);
}

export async function serviceCustomerPackageTransaction(params) {
    return await postRequest('customers/package/transactions', params);
}


export async function serviceCustomerCouponsUsed(params) {
    return await postRequest('customers/coupons/used', params);
}

export async function serviceCustomerDeliveryDetail(params) {
    return await postRequest('customers/delivery/detail', params);
}
