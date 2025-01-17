import { postRequest} from "../libs/AxiosService.util";

/**
 * Created by charnjeetelectrovese@gmail.com on 4/30/2020.
 */
export async function serviceGetDashboard(params) {
    return await postRequest('dashboard', params);
}
export async function serviceChangeAcceptingOrders(type) {
    return await postRequest('/app/settings/change/accepting', {is_accepting: type});
}
