/**
 * Created by charnjeetelectrovese@gmail.com on 2/7/2020.
 */
import {formDataRequest, postRequest} from '../libs/AxiosService.util';



export async function serviceCreateCoupons(params) {
    return await postRequest('coupons/create', params);
}

export async function serviceUpdateCoupons(params) {
    return await postRequest('coupons/update', params);
}

export async function serviceFetchCoupons(params) {
    return await postRequest('coupons', params);
}

export async function serviceDeleteCoupons(params) {
    return await postRequest('coupons/delete', params);
}


export async function serviceListData() {
    return await postRequest('list/custom', { list: ['TOURTYPE', 'CITY', 'COUNTRY', 'PROVIDERS'] })
}


export async function serviceCheckCoupon(params) {
    return await postRequest('/coupons/check', params);
}
