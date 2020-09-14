/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, Paper, Checkbox, Switch} from '@material-ui/core';

import classNames from 'classnames';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
    red as redColor,
} from '@material-ui/core/colors';
import { Add } from '@material-ui/icons';
import PageBox from '../../components/PageBox/PageBox.component';
import SidePanelComponent from '../../components/SidePanel/SidePanel.component';
// import CreateProvider from './Create.container';
import styles from './styles.module.css';
// import DataTables from '../../Datatables/DataTableSrc/DataTables';
import DataTables from '../../Datatables/Datatable.table';
import Constants from '../../config/constants';
import FilterComponent from '../../components/Filter/Filter.component';
import {BookmarkBorder, Bookmark, Check, Close,} from '@material-ui/icons';
import {
    actionFetchOrder,
    actionChangePageOrder,
    actionChangeStatusOrder,
    actionFilterOrder,
    actionResetFilterOrder,
    actionSetPageOrder,
    actionCreateOrder,
    actionUpdateOrder, actionAssignBatchToOrders
} from '../../actions/Order.action';
import DateUtils from '../../libs/DateUtils.lib';
import {serviceAcceptOrder, serviceListData, serviceRejectOrder} from "../../services/OrderRequest.service";
import EventEmitter from "../../libs/Events.utils";
import BottomPanel from '../../components/BottomPanel/BottomPanel.component';
import BottomAction from './components/BottomActions/BottomAction.component';
import {actionChangeAcceptingOrders} from "../../actions/Dashboard.action";

let CreateProvider = null;
class OrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogState: false,
            point_selected: null,
            data: [],
            page: 1,
            total: Constants.DEFAULT_PAGE_VALUE + 1,
            side_panel: false,
            edit_data: null,
            listData: null,
            is_submit: false,
            selected: [],
        };
        this.configFilter = [
            {label: 'City', name: 'city', type: 'text'},
            {label: 'Request Date', name: 'createdAt', type: 'date'},
            {label: 'Status', name: 'status', type: 'select', fields: ['PENDING', 'ACTIVE']},
        ];

        this._handleFilterDataChange = this._handleFilterDataChange.bind(this);
        this._queryFilter = this._queryFilter.bind(this);
        this._handleSearchValueChange = this._handleSearchValueChange.bind(this);
        this._handleSideToggle = this._handleSideToggle.bind(this);
        this._handleSortOrderChange = this._handleSortOrderChange.bind(this);
        this._handleRowSize = this._handleRowSize.bind(this);
        this._handlePageChange = this._handlePageChange.bind(this);
        this._handleEdit = this._handleEdit.bind(this);
        this._handleChangeStatus = this._handleChangeStatus.bind(this);
        this._handleDataSave = this._handleDataSave.bind(this);
        this._handleCheckbox = this._handleCheckbox.bind(this);
        this._handleBatchSelection = this._handleBatchSelection.bind(this);
        this._handleAcceptingOrder = this._handleAcceptingOrder.bind(this);
    }

    componentDidMount() {
        // if (this.props.total_count <= 0) {
        this.props.actionFetchData();
        // const request = serviceListData();
        // request.then((data)=> {
        //     if(!data.error){
        //         this.setState({
        //             listData: data.data
        //         })
        //     }
        // });
        }


    handleCellClick(rowIndex, columnIndex, row, column) {
        console.log(`handleCellClick rowIndex: ${rowIndex} columnIndex: ${columnIndex}`);
    }

    _handlePageChange(type) {
        console.log('_handlePageChange', type);
        this.props.actionSetPage(type);
    }


    _queryFilter(key, value) {
        console.log('_queryFilter', key, value);
        // this.props.actionSetPage(1);
        this.props.actionFetchData(1, this.props.sorting_data, {
            query: key == 'SEARCH_TEXT' ? value : this.props.query,
            query_data: key == 'FILTER_DATA' ? value : this.props.query_data,
        }, true);
    }

    _handleFilterDataChange(value) {
        console.log('_handleFilterDataChange', value);
        this._queryFilter('FILTER_DATA', value);
    }

    _handleSearchValueChange(value) {
        console.log('_handleSearchValueChange', value);
        this._queryFilter('SEARCH_TEXT', value);
    }

    handlePreviousPageClick() {
        console.log('handlePreviousPageClick', 'PREV');
    }

    handleNextPageClick() {
        console.log('handleNextPageClick', 'NEXT');
    }

    _handleSortOrderChange(row, order) {
        console.log(`handleSortOrderChange key:${row} order: ${order}`);
        // this.props.actionSetPage(1);
        this.props.actionFetchData(1,
            {row, order}, {
                query: this.props.query,
                query_data: this.props.query_data,
            }, row);
        // this.props.fetchUsers(1, row, order, { query: this.props.query, query_data: this.props.query_data });
    }

    _handleRowSize(page) {
        console.log(page);
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


    renderFirstCell(user) {
        const tempEmailRender = (<span style={{textTransform: 'lowercase'}}>{(user.user.contact)}</span>);
        return (
            <div className={styles.firstCellFlex}>
                <div>

                </div>
                <div className={classNames(styles.firstCellInfo, 'openSans')}>
                    <span><strong>{user.user.name}</strong></span> <br/>
                   {tempEmailRender}
                </div>
            </div>
        );
    }


    _handleEdit(data) {
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

    _renderCreateForm () {
        if (CreateProvider == null) {
            // import CreateProvider from './Create.container';
            CreateProvider = require('./Order.container').default;
        }
        if (this.state.side_panel) {
            const { id } = this.props.match.params;
            return (<CreateProvider data={this.state.edit_data}
                                    listData={this.state.listData}
                                    changeStatus={this._handleDataSave}></CreateProvider>);
        } return null;
    }
    _handleChangeStatus(data, type) {
        this.props.actionChangeStatus({...data, type: type});
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
            // request = await serviceAcceptOrder(data);
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

    _handleBatchSelection(data) {
        const { selected } = this.state;
        const formData = { ...data, selection: selected };
        this.props.actionAssignBatch(formData);
        this.setState({
            selected: [],
        });
    }

    _renderContact(all){
        return (
            <div>
                {all.country_code}-{all.contact}
                <br/>
                OTP-
                <span style={{
                    fontSize: '12px',
                    color: 'white',
                    background: '#607D8B',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'capitalize'
                }}>
                    {/*{all.verification_code}*/}
                </span>
            </div>
        )
    }

    _handleAcceptingOrder() {
        const { accepting_orders } = this.props;
        this.props.actionChangeAcceptingOrders(!accepting_orders);
    }

    _handleCheckbox(id) {
        const tempSelected = this.state.selected;
        const tempIndex = tempSelected.indexOf(id);
        if (tempIndex >= 0) {
            tempSelected.splice(tempIndex, 1);
        } else {
            tempSelected.push(id);
        }
        this.setState({
            selected: tempSelected,
        });
    }

    _renderOrderId(data) {
        return (
            <div className={styles.flex}>
                <Checkbox
                    disabled={!data.user.is_address_verified}
                    onChange={this._handleCheckbox.bind(this, data.id)}
                    checked={this.state.selected.indexOf(data.id) >= 0}
                    value="secondary"
                    color="primary"
                    inputProps={{'aria-label': 'secondary checkbox'}}
                />
                <span>{data.order_no}</span>
            </div>
        )
    }
    render() {
        const tableStructure = [
            {
                key: 'order_no',
                label: 'Order No',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div>{this._renderOrderId(all)}</div>,
            },
            {
                key: 'user_info',
                label: 'User Info',
                sortable: true,
                style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}}>{this.renderFirstCell(all)}</div>,
            },{
                key: 'address',
                label: 'Address - Slot',
                sortable: true,
                style: { width: '10%'},
                render: (temp, all) => {
                    return (<div >
                        <span>
                            <a href={"https://www.google.com/maps/search/?api=1&query="+all.loc.coordinates[1]+','+all.loc.coordinates[0]} target={'_blank'}><div style={{wordBreak:'break-word'}}>{all.address.address}, {all.address.area}
                                <br/>
                                {all.address.landmark} , {all.address.city}
                        </div></a>
                        </span>
                        <span style={{ fontWeight: 'bold' }}>
                            {all.delivery_slot.unformatted}
                        </span>
                    </div>)
                },
            },
            {
                key: 'geotag_name',
                label: 'GeoTag',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}} >{all.geotag_name} <br/>{all.distance} Km</div>,
            },
            {
                key: 'status',
                label: 'Status',
                sortable: false,
                // style: { width: '20%'},
                render: (temp, all) => <div>{this.renderStatus(all)}</div>,
            },
            {
                key: 'total_amount',
                label: 'Subscription',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}} >Products - {all.products.length} <br/>
                    Rs. {all.amount.total}
                </div>,
            },

            {
                key: 'payment_mode',
                label: 'Payment Preference',
                sortable: true,
                render: (temp, all) => <div>{all.payment_mode} <br/>
                    Rs. {all.user.wallet_amount}
                </div>,
            },
            // {
            //     key: 'start_loc',
            //     label: 'Start - End Location',
            //     sortable: false,
            //     render: (temp, all) => (<div>
            //         <div>{all.start_loc.name}</div>
            //         <div>{all.end_loc.name}</div>
            //     </div>)
            // },
            // {
            //     key: 'createdAt',
            //     label: 'Date',
            //     sortable: true,
            //     render: (temp, all) => <div>{all.createdAt}</div>,
            // },
            // {
            //     key: 'status',
            //     label: 'Status',
            //     sortable: true,
            //     render: (temp, all) => <div>{this.renderStatus(all.status)}</div>,
            // },
            {
                key: 'user_id',
                label: 'Action',
                render: (temp, all) => (<div><Button onClick={this._handleEdit.bind(this, all)}>Info</Button></div>),
            },


        ];
        const datatableFunctions = {
            onCellClick: this.handleCellClick,
            // onCellDoubleClick: this.handleCellDoubleClick,
            // onFilterValueChange: this._handleSearchValueChange.bind(this),
            onSortOrderChange: this._handleSortOrderChange,
            onPageChange: this._handlePageChange,
            onRowSelection: this.handleRowSelection,
            onRowSizeChange: this._handleRowSize,

        };
        const datatable = {
            ...Constants.DATATABLE_PROPERTIES,
            columns: tableStructure,
            data: this.props.data,
            count: this.props.total_count,
            page: this.props.currentPage,
        };
        return (
            <div>
                <PageBox>
                    <div className={styles.headerContainer}>
                        <span className={styles.title}>Order List</span>
                        <div>
                            <span>
                                Accepting Orders ?
                            <Switch
                                checked={this.props.accepting_orders}
                                onChange={this._handleAcceptingOrder}
                                name="checkedB"
                                color="primary"
                            />
                            </span>
                        </div>
                    </div>

                    <div>
                        <FilterComponent
                            is_progress={this.props.is_fetching}
                            filters={this.configFilter}
                            handleSearchValueChange={this._handleSearchValueChange.bind(this)}
                            handleFilterDataChange={this._handleFilterDataChange}
                        />
                        <div>
                            <br/>
                            <div style={{width: '100%'}}>
                                <DataTables
                                    {...datatable}
                                    {...datatableFunctions}
                                />
                            </div>
                        </div>
                    </div>

                </PageBox>
                <SidePanelComponent
                    handleToggle={this._handleSideToggle}
                    title={'Order '} open={this.state.side_panel} side={'right'}>
                    {this._renderCreateForm()}
                </SidePanelComponent>
                <BottomPanel open={this.state.selected.length > 0}>
                    <BottomAction
                        selected={this.state.selected.length}
                        handleAssign={this._handleBatchSelection} />
                </BottomPanel>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        accepting_orders: state.dashboard.is_accepting,
        data: state.order.present,
        total_count: state.order.all.length,
        currentPage: state.order.currentPage,
        serverPage: state.order.serverPage,
        sorting_data: state.order.sorting_data,
        is_fetching: state.order.is_fetching,
        query: state.order.query,
        query_data: state.order.query_data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchOrder,
        actionSetPage: actionSetPageOrder,
        actionResetFilter: actionResetFilterOrder,
        actionSetFilter: actionFilterOrder,
        actionChangeStatus: actionChangeStatusOrder,
        actionCreate: actionCreateOrder,
        actionUpdate: actionUpdateOrder,
        actionAssignBatch: actionAssignBatchToOrders,
        actionChangeAcceptingOrders: actionChangeAcceptingOrders
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
