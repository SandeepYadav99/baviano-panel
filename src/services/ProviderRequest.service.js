/**
 * Created by charnjeetelectrovese@gmail.com on 12/5/2019.
 */
import {getRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateRequest(params) {
    return await postRequest('request/create', params);
}

export async function serviceGetCityData() {
    return await getRequest('city/list', {});
}
export async function serviceProviderEmailExists(params) {
    return await postRequest('checkemail', params);
}
