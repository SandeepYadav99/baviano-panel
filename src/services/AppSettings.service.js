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
