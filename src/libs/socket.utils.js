/**
 * Created by charnjeetelectrovese@gmail.com on 3/4/2020.
 */
import socketIOClient from "socket.io-client";
import Constants from "../config/constants";
import EventEmitter from "./Events.utils";
import history from './history.utils';
import RouteNames from "../routes/Route.name";
import store from '../store';
import {actionCreateOrder, actionUpdateOrder} from "../actions/Order.action";
import {actionDashboardAddDriver, actionDashboardRemoveDriver} from "../actions/Dashboard.action";

var socket = null;

export const connectToSocket = (token = null) => {
    disconnectSocket();
    console.log('connecting to socket @connectToSocket');
    socket = socketIOClient(Constants.SOCKET_URL, { query: `token=${token ? token : ''}` });
    if (socket) {
        socket.on('connect', (data) => {
            socket.emit('subscribe', 'COMPANY_UPDATES');
            console.log('connected');
        });
        socket.on('reconnecting', (data) => {
            console.log('reconnecting');
        });

        socket.on('connect_timeout', (data) => {
            console.log('connection timeout');
        })
        socket.on('reconnect_attempt', (data) => {
            console.log('reconnect_attempt');
        })
        socket.on('connect_error', (data) => {
            console.log('connect_error');
        });

        socket.on('reconnect_error', (data) => {
            console.log('reconnect_error');
        })
        socket.on('reconnect_failed', (data) => {
            console.log('reconnect_failed');
        });


        socket.on(Constants.SOCKET_EVENTS.NEW_ORDER, (data) =>  {
            console.log('new_order', data);
                    EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
                        error: 'New Order, Check in the order window',
                        type: 'success'
                    });
            store.dispatch(actionCreateOrder(data.message));
            const  audio = new Audio(require('../assets/audio/just-saying.ogg'));
            audio.play();
        });
        socket.on(Constants.SOCKET_EVENTS.ORDER_UPDATE, (data) => {
            console.log('order_update', data);
            store.dispatch(actionUpdateOrder(data.message));
            const tempData = data.message;
            if (tempData.retry_dispatching) {
                EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
                    error: 'One Order needs attention, Check in the order window',
                    type: 'info'
                });
                const  audio = new Audio(require('../assets/audio/just-saying.ogg'));
                audio.play();
            }
        });

        socket.on(Constants.SOCKET_EVENTS.COMPANY_DRIVER_ADD, (data) => {
            const tempData = data.message;
            store.dispatch(actionDashboardAddDriver(tempData))
        });

        socket.on(Constants.SOCKET_EVENTS.COMPANY_DRIVER_REMOVE, (data) => {
            const tempData = data.message;
            store.dispatch(actionDashboardRemoveDriver(tempData))
        });

        // socket.on(Constants.SOCKET_EVENTS.TOUR_COMPLETED, (data) =>  {
        //     // cb(null, JSON.parse(data))
        //     EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
        //         error: data.message.title,
        //         type: 'info'
        //     });
        // });
        //
        // socket.on(Constants.SOCKET_EVENTS.USER_MESSAGE_RECEIVED, (data) =>  {
        //     // cb(null, JSON.parse(data))
        //     if (window.location.href.indexOf('conversations') < 0 ) {
        //         EventEmitter.dispatch(EventEmitter.THROW_ERROR, {
        //             error: data.message.body,
        //             type: 'info'
        //         });
        //     }
        // });

    }
    return socket;
};

export const getSocketInstance = () => {
    if (socket) {
        return socket;
    }
    return connectToSocket();
};


export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
    }
};
