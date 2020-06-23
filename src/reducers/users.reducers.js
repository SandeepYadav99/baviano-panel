/**
 * Created by charnjeetelectrovese@gmail.com on 10/10/2017.
 */
import {
    FETCH_NEXT_USERS,
    FETCH_USERS,
    FETCHED_USERS,
    FILTER_USERS,
    NEXT_USERS,
    PREV_USERS,
    RESET_FILTER,
    SET_SORTING,
    SUSPEND_USER,
    UPDATE_POINTS,
    USERS_FETCHED,
    SET_FILTER,
    SET_PAGE,
    CHANGE_PAGE
} from '../actions/user_data.action';
import Constants from '../config/constants';

function mapPresetUser(all, pageId) {
    return all.filter((val, index) => {
        if (index >= (((pageId+1) * Constants.DEFAULT_PAGE_VALUE) - Constants.DEFAULT_PAGE_VALUE) && index < (((pageId+1) * Constants.DEFAULT_PAGE_VALUE))) {
            return val;
        }
    });
}

const initialState = {
    all: [],
    present: [],
    currentPage: 0,
    serverPage: 0,
    query: null, //search text data
    query_data: null, // popover filter data
    sorting_data: { row: null, order: null },
    fetching: false };

export default function (state = JSON.parse(JSON.stringify(initialState)), action) {
    switch (action.type) {
        case FETCH_USERS: {
            return { ...state, fetching: true };
        }
        case FETCHED_USERS: {
            return { ...state, fetching: false };
        }
        case USERS_FETCHED: {
            const newAll = [...state.all, ...(action.payload)];
            const tableData = mapPresetUser(newAll, state.currentPage);
            return { ...state, all: newAll, present: tableData }; // { ...state , all: newAll, present: tableData, serverPage: 1, currentPage: 1 };
        }
        case SET_SORTING: {
            return { ...state, sorting_data: action.payload };
        }
        case SUSPEND_USER: {
            if (action.payload) {
                const newState = state.all.map((val) => {
                    if (val.user_id == action.payload.user_id) {
                        return { ...val, status: action.payload.type == 'SUSPEND' ? 'SUSPENDED' : 'ACTIVE' };
                    } return { ...val };
                });
                const tableData = mapPresetUser(newState, state.currentPage);
                return { ...state, all: newState, present: tableData };
            }
            return state;
        }
        case NEXT_USERS: {
            const tableData = mapPresetUser(state.all, state.currentPage + 1);
            return { ...state, present: tableData, currentPage: (state.currentPage + 1) };
        }
        case PREV_USERS: {
            const tableData = mapPresetUser(state.all, state.currentPage - 1);
            return { ...state, present: tableData, currentPage: (state.currentPage - 1) };
        }
        case CHANGE_PAGE: {
            const tempPage = action.payload;
            const tableData = mapPresetUser(state.all, tempPage);
            return { ...state, present: tableData, currentPage: tempPage };
        }
        case FETCH_NEXT_USERS: {
            const newAll = state.all.concat(action.payload);
            return { ...state, all: newAll, serverPage: (state.serverPage + 1) };
        }
        case FILTER_USERS: {
            return { ...state, present: action.payload };
        }
        case SET_FILTER: {
            return { ...state, query: action.payload.query, query_data: action.payload.query_data };
        }
        case RESET_FILTER: {
            const tableData = mapPresetUser(state.all, state.currentPage);
            return { ...state, present: tableData };
        }
        case SET_PAGE: {
            return { ...state,  currentPage: action.payload,
                serverPage: action.payload  };
        }
        case UPDATE_POINTS : {
            const newState = state.present.map((val) => {
                if (val.user_id == action.payload.user_id) {
                    val.points = action.payload.points;
                }
                return val;
            });
            return { ...state, present: newState };
        }
        default: {
            return state;
        }
    }
}
