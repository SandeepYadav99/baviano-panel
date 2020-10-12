import { postRequest} from '../libs/AxiosService.util';


export async function serviceGetMonthlyBills(params) {
    return await postRequest('customers/monthly/bills', params);
}
