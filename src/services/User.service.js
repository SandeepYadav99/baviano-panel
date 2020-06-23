/**
 * Created by charnjeetelectrovese@gmail.com on 5/25/2018.
 */
import { postRequest } from '../libs/AxiosService.util';

export async function fetchBankDetails(params) {
    return await postRequest('bankdetails', params);
}

export async function storeBankDetails(params) {
    return await postRequest('bankdetailts/store', params);
}

export async function isUserService(params) {
    return await postRequest('isuser', params);
}

export async function fetchUsers(params) {
    const tempParams = { page_id: 1, row: null, order: null, ...params };
    return await postRequest('users', tempParams);
}
