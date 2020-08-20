import {postRequest} from '../libs/AxiosService.util';

export async function serviceGetVerification(params) {
    return await postRequest('verifications', params);
}
export async function serviceAssignDriverToVerification(params) {
    return await postRequest('verifications/assign/driver', params);
}

export async function serviceGetFreeDriversForVerification(params) {
    return await postRequest('verifications/free/driver', params);
}
