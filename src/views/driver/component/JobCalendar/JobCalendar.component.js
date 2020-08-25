import React, { Component } from 'react';
import { Calendar, momentLocalizer, Views  } from 'react-big-calendar'
import moment from 'moment'
import "react-big-calendar/lib/css/react-big-calendar.css";
import {serviceCustomerGetMonthOrders} from "../../../../services/CustomersRequest.service";
import {serviceGetDriverMonthJobs} from "../../../../services/Driver.service";

let allViews = Object.keys(Views).map(k => Views[k])

const ColoredDateCellWrapper = ({ children }) =>
    React.cloneElement(React.Children.only(children), {
        style: {
            backgroundColor: 'lightblue',
        },
    })

class JobCalendarComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: [],
        };
        this._handleNavigation = this._handleNavigation.bind(this);
        this._getData = this._getData.bind(this);
    }
    componentDidMount() {
       this._getData();
    }

    async _getData(date = new Date()) {
        const { driverId } = this.props;
        const month = moment(new Date(date)).format('MM');
        const year = moment(new Date(date)).format('YYYY');
        const req = await serviceGetDriverMonthJobs({ driver_id: driverId, month, year });
        if (!req.error) {
            const data = req.data;
            const events = [];
            data.forEach((val) => {
                events.push( {
                    start: moment(val.date),
                    end: moment(val.date),
                    type: val.status,
                    title: val.status + ' ' + val.distance  + ' K.m.'
                });
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
        if (e.type == 'COMPLETED') {
            return {
                className: 'deliveredSlot',
                style: {

                },
            }
        } else if (e.type == 'PENDING') {
            return {
                className: 'deliverySlot',
                style: {

                },
            }
        } else if (e.type == 'IN_PROCESS') {
            return {
                className: 'vacationSlot',
                style: {

                },
            }
        }
        return {};
    }
    render () {
        const { events } = this.state;
        const localizer = momentLocalizer(moment);
        return (
            <div>
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
                    style={{ padding: '20px', height: "90vh" }}
                />
            </div>
        )
    }
}

export default JobCalendarComponent;
