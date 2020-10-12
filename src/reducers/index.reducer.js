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
import PendingPlanReducer from './PendingPlan.reducer';
import BatchReducer from './Batch.reducer';
import BatchProcessingReducer from './BatchProcessing.reducer';
import BatchForecastingReducer from './BatchForecasting.reducer';
import GeofenceReducer from './Geofence.reducer';
import VerificationReducer from './Verification.reducer';
import BatchJobReducer from './BatchJob.reducer';
import AcceptedOrderReducer from './AcceptedOrder.reducer';
import MinBalanceReducer from './MinBalance.reducer';
import MonthlyBillsReducer from './MonthlyBills.reducer';

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
    order: OrderReducer,
    accepted_order: AcceptedOrderReducer,
    pending_plan: PendingPlanReducer,
    batch: BatchReducer,
    batch_processing: BatchProcessingReducer,
    batch_forecasting: BatchForecastingReducer,
    geofence: GeofenceReducer,
    verification: VerificationReducer,
    batch_job: BatchJobReducer,
    min_balance: MinBalanceReducer,
    monthly_bills: MonthlyBillsReducer
    // form: formReducer,
});

export default rootReducer;
