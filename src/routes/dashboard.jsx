import DashboardPage from "../views/dashboard/Dashboard";
import CategoryList from "../views/Category/CategoryList.container";
import Individual from '../views/Individualinfo/Individual.view';
import Vehicles from '../views/Vehicle/VehiclesList.container'
import Tour from '../views/Tour/TourList.container'
import UnitList from '../views/Unit/UnitList.container';
import ProductList from '../views/Product/ProductList.container'
import UserList from '../views/UserStore/UserList.container'
import CouponList from '../views/Coupons/CouponList.container';
import PromotionList from '../views/Promotion/PromotionList.container';
import CustomerList from '../views/Customers/CustomerList.container';
import DriverList from '../views/driver/DriversList.container';
import OrderList from '../views/Order/OrderList.container'
import AppSettings from '../views/AppSettings/AppSettings.container';

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

const dashboardRoutes = [
    {
        path: "/",
        sidebarName: "Dashboard",
        navbarName: "Material Dashboard",
        icon: Dashboard,
        component: DashboardPage,
        is_sidebar: true,
    },


    // {
    //     path: "/info",
    //     sidebarName: "Profile",
    //     navbarName: "Tour Provider Registration",
    //     icon: Dashboard,
    //     component: Individual,
    //     is_sidebar: true,
    //     is_protect: true,
    // },

    {
        path: "/categories",
        sidebarName: "Categories",
        navbarName: "Categories",
        icon: Dashboard,
        component: CategoryList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/units",
        sidebarName: "Units",
        navbarName: "Units",
        icon: Dashboard,
        component: UnitList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/products",
        sidebarName: "Products",
        navbarName: "Products",
        icon: Dashboard,
        component: ProductList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/users",
        sidebarName: "StoreUser",
        navbarName: "StoreUser",
        icon: Dashboard,
        component: UserList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/coupons",
        sidebarName: "Coupons",
        navbarName: "Coupons",
        icon: Dashboard,
        component: CouponList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/promotions",
        sidebarName: "Promotions",
        navbarName: "Promotions",
        icon: Dashboard,
        component: PromotionList,
        is_sidebar: true,
        is_protect: true,
    },

    {
        path: "/customers",
        sidebarName: "Customers",
        navbarName: "Customers",
        icon: Dashboard,
        component: CustomerList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/driver",
        sidebarName: "Driver",
        navbarName: "Driver",
        icon: Dashboard,
        component: DriverList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/orders",
        sidebarName: "Order",
        navbarName: "Order",
        icon: Dashboard,
        component: OrderList,
        is_sidebar: true,
        is_protect: true,
    },
    {
        path: "/app/settings",
        sidebarName: "App Settings",
        navbarName: "App Settings",
        icon: Dashboard,
        component: AppSettings,
        is_sidebar: true,
        is_protect: true,
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
