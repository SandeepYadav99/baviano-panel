/**
 * Created by charnjeetelectrovese@gmail.com on 12/19/2019.
 */
import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreatePromotion(params) {
    return await formDataRequest('promotions/create', params);
}

export async function serviceUpdatePromotion(params) {
    return await formDataRequest('promotions/update', params);
}

export async function serviceDeletePromotion(params) {
    return await formDataRequest('promotions/delete', params);
}

export async function serviceGetPromotion (params) {
    return await postRequest('promotions', params);
}

export async function serviceGetPromotionList (params) {
    return await postRequest('promotions/list', params);
}

export async function servicePromotionCheck (params) {
    return await postRequest('promotions/check', params);
}
