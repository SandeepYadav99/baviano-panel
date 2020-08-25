/**
 * Created by charnjeetelectrovese@gmail.com on 5/1/2020.
 */

import {postRequest} from "../libs/AxiosService.util";

export async function serviceGetAppSettings(params) {
    return await postRequest('app/settings', params);
}

export async function serviceUpdateGeoFence(params) {
    return await postRequest('app/settings/geofence/update', params);
}

export async function serviceUpdateMinValue(params) {
    return await postRequest('app/settings/minvalue/update', params);
}


export async function serviceUpdateOrderAfter(params) {
    return await postRequest('app/settings/order/after', params);
}

export async function serviceGetHeatMapUsers(params) {
    return await postRequest('heatmap/users', params);
}

export async function serviceGetHeatMapOrders(params) {
    return await postRequest('heatmap/orders', params);
}

