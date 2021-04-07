/**
 * Created by charnjeetelectrovese@gmail.com on 7/31/2020.
 */
import store from '../store';
import Constants from '../config/constants';
import {serviceGetBatchForecasting } from "../services/BatchForecasting.service";

export const FETCH_INIT = 'FETCH_INIT_BATCH_FORECASTING';
export const FETCHED = 'FETCHED_BATCH_FORECASTING';
export const FETCHED_FAIL = 'FETCHED_FAIL_BATCH_FORECASTING';
export const FETCHED_FILTER = 'FETCHED_FILTER_BATCH_FORECASTING';
// export const NEXT_PREQUESTS = 'NEXT_PREQUESTS';
// export const PREV_PREQUESTS = 'PREV_PREQUESTS';
export const FETCH_NEXT = 'FETCH_NEXT_BATCH_FORECASTING';
export const FILTER = 'FILTER_BATCH_FORECASTING';
export const RESET_FILTER = 'RESET_FILTER_BATCH_FORECASTING';
export const SET_SORTING = 'SET_SORTING_BATCH_FORECASTING';
export const SET_FILTER = 'SET_FILTER_BATCH_FORECASTING';
export const SET_PAGE = 'SET_PAGE_BATCH_FORECASTING';
export const CHANGE_PAGE = 'CHANGE_PAGE_BATCH_FORECASTING';
export const CHANGE_STATUS = 'CHANGE_STATE_BATCH_FORECASTING';
export const SET_SERVER_PAGE = 'SET_SERVER_PAGE_BATCH_FORECASTING';
export const CREATE_DATA = 'CREATE_BATCH_FORECASTING';
export const UPDATE_DATA = 'UPDATE_BATCH_FORECASTING';
export const UPDATE_BATCH_ID = 'UPDATE_BATCH_ID_BATCH_FORECASTING';
export const ASSIGN_DRIVER_TO_JOB = 'ASSIGN_DRIVER_TO_JOB';
export const CLEAN_LIST = 'CLEAN_LIST_BATCH_FORECASTING';
export const CHANGE_DATE = 'CHANGE_FORECASTING_DATE';

export function actionFetchBatchForecasting( index = 1, sorting = {}, filter = {}, shouldReset = false) {
    const stateData = store.getState().batch_forecasting;
    const request = serviceGetBatchForecasting({ date: stateData.date, index, row: sorting.row, order: sorting.order, batch_id: stateData.batch_id,  ...filter}); // GetOrder
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
                dispatch({type: FETCHED, payload: {data: data.data, page: index}});
                dispatch({type: SET_SERVER_PAGE, payload: index});
                if (index == 1) {
                    dispatch({type: CHANGE_PAGE, payload: index - 1});
                }
            } else {
                dispatch({type: FETCHED_FAIL, payload: null});
            }
        });
    };
}

export function actionCreateBatchForecasting(data) {
    return (dispatch) => {
        dispatch({type: CREATE_DATA, payload: data})
    }
}

export function actionUpdateBatchForecasting(data) {
    return (dispatch) => {
        dispatch({type: UPDATE_DATA, payload: data})
    }
}



export function actionChangePageBatchForecasting(page) {
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

export function actionFilterBatchForecasting(value) {
    const request = null;////serviceFetchProviderRequests(value);
    return (dispatch) => {
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: FILTER, payload: data});
            dispatch({type: FETCHED, payload: null});
        });
    };
}

export function actionChangeBatchId(batchId) {
    return (dispatch) => {
        dispatch({type: UPDATE_BATCH_ID, payload: batchId});
        dispatch(actionFetchBatchForecasting());
    }
}

export function actionChangeStatusBatchForecasting(params) {
    // const request = serviceUpdateBatchForecasting({id: params.id, status: params.type});
    // return (dispatch) => {
    //     request.then((data) => {
    //         dispatch({type: CHANGE_STATUS, payload: {id: params.id, status: params.type}});
    //     });
    // };
}

export function actionResetFilterBatchForecasting() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}

export function actionCleanBatchForecasting() {
    return {
        type: CLEAN_LIST,
        payload: null,
    };
}

export function actionChangeForecastingDate(date) {
    return {
        type: CHANGE_DATE,
        payload: date
    }
}

export function actionSetPageBatchForecasting(page) {
    const stateData = store.getState().batch_forecasting;
    const currentPage = stateData.currentPage;
    const totalLength = stateData.all.length;
    const sortingData = stateData.sorting_data;
    const query = stateData.query;
    const queryData = stateData.query_data;
    const serverPage = stateData.serverPage;

    if (totalLength <= ((page + 1) * Constants.DEFAULT_PAGE_VALUE)) {
        store.dispatch(actionFetchBatchForecasting(serverPage + 1, sortingData, {query, query_data: queryData}));
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
