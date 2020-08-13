import React from "react";
import {
    Table,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
    TableContainer,
    Button, Typography, withStyles,
    FormControlLabel,
    Switch
} from "@material-ui/core";
import {connect} from "react-redux";
import {bindActionCreators} from 'redux';
import Widget from "../../../../components/Widget/WidgetView";
import classNames from "classnames";
// import { Button } from '../../../../components/Wrappers/Wrappers';
import styles from './Style.module.css';
import Constants from "../../../../config/constants";
import DateUtils from "../../../../libs/DateUtils.lib";
import SidePanelComponent from "../../../../components/SidePanel/SidePanel.component";
import {serviceAcceptOrder, serviceRejectOrder} from "../../../../services/OrderRequest.service";
import EventEmitter from "../../../../libs/Events.utils";
import {
     actionCreateOrder,
     actionUpdateOrder
} from "../../../../actions/Order.action";
import {
    actionChangeAcceptingOrders
} from "../../../../actions/Dashboard.action";

const states = {
    sent: "success",
    pending: "warning",
    declined: "secondary"
};
let CreateProvider = null;

class TableComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            side_panel: false,
            edit_data: null,
            listData: null,
        };
        this._handleEdit = this._handleEdit.bind(this);
        this._handleSideToggle = this._handleSideToggle.bind(this);
        this._handleDataSave = this._handleDataSave.bind(this);
        this._renderCreateForm = this._renderCreateForm.bind(this);
        this._handleAcceptingOrder = this._handleAcceptingOrder.bind(this);
    }

    renderStatus(val) {
        const status = val.status;
        const oStatus = Constants.ORDER_STATUS;
        const colors = {
            [oStatus.PAYMENT]: '#d50000',
            [oStatus.PENDING]: '#f9a825',
            [oStatus.ACCEPTED]: '#ff9100',
            [oStatus.REJECTED]: '#f44336',
            [oStatus.ASSIGNED]: '#66bb6a',
            [oStatus.ON_PICKUP_LOCATION]: '#4caf50',
            [oStatus.OUT_FOR_DELIVERY]: '#43a047',
            [oStatus.ON_DROP_LOCATION]: '#2e7d32',
            [oStatus.DELIVERED]: '#1b5e20',
        }
        const color = colors[status];
        let shouldBlink = false;
        if (status == oStatus.ACCEPTED && val.retry_dispatching) {
            shouldBlink = true;
        } else if (status == oStatus.ON_PICKUP_LOCATION) {
            shouldBlink = true;
        }
        return (<span
            className={classNames((shouldBlink ? styles.blink : ''))}
            style={{
                ...styles.spanFont,
                fontSize: '12px',
                color: 'white',
                background: `${color}`,
                padding: '3px 10px',
                borderRadius: '20px',
                textTransform: 'capitalize'
            }}>{Constants.ORDER_STATUS_TEXT[val.status]}</span>);
    }

    _handleEdit(data) {
        if (CreateProvider == null) {
            // import CreateProvider from './Create.container';
            CreateProvider = require('../../../Order/Order.container').default;
        }
        this.setState({
            side_panel: !this.state.side_panel,
            edit_data: data,
        })
    }

    _handleSideToggle() {
        this.setState({
            side_panel: !this.state.side_panel,
            edit_data: null,
        });
    }

    async _handleDataSave(data, type) {

        this.setState({
            is_submit: true
        });
        let request = null;
        if (type == 'ACCEPT') {
            request = await serviceAcceptOrder(data);
        } else {
            request = await serviceRejectOrder(data);
        }
        if (!request.error) {
            this.props.actionUpdate({...data});
            this.setState({
                side_panel: !this.state.side_panel,
                edit_data: null,
                is_submit: false
            });
        } else {
            EventEmitter.dispatch(EventEmitter.THROW_ERROR, {error: request.message, type: 'error'});
            this.setState({
                is_submit: false
            });
        }
    }

    _renderCreateForm () {

        if (CreateProvider && this.state.side_panel) {
            return (<CreateProvider data={this.state.edit_data}
                                    listData={this.state.listData}
                                    changeStatus={this._handleDataSave}></CreateProvider>);
        } return null;
    }

    _renderListData() {
        const {data} = this.props;
        const tableRows = [];
        data.forEach((val) => {
            if ([Constants.ORDER_STATUS.DELIVERED, Constants.ORDER_STATUS.PAYMENT, Constants.ORDER_STATUS.REJECTED].indexOf(val.status) < 0) {
                tableRows.push(
                    <TableRow key={val.id}>
                        <TableCell className="pl-3 fw-normal">{val.order_no}</TableCell>
                        <TableCell className="pl-3 fw-normal">
                            <div className={styles.firstCellFlex}>
                                <div>
                                    {/*<img src={user.user_image} alt=""/>*/}
                                </div>
                                <div className={classNames(styles.firstCellInfo, 'openSans')}>
                                    <span><strong>{val.user.name}</strong></span> <br/>
                                    <span style={{textTransform: 'lowercase'}}>+{(val.user.contact)}</span>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="pl-3 fw-normal">
                            {val.address.address}
                        </TableCell>
                        <TableCell className="pl-3 fw-normal">
                            {val.products.length}
                        </TableCell>
                        <TableCell className="pl-3 fw-normal">
                            {Constants.CURRENCY} {val.amount.total}
                        </TableCell>
                        <TableCell className="pl-3 fw-normal">
                            {this.renderStatus(val)}
                        </TableCell>
                        <TableCell className="pl-3 fw-normal">
                            {DateUtils.changeTimezoneFromUtc(val.createdAt)}
                        </TableCell>
                        <TableCell className="pl-3 fw-normal">
                            <div><Button onClick={this._handleEdit.bind(this, val)}>Info</Button></div>
                        </TableCell>
                    </TableRow>
                );
            }
        });
        return tableRows;
    }

    _handleAcceptingOrder() {
        const { accepting_orders } = this.props;
        this.props.actionChangeAcceptingOrders(!accepting_orders);
    }

    render() {
        const {classes} = this.props;
        return (
            <Widget
                header={
                    <div className={styles.headerFlex}>
                    <div className={classes.title}>
                        <Typography variant="h5">Ongoing Orders</Typography>
                    </div>
                        <div className={styles.switchCont}>
                            <Typography variant="h5">Accepting Orders?</Typography>
                            <Switch
                                checked={this.props.accepting_orders}
                                onChange={this._handleAcceptingOrder}
                                name="checkedB"
                                color="primary"
                            />
                        </div>
                    </div>
                }
                upperTitle
            >
                <TableContainer className={classes.container}>
                    <Table stickyHeader className="mb-0">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>User Info</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Total Products</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Order Date</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this._renderListData()}
                        </TableBody>
                    </Table>
                </TableContainer>
                <SidePanelComponent
                    handleToggle={this._handleSideToggle}
                    title={'Order '} open={this.state.side_panel} side={'right'}>
                    {this._renderCreateForm()}
                </SidePanelComponent>
            </Widget>
        );
    }
};
const useStyle = theme => ({
    title: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: theme.spacing.unit
    },
    container: {
        maxHeight: 440,
    },
});

function mapStateToProps(state) {
    return {
        data: state.order.present,
        accepting_orders: state.dashboard.is_accepting
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionCreate: actionCreateOrder,
        actionUpdate: actionUpdateOrder,
        actionChangeAcceptingOrders: actionChangeAcceptingOrders
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyle, {withTheme: true})(TableComponent));
