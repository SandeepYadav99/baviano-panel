/**
 * Created by charnjeetelectrovese@gmail.com on 4/8/2020.
 */
import {postRequest} from '../libs/AxiosService.util';

export async function serviceCreateGeofence(params) {
    return await postRequest('geofences/create', params);
}

export async function serviceUpdateGeofence(params) {
    return await postRequest('geofences/update', params);
}

export async function serviceDeleteGeofence(params) {
    return await postRequest('geofences/delete', params);
}


export async function serviceGetGeofence (params) {
    return await postRequest('geofences', params);
}
