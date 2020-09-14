/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, Paper, IconButton} from '@material-ui/core';

import classNames from 'classnames';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
    red as redColor,
} from '@material-ui/core/colors';
import PageBox from '../../components/PageBox/PageBox.component';
import SidePanelComponent from '../../components/SidePanel/SidePanel.component';
// import CreateProvider from './Create.container';
import styles from './styles.module.css';
// import DataTables from '../../Datatables/DataTableSrc/DataTables';
import DataTables from '../../Datatables/Datatable.table';
import Constants from '../../config/constants';
import FilterComponent from '../../components/Filter/Filter.component';
import AmountDialog from './component/wallet/AddDialog.componet';
import {
    actionFetchCustomers,
    actionChangePageCustomers,
    actionChangeStatusCustomers,
    actionFilterCustomers,
    actionResetFilterCustomers,
    actionSetPageCustomers,
    actionCreateCustomers,
    actionUpdateCustomers
} from '../../actions/Customers.action';
import {AddCircle as AddIcon, VerifiedUser as VerifiedIcon, Delete as DeleteIcon} from '@material-ui/icons';
import {serviceGetCustomersDownload} from "../../services/CustomersRequest.service";

let CreateProvider = null;
class CustomerList extends Component {
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
            userId: null,
            showAmountDialog: false,
        };
        this.configFilter = [
            {label: 'City', name: 'city', type: 'text'},
            {label: 'Request Date', name: 'createdAt', type: 'date'},
            {label: 'Status', name: 'status', type: 'select', fields: ['PENDING', 'ACTIVE', 'SUSPENDED']},
            {label: 'Verified?', name: 'is_address_verified', type: 'selectObject', custom: { extract: { id: 'id', title: 'name' } } , fields: [{ id: true, name: 'Verified' }, { id: false, name: 'Not Verified' } ]},
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
        this._handleCloseAmountDialog = this._handleCloseAmountDialog.bind(this);
        this._handleSideBarClose = this._handleSideBarClose.bind(this);
        this._handleDownload = this._handleDownload.bind(this);
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

    renderStatus(status) {
        if (status === 'ACTIVE') {
            return (
                <span style={{
                    fontSize: '12px',
                    color: 'white',
                    background: 'green',
                    padding: '3px 10px',
                    borderRadius: '20px',
                    textTransform: 'capitalize'
                }}>
                    {(status)}
                </span>
            );
        }
        return (<span style={{
            ...styles.spanFont,
            fontSize: '12px',
            color: 'white',
            background: `${status == 'NEW' ? 'orange' : 'orange'}`,
            padding: '3px 10px',
            borderRadius: '20px',
            textTransform: 'capitalize'
        }}>{(status)}</span>);
    }

    renderFirstCell(user) {
        return (
            <div className={styles.firstCellFlex}>
                <div>

                </div>
                <div className={classNames(styles.firstCellInfo, 'openSans')}>
                    <span><strong>{user.name}</strong></span>  <br/>
                    <span title={user.verification_code}>{user.contact}</span>
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

    _handleSideBarClose() {
        this.setState({
            side_panel: false,
        });
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
            CreateProvider = require('./Customer.container').default;
        }
        if (this.state.side_panel) {
            const { id } = this.props.match.params;
            return (<CreateProvider data={this.state.edit_data}
                                    listData={this.state.listData}
                                    changeStatus={this._handleChangeStatus}
                                    handleClose={this._handleSideBarClose}
                                    handleDataSave={this._handleDataSave}></CreateProvider>);
        } return null;
    }
    _handleChangeStatus(data) {
        this.props.actionChangeStatus({...data});
        this.setState({
            side_panel: !this.state.side_panel,
            edit_data: null,
        });
    }

    _handleDataSave(data, type) {
        // this.props.actionChangeStatus({...data, type: type});
        if (type == 'CREATE') {
            this.props.actionCreate(data)
        } else {
            this.props.actionUpdate(data)
        }
        this.setState({
            side_panel: !this.state.side_panel,
            edit_data: null,
        });
    }

    _renderContact(all){
        return (
            <div>
                {all.country_code}-{all.contact}
                <br/>
                <div style={{ fontSize: '11px' }}>
                OTP-
                <span style={{
                    marginLeft: '5px',
                    color: 'white',
                    background: '#2c3f8b',
                    padding: '2px 7px',
                    borderRadius: '10px',
                    textTransform: 'capitalize'
                }}>
                    {all.verification_code}
                </span>
                </div>
            </div>
        )
    }

    _renderSubscription(isOrder) {
        const color = isOrder ? '#2e7d32' : '#f44336';
        return (<span
            style={{
                ...styles.spanFont,
                fontSize: '12px',
                color: 'white',
                background: `${color}`,
                padding: '3px 10px',
                borderRadius: '20px',
                textTransform: 'capitalize'
            }}>{isOrder ? 'Subscribed' : 'Not Subscribed'}</span>);
    }

    _handleCloseAmountDialog () {
        this.setState({
            userId: null,
            showAmountDialog: false,
        })
    }
    _handleAddAmount(userId) {
        this.setState({
            userId: userId,
            showAmountDialog: true,
        })
    }

    async _handleDownload() {
        const  { sorting_data, query, query_data } = this.props;
        const req = await serviceGetCustomersDownload({ row: sorting_data.row, order: sorting_data.order, query, query_data });
        if (!req.error) {

            const data = req.data;
            window.open(
                data, "_blank");
        }
    }

    render() {
        const tableStructure = [

            {
                key: 'is_address_verified',
                label: 'V',
                sortable: true,
                style: { width: '10px', backgroundColor: 'inherit'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}}>{all.is_address_verified && (<VerifiedIcon></VerifiedIcon>)}</div>,
            },
            {
                key: 'name',
                label: 'Name',
                sortable: true,
                style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}}>{this.renderFirstCell(all)}</div>,
            },{
                key: 'address',
                label: 'Address - Slot',
                sortable: true,
                style: { width: '20%'},
                render: (temp, all) => {
                    if (all.status != 'PENDING') {
                        return (<div>
                        <span>
                            <a href={"https://www.google.com/maps/search/?api=1&query=" + all.loc.coordinates[1] + ',' + all.loc.coordinates[0]}
                               target={'_blank'}><div
                                style={{wordBreak: 'break-word'}}>{all.address.address}, {all.address.area}
                                <br/>
                                {all.address.landmark} , {all.address.city}
                        </div></a>
                        </span>
                            <span style={{fontWeight: 'bold'}}>
                            {all.delivery_slot.unformatted}
                        </span>
                        </div>)
                    } return (<div>N/A</div>)
                },
            },
            {
                key: 'geotag_name',
                label: 'GeoTag',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}} >{all.geotag_name} <br/>{all.distance} Km</div>,
            },

            // {
            //     key: 'packages_pending',
            //     label: 'Pending Packages',
            //     sortable: true,
            //     style: { width: '20%'},
            //     render: (temp, all) => <div style={{wordBreak:'break-word'}} >{all.packages_pending}</div>,
            // },
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
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (temp, all) => <div>{this.renderStatus(all.status)}</div>,
            },
            {
                key: 'subscription',
                label: 'Subscription',
                sortable: true,
                render: (temp, all) => <div>{this._renderSubscription(all.is_order)}</div>,
            },
            {
                key: 'wallet_balance',
                label: 'Payment Preference',
                sortable: true,
                render: (temp, all) => <div>
                    {all.payment_mode} <br/>
                    Rs. {all.wallet.amount}</div>,
            },

            {
                key: 'user_id',
                label: 'Action',
                render: (temp, all) => (<div>
                    <IconButton variant={'contained'}
                                onClick={this._handleAddAmount.bind(this, all.id)}
                                type="button">
                        <AddIcon />
                    </IconButton>
                    <Button onClick={this._handleEdit.bind(this, all)}>Info</Button>
                </div>),
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
                        <span className={styles.title}>Customers List</span>
                        <Button onClick={this._handleDownload} variant={'contained'} color={'primary'}>
                            Export
                        </Button>
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
                    title={'Customers '} open={this.state.side_panel} side={'right'}>
                    {this._renderCreateForm()}
                </SidePanelComponent>
                <AmountDialog
                    userId={this.state.userId}
                    open={this.state.showAmountDialog}
                    handleClose={this._handleCloseAmountDialog}
                />
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.customers.present,
        total_count: state.customers.all.length,
        currentPage: state.customers.currentPage,
        serverPage: state.customers.serverPage,
        sorting_data: state.customers.sorting_data,
        is_fetching: state.customers.is_fetching,
        query: state.customers.query,
        query_data: state.customers.query_data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchCustomers,
        actionSetPage: actionSetPageCustomers,
        actionResetFilter: actionResetFilterCustomers,
        actionSetFilter: actionFilterCustomers,
        actionChangeStatus: actionChangeStatusCustomers,
        actionCreate: actionCreateCustomers,
        actionUpdate: actionUpdateCustomers
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerList);
