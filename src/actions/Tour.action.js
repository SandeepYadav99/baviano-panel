/**
 * Created by charnjeetelectrovese@gmail.com on 1/1/2020.
 */

// import { serviceFetchProviderRequests } from '../services/ProviderRequest.service';
// import { fetchPRequests } from '../services/User.service';
import store from '../store';
import Constants from '../config/constants';
import {serviceCreateTour, serviceGetTours, serviceUpdateTour} from "../services/Tour.service";
import EventEmitter from "../libs/Events.utils";


export const FETCH_INIT = 'FETCH_INIT_TOURS';
export const FETCHED = 'FETCHED_TOURS';
export const FETCHED_FAIL = 'FETCHED_FAIL_TOURS';
export const FETCHED_FILTER = 'FETCHED_FILTER_TOURS';
// export const NEXT_PREQUESTS = 'NEXT_PREQUESTS';
// export const PREV_PREQUESTS = 'PREV_PREQUESTS';
export const FETCH_NEXT = 'FETCH_NEXT_TOURS';
export const FILTER = 'FILTER_TOURS';
export const RESET_FILTER = 'RESET_FILTER_TOURS';
export const SET_SORTING = 'SET_SORTING_TOURS';
export const SET_FILTER = 'SET_FILTER_TOURS';
export const SET_PAGE = 'SET_PAGE_TOURS';
export const CHANGE_PAGE = 'CHANGE_PAGE_TOURS';
export const CHANGE_STATUS= 'CHANGE_STATE_TOURS';
export const SET_SERVER_PAGE = 'SET_SERVER_PAGE_TOURS';
export const CREATE_DATA = 'CREATE_TOUR';
export const UPDATE_DATA = 'UPDATE_TOUR';
export const DELETE_TOUR_IMAGE = 'DELETE_TOUR_IMAGE';

export function actionFetchTours(index = 1, sorting = {}, filter = {}) {
    const request = serviceGetTours({ index, row: sorting.row, order: sorting.order, ...filter });
    return (dispatch) => {
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

export function actionCreateTour(data) {
    const request = serviceCreateTour(data);
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: 'Saved', type: 'success'});
                dispatch({type: CREATE_DATA, payload: data.data})
            }
        })
    }
}

export function actionUpdateTour(data) {
    const request = serviceUpdateTour(data);
    return (dispatch) => {
        request.then((data) => {
            if (!data.error) {
                dispatch({type: UPDATE_DATA, payload: data.data})
            }
        })
    }
}



export function actionChangePageTourRequests(page) {
    return (dispatch) => {
        dispatch({type: CHANGE_PAGE, payload: page})
    }
}

export function actionDeleteTourImage(id, index) {
    return (dispatch) => {
        dispatch({type: DELETE_TOUR_IMAGE, payload: {id, index}})
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

export function actionFilterTourRequests(value) {
    const request = null;////serviceFetchProviderRequests(value);
    return (dispatch) => {
        dispatch({type: FETCH_INIT, payload: null});
        request.then((data) => {
            dispatch({type: FILTER, payload: data});
            dispatch({type: FETCHED, payload: null});//dispatch function
        });
    };
}


export function actionChangeStatusTourRequests(id, status) {
    // const request = serviceFetchProviderRequests(value);
    return (dispatch) => {
        dispatch({type: CHANGE_STATUS, payload: {id, status}});
        // request.then((data) => {
        //     dispatch({type: FILTER_PREQUESTS, payload: data});
        //     dispatch({type: FETCHED_PREQUESTS, payload: null});
        // });
    };
}

export function actionResetFilterTourRequests() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}

export function actionSetPageTourRequests(page) {
    const stateData = store.getState().drivers;
    const currentPage = stateData.currentPage;
    const totalLength = stateData.all.length;
    const sortingData = stateData.sorting_data;
    const query = stateData.query;
    const queryData = stateData.query_data;
    const serverPage = stateData.serverPage;

    if (totalLength <= ((page + 1) * Constants.DEFAULT_PAGE_VALUE)) {
        store.dispatch(actionFetchTours(serverPage + 1, sortingData, {query, query_data: queryData}));
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