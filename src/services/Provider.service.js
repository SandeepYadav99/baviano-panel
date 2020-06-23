/**
 * Created by charnjeetelectrovese@gmail.com on 12/18/2019.
 */
import { formDataRequest } from '../libs/AxiosService.util';

export async function serviceUpdateProfile(params) {
    return await formDataRequest('providers/save', params);
}
