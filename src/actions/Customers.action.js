/**
 * Created by charnjeetelectrovese@gmail.com on 12/5/2019.
 */

// import { serviceFetchProviderRequests } from '../services/ProviderRequest.service';
// import { fetchPRequests } from '../services/User.service';
import store from '../store';
import Constants from '../config/constants';
import {
    serviceCreateCustomers,
    serviceCustomerAddWallet,
    serviceGetCustomers,
    serviceUpdateCustomers
} from "../services/CustomersRequest.service";

export const FETCH_INIT = 'FETCH_INIT_CUSTOMERS';
export const FETCHED = 'FETCHED_CUSTOMERS';
export const FETCHED_FAIL = 'FETCHED_FAIL_CUSTOMERS';
export const FETCHED_FILTER = 'FETCHED_FILTER_CUSTOMERS';
// export const NEXT_PREQUESTS = 'NEXT_PREQUESTS';
// export const PREV_PREQUESTS = 'PREV_PREQUESTS';
export const FETCH_NEXT = 'FETCH_NEXT_CUSTOMERS';
export const FILTER = 'FILTER_CUSTOMERS';
export const RESET_FILTER = 'RESET_FILTER_CUSTOMERS';
export const SET_SORTING = 'SET_SORTING_CUSTOMERS';
export const SET_FILTER = 'SET_FILTER_CUSTOMERS';
export const SET_PAGE = 'SET_PAGE_CUSTOMERS';
export const CHANGE_PAGE = 'CHANGE_PAGE_CUSTOMERS';
export const CHANGE_STATUS= 'CHANGE_STATE_CUSTOMERS';
export const SET_SERVER_PAGE = 'SET_SERVER_PAGE_CUSTOMERS';
export const CREATE_DATA = 'CREATE_CUSTOMERS';
export const UPDATE_DATA = 'UPDATE_CUSTOMERS';
export const ADD_AMOUNT_CUSTOMERS = 'ADD_AMOUNT_CUSTOMERS';


export function actionFetchCustomers(index = 1, sorting = {}, filter = {}, shouldReset=false) {
    const request = serviceGetCustomers({ index, row: sorting.row, order: sorting.order, ...filter }); // GetCustomers
    return (dispatch) => {
        if (shouldReset) {
            dispatch({
                type: CHANGE_PAGE,
                payload: 1,
            });
        }
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: SET_FILTER, payload: filter});
            dispatch({type: SET_SORTING, payload: sorting});
            if (!data.error) {
                dispatch({type: FETCHED, payload: { data: data.data, page: index }});
                dispatch({ type: SET_SERVER_PAGE, payload: index });
                if (index == 1) {
                    dispatch({type: CHANGE_PAGE, payload: index - 1});
                }
            } else {
                dispatch({type: FETCHED_FAIL, payload: null});
            }
        });
    };
}

export function actionCreateCustomers(data) {
    const request = serviceCreateCustomers(data);
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                dispatch({type: CREATE_DATA, payload: data.data})
            }
        })
    }
}

export function actionUpdateCustomers(data) {
    const request = serviceUpdateCustomers(data);
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                dispatch({type: UPDATE_DATA, payload: data.data})
            }
        })
    }
}



export function actionChangePageCustomers(page) {
    return (dispatch) => {
        dispatch({type: CHANGE_PAGE, payload: page})
    }
}

export function actionCustomerAddAmount(data) {
    const request = serviceCustomerAddWallet(data);
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                dispatch({type: ADD_AMOUNT_CUSTOMERS, payload: data.data})
            }
        })
    }
}
// export function nextPRequestsClick() {
//     return {
//         type: NEXT_PREQUESTS,
//         payload: null,
//     };
// }
//
// export function prevPRequestsClick() {
//     return {
//         type: PREV_PREQUESTS,
//         payload: null,
//     };
// }

export function actionFilterCustomers(value) {
    const request = null;////serviceFetchProviderRequests(value);
    return (dispatch) => {
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: FILTER, payload: data});
            dispatch({type: FETCHED, payload: null});
        });
    };
}


export function actionChangeStatusCustomers(params) {
    const request = serviceUpdateCustomers({ id: params.id, status: params.type});
    return (dispatch) => {
        request.then((data) => {
            dispatch({type: CHANGE_STATUS, payload: {id: params.id, status: params.type}});
        });
    };
}

export function actionResetFilterCustomers() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}

export function actionSetPageCustomers(page) {
    const stateData = store.getState().customers;
    const currentPage = stateData.currentPage;
    const totalLength = stateData.all.length;
    const sortingData = stateData.sorting_data;
    const query = stateData.query;
    const queryData = stateData.query_data;
    const serverPage = stateData.serverPage;

    if (totalLength <= ((page + 1) * Constants.DEFAULT_PAGE_VALUE)) {
        store.dispatch(actionFetchCustomers(serverPage + 1, sortingData, {query, query_data: queryData}));
        // this.props.fetchNextUsers(this.props.serverPage + 1, this.props.sorting_data.row, this.props.sorting_data.order, { query: this.props.query, query_data: this.props.query_data });
    }

    console.log(currentPage, totalLength);
    return {
        type: CHANGE_PAGE,
        payload: page,
    };
    // if (this.props.totalUsers <= ((this.props.currentPage + 1) * 100)) {
    //         // this.props.fetchNextUsers(this.props.serverPage + 1, this.props.sorting_data.row, this.props.sorting_data.order);
    //         this.props.fetchNextUsers(this.props.serverPage + 1, this.props.sorting_data.row, this.props.sorting_data.order, { query: this.props.query, query_data: this.props.query_data });
    //     }

}
