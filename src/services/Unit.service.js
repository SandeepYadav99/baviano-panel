/**
 * Created by charnjeetelectrovese@gmail.com on 4/8/2020.
 */
import {postRequest} from '../libs/AxiosService.util';

export async function serviceCreateUnit(params) {
    return await postRequest('units/create', params);
}

export async function serviceUpdateUnit(params) {
    return await postRequest('units/update', params);
}

export async function serviceDeleteUnit(params) {
    return await postRequest('units/delete', params);
}


export async function serviceGetUnit (params) {
    return await postRequest('units', params);
}

export async function serviceGetUnitList (params) {
    return await postRequest('units/list', params);
}

export async function serviceUnitCheck (params) {
    return await postRequest('units/check', params);
}
