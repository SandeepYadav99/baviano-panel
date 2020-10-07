import {formDataRequest, postRequest} from '../libs/AxiosService.util';


export async function serviceGetMinBalance(params) {
    return await postRequest('customers/min/balance', params);
}
