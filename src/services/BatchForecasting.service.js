import {postRequest} from '../libs/AxiosService.util';

export async function serviceGetBatchForecasting(params) {
    return await postRequest('batch/forecasting', params);
}
