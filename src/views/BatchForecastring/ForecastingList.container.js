/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, Chip} from '@material-ui/core';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import PageBox from '../../components/PageBox/PageBox.component';
import SidePanelComponent from '../../components/SidePanel/SidePanel.component';
// import CreateProvider from './Create.container';
import styles from './styles.module.css';
// import DataTables from '../../Datatables/DataTableSrc/DataTables';
import DataTables from '../../Datatables/Datatable.table';
import Constants from '../../config/constants';
import FilterComponent from '../../components/Filter/Filter.component';
import {
    actionChangeBatchId,
    actionChangeStatusBatchForecasting,
    actionCleanBatchForecasting,
    actionCreateBatchForecasting,
    actionFetchBatchForecasting,
    actionFilterBatchForecasting,
    actionResetFilterBatchForecasting,
    actionSetPageBatchForecasting,
    actionUpdateBatchForecasting,
    actionChangeForecastingDate
} from '../../actions/BatchForecasting.action';
import DateUtils from '../../libs/DateUtils.lib';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {actionFetchBatch} from "../../actions/Batch.action";
import ReduxDatePicker from "../../components/ReduxDatePicker/ReduxDatePicker.component";
import {ProductAggComponent} from "../../components/index.component";
import {serviceGetCustomersDownload} from "../../services/CustomersRequest.service";
import {serviceGetBatchForecastingDownload} from "../../services/BatchForecasting.service";
import {serviceGetCustomList} from "../../services/Common.service";


let CreateProvider = null;

class BatchForecastingList extends Component {
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
            batch_id: [],
            allSelected: false,
            selectedDate: null,
            minDate: null,
            maxDate: null
        };
        this.configFilter = [
            // {label: 'Country', name: 'country', type: 'text'},
            // {label: 'City', name: 'city', type: 'text'},
            // {label: 'Request Date', name: 'createdAt', type: 'date'},
            {label: 'Product', name: 'product_id', type: 'selectObject', custom: { extract: { id: 'id', title: 'name' } } , fields: []},
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
        this._handleBatchChange = this._handleBatchChange.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
        this._handleDownload = this._handleDownload.bind(this);
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
        this.props.actionChangeForecastingDate(DateUtils.changeTimeStamp(date, 'YYYY-MM-DD'));
        this.props.actionFetchData();
        this.props.actionFetchBatch();

        const request = serviceGetCustomList(['PRODUCT']);

        request.then((data) => {
            if (!data.error) {
                this.configFilter[0].fields = data.data.products;
            } else {

            }
        })

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
        const oStatus = Constants.JOB_STATUS;
        const colors = {
            [oStatus.NO_CASH]: '#d50000',
            [oStatus.PENDING]: '#f9a825',
            [oStatus.NOT_ASSIGNED]: '#ff9100',
            [oStatus.ASSIGNED]: '#f44336',
            [oStatus.DELIVERED]: '#1b5e20',
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
            }}>{Constants.JOB_STATUS_TEXT[val.status]}</span>);
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

    _handleDateChange(date) {
        this.setState({
            selectedDate: date,
        });
        this.props.actionChangeForecastingDate(DateUtils.changeTimeStamp(date, 'YYYY-MM-DD'));
        this.props.actionFetchData();
    }

    _renderCreateForm() {
        if (CreateProvider == null) {
            // import CreateProvider from './Create.container';
            CreateProvider = require('./ForecastingDetails.container').default;
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

    _handleBatchChange(e, data) {
        console.log('handleBatchChange', e.target.value)
        const batchId = e.target.value;
        this.setState({
            batch_id: batchId,
            selected: [],
        });
        const  { selectedDate } = this.state;
        this.props.actionCleanBatchForecasting();
        this.props.actionChangeBatchId(batchId);
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


    _renderMenu() {
        const {batches} = this.props;
        const temp =  batches.map((val) => {
            return (<MenuItem value={val.id}>{val.name} - {val.delivery_slot.unformatted}</MenuItem>);
        });
        // temp.unshift(<MenuItem value={''}>NONE</MenuItem>)
        return temp;
    }

    _renderOrderId(data) {
        const isDisabled = ([Constants.JOB_STATUS.NOT_ASSIGNED]).indexOf(data.status) < 0;
        let isChecked = ([Constants.JOB_STATUS.NOT_ASSIGNED]).indexOf(data.status) < 0;
        if (Constants.JOB_STATUS.NO_CASH == data.status) {
            isChecked = false;
        }
        return (
            <div className={styles.flex}>
                <div>
                    {data.user.name}
                    <br/>
                    {data.user.contact}
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
                <span className={styles.productQty}> {parseFloat(val.quantity * val.unit_step).toFixed(2)} {val.unit}</span>
            </div>)
        })
    }

    async _handleDownload() {
        const  { sorting_data, query, query_data, date, batch_id } = this.props;
        const req = await serviceGetBatchForecastingDownload({ date: date, batch_id: batch_id, row: sorting_data.row, order: sorting_data.order, query, query_data });
        if (!req.error) {

            const data = req.data;
            window.open(
                data, "_blank");
        }
    }

    render() {
        const { minDate, maxDate } = this.state;
        const tableStructure = [
            {
                key: 'order_no',
                label: 'Order No',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div>{this._renderOrderId(all)}</div>,
            },
            {
                key: 'address',
                label: 'Address',
                sortable: true,
                style: {width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>{all.address.address} - {all.address.area}
                    <br/>{all.address.landmark}</div>,
            },
            {
                key: 'total_products',
                label: 'Total Products',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>{this._renderProducts(all.products)}</div>,
            },
            {
                key: 'price',
                label: 'Price',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>{this.ccyFormat(all.price)} <br/>
                    {all.payment_mode}
                </div>,
            },
            {
                key: 'price',
                label: 'Wallet',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>{ this.ccyFormat(all.wallet_amount) }
                </div>,
            },

            // {
            //     key: 'status',
            //     label: 'Status',
            //     sortable: false,
            //     // style: { width: '20%'},
            //     render: (temp, all) => <div>{this.renderStatus(all)}</div>,
            // },
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

        };
        const datatable = {
            ...Constants.DATATABLE_PROPERTIES,
            columns: tableStructure,
            data: this.props.data,
            count: this.props.total_count,
            page: this.props.currentPage
        };
        return (
            <div>
                <PageBox>
                    <div className={styles.headerContainer}>
                        <span className={styles.title}>Orders Forecasting</span>
                        <div style={{width: '80%', display: 'flex', }}>
                            <div style={{ marginRight: '10px' }}>
                            <ReduxDatePicker
                                // minDate={minDate}
                                maxDate={maxDate}
                                onChange={this._handleDateChange}
                                value={this.state.selectedDate}
                                label={'Date'}
                            />
                            </div>
                            <FormControl fullWidth variant="outlined" margin={'dense'}>
                                <InputLabel
                                    htmlFor={'selectBatchLabel'}
                                >
                                    Select Batch
                                </InputLabel>
                                <Select
                                    label={'Select Batch'}
                                    fullWidth={true}
                                    labelId="selectBatchLabel"
                                    id="selectBatch"
                                    value={this.state.batch_id}
                                    multiple={true}
                                    onChange={this._handleBatchChange}

                                >
                                    {this._renderMenu()}
                                </Select>
                            </FormControl>
                        </div>
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
                            <div>
                                <ProductAggComponent data={this.props.all} />
                            </div>
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
        data: state.batch_forecasting.present,
        all: state.batch_forecasting.all,
        total_count: state.batch_forecasting.all.length,
        currentPage: state.batch_forecasting.currentPage,
        serverPage: state.batch_forecasting.serverPage,
        sorting_data: state.batch_forecasting.sorting_data,
        is_fetching: state.batch_forecasting.is_fetching,
        query: state.batch_forecasting.query,
        query_data: state.batch_forecasting.query_data,
        batch_id: state.batch_forecasting.batch_id,
        date: state.batch_forecasting.date,
        batches: state.batch.present,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchBatchForecasting,
        actionSetPage: actionSetPageBatchForecasting,
        actionResetFilter: actionResetFilterBatchForecasting,
        actionSetFilter: actionFilterBatchForecasting,
        actionChangeStatus: actionChangeStatusBatchForecasting,
        actionCreate: actionCreateBatchForecasting,
        actionUpdate: actionUpdateBatchForecasting,
        actionChangeBatchId: actionChangeBatchId,
        actionFetchBatch: actionFetchBatch,
        actionCleanBatchForecasting: actionCleanBatchForecasting,
        actionChangeForecastingDate: actionChangeForecastingDate
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchForecastingList);
