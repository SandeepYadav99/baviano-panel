/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, FormControl, InputLabel, Paper, Select} from '@material-ui/core';

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
import styles from './Style.module.css';
import DataTables from '../../Datatables/Datatable.table';
import Constants from '../../config/constants';
import ReduxDatePicker from "../../components/ReduxDatePicker/ReduxDatePicker.component";
import DateUtils from "../../libs/DateUtils.lib";
import LineStat from './LineStat.component';

const PieChartData = [
    {name: "Group A", value: 400, color: "primary"},
    {name: "Group B", value: 300, color: "secondary"},
    {name: "Group C", value: 300, color: "warning"},
    {name: "Group D", value: 200, color: "success"}
];

let CreateProvider = null;

class RechargeList extends Component {
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
            start_date: new Date(),
            end_date: new Date(),
            minDate: null,
            maxDate: new Date()
        };
        this.configFilter = [
           
        ];

        this._handleFilterDataChange = this._handleFilterDataChange.bind(this);
        this._queryFilter = this._queryFilter.bind(this);
        this._handleSearchValueChange = this._handleSearchValueChange.bind(this);
        this._handleSideToggle = this._handleSideToggle.bind(this);
        this._handleSortOrderChange = this._handleSortOrderChange.bind(this);
        this._handleRowSize = this._handleRowSize.bind(this);
        this._handlePageChange = this._handlePageChange.bind(this);
        this._handleEdit = this._handleEdit.bind(this);
        this._handleStatusChange = this._handleStatusChange.bind(this);
        this._handleBatchChange = this._handleBatchChange.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
    }

    componentDidMount() {
        const date = new Date();
        date.setDate(date.getDate() + 1);
        const maxDate = new Date();
        maxDate.setMonth(maxDate.getMonth() + 1);
        this.setState({
            selectedDate: date,
            minDate: date,
            maxDate: maxDate
        });
        // if (this.props.total_count <= 0) {
        // this.props.actionFetchData();
        // }
    }


    handleCellClick(rowIndex, columnIndex, row, column) {
        console.log(`handleCellClick rowIndex: ${rowIndex} columnIndex: ${columnIndex}`);
    }

    _handlePageChange(type) {
        console.log('_handlePageChange', type);
        this.props.actionSetPage(type);
    }


    _handleStatusChange(data, type) {
        // this.props.actionChangeStatus({id: data, type: type});
        // if (type == 'CREATE') {
        //     this.props.actionCreate(data)
        // } else {
        //     this.props.actionUpdate(data)
        // }
        this.setState({
            side_panel: !this.state.side_panel,
            edit_data: null,
        });
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



    _handleDateChange(type, date) {
        this.setState({
            [type]: date,
        }, () => {
            const {start_date, end_date} = this.state;
            if (new Date(start_date).getTime() > new Date(end_date).getTime()) {
                this.setState({
                    end_date: start_date,
                });
            }
        });
        // this.props.actionChangeForecasting({ [type]: DateUtils.changeTimeStamp(date, 'YYYY-MM-DD') });
    }

    _handleBatchChange(e) {
        const batchId = e.target.value;
        this.setState({
            batch_id: batchId,
            selected: [],
        });
        const  { selectedDate } = this.state;
        // this.props.actionCleanBatchForecasting();
        // this.props.actionChangeBatchId(batchId);
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
            background: `${status == 'REJECTED' ? 'red' : 'orange'}`,
            padding: '3px 10px',
            borderRadius: '20px',
            textTransform: 'capitalize'
        }}>{(status)}</span>);
    }

    renderFirstCell(user) {
        // const tempEmailRender = user.email ? (<span style={{textTransform: 'lowercase'}}>{(user.email)}</span>) : null;
        return (
            <div className={'userDetailLeague'} title={user.otp}>
                <div className={classNames('userDetailLeagueText', 'openSans')}>
                    <span><strong>{`${user.name}`}</strong></span> <br/>
                    {/*{tempEmailRender}*/}
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
            CreateProvider = require('./Recharge.view').default;
        }
        if (this.state.side_panel) {
            return (<CreateProvider changeStatus={this._handleStatusChange} data={this.state.edit_data}></CreateProvider>);
        } return null;
    }

    _renderUserInfo (data) {
        return (
            <div className={classNames('userDetailLeagueText', 'openSans')}>
                    <span><strong>
                        {data.name}
                        </strong></span> <br/>
                {data.representative_name}
                {/*{tempEmailRender}*/}
            </div>
        )
    }
    render() {
        const { maxDate } = this.state;
        const tableStructure = [
            {
                key: 'createdAt',
                label: 'Date',
                sortable: true,
                render: (temp, all) => <div>{'asdsad'}</div>,
            },
            {
                key: 'name',
                label: 'Contact Name',
                sortable: true,
                render: (temp, all) => <div></div>,
            },

            {
                key: 'number',
                label: 'Number',
                sortable: true,
                render: (temp, all) => <div></div>,
            },
            {
                key: 'payment_mode',
                label: 'Mode',
                sortable: true,
                render: (temp, all) => <div></div>,
            },
            {
                key: 'total_amount',
                label: 'Amount',
                sortable: true,
                render: (temp, all) => <div></div>,
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
            data: this.state.data,
            count: this.state.data.length,
            page: 1, // this.props.currentPage,
            rowsPerPage: 10,
            // allRowSelected: (this.state.data.length == this.props.selected.length)
        };
        return (
            <div>
                <PageBox>
                    <div className={styles.headerContainer}>
                        <span className={styles.title}>
                            {/*Recharge List*/}
                        </span>
                        <div className={styles.forecastCont}>
                            <div style={{ marginRight: '10px' }}>
                                <ReduxDatePicker
                                    // minDate={minDate}
                                    maxDate={new Date()}
                                    onChange={this._handleDateChange.bind(this, 'start_date')}
                                    value={this.state.start_date}
                                    label={'Start Date'}
                                />
                            </div>
                            <div style={{ marginRight: '10px' }}>
                                <ReduxDatePicker
                                    // minDate={minDate}
                                    maxDate={new Date()}
                                    onChange={this._handleDateChange.bind(this, 'end_date')}
                                    value={this.state.end_date}
                                    label={'End Date'}
                                />
                            </div>

                        </div>
                    </div>
                    <br/>
                    <LineStat data={PieChartData}></LineStat>

                    <div>
                        <div>
                            <div style={{width: '100%'}}>
                                <DataTables
                                    {...datatable}
                                    {...datatableFunctions}
                                />
                            </div>
                        </div>
                    </div>

                </PageBox>
            </div>
        )
    }
}


export default connect(null, null)(RechargeList);
