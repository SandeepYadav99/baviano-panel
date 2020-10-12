import DashboardPage from "../views/dashboard/Dashboard";
import CategoryList from "../views/Category/CategoryList.container";
import Constants from '../config/constants';
import UnitList from '../views/Unit/UnitList.container';
import ProductList from '../views/Product/ProductList.container'
import UserList from '../views/UserStore/UserList.container'
import CouponList from '../views/Coupons/CouponList.container';
import PromotionList from '../views/Promotion/PromotionList.container';
import CustomerList from '../views/Customers/CustomerList.container';
import DriverList from '../views/driver/DriversList.container';
import OrderList from '../views/Order/OrderList.container'
import AcceptedOrderList from '../views/AcceptedOrder/OrderList.container'
import AppSettings from '../views/AppSettings/AppSettings.container';
import PendingPlan from '../views/PendingPlans/PendingPlanList.container';
import BatchProcessing from '../views/BatchProcessing/BatchList.container';
import BatchForecasting from '../views/BatchForecastring/ForecastingList.container';
import GeofenceList from '../views/Geofences/GeofenceList.container';
import VerificationList from '../views/Verification/VerificationList.container';
import BatchJobList from '../views/BatchJobs/BatchJobsList.container';
import MinBalanceList from "../views/MinBalance/MinBalanceList.container";
import MonthlyBillsList from "../views/MonthlyBills/MonthlyBillsList.container";
// import TableList from "views/TableList/TableList.jsx";
// import Typography from "views/Typography/Typography.jsx";
// import Icons from "views/Icons/Icons.jsx";
// import Maps from "views/Maps/Maps.jsx";
// import NotificationsPage from "views/Notifications/Notifications.jsx";

import {
    Dashboard,
    Person,
    LibraryBooks,
    BubbleChart,
    LocationOn,
    Notifications
} from "@material-ui/icons";

const roles = Constants.ROLES;
const dashboardRoutes = [
    {
        path: "/",
        sidebarName: "Dashboard",
        navbarName: "Material Dashboard",
        icon: Dashboard,
        component: DashboardPage,
        is_sidebar: true,
        roles: [roles.ALL]
    },
    {
        path: "/customers",
        sidebarName: "Customers",
        navbarName: "Customers",
        icon: Dashboard,
        component: CustomerList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.ALL]
    },
    {
        path: "/low/balance",
        sidebarName: "Low Balance",
        navbarName: "Low Balance",
        icon: Dashboard,
        component: MinBalanceList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.ALL]
    },

    {
        path: "/verifications",
        sidebarName: "Verifications",
        navbarName: "Verifications",
        icon: Dashboard,
        component: VerificationList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.ALL]
    },

    {
        path: "/orders",
        sidebarName: "Order",
        navbarName: "Order",
        icon: Dashboard,
        component: OrderList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO, roles.MANAGER]
    },

    {
        path: "/accepted",
        sidebarName: "Accepted Orders",
        navbarName: "Accepted Orders",
        icon: Dashboard,
        component: AcceptedOrderList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO, roles.MANAGER]
    },
    {
        path: "/batch/forecasting",
        sidebarName: "Batch Forecast",
        navbarName: "Batch Forecast",
        icon: Dashboard,
        component: BatchForecasting,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO, roles.MANAGER]
    },
    {
        path: "/batch/processing",
        sidebarName: "Batch Assign",
        navbarName: "Batch Assign",
        icon: Dashboard,
        component: BatchProcessing,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO, roles.MANAGER]
    },
    {
        path: "/batch/jobs",
        sidebarName: "Batch Status",
        navbarName: "Batch Status",
        icon: Dashboard,
        component: BatchJobList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO, roles.MANAGER]
    },
    {
        path: "/driver",
        sidebarName: "Riders",
        navbarName: "Riders",
        icon: Dashboard,
        component: DriverList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO, roles.MANAGER]
    },
    {
        path: "/products",
        sidebarName: "Products",
        navbarName: "Products",
        icon: Dashboard,
        component: ProductList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },
    {
        path: "/categories",
        sidebarName: "Categories",
        navbarName: "Categories",
        icon: Dashboard,
        component: CategoryList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },
    {
        path: "/units",
        sidebarName: "Units",
        navbarName: "Units",
        icon: Dashboard,
        component: UnitList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },
    {
        path: "/coupons",
        sidebarName: "Coupons",
        navbarName: "Coupons",
        icon: Dashboard,
        component: CouponList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },

    {
        path: "/promotions",
        sidebarName: "Promotions",
        navbarName: "Promotions",
        icon: Dashboard,
        component: PromotionList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },
    {
        path: "/users",
        sidebarName: "Users",
        navbarName: "Users",
        icon: Dashboard,
        component: UserList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },

    {
        path: "/geofences",
        sidebarName: "Geofences",
        navbarName: "Geofences",
        icon: Dashboard,
        component: GeofenceList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },

    {
        path: "/app/settings",
        sidebarName: "App Settings",
        navbarName: "App Settings",
        icon: Dashboard,
        component: AppSettings,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO]
    },
    {
        path: "/monthly/bills",
        sidebarName: "Monthly Bills",
        navbarName: "Monthly Bills",
        icon: Dashboard,
        component: MonthlyBillsList,
        is_sidebar: true,
        is_protect: true,
        roles: [roles.CEO, roles.MANAGER]
    },



    // {
    //   path: "/notifications",
    //   sidebarName: "Notifications",
    //   navbarName: "Notifications",
    //   icon: Notifications,
    //   component: NotificationsPage
    // },
    // { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
