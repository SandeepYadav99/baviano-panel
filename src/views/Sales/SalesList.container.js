/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';

import classNames from 'classnames';
import {connect} from 'react-redux';
import PageBox from '../../components/PageBox/PageBox.component';
// import CreateProvider from './Create.container';
import styles from './Style.module.css';
import DataTables from '../../Datatables/Datatable.table';
import Constants from '../../config/constants';
import ReduxDatePicker from "../../components/ReduxDatePicker/ReduxDatePicker.component";
import {
    serviceGetNewCustomers,
    serviceGetProductSalesReport,
    serviceGetRechargeTransaction
} from "../../services/Analytics.service";


const TOTAL_SHOW = 50;

class SalesList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dialogState: false,
            point_selected: null,
            data: [],
            all_data: [],
            graph_data: {},
            total_count: 0,
            total_value: 0,
            currentPage: 1,
            total: Constants.DEFAULT_PAGE_VALUE + 1,
            side_panel: false,
            edit_data: null,
            start_date: new Date(),
            end_date: new Date(),
            minDate: null,
            maxDate: new Date()
        };
        this.configFilter = [];

        this._handleFilterDataChange = this._handleFilterDataChange.bind(this);
        this._queryFilter = this._queryFilter.bind(this);
        this._handleSearchValueChange = this._handleSearchValueChange.bind(this);
        this._handleSortOrderChange = this._handleSortOrderChange.bind(this);
        this._handleRowSize = this._handleRowSize.bind(this);
        this._handlePageChange = this._handlePageChange.bind(this);
        this._handleStatusChange = this._handleStatusChange.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._initializeData = this._initializeData.bind(this);
        this._changePageData = this._changePageData.bind(this);
        this._processData = this._processData.bind(this);
    }

    _initializeData() {
        const {start_date, end_date} = this.state;
        const req = serviceGetProductSalesReport(start_date, end_date);
        req.then((res) => {
            if (!res.error) {
                const resData = res.data;
                this.setState({
                    all_data: resData.data,
                    total_value: resData.totalValue,
                    total_count: resData.totalCount,
                    graph_data: resData.graphData,
                    currentPage: 1,
                }, () => {
                    this._processData()
                })
            }
        })
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
        this._initializeData();
        // if (this.props.total_count <= 0) {
        // this.props.actionFetchData();
        // }
    }


    handleCellClick(rowIndex, columnIndex, row, column) {
        console.log(`handleCellClick rowIndex: ${rowIndex} columnIndex: ${columnIndex}`);
    }

    _handlePageChange(type) {
        const {all_data} = this.state;
        if (Math.ceil(all_data.length / TOTAL_SHOW) >= (type + 1)) {
            this.setState({
                currentPage: type + 1
            }, () => {
                this._processData();
            });

        }
    }

    _processData() {
        const {all_data, currentPage} = this.state;
        const from = (((currentPage) * TOTAL_SHOW) - TOTAL_SHOW);
        let to = (((currentPage) * TOTAL_SHOW));
        // all.filter((val, index) => {
        //     if (index >= (((currentPage) * totalShow) - totalShow) && index < (((currentPage) * totalShow))) {
        //         return val;
        //     }
        // });
        if (from <= all_data.length) {
            to = to <= all_data.length ? to : all_data.length;
            this.setState({
                data: all_data.slice(from, to),
            });
        }
    }
    _changePageData(type) {


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
            const prop = this;
            if (new Date(start_date).getTime() > new Date(end_date).getTime()) {
                this.setState({
                    end_date: start_date,
                }, () => {
                    prop._initializeData();
                });
            } else {
                prop._initializeData();
            }
        });
        // this.props.actionChangeForecasting({ [type]: DateUtils.changeTimeStamp(date, 'YYYY-MM-DD') });
    }


    render() {
        const {graph_data} = this.state;
        const tableStructure = [
            {
                key: 'product_name',
                label: 'Product Name',
                sortable: true,
                render: (temp, all) => <div>{all.name}</div>,
            },
            {
                key: 'qty',
                label: 'Total Qty',
                sortable: true,
                render: (temp, all) => <div>{all.total_qty}</div>,
            },

            {
                key: 'price',
                label: 'Price Per Unit',
                sortable: true,
                render: (temp, all) => <div>Rs. {all.price}</div>,
            },
            {
                key: 'type',
                label: 'Product type (Regular/OT)',
                sortable: true,
                render: (temp, all) => <div>{all.type}</div>,
            },
            {
                key: 'total_price',
                label: 'Total Price',
                sortable: true,
                render: (temp, all) => <div>Rs. {all.total_sum}</div>,
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
            count: this.state.all_data.length,
            page: this.state.currentPage - 1,
            rowsPerPage: 50,
            // allRowSelected: (this.state.data.length == this.props.selected.length)
        };
        return (
            <div>
                <PageBox>
                    <div className={styles.headerContainer}>
                        <span className={styles.title}>
                            {/*OrderReport List*/}
                        </span>
                        <div className={styles.forecastCont}>
                            <div style={{marginRight: '10px'}}>
                                <ReduxDatePicker
                                    // minDate={minDate}
                                    maxDate={new Date()}
                                    onChange={this._handleDateChange.bind(this, 'start_date')}
                                    value={this.state.start_date}
                                    label={'Start Date'}
                                />
                            </div>
                            <div style={{marginRight: '10px'}}>
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

                    <div style={{textAlign: 'center'}}>
                        <div>Grand Total: Rs. {this.state.total_value}</div>
                    </div>

                </PageBox>
            </div>
        )
    }
}


export default connect(null, null)(SalesList);
