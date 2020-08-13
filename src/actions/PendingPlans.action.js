/**
 * Created by charnjeetelectrovese@gmail.com on 6/26/2020.
 */
import store from '../store';
import Constants from '../config/constants';
import {serviceGetPendingPlan, serviceAssignBatch} from "../services/Plans.service";

export const FETCH_INIT = 'FETCH_INIT_PENDING_PLAN';
export const FETCHED = 'FETCHED_PENDING_PLAN';
export const FETCHED_FAIL = 'FETCHED_FAIL_PENDING_PLAN';
export const FETCHED_FILTER = 'FETCHED_FILTER_PENDING_PLAN';
// export const NEXT_PREQUESTS = 'NEXT_PREQUESTS';
// export const PREV_PREQUESTS = 'PREV_PREQUESTS';
export const FETCH_NEXT = 'FETCH_NEXT_PENDING_PLAN';
export const FILTER = 'FILTER_PENDING_PLAN';
export const RESET_FILTER = 'RESET_FILTER_PENDING_PLAN';
export const SET_SORTING = 'SET_SORTING_PENDING_PLAN';
export const SET_FILTER = 'SET_FILTER_PENDING_PLAN';
export const SET_PAGE = 'SET_PAGE_PENDING_PLAN';
export const CHANGE_PAGE = 'CHANGE_PAGE_PENDING_PLAN';
export const CHANGE_STATUS = 'CHANGE_STATE_PENDING_PLAN';
export const SET_SERVER_PAGE = 'SET_SERVER_PAGE_PENDING_PLAN';
export const CREATE_DATA = 'CREATE_PENDING_PLAN';
export const UPDATE_DATA = 'UPDATE_PENDING_PLAN';
export const ASSIGN_BATCH_PENDING_PLAN = 'ASSIGN_BATCH_PENDING_PLAN';

export function actionFetchPendingPlan(index = 1, sorting = {}, filter = {}, shouldReset = false) {
    const request = serviceGetPendingPlan({index, row: sorting.row, order: sorting.order, ...filter}); // GetPendingPlan
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

export function actionCreatePendingPlan(data) {
    return (dispatch) => {
        dispatch({type: CREATE_DATA, payload: data})
    }
}

export function actionUpdatePendingPlan(data) {

    return (dispatch) => {
        dispatch({type: UPDATE_DATA, payload: data})
    }
}

export function actionAssignBatch(data) {
    const req = serviceAssignBatch(data);
    return (dispatch) => {
        dispatch({type: ASSIGN_BATCH_PENDING_PLAN, payload: data})
    }
}


export function actionChangePagePendingPlan(page) {
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

export function actionFilterPendingPlan(value) {
    const request = null;////serviceFetchProviderRequests(value);
    return (dispatch) => {
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: FILTER, payload: data});
            dispatch({type: FETCHED, payload: null});
        });
    };
}


export function actionChangeStatusPendingPlan(params) {
    const request = serviceAssignBatch({id: params.id, status: params.type});
    return (dispatch) => {
        request.then((data) => {
            dispatch({type: CHANGE_STATUS, payload: {id: params.id, status: params.type}});
        });
    };
}

export function actionResetFilterPendingPlan() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}

export function actionSetPagePendingPlan(page) {
    const stateData = store.getState().pending_plan;
    const currentPage = stateData.currentPage;
    const totalLength = stateData.all.length;
    const sortingData = stateData.sorting_data;
    const query = stateData.query;
    const queryData = stateData.query_data;
    const serverPage = stateData.serverPage;

    if (totalLength <= ((page + 1) * Constants.DEFAULT_PAGE_VALUE)) {
        store.dispatch(actionFetchPendingPlan(serverPage + 1, sortingData, {query, query_data: queryData}));
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
