/**
 * Created by charnjeetelectrovese@gmail.com on 5/1/2020.
 */

import {
    APP_SETTINGS_UPDATE_GEOFENCE,
    APP_SETTINGS_DONE,
    APP_SETTINGS_INIT, APP_SETTINGS_CHANGE_THEME, APP_SETTINGS_UPDATE_MIN_VALUE, APP_SETTINGS_UPDATE_ORDER_AFTER,
    APP_SETTINGS_UPDATE_REFER_AMOUNT
} from "../actions/AppSettings.action";

const initialState = {
    error: false,
    is_calling: true,
    geofence: [],
    theme: 'dark',
    order_after: 0,
    driver_payout: null,
};

export default function (state = JSON.parse(JSON.stringify(initialState)), action) {
    switch (action.type) {
        case APP_SETTINGS_INIT: {
            return {...state, is_calling: true };
        }
        case APP_SETTINGS_DONE: {
            return {
                ...state,
                ...action.payload,
                is_calling: false
            }
        }
        case APP_SETTINGS_UPDATE_GEOFENCE: {
            if (action.payload) {
                return {...state, geofence: action.payload};
            }
        }
        case APP_SETTINGS_CHANGE_THEME: {
            if (action.payload) {
                return {...state, theme: action.payload};
            }
        }
        case APP_SETTINGS_UPDATE_MIN_VALUE: {
            if (action.payload) {
                return {...state, min_value: action.payload};
            }
        }
        case APP_SETTINGS_UPDATE_REFER_AMOUNT: {
            if (action.payload) {
                return {...state, min_value: action.payload};
            }
        }
        case APP_SETTINGS_UPDATE_REFER_AMOUNT: {
            if (action.payload) {
                return {...state, driver_payout: action.payload};
            }
        }
        case APP_SETTINGS_UPDATE_ORDER_AFTER: {
            if (action.payload) {
                return {...state, order_after: action.payload.order_after};
            }
        }

        default: {
            return state;
        }
    }
    return state;
}
