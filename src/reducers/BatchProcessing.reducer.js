/**
 * Created by charnjeetelectrovese@gmail.com on 6/29/2020.
 */

import {
    FETCH_NEXT,
    FETCH_INIT,
    FETCHED,
    FILTER,
    RESET_FILTER,
    SET_SORTING,
    SET_FILTER,
    SET_PAGE,
    CHANGE_PAGE,
    CHANGE_STATUS,
    SET_SERVER_PAGE,
    CREATE_DATA,
    UPDATE_DATA,
    UPDATE_BATCH_ID,
    ASSIGN_DRIVER_TO_JOB,
    CLEAN_LIST
} from '../actions/BatchProcessing.action';
import Constants from '../config/constants';

function mapPresetPRequest(all, pageId) {
    return all.filter((val, index) => {
        if (index >= (((pageId + 1) * Constants.DEFAULT_PAGE_VALUE) - Constants.DEFAULT_PAGE_VALUE) && index < (((pageId + 1) * Constants.DEFAULT_PAGE_VALUE))) {
            return val;
        }
    });
}

const initialState = {
    all: [],
    present: [],
    currentPage: 0,
    serverPage: 0,
    query: null, // search text data
    query_data: null, // popover filter data change
    sorting_data: {row: null, order: null},
    is_fetching: false,
    batch_id: null,
};

export default function (state = JSON.parse(JSON.stringify(initialState)), action) {
    switch (action.type) {
        case CLEAN_LIST: {
          return { ...state, ...JSON.parse(JSON.stringify(initialState)) };
        }
        case FETCH_INIT: {
            return {...state, is_fetching: true};
        }
        case UPDATE_BATCH_ID: {
            return {...state, batch_id: action.payload};
        }
        case FETCHED: {
            const newData = (action.payload).data;
            const page = action.payload.page;
            let newAll = [];
            if (page == 1) {
                newAll = [...newData];
            } else {
                newAll = [...state.all, ...newData];
                console.log(newAll)
            }
            const tableData = mapPresetPRequest(newAll, state.currentPage);
            return {...state, all: newAll, present: tableData, is_fetching: false}; // { ...state , all: newAll, present: tableData, serverPage: 1, currentPage: 1 };
        }
        case SET_SORTING: {
            return {...state, sorting_data: action.payload};
        }
        case CHANGE_STATUS: {
            if (action.payload) {
                let tempIndex = null;
                const prevState = state.all;
                prevState.some((val, index) => {
                    if (val.id == action.payload) {
                        tempIndex = index;
                        return true;
                    }
                });
                if (tempIndex != null) {
                    prevState.splice(tempIndex, 1);
                }
                // const newState = state.all.map((val) => {
                //     if (val.id == action.payload.id) {
                //         return { ...val, status: action.payload.status == 'SUSPEND' ? 'SUSPEND' : 'ACTIVE' };
                //     } return { ...val };
                // });
                const tableData = mapPresetPRequest(prevState, state.currentPage);
                return {...state, all: prevState, present: tableData};
            }
            return state;
        }
        // case NEX: {
        //     const tableData = mapPresetPRequest(state.all, state.currentPage + 1);
        //     return { ...state, present: tableData, currentPage: (state.currentPage + 1) };
        // }
        // case PREV_PREQUESTS: {
        //     const tableData = mapPresetPRequest(state.all, state.currentPage - 1);
        //     return { ...state, present: tableData, currentPage: (state.currentPage - 1) };
        // }
        case CHANGE_PAGE: {
            const tempPage = action.payload;
            const tableData = mapPresetPRequest(state.all, tempPage);
            return {...state, present: tableData, currentPage: tempPage};
        }
        case FETCH_NEXT: {
            const newAll = state.all.concat(action.payload);
            return {...state, all: newAll, serverPage: (state.serverPage + 1)};
        }
        case FILTER: {
            return {...state, present: action.payload};
        }
        case SET_FILTER: {
            return {...state, query: action.payload.query, query_data: action.payload.query_data};
        }
        case RESET_FILTER: {
            const tableData = mapPresetPRequest(state.all, state.currentPage);
            return {...state, present: tableData};
        }
        case SET_PAGE: {
            return {...state, currentPage: action.payload};
        }
        case SET_SERVER_PAGE: {
            return {...state, serverPage: action.payload};
        }

        case CREATE_DATA: {
            if (action.payload) {
                const prevState = state.all;
                prevState.unshift(action.payload);
                const tableData = mapPresetPRequest(prevState, state.currentPage);
                return {...state, all: prevState, present: tableData};
            }
            return state;
        }
        case UPDATE_DATA: {
            if (action.payload) {
                const prevState = state.all;
                let tIndex = null;
                prevState.some((val, index) => {
                    if (val.id == action.payload.id) {
                        tIndex = index;
                        return true;
                    }
                });
                if (tIndex != null) {
                    const newData = action.payload;
                    const oldData = prevState[tIndex];
                    if (newData.type == 'STATUS_UPDATE') {
                        const timeStamps = oldData.timestamps;
                        timeStamps[newData.status] = newData.current_timestamp;
                        newData.timestamps = timeStamps;
                    }
                    prevState[tIndex] = {
                        ...oldData,
                        ...newData,
                    };
                }
                const tableData = mapPresetPRequest(prevState, state.currentPage);
                return {...state, all: prevState, present: tableData};
            }
            return state;
        }

        case ASSIGN_DRIVER_TO_JOB: {
            if (action.payload) {
                let tempIndex = [];
                const prevState = state.all;
                prevState.forEach((val, index) => {
                    if (action.payload.selection.indexOf(val.id) >= 0) {
                        // tempIndex.push(index);
                        val.status = Constants.JOB_STATUS.ASSIGNED;
                    }
                });
                // if (tempIndex.length > 0) {
                //     tempIndex.forEach((val) => {
                //         // prevState.splice(tempIndex, 1);
                //     })
                //
                // }
                const tableData = mapPresetPRequest(prevState, state.currentPage);
                return {...state, all: prevState, present: tableData};
            }
            return state;
        }

        default: {
            return state;
        }
    }
}
