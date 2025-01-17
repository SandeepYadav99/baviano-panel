/* eslint-disable indent,linebreak-style */
const TABLE_LIMIT = 50;
const isDev = true;
const tempLevel = !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
const tempDate = new Date();
const SOCKET_PROJECT = 'BAVIANO_';
let url  = 'http://91.205.173.97:2306/api/company/';
let socketUrl = 'http://91.205.173.97:2306';

if (!isDev) {
    url = 'https://ksheersagar.com/api/company/';
    socketUrl = 'https://ksheersagar.com/';
}

export default {
    TIME_ZONE: -(tempDate.getTimezoneOffset()/60),
    ROLES: { MANAGER: 'MANAGER', CEO: 'CEO', CUSTOMER_CARE: 'CUSTOMER_CARE', ALL: 'ALL'},
    DEFAULT_TIME_FORMAT: 'DD-MM-YYYY, HH:mm',
    APP_NAME: 'Baviano - CompanyPanel',
    DEFAULT_APP_URL: tempLevel ? url :'http://localhost:2306/api/company/',
    SOCKET_URL: tempLevel ? socketUrl : 'http://localhost:2306',
    // DEFAULT_APP_URL: 'http://35.154.147.169:5055/api/',
    MAP_CENTER: { lat: 25.362945, lng: 82.975657 },
    DEFAULT_PAGE_VALUE: TABLE_LIMIT,
    GOOGLE_LOGIN_KEY: '1027293586426-qg6lv2vsp57m05tn32m9stku2ljsd1uh.apps.googleusercontent.com',
    GOOGLE_MAP_KEY: 'AIzaSyCFLmHivV8XnwV9qV1vV8oIDI-EOYRCBhY',
    FACEBOOK_LOGIN_KEY: '213504989180156',
    DATATABLE_PROPERTIES: {
        title: 'Search',
        height: 'auto',
        selectable: false,
        showRowHover: true,
        columns: [],
        data: [],
        count: 0,
        page: 0,
        showCheckboxes: false,
        // showHeaderToolbar: true,
        rowsPerPage: TABLE_LIMIT,
        rowsPerPageOptions: [],
    },
    PRODUCT_TAGS: ['VEG', 'VEGAN', 'GLUTEN FREE', 'DIARY'],
    CURRENCY: 'RS.',
    JOB_STATUS: {
        PENDING: 'PENDING',
        DELIVERED: 'DELIVERED',
        UNDELIVERED: 'UNDELIVERED',
        REJECTED: 'REJECTED',
        NOT_ASSIGNED: 'NOT_ASSIGNED',
        NO_CASH: 'NO_CASH',
        ASSIGNED: 'ASSIGNED'
    },
    JOB_STATUS_TEXT: {
        PENDING: 'Pending',
        DELIVERED: 'Delivered',
        UNDELIVERED: 'UnDelivered',
        REJECTED: 'Rejected',
        NOT_ASSIGNED: 'Not Assigned',
        NO_CASH: 'No Cash',
        ASSIGNED: 'Assigned'
    },
    ORDER_STATUS: {
        PENDING: 'PENDING',
        ASSIGNED: 'ASSIGNED',
        PAYMENT: 'PAYMENT',
        ON_PICKUP_LOCATION: 'ON_PICKUP_LOCATION',
        OUT_FOR_DELIVERY: 'OUT_FOR_DELIVERY',
        ON_DROP_LOCATION: 'ON_DROP_LOCATION',
        DELIVERED: 'DELIVERED',
        REJECTED: 'REJECTED',
        ACCEPTED: 'ACCEPTED'
    },
    ORDER_STATUS_TEXT: {
        ORDER: 'Ordered',
        PENDING: 'Pending',
        ASSIGNED: 'Driver Assigned',
        PAYMENT: 'Payment Pending',
        ON_PICKUP_LOCATION: 'Dispatching',
        OUT_FOR_DELIVERY: 'Out For Delivery',
        ON_DROP_LOCATION: 'Arrived On Location',
        DELIVERED: 'Order Delivered',
        REJECTED: 'Rejected',
        ACCEPTED: 'Accepted'
    },
    SOCKET_EVENTS: {
        JOB_START: SOCKET_PROJECT + 'COMPANY_JOB_START',
        ORDER_DELIVERED: SOCKET_PROJECT + 'COMPANY_ORDER_DELIVERED',
        ORDER_UNDELIVERED: SOCKET_PROJECT + 'COMPANY_ORDER_UNDELIVERED',
        LOCATION_UPDATE: SOCKET_PROJECT + 'COMPANY_LOCATION_UPDATE',
        JOB_END: SOCKET_PROJECT + 'COMPANY_JOB_END',

        NEW_ORDER: SOCKET_PROJECT+'COMPANY_NEW_ORDER',
        ORDER_UPDATE: SOCKET_PROJECT+'COMPANY_ORDER_UPDATE',
        ORDER_ACCEPTED: SOCKET_PROJECT+'ORDER_ACCEPTED',
        ORDER_ASSIGNED: SOCKET_PROJECT+'ORDER_ASSIGNED',
        ORDER_REJECTED: SOCKET_PROJECT+'ORDER_REJECTED',
        ORDER_ON_PICKUP_LOCATION: SOCKET_PROJECT+'ORDER_ON_PICKUP_LOCATION',
        ORDER_ON_WAY: SOCKET_PROJECT+'ORDER_ON_WAY',
        ORDER_ON_DROP_LOCATION: SOCKET_PROJECT+'ORDER_ON_DROP_LOCATION',
        // ORDER_DELIVERED: SOCKET_PROJECT+'ORDER_DELIVERED',
        ORDER_LOCATION_UPDATE: SOCKET_PROJECT+'COMPANY_LOCATION_UPDATE',
        ORDER_DATA: SOCKET_PROJECT+'ORDER_DATA',
        COMPANY_DRIVER_ADD: SOCKET_PROJECT+'COMPANY_DRIVER_ADD',
        COMPANY_DRIVER_REMOVE: SOCKET_PROJECT+'COMPANY_DRIVER_REMOVE',
    },
    DRIVER_JOB_STATUS: {
        PENDING: 'PENDING',
        COMPLETED: 'COMPLETED',
        REJECTED: 'REJECTED',
        IN_PROCESS: 'IN_PROCESS',
    },

    DELIVERY_SLOTS: [{
        time: '07:00',
        time_min: 420,
        unformatted: '07:00 - 08:00am',
        index: 0,
        delivery_index: 0,
    }, {
        time: '08:00',
        time_min: 480,
        unformatted: '08:00 - 09:00am',
        index: 1,
        delivery_index: 1,
    }, {
        time: '09:00',
        time_min: 540,
        unformatted: '09:00 - 10:00am',
        index: 2,
        delivery_index: 2,
    }, {
        time: '10:00',
        time_min: 600,
        unformatted: '10:00 - 11:00am',
        index: 3,
        delivery_index: 3,
    },
    ],
};
