/**
 * Created by charnjeetelectrovese@gmail.com on 4/30/2020.
 */
import {
    DASHBOARD_INIT,
    DASHBOARD_DONE,
    DASHBOARD_ADD_DRIVER,
    DASHBOARD_REMOVE_DRIVER,
    DASHBOARD_UPDATE_DRIVER,
    DASHBOARD_CHANGE_ACCEPTING_ORDERS
} from "../actions/Dashboard.action";

const initialState = {
    error: false,
    is_calling: true,
    weekly_data: [],
    total_orders: 0,
    total_customers: 0,
    total_revenue: 0,
    total_products: 0,
    drivers: [],
    is_accepting: false,
};

export default function (state = JSON.parse(JSON.stringify(initialState)), action) {
    switch (action.type) {
        case DASHBOARD_INIT: {
            return {...state, is_calling: true };
        }
        case DASHBOARD_DONE: {
            return {
                ...state,
                ...action.payload,
                is_calling: false
            }
        }
        case DASHBOARD_ADD_DRIVER: {
            if (action.payload) {
                const prevState = state.drivers;
                prevState.push(action.payload);
                return {...state, drivers: prevState};
            }
        }
        case DASHBOARD_REMOVE_DRIVER: {
            if (action.payload) {
                const prevState = state.drivers;
                let tIndex = null;
                prevState.some((val, index) => {
                    if (val.driver_id == action.payload.driver_id) {
                        tIndex = index;
                        return true;
                    }
                });
                if (tIndex != null) {
                    prevState.splice(tIndex, 1);
                }
                return {...state, drivers: prevState};
            }
        }
        case DASHBOARD_UPDATE_DRIVER: {
            if (action.payload) {
                const prevState = state.drivers;
                let tIndex = null;
                prevState.some((val, index) => {
                    if (val.driver_id == action.payload.driver_id) {
                        tIndex = index;
                        return true;
                    }
                });
                if (tIndex != null) {
                    prevState[tIndex] = {
                        ...prevState[tIndex],
                        ...action.payload,
                    };
                }
                return {...state, drivers: prevState};
            }
        }
        case DASHBOARD_CHANGE_ACCEPTING_ORDERS: {
            return {
                ...state,
                is_accepting: action.payload,
            }
        }
        default: {
            return state;
        }
    }
    return state;
}
