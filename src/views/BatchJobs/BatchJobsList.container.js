/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, Paper, Checkbox} from '@material-ui/core';

import classNames from 'classnames';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {
    red as redColor,
} from '@material-ui/core/colors';
import {Add} from '@material-ui/icons';
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
    actionFetchBatchJob,
    actionChangePageBatchJob,
    actionChangeStatusBatchJob,
    actionFilterBatchJob,
    actionResetFilterBatchJob,
    actionSetPageBatchJob,
    actionCreateBatchJob,
    actionUpdateBatchJob,
    actionCleanBatchJob
} from '../../actions/BatchJob.action';
import DateUtils from '../../libs/DateUtils.lib';
import EventEmitter from "../../libs/Events.utils";
import BottomPanel from '../../components/BottomPanel/BottomPanel.component';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";


let CreateProvider = null;

class BatchJobList extends Component {
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
            batch_id: null,
            allSelected: false,
            driver_name: '',
        };
        this.configFilter = [
            // {label: 'Country', name: 'country', type: 'text'},
            // {label: 'City', name: 'city', type: 'text'},
            {label: 'Request Date', name: 'createdAt', type: 'date'},
            {label: 'Status', name: 'status', type: 'select', fields: ['PENDING', 'COMPLETED', 'REJECTED', 'IN_PROCESS']},
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
        this._handleSelectAll = this._handleSelectAll.bind(this);

    }

    componentDidMount() {
        this.props.actionFetchData();
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
        const oStatus = Constants.DRIVER_JOB_STATUS;
        const colors = {
            [oStatus.REJECTED]: '#d50000',
            [oStatus.PENDING]: '#f9a825',
            [oStatus.IN_PROCESS]: '#ff9100',
            [oStatus.COMPLETED]: '#1b5e20',
        }
        const color = colors[status];
        return (<span
            style={{
                ...styles.spanFont,
                fontSize: '12px',
                color: 'white',
                background: `${color}`,
                padding: '3px 10px',
                borderRadius: '20px',
                textTransform: 'capitalize'
            }}>{Constants.DRIVER_JOB_STATUS[val.status]}</span>);
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

    _renderCreateForm() {
        if (CreateProvider == null) {
            // import CreateProvider from './Create.container';
            CreateProvider = require('./BatchJob.container').default;
        }
        if (this.state.side_panel) {
            const {id} = this.props.match.params;
            return (<CreateProvider data={this.state.edit_data}
                                    listData={this.state.listData}
                                    changeStatus={this._handleDataSave}></CreateProvider>);
        }
        return null;
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
    }

    _renderContact(all) {
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
            allSelected: false,
        });
    }

    _renderMenu() {
        const {batches} = this.props;
        return batches.map((val) => {
            return (<MenuItem value={val.id}>{val.name} - {val.delivery_slot.unformatted}</MenuItem>);
        })
    }

    _handleSelectAll() {
        const {data} = this.props;
        const {allSelected} = this.state;
        if (allSelected) {
            this.setState({
                selected: [],
                allSelected: false
            });
        } else {
            const temp = [];
            data.forEach((val) => {
                if (val.status == Constants.JOB_STATUS.NOT_ASSIGNED) {
                    temp.push(val.id);
                }
            });
            this.setState({
                selected: temp,
                allSelected: true
            });
        }
    }

    _renderOrderId(data) {
        return (
            <div className={styles.flex}>
                <div>
                    {data.batch_name}
                    <br/>
                    {data.unformatted_date}
                </div>
            </div>
        )
    }

    ccyFormat(num) {
        return `${Constants.CURRENCY} ${num.toFixed(2)}`;
    }

    _renderProducts(products) {
        return products.map((val) => {
            return (<div className={styles.productInfo}>
                <span className={styles.productName}>{val.name}</span>
                <span
                    className={styles.productQty}> {parseFloat(val.quantity * val.unit_step).toFixed(2)} {val.unit}</span>
            </div>)
        })
    }

    render() {
        const tableStructure = [
            {
                key: '_id',
                label: 'Batch / Date',
                sortable: true,
                style: { width: '20%'},
                render: (temp, all) => <div>{this._renderOrderId(all)}</div>,
            },
            {
                key: 'driver_name',
                label: 'Driver Info',
                sortable: false,
                style: {width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>
                    {all.driver_name}
                    <br/>
                    {all.driver_contact}
                </div>,
            },
            {
                key: 'total_orders',
                label: 'Total Orders',
                sortable: false,
                // style: { width: '20%'},
                render: (temp, all) => <div
                    style={{wordBreak: 'break-word'}}>{all.orders}</div>,
            },
            {
                key: 'delivery_slot.index',
                label: 'Delivery Slot',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>{all.delivery_slot.unformatted}
                </div>,
            },
            {
                key: 'status',
                label: 'Status',
                sortable: false,
                // style: { width: '20%'},
                render: (temp, all) => <div>{this.renderStatus(all)}</div>,
            },
            // {
            //     key: 'createdAt',
            //     label: 'Date',
            //     sortable: true,
            //     render: (temp, all) => <div>{DateUtils.changeTimezoneFromUtc(all.createdAt)}</div>,
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
            handleSelectAllClick: this._handleSelectAll

        };
        const datatable = {
            ...Constants.DATATABLE_PROPERTIES,
            columns: tableStructure,
            data: this.props.data,
            count: this.props.total_count,
            page: this.props.currentPage,
            showSelection: false,
            allRowSelected: this.state.allSelected
        };
        return (
            <div>
                <PageBox>
                    <div className={styles.headerContainer}>
                        {/*<Button onClick={this._handleSideToggle} variant={'contained'} color={'primary'} disabled={this.state.listData==null}>*/}
                        {/*<Add></Add> Create*/}
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
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.batch_job.present,
        total_count: state.batch_job.all.length,
        currentPage: state.batch_job.currentPage,
        serverPage: state.batch_job.serverPage,
        sorting_data: state.batch_job.sorting_data,
        is_fetching: state.batch_job.is_fetching,
        query: state.batch_job.query,
        query_data: state.batch_job.query_data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchBatchJob,
        actionSetPage: actionSetPageBatchJob,
        actionResetFilter: actionResetFilterBatchJob,
        actionSetFilter: actionFilterBatchJob,
        actionChangeStatus: actionChangeStatusBatchJob,
        actionCreate: actionCreateBatchJob,
        actionUpdate: actionUpdateBatchJob,
        actionCleanBatchJob: actionCleanBatchJob
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchJobList);
