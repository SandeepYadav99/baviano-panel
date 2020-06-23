/**
 * Created by charnjeetelectrovese@gmail.com on 9/15/2017.
 */
import { suspendUser, fetchFilterUsers, serviceUpdatePoints } from '../services/index.services';
// import { fetchUsers } from '../services/User.service';

function createData(name, status, email, contact) {
    return {name, status, email, contact};
}

const rows = [
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
    createData('Cupcake', 'ACTIVE', 'charan@gmail.com', 81466666618),
];


export const FETCH_USERS = 'FETCH_USERS';
export const FETCHED_USERS = 'FETCHED_USERS';
export const USERS_FETCHED = 'USERS_FETCHED';
export const SUSPEND_USER = 'SUSPEND_USER';
export const NEXT_USERS = 'NEXT_USERS';
export const PREV_USERS = 'PREV_USERS';
export const FETCH_NEXT_USERS = 'FETCH_NEXT_USERS';
export const FILTER_USERS = 'FILTER_USERS';
export const RESET_FILTER = 'RESET_FILTER';
export const POINTS_SELECT = 'POINTS_SELECT';
export const RESET_POINTS_SELECT = 'RESET_POINTS_SELECT';
export const UPDATE_POINTS = 'UPDATE_POINTS';
export const SET_SORTING = 'SET_SORTING';
export const SET_FILTER = 'SET_FILTER';
export const SET_PAGE = 'SET_PAGE';
export const CHANGE_PAGE = 'CHANGE_PAGE';


export function actionFetchUsers(index = 1, row = null, order = null, filter = {}) {
    // const request = fetchUsers({ index, row, order, ...filter });
    return (dispatch) => {
        dispatch({ type: FETCH_USERS, payload: null });
        // request.then((data) => {
            dispatch({ type: SET_FILTER, payload: filter });
            dispatch({ type: SET_SORTING, payload: { row, order } });
            // if (!data.error) {
                dispatch({ type: USERS_FETCHED, payload: rows });
            // }
            dispatch({ type: FETCHED_USERS, payload: null });
        // });
    };
}

export function actionSuspendUser(user_id, type) {
    return (dispatch) => {
        dispatch({ type: SUSPEND_USER, payload: { user_id, type } });
    };
}


export function actionChangePage(page) {
    return (dispatch) => {
        dispatch({type: CHANGE_PAGE, payload: page })
    }
}
export function nextUsersClick() {
    return {
        type: NEXT_USERS,
        payload: null,
    };
}
export function prevUsersClick() {
    return {
        type: PREV_USERS,
        payload: null,
    };
}
export function actionFetchNextUsers(index = 1, row = null, order = null, filter = {}) {
    // const request = fetchUsers({ index, row, order, ...filter });
    return (dispatch) => {
        dispatch({ type: FETCH_USERS, payload: null });
        // request.then((data) => {
        //     if(!data.error) {
                dispatch({ type: FETCH_NEXT_USERS, payload: rows });
            // }
            dispatch({ type: FETCHED_USERS, payload: null });
        // });
    };
}

export function actionFilterUsers(value) {
    const request = fetchFilterUsers(value);
    return (dispatch) => {
        dispatch({ type: FETCH_USERS, payload: null });
        request.then((data) => {
            dispatch({ type: FILTER_USERS, payload: data });
            dispatch({ type: FETCHED_USERS, payload: null });
        });
    };
}
export function actionUpdatePoints(value) {
    const request = serviceUpdatePoints(value);
    return (dispatch) => {
        request.then(() => {
            dispatch({ type: UPDATE_POINTS, payload: value });
        });
    };
}
export function actionResetFilter() {
    return {
        type: RESET_FILTER,
        payload: null,
    };
}
export function actionSetPage(page) {
    return {
        type: SET_PAGE,
        payload: page,
    };
}
