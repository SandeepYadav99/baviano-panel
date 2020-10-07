/**
 * Created by charnjeetelectrovese@gmail.com on 12/5/2019.
 */

// import { serviceFetchProviderRequests } from '../services/ProviderRequest.service';
// import { fetchPRequests } from '../services/User.service';
import store from '../store';
import Constants from '../config/constants';
import {
    serviceGetMinBalance,
} from "../services/MinBalanceRequest.service";

export const FETCH_INIT = 'FETCH_INIT_MIN_BALANCE';
export const FETCHED = 'FETCHED_MIN_BALANCE';
export const FETCHED_FAIL = 'FETCHED_FAIL_MIN_BALANCE';
export const FETCHED_FILTER = 'FETCHED_FILTER_MIN_BALANCE';
// export const NEXT_PREQUESTS = 'NEXT_PREQUESTS';
// export const PREV_PREQUESTS = 'PREV_PREQUESTS';
export const FETCH_NEXT = 'FETCH_NEXT_MIN_BALANCE';
export const FILTER = 'FILTER_MIN_BALANCE';
export const RESET_FILTER = 'RESET_FILTER_MIN_BALANCE';
export const SET_SORTING = 'SET_SORTING_MIN_BALANCE';
export const SET_FILTER = 'SET_FILTER_MIN_BALANCE';
export const SET_PAGE = 'SET_PAGE_MIN_BALANCE';
export const CHANGE_PAGE = 'CHANGE_PAGE_MIN_BALANCE';
export const CHANGE_STATUS= 'CHANGE_STATE_MIN_BALANCE';
export const SET_SERVER_PAGE = 'SET_SERVER_PAGE_MIN_BALANCE';
export const CREATE_DATA = 'CREATE_MIN_BALANCE';
export const UPDATE_DATA = 'UPDATE_MIN_BALANCE';
export const ADD_AMOUNT_MIN_BALANCE = 'ADD_AMOUNT_MIN_BALANCE';
export const DEDUCT_PACKING_MIN_BALANCE = 'DEDUCT_PACKING_MIN_BALANCE';


export function actionFetchMinBalance(index = 1, sorting = {}, filter = {}, shouldReset=false) {
    const request = serviceGetMinBalance({ index, row: sorting.row, order: sorting.order, ...filter }); // GetMinBalance
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




export function actionChangePageMinBalance(page) {
    return (dispatch) => {
        dispatch({type: CHANGE_PAGE, payload: page})
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

export function actionFilterMinBalance(value) {
    const request = null;////serviceFetchProviderRequests(value);
    return (dispatch) => {
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: FILTER, payload: data});
            dispatch({type: FETCHED, payload: null});
        });
    };
}

export function actionResetFilterMinBalance() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}

export function actionSetPageMinBalance(page) {
    const stateData = store.getState().min_balance;
    const currentPage = stateData.currentPage;
    const totalLength = stateData.all.length;
    const sortingData = stateData.sorting_data;
    const query = stateData.query;
    const queryData = stateData.query_data;
    const serverPage = stateData.serverPage;

    if (totalLength <= ((page + 1) * Constants.DEFAULT_PAGE_VALUE)) {
        store.dispatch(actionFetchMinBalance(serverPage + 1, sortingData, {query, query_data: queryData}));
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
