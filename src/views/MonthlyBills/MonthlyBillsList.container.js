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
import {
    actionFetchMonthlyBills,
    actionFilterMonthlyBills,
    actionResetFilterMonthlyBills,
    actionSetPageMonthlyBills,

} from '../../actions/MonthlyBills.action';
import {AddCircle as AddIcon, VerifiedUser as VerifiedIcon, Delete as DeleteIcon} from '@material-ui/icons';
import moment from "moment";
// import {serviceGetMonthlyBillsDownload} from "../../services/MonthlyBillsRequest.service";

let CreateProvider = null;

class MonthlyBillsList extends Component {
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
            {label: 'Month', name: 'month', type: 'select', fields: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]},
            {label: 'Year', name: 'year', type: 'select', fields: []},
            // {label: 'City', name: 'city', type: 'text'},
            // {label: 'Request Date', name: 'createdAt', type: 'date'},
            // {label: 'PayMode', name: 'payment_mode', type: 'select', fields: ['COD', 'WALLET']},
            // {label: 'Status', name: 'status', type: 'select', fields: ['PENDING', 'ACTIVE', 'SUSPENDED']},
            // {label: 'Verified?', name: 'is_address_verified', type: 'selectObject', custom: { extract: { id: 'id', title: 'name' } } , fields: [{ id: true, name: 'Verified' }, { id: false, name: 'Not Verified' } ]},
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
        this._handleSideBarClose = this._handleSideBarClose.bind(this);
        this._handleDownload = this._handleDownload.bind(this);
    }

    componentDidMount() {
        // if (this.props.total_count <= 0) {
        // this.props.actionFetchData();
        this.props.actionFetchData(1, this.props.sorting_data, {
            query: null,
            query_data: [{"label": "Month", "name": "month", "value": 9, "type": "select"},
                {"label": "Year", "name": "year", "value": 2020, "type": "select"}
            ]
        }, true);
        // const request = serviceListData();
        // request.then((data)=> {
        //     if(!data.error){
        //         this.setState({
        //             listData: data.data
        //         })
        //     }
        // });
        const year = parseInt(moment(new Date()).format('YYYY'));
        const month = parseInt(moment(new Date()).format('MM'));
        const years = [];
        for (let i = year - 1; i <= (year); i++) {
            years.push(i);
        }
        this.configFilter[1].fields = years;

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
                    <span><strong>{user.name}</strong></span> <br/>
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

    _renderCreateForm() {
        // if (CreateProvider == null) {
        //     // import CreateProvider from './Create.container';
        //     CreateProvider = require('./MonthlyBills.container').default;
        // }
        // if (this.state.side_panel) {
        //     const { id } = this.props.match.params;
        //     return (<CreateProvider data={this.state.edit_data}
        //                             listData={this.state.listData}
        //                             changeStatus={this._handleChangeStatus}
        //                             handleClose={this._handleSideBarClose}
        //                             handleDataSave={this._handleDataSave}></CreateProvider>);
        // } return null;
    }

    _handleChangeStatus(data) {
        // this.props.actionChangeStatus({...data});
        // this.setState({
        //     side_panel: !this.state.side_panel,
        //     edit_data: null,
        // });
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

    _renderContact(all) {
        return (
            <div>
                {all.country_code}-{all.contact}
                <br/>
                <div style={{fontSize: '11px'}}>
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

    _handleAddAmount(userId) {
        this.setState({
            userId: userId,
            showAmountDialog: true,
        })
    }

    async _handleDownload() {
        // const  { sorting_data, query, query_data } = this.props;
        // const req = await serviceGetMonthlyBillsDownload({ row: sorting_data.row, order: sorting_data.order, query, query_data });
        // if (!req.error) {
        //
        //     const data = req.data;
        //     window.open(
        //         data, "_blank");
        // }
    }

    render() {
        const { query_data  }  =this.props;
        let month = '';
        let year = '';
        if (query_data) {
            query_data.forEach((val) => {
                if (val.name == 'month') {
                    month = val.value
                }
                if (val.name == 'year') {
                    year = val.value
                }
            })
        }
        const tableStructure = [

            {
                key: 'userObj.name',
                label: 'User',
                sortable: true,
                style: {width: '20%', backgroundColor: 'inherit'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>{all.name} <br/>
                    {all.contact}
                    <br/>
                    {all.email}</div>,
            },
            {
                key: 'closing_balance',
                label: 'Opening - Closing Balance',
                sortable: true,
                style: {width: '20%'},
                render: (temp, all) => <div
                    style={{wordBreak: 'break-word'}}>Rs. {all.opening_balance} - {all.closing_balance}</div>,
            }, {
                key: 'debit',
                label: 'Debit',
                sortable: true,
                style: {width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>Rs. {all.debit}</div>,
            },
            {
                key: 'credit',
                label: 'Credit',
                sortable: true,
                style: {width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>Rs. {all.credit}</div>,
            },

            {
                key: 'user_id',
                label: 'Action',
                render: (temp, all) => (<div>
                    <a href={all.pdf_file} target={'_blank'}>PDF</a>
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
                        <span className={styles.title}>MonthlyBills List ({month}/{year})</span>
                        {/*<Button onClick={this._handleDownload} variant={'contained'} color={'primary'}>*/}
                        {/*    Export*/}
                        {/*</Button>*/}
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
                    title={'MonthlyBills '} open={this.state.side_panel} side={'right'}>
                    {this._renderCreateForm()}
                </SidePanelComponent>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.monthly_bills.present,
        total_count: state.monthly_bills.all.length,
        currentPage: state.monthly_bills.currentPage,
        serverPage: state.monthly_bills.serverPage,
        sorting_data: state.monthly_bills.sorting_data,
        is_fetching: state.monthly_bills.is_fetching,
        query: state.monthly_bills.query,
        query_data: state.monthly_bills.query_data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchMonthlyBills,
        actionSetPage: actionSetPageMonthlyBills,
        actionResetFilter: actionResetFilterMonthlyBills,
        actionSetFilter: actionFilterMonthlyBills,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(MonthlyBillsList);
