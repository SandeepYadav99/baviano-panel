/**
 * Created by charnjeetelectrovese@gmail.com on 12/19/2019.
 */
import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateCategory(params) {
    return await formDataRequest('categories/create', params);
}

export async function serviceUpdateCategory(params) {
    return await formDataRequest('categories/update', params);
}

export async function serviceDeleteCategory(params) {
    return await formDataRequest('categories/delete', params);
}

export async function serviceGetCategories (params) {
    return await postRequest('categories', params);
}

export async function serviceGetCategoriesList (params) {
    return await postRequest('categories/list', params);
}

export async function serviceCategoryCheck (params) {
    return await postRequest('categories/check', params);
}
