/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, Paper, Checkbox, ButtonBase} from '@material-ui/core';

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
    actionFetchBatchProcessing,
    actionChangePageBatchProcessing,
    actionChangeStatusBatchProcessing,
    actionFilterBatchProcessing,
    actionResetFilterBatchProcessing,
    actionSetPageBatchProcessing,
    actionCreateBatchProcessing,
    actionUpdateBatchProcessing,
    actionAssignDriver,
    actionChangeBatchId,
    actionCleanBatchProcessing
} from '../../actions/BatchProcessing.action';
import DateUtils from '../../libs/DateUtils.lib';
import EventEmitter from "../../libs/Events.utils";
import BottomPanel from '../../components/BottomPanel/BottomPanel.component';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {actionFetchBatch} from "../../actions/Batch.action";
import BottomAction from "./components/BottomActions/BottomAction.component";
import {ProductAggComponent} from "../../components/index.component";
import {serviceGetBatchDriverAssigned, serviceGetBatchProcessingDownload} from "../../services/BatchProcessing.service";


let CreateProvider = null;

class BatchProcessingList extends Component {
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
            {label: 'Country', name: 'country', type: 'text'},
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
        this._handleBatchChange = this._handleBatchChange.bind(this);
        this._handleDriverSelection = this._handleDriverSelection.bind(this);
        this._handleSelectAll = this._handleSelectAll.bind(this);
        this._handleDownload = this._handleDownload.bind(this);
    }

    componentDidMount() {
        this.props.actionFetchBatch();
        this.props.actionCleanBatchProcessing();
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

    async _handleDownload() {
        const { batch_id } = this.state;
        const req = await serviceGetBatchProcessingDownload({ batch_id: batch_id });
        if (!req.error) {
            const data = req.data;
            window.open(
                data, "_blank");
        }
    }

    renderStatus(val) {
        const status = val.status;
        const oStatus = Constants.JOB_STATUS;
        const colors = {
            [oStatus.UNDELIVERED]: '#d50000',
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

    _renderCreateForm() {
        if (CreateProvider == null) {
            // import CreateProvider from './Create.container';
            CreateProvider = require('./OrderDetails.container').default;
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

    _handleBatchChange(e) {
        const batchId = e.target.value;
        this.setState({
            batch_id: batchId,
            selected: [],
        });
        this.props.actionChangeBatchId(batchId);
        serviceGetBatchDriverAssigned({batch_id: batchId}).then((val) => {
            if (!val.error) {
                const t = val.data;
                if (t) {
                    this.setState({
                        driver_name: t
                    });
                } else {
                    this.setState({
                        driver_name: '',
                    });
                }
            } else {
                this.setState({
                    driver_name: '',
                });
            }
        });
    }

    async _handleDataSave(data, type) {

        this.setState({
            is_submit: true
        });
    }

    _handleDriverSelection(data) {
        const {selected} = this.state;
        const formData = {...data, selection: selected};
        this.props.actionAssignDriver(formData);
        this.setState({
            selected: []
        })
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
        const isDisabled = ([Constants.JOB_STATUS.NOT_ASSIGNED]).indexOf(data.status) < 0;
        let isChecked = ([Constants.JOB_STATUS.NOT_ASSIGNED]).indexOf(data.status) < 0;
        if (Constants.JOB_STATUS.NO_CASH == data.status) {
            isChecked = false;
        }
        return (
            <div className={styles.flex}>
                <Checkbox
                    disabled={isDisabled}
                    onChange={this._handleCheckbox.bind(this, data.id)}
                    checked={isChecked || this.state.selected.indexOf(data.id) >= 0}
                    value="secondary"
                    color="primary"
                    inputProps={{'aria-label': 'secondary checkbox'}}
                />
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
                <span
                    className={styles.productQty}> {parseFloat(val.quantity * val.unit_step).toFixed(2)} {val.unit}</span>
            </div>)
        })
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
                render: (temp, all) => <div
                    style={{wordBreak: 'break-word'}}>{this._renderProducts(all.products)}</div>,
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
                key: 'total_amount',
                label: 'Wallet Amount',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak: 'break-word'}}>{this.ccyFormat(all.wallet.amount)}</div>,
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
            showSelection: true,
            allRowSelected: this.state.allSelected
        };
        return (
            <div>
                <PageBox>
                    <div className={styles.headerContainer}>
                        <span
                            className={styles.title}>Today Orders <strong>({DateUtils.changeTimeStamp(new Date, 'DD-MM-YYYY')})</strong></span>
                        <br/>

                        <div style={{width: '300px'}}>
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
                                    value={this.state.batchId}
                                    onChange={this._handleBatchChange}
                                >
                                    {this._renderMenu()}
                                </Select>
                            </FormControl>
                            {this.state.batch_id && (<div style={{ textAlign: 'right' }}>
                            <ButtonBase onClick={this._handleDownload}>Export Data</ButtonBase>
                            </div>)}
                        </div>
                        {/*<Button onClick={this._handleSideToggle} variant={'contained'} color={'primary'} disabled={this.state.listData==null}>*/}
                        {/*<Add></Add> Create*/}
                        {/*</Button>*/}
                    </div>
                    <div>
                    <span>Driver Assigned <strong>{this.state.driver_name}</strong></span>
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
                                <ProductAggComponent data={this.props.data}/>
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
                <BottomPanel open={this.state.selected.length > 0}>
                    {this.state.selected.length > 0 && (<BottomAction
                        selected={this.state.selected.length}
                        handleAssign={this._handleDriverSelection}
                        batch_id={this.state.batch_id}
                    />)}
                </BottomPanel>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.batch_processing.present,
        total_count: state.batch_processing.all.length,
        currentPage: state.batch_processing.currentPage,
        serverPage: state.batch_processing.serverPage,
        sorting_data: state.batch_processing.sorting_data,
        is_fetching: state.batch_processing.is_fetching,
        query: state.batch_processing.query,
        query_data: state.batch_processing.query_data,
        batches: state.batch.present,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchBatchProcessing,
        actionSetPage: actionSetPageBatchProcessing,
        actionResetFilter: actionResetFilterBatchProcessing,
        actionSetFilter: actionFilterBatchProcessing,
        actionChangeStatus: actionChangeStatusBatchProcessing,
        actionCreate: actionCreateBatchProcessing,
        actionUpdate: actionUpdateBatchProcessing,
        actionAssignDriver: actionAssignDriver,
        actionChangeBatchId: actionChangeBatchId,
        actionFetchBatch: actionFetchBatch,
        actionCleanBatchProcessing: actionCleanBatchProcessing
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BatchProcessingList);
