/**
 * Created by charnjeetelectrovese@gmail.com on 1/22/2020.
 */
import {formDataRequest, postRequest} from "../libs/AxiosService.util";

export async function serviceGetCustomList(list) {
    return await postRequest('list/custom', {list: list});
}
