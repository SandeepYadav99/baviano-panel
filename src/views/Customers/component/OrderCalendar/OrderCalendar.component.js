import React, { Component } from 'react';
import { Calendar, momentLocalizer, Views  } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import {
    serviceCustomerDeliveryDetail, serviceCustomerFutureDeliveryDetail,
    serviceCustomerGetMonthOrders
} from "../../../../services/CustomersRequest.service";
import DetailDialog from './DetailDialog';

let allViews = Object.keys(Views).map(k => Views[k])

const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'lightblue',
        },
    })

class OrderCalendarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            isOpen: false,
            detailData: [],
        };
        this._handleNavigation = this._handleNavigation.bind(this);
        this._getData = this._getData.bind(this);
        this._handleEventClick = this._handleEventClick.bind(this);
        this._handleClose = this._handleClose.bind(this);
    }
    componentDidMount() {
       this._getData();
    }

    async _getData(date = new Date()) {
        const { userId } = this.props;
        const month = moment(new Date(date)).format('MM');
        const year = moment(new Date(date)).format('YYYY');
        const req = await serviceCustomerGetMonthOrders({ user_id: userId, month, year });
        if (!req.error) {
            const data = req.data;
            const events = [];
            const datesArr = [];
            data.delivered.forEach((val) => {
                datesArr.push(val);
                events.push( {
                    start: moment(val),
                    end: moment(val),
                    title: "Delivered"
                });
            })
            data.vacations.forEach((val) => {
                if (datesArr.indexOf(val) < 0) {
                    datesArr.push(val);
                    events.push({
                        start: moment(val),
                        end: moment(val),
                        title: "Vacation"
                    });
                }
            })
            data.month_deliveries.forEach((val) => {
                if (datesArr.indexOf(val) < 0) {
                    datesArr.push(val);
                    events.push({
                        start: moment(val),
                        end: moment(val),
                        title: "Delivery"
                    });
                }
            })
            data.undelivered.forEach((val) => {
                if (datesArr.indexOf(val) < 0) {
                    datesArr.push(val);
                    events.push({
                        start: moment(val),
                        end: moment(val),
                        title: "Undelivered"
                    });
                }
            })


            this.setState({
                events: events
            })
        }
    }

    _handleNavigation(d, c, e, f) {
        this._getData(d);
    }

    _eventPropGetter(e) {
        if (e.title == 'Delivered') {
            return {
                className: 'deliveredSlot',
                style: {

                },
            }
        } else if (e.title == 'Delivery') {
            return {
                className: 'deliverySlot',
                style: {
                },
            }
        } else if (e.title == 'Vacation') {
            return {
                className: 'vacationSlot',
                style: {

                },
            }
        }
        else if (e.title == 'Undelivered') {
            return {
                className: 'undeliveredSlot',
                style: {

                },
            }
        }
        return {};
    }

    async _handleEventClick(e) {
        if (e.title === 'Delivered' || e.title === 'Undelivered') {
            const { userId } = this.props;
            const req = await serviceCustomerDeliveryDetail({ user_id: userId,date: moment(e.start).format('YYYY-MM-DD') });
            if (!req.error) {
                this.setState({
                    isOpen: true,
                    detailData: req.data
                });
            }
        } else if (e.title === 'Delivery') {
            const { userId } = this.props;
            const req = await serviceCustomerFutureDeliveryDetail({ user_id: userId,date: moment(e.start).format('YYYY-MM-DD') });
            if (!req.error) {
                this.setState({
                    isOpen: true,
                    detailData: req.data.map((val) => {return {...val, name: val.product_name, status: 'DELIVERY'}})
                });
            }
        }
    }

    _handleClose() {
        this.setState({
            isOpen: false,
        })
    }

    render () {
        const { events, isOpen, detailData } = this.state;
        const localizer = momentLocalizer(moment);
        return (
            <div style={{ background: 'white', color: 'black' }}>
                <Calendar
                    views={[Views.MONTH]}
                    components={{
                        timeSlotWrapper: ColoredDateCellWrapper,
                    }}
                    onNavigate={this._handleNavigation}
                    localizer={localizer}
                    defaultDate={new Date()}
                    eventPropGetter={this._eventPropGetter}
                    defaultView="month"
                    events={events}
                    onSelectEvent={this._handleEventClick}
                    style={{ padding: '20px', height: "90vh" }}
                />
                <DetailDialog
                    isOpen={isOpen}
                    handleClose={this._handleClose}
                    data={detailData}
                ></DetailDialog>
            </div>
        )
    }
}

export default OrderCalendarComponent;
