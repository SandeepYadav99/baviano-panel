/**
 * Created by charnjeetelectrovese@gmail.com on 5/1/2020.
 */
import {
    serviceGetAppSettings,
    serviceUpdateGeoFence,
    serviceUpdateMinValue,
    serviceUpdateOrderAfter, serviceUpdateReferAmount,
    serviceUpdateDriverPayout
} from "../services/AppSettings.service";

export const APP_SETTINGS_INIT = 'APP_SETTINGS_INIT';
export const APP_SETTINGS_DONE = 'APP_SETTINGS_DONE';
export const APP_SETTINGS_UPDATE_GEOFENCE = 'APP_SETTINGS_UPDATE_GEOFENCE';
export const APP_SETTINGS_CHANGE_THEME = 'APP_SETTINGS_CHANGE_THEME';
export const APP_SETTINGS_UPDATE_MIN_VALUE = 'APP_SETTINGS_UPDATE_MIN_VALUE';
export const APP_SETTINGS_UPDATE_ORDER_AFTER = 'APP_SETTINGS_UPDATE_ORDER_AFTER';
export const APP_SETTINGS_UPDATE_REFER_AMOUNT = 'APP_SETTINGS_UPDATE_REFER_AMOUNT';
export const APP_SETTINGS_UPDATE_DRIVER_PAYOUT = 'APP_SETTINGS_UPDATE_DRIVER_PAYOUT';

export function actionGetAppSettings(data) {
    const req = serviceGetAppSettings({});
    return (dispatch) => {
        dispatch({ type: APP_SETTINGS_INIT, payload: {} });
        req.then((data) => {
            if (!data.error) {
                const tempData = data.data;
                dispatch({ type: APP_SETTINGS_DONE, payload: tempData });
            }
        });
    };
    // return ({type: AUTH_USER, payload: data});
}


export function actionUpdateGeoFence(data) {
    const request = serviceUpdateGeoFence({ polygon: data } )
    return (dispatch) => {
        dispatch({ type: APP_SETTINGS_UPDATE_GEOFENCE, payload: data })
    }
}
export function actionUpdateMinValue(data) {
    const request = serviceUpdateMinValue({ data: data } );
    return (dispatch) => {
        dispatch({ type: APP_SETTINGS_UPDATE_MIN_VALUE, payload: data })
    }
}

export function actionUpdateOrderAfter(data) {
    const request = serviceUpdateOrderAfter({ ...data } );
    return (dispatch) => {
        dispatch({ type: APP_SETTINGS_UPDATE_ORDER_AFTER, payload: data })
    }
}

export function actionUpdateReferAmount(data) {
    const request = serviceUpdateReferAmount({ data: data } );
    return (dispatch) => {
        dispatch({ type: APP_SETTINGS_UPDATE_REFER_AMOUNT, payload: data })
    }
}

export function actionUpdateDriverPayout(data) {
    const request = serviceUpdateDriverPayout({ data: data } );
    return (dispatch) => {
        dispatch({ type: APP_SETTINGS_UPDATE_DRIVER_PAYOUT, payload: data })
    }
}

export function actionChangeTheme(theme) {
    return (dispatch) => {
        localStorage.setItem('theme', theme);
        dispatch({type: APP_SETTINGS_CHANGE_THEME, payload: theme});
    }
}
