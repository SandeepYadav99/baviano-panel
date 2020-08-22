/**
 * Created by charnjeetelectrovese@gmail.com on 6/29/2020.
 */
import {postRequest} from '../libs/AxiosService.util';

export async function serviceGetBatchJob(params) {
    return await postRequest('batch/jobs', params);
}

export async function serviceGetBatchJobDetail(params) {
    return await postRequest('batch/jobs/detail', params);
}
