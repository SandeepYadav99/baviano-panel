import {postRequest} from "../libs/AxiosService.util";

export async function serviceGetNewCustomers(fromDate, toDate) {
    return await postRequest('analytics/new/customers', {from_date: fromDate, to_date: toDate });
}

export async function serviceGetRechargeTransaction(fromDate, toDate) {
    return await postRequest('analytics/recharges', {from_date: fromDate, to_date: toDate });
}

export async function serviceGetProductSalesReport(fromDate, toDate) {
    return await postRequest('analytics/product/sales', {from_date: fromDate, to_date: toDate });
}

export async function serviceOrderCancelReport(fromDate, toDate) {
    return await postRequest('analytics/order/cancel', {from_date: fromDate, to_date: toDate });
}

