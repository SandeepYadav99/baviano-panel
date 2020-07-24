/* eslint-disable indent,linebreak-style */
const TABLE_LIMIT = 50;
const tempLevel = !(!process.env.NODE_ENV || process.env.NODE_ENV === 'development');
const tempDate = new Date();
const SOCKET_PROJECT = 'BAVIANO_';
export default {
    TIME_ZONE: -(tempDate.getTimezoneOffset()/60),
    DEFAULT_TIME_FORMAT: 'DD-MM-YYYY, HH:mm',
    APP_NAME: 'Baviano - CompanyPanel',
    DEFAULT_APP_URL: tempLevel ? 'http://91.205.173.97:2306/api/company/' :'http://192.168.1.21:2306/api/company/',
    SOCKET_URL: tempLevel ? 'http://91.205.173.97:2306' : 'http://192.168.1.21:2306',
    // DEFAULT_APP_URL: 'http://35.154.147.169:5055/api/',
    DEFAULT_PAGE_VALUE: TABLE_LIMIT,
    GOOGLE_LOGIN_KEY: '1027293586426-qg6lv2vsp57m05tn32m9stku2ljsd1uh.apps.googleusercontent.com',
    GOOGLE_MAP_KEY: 'AIzaSyDUTIV7DaCvMUMg3qElE-sxdj4zR-dxhFM',
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
        rowsPerPageOptions: [10, 15, 25],
    },
    PRODUCT_TAGS: ['VEG', 'VEGAN', 'GLUTEN FREE', 'DIARY'],
    CURRENCY: 'RS.',
    JOB_STATUS: {
        PENDING: 'PENDING',
        DELIVERED: 'DELIVERED',
        REJECTED: 'REJECTED',
        NOT_ASSIGNED: 'NOT_ASSIGNED',
        NO_CASH: 'NO_CASH',
        ASSIGNED: 'ASSIGNED'
    },
    JOB_STATUS_TEXT: {
        PENDING: 'Pending',
        DELIVERED: 'Delivered',
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
        NEW_ORDER: SOCKET_PROJECT+'COMPANY_NEW_ORDER',
        ORDER_UPDATE: SOCKET_PROJECT+'COMPANY_ORDER_UPDATE',
        ORDER_ACCEPTED: SOCKET_PROJECT+'ORDER_ACCEPTED',
        ORDER_ASSIGNED: SOCKET_PROJECT+'ORDER_ASSIGNED',
        ORDER_REJECTED: SOCKET_PROJECT+'ORDER_REJECTED',
        ORDER_ON_PICKUP_LOCATION: SOCKET_PROJECT+'ORDER_ON_PICKUP_LOCATION',
        ORDER_ON_WAY: SOCKET_PROJECT+'ORDER_ON_WAY',
        ORDER_ON_DROP_LOCATION: SOCKET_PROJECT+'ORDER_ON_DROP_LOCATION',
        ORDER_DELIVERED: SOCKET_PROJECT+'ORDER_DELIVERED',
        ORDER_LOCATION_UPDATE: SOCKET_PROJECT+'COMPANY_LOCATION_UPDATE',
        ORDER_DATA: SOCKET_PROJECT+'ORDER_DATA',
        COMPANY_DRIVER_ADD: SOCKET_PROJECT+'COMPANY_DRIVER_ADD',
        COMPANY_DRIVER_REMOVE: SOCKET_PROJECT+'COMPANY_DRIVER_REMOVE',
    },
};
