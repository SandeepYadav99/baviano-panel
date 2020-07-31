import {postRequest} from "../libs/AxiosService.util";



export async function serviceSendNotification(params) {
    return await postRequest('/notification/send', params);
}
