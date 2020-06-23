/**
 * Created by charnjeetelectrovese@gmail.com on 1/1/2020.
 */
import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateTour(params) {
    return await formDataRequest('tours/create', params);
}
export async function serviceUpdateTour(params) {
    return await formDataRequest('tours/update', params);
}


export async function serviceGetTours(params) {
    return await postRequest('tours', params);
}

export async function serviceDeleteTourImage(params) {
    return await postRequest('tours/images/delete', params);
}
