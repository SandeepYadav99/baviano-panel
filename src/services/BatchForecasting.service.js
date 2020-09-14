import {postRequest} from '../libs/AxiosService.util';

export async function serviceGetBatchForecasting(params) {
    return await postRequest('batch/forecasting', params);
}


export async function serviceGetBatchForecastingDownload(params) {
    return await postRequest('batch/forecasting/download', params);
}

