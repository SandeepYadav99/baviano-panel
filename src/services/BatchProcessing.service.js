/**
 * Created by charnjeetelectrovese@gmail.com on 6/29/2020.
 */
import {postRequest} from '../libs/AxiosService.util';

export async function serviceGetBatchProcessing(params) {
    return await postRequest('batch/orders', params);
}
