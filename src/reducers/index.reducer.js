/* eslint-disable indent,linebreak-style */
/**
 * Created by charnjeetelectrovese@gmail.com on 9/15/2017.
 */
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import UserReducer from './users.reducers';
import CategoryReducer from './Categories.reducer';
import VehicleReducer from './VehicleReducer.reducer'
import AuthReducer from './Auth.reducer';
import TourReducer from './Tour.reducer';
import UnitReducer from './Unit.reducer';
import ProductReducer from './Product.reducer';
import ProviderUser from './ProviderUser.reducer';
import CouponReducer from './Coupons.reducer';
import PromotionReducer from './Promotion.reducer';
import Customers from './Customers.reducer';
import DRequestReducer from './DriverRequest.reducer';
import OrderReducer from './Order.reducer'
import DashboardReducer from './Dashboard.reducer';
import AppSettingReducer from './AppSettings.reducer';

const rootReducer = combineReducers({
    state: (state = {}) => state,
    form: formReducer,
    app_setting: AppSettingReducer,
    dashboard: DashboardReducer,
    users: UserReducer,
    categories: CategoryReducer,
    vehicles:VehicleReducer,
    auth: AuthReducer,
    tours: TourReducer,
    unit: UnitReducer,
    product: ProductReducer,
    provider_user: ProviderUser,
    coupons: CouponReducer,
    promotion: PromotionReducer,
    customers: Customers,
    drivers: DRequestReducer,
    order: OrderReducer
    // form: formReducer,
});

export default rootReducer;
