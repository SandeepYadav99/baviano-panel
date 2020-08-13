/**
 * Created by charnjeetelectrovese@gmail.com on 2/7/2020.
 */

import {serviceFetchCoupons, serviceUpdateCoupons, serviceCreateCoupons,serviceDeleteCoupons} from '../services/Coupons.service';
// import { fetchPRequests } from '../services/User.service';
import store from '../store';
import Constants from '../config/constants';
import EventEmitter from '../libs/Events.utils'
import history from '../libs/history.utils';
import {serviceDeleteCategory} from "../services/Category.service";


export const FETCH_INIT = 'FETCH_INIT_COUPONS';
export const FETCHED = 'FETCHED_COUPONS';
export const FETCHED_FAIL = 'FETCHED_FAIL_COUPONS';
export const FETCHED_FILTER = 'FETCHED_FILTER_COUPONS';
// export const NEXT_COUPONS = 'NEXT_COUPONS';
// export const PREV_COUPONS = 'PREV_COUPONS';
export const FETCH_NEXT = 'FETCH_NEXT_COUPONS';
export const FILTER = 'FILTER_COUPONS';
export const RESET_FILTER = 'RESET_FILTER_COUPONS';
export const SET_SORTING = 'SET_SORTING_COUPONS';
export const SET_FILTER = 'SET_FILTER_COUPONS';
export const SET_PAGE = 'SET_PAGE_COUPONS';
export const CHANGE_PAGE = 'CHANGE_PAGE_COUPONS';
export const CHANGE_STATUS = 'CHANGE_STATE_COUPONS';
export const SET_SERVER_PAGE = 'SET_SERVER_PAGE_COUPONS';
export const CREATE_DATA = 'CREATE_COUPONS';
export const UPDATE_DATA = 'UPDATE_COUPONS';
export const DELETE_ITEM = 'DELETE_COUPONS';

export function actionFetchCoupons(index = 1, sorting = {}, filter = {}, shouldReset=false) {
    const {pathname} = history.location;
    const temp = pathname.split('/');
    const id = temp[temp.length - 1];
    const request = serviceFetchCoupons({index, row: sorting.row, order: sorting.order, country_id: id, ...filter});
    return (dispatch) => {
        if (shouldReset) {
            dispatch({
                type: CHANGE_PAGE,
                payload: 1,
            });
        }
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            console.log(data);
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


export function actionChangePageCoupons(page) {
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

export function actionFilterCoupons(value) {
    const request = serviceFetchCoupons(value);
    return (dispatch) => {
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: FILTER, payload: data});
            dispatch({type: FETCHED, payload: null});
        });
    };
}


export function actionChangeStatusCoupons(params) {
    const request = serviceUpdateCoupons(params);
    if (params.type == 'APPROVE') {
        EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Approved', type: 'success'});
    }
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                if (params.id) {
                    dispatch({type: CHANGE_STATUS, payload: params.id});
                }
            }
        });
    };
}

export function actionDeleteCoupons(id) {
    const request = serviceDeleteCoupons({ id: id});
    return (dispatch) => {
        dispatch({type: DELETE_ITEM, payload: id})
    }
}


export function actionResetFilterCoupons() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}

export function actionSetPageCoupons(page) {
    const stateData = store.getState().coupons;
    const currentPage = stateData.currentPage;
    const totalLength = stateData.all.length;
    const sortingData = stateData.sorting_data;
    const query = stateData.query;
    const queryData = stateData.query_data;
    const serverPage = stateData.serverPage;

    if (totalLength <= ((page + 1) * Constants.DEFAULT_PAGE_VALUE)) {
        store.dispatch(actionFetchCoupons(serverPage + 1, sortingData, {query, query_data: queryData}));
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

export function actionCreateCoupons(data) {
    const request = serviceCreateCoupons(data);
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Saved', type: 'success'});
                dispatch({type: CREATE_DATA, payload: data.data});
            }
        })
    }
}

export function actionUpdateCoupons(data) {
    const request = serviceUpdateCoupons(data);
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                dispatch({type: UPDATE_DATA, payload: data.data});
            }
        })
    }
}

