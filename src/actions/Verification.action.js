
import store from '../store';
import Constants from '../config/constants';
import {serviceGetVerification, serviceAssignDriverToVerification} from "../services/Verification.service";

export const FETCH_INIT = 'FETCH_INIT_VERIFICATION';
export const FETCHED = 'FETCHED_VERIFICATION';
export const FETCHED_FAIL = 'FETCHED_FAIL_VERIFICATION';
export const FETCHED_FILTER = 'FETCHED_FILTER_VERIFICATION';
// export const NEXT_PREQUESTS = 'NEXT_PREQUESTS';
// export const PREV_PREQUESTS = 'PREV_PREQUESTS';
export const FETCH_NEXT = 'FETCH_NEXT_VERIFICATION';
export const FILTER = 'FILTER_VERIFICATION';
export const RESET_FILTER = 'RESET_FILTER_VERIFICATION';
export const SET_SORTING = 'SET_SORTING_VERIFICATION';
export const SET_FILTER = 'SET_FILTER_VERIFICATION';
export const SET_PAGE = 'SET_PAGE_VERIFICATION';
export const CHANGE_PAGE = 'CHANGE_PAGE_VERIFICATION';
export const CHANGE_STATUS = 'CHANGE_STATE_VERIFICATION';
export const SET_SERVER_PAGE = 'SET_SERVER_PAGE_VERIFICATION';
export const CREATE_DATA = 'CREATE_VERIFICATION';
export const UPDATE_DATA = 'UPDATE_VERIFICATION';
export const ASSIGN_DRIVER_TO_VERIFICATION = 'ASSIGN_DRIVER_TO_VERIFICATION';
export const CLEAN_LIST = 'CLEAN_LIST_VERIFICATION';

export function actionFetchVerification(index = 1, sorting = {}, filter = {}, shouldReset = false) {
    const stateData = store.getState().batch_processing;
    const request = serviceGetVerification({index, row: sorting.row, order: sorting.order, batch_id: stateData.batch_id,  ...filter}); // GetOrder
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

export function actionCreateVerification(data) {
    return (dispatch) => {
        dispatch({type: CREATE_DATA, payload: data})
    }
}

export function actionUpdateVerification(data) {
    return (dispatch) => {
        dispatch({type: UPDATE_DATA, payload: data})
    }
}


export function actionAssignDriver(data) {
    const req = serviceAssignDriverToVerification(data);
    return (dispatch) => {
        req.then((res) => {
            if (!res.error) {
                dispatch({type: ASSIGN_DRIVER_TO_VERIFICATION, payload: res.data})
            }
        })
    }
}


export function actionChangePageVerification(page) {
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

export function actionFilterVerification(value) {
    const request = null;////serviceFetchProviderRequests(value);
    return (dispatch) => {
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: FILTER, payload: data});
            dispatch({type: FETCHED, payload: null});
        });
    };
}


export function actionChangeStatusVerification(params) {
    // const request = serviceUpdateVerification({id: params.id, status: params.type});
    // return (dispatch) => {
    //     request.then((data) => {
    //         dispatch({type: CHANGE_STATUS, payload: {id: params.id, status: params.type}});
    //     });
    // };
}

export function actionResetFilterVerification() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}

export function actionCleanVerification() {
    return {
        type: CLEAN_LIST,
        payload: null,
    };
}

export function actionSetPageVerification(page) {
    const stateData = store.getState().verification;
    const currentPage = stateData.currentPage;
    const totalLength = stateData.all.length;
    const sortingData = stateData.sorting_data;
    const query = stateData.query;
    const queryData = stateData.query_data;
    const serverPage = stateData.serverPage;

    if (totalLength <= ((page + 1) * Constants.DEFAULT_PAGE_VALUE)) {
        store.dispatch(actionFetchVerification(serverPage + 1, sortingData, {query, query_data: queryData}));
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
