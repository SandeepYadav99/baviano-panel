/**
 * Created by charnjeetelectrovese@gmail.com on 12/19/2019.
 */
import {formDataRequest, postRequest} from '../libs/AxiosService.util';

export async function serviceCreateVehicle(params) {
    return await formDataRequest('vehicles/create', params);
}
export async function serviceUpdateVehicle(params) {
    return await formDataRequest('vehicles/update', params);
}


export async function serviceGetVehicles(params) {
    return await postRequest('vehicles', params);
}

export async function serviceGetVehiclesList(params) {
    return await postRequest('vehicles/list', params);
}

export async function serviceCheckVehicle(params) {
    return await postRequest('vehicles/check', params);
}
