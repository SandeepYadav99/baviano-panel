/**
 * Created by charnjeetelectrovese@gmail.com on 4/8/2020.
 */
import {postRequest, formDataRequest} from '../libs/AxiosService.util';

export async function serviceCreateProduct(params) {
    return await formDataRequest('products/create', params);
}

export async function serviceUpdateProduct(params) {
    return await formDataRequest('products/update', params);
}

export async function serviceDeleteProduct(params) {
    return await formDataRequest('products/delete', params);
}


export async function serviceGetProduct (params) {
    return await postRequest('products', params);
}

export async function serviceProductCheck (params) {
    return await postRequest('products/check', params);
}
