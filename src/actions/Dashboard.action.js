/**
 * Created by charnjeetelectrovese@gmail.com on 4/30/2020.
 */
import {serviceChangeAcceptingOrders, serviceGetDashboard} from "../services/Dashboard.service";


export const DASHBOARD_INIT = 'DASHBOARD_INIT';
export const DASHBOARD_DONE = 'DASHBOARD_DONE';
export const DASHBOARD_ADD_DRIVER = 'DASHBOARD_ADD_DRIVER';
export const DASHBOARD_REMOVE_DRIVER = 'DASHBOARD_REMOVE_DRIVER';
export const DASHBOARD_UPDATE_DRIVER = 'DASHBOARD_UPDATE_DRIVER';
export const DASHBOARD_CHANGE_ACCEPTING_ORDERS = 'DASHBOARD_CHANGE_ACCEPTING_ORDERS';


export function actionGetDashboard(data) {
    const req = serviceGetDashboard({});
    return (dispatch) => {
        dispatch({ type: DASHBOARD_INIT, payload: {} });
        req.then((data) => {
            if (!data.error) {
                const tempData = data.data;
                dispatch({ type: DASHBOARD_DONE, payload: tempData });
            }
        });
    };
    // return ({type: AUTH_USER, payload: data});
}


export function actionDashboardAddDriver(driver) {
    return (dispatch) => {
        dispatch({ type: DASHBOARD_ADD_DRIVER, payload: driver })
    }
}


export function actionDashboardRemoveDriver(driver) {
    return (dispatch) => {
        dispatch({ type: DASHBOARD_REMOVE_DRIVER, payload: driver })
    }
}


export function actionDashboardUpdateDriver(driver) {
    return (dispatch) => {
        dispatch({ type: DASHBOARD_UPDATE_DRIVER, payload: driver })
    }
}

export function actionChangeAcceptingOrders(isAccepting) {
    serviceChangeAcceptingOrders(isAccepting);
    return (dispatch) => {
        dispatch({ type: DASHBOARD_CHANGE_ACCEPTING_ORDERS, payload: isAccepting })
    }
}
