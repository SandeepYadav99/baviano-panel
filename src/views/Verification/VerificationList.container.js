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
    actionFetchVerification,
    actionChangePageVerification,
    actionChangeStatusVerification,
    actionFilterVerification,
    actionResetFilterVerification,
    actionSetPageVerification,
    actionCreateVerification,
    actionUpdateVerification,
    actionAssignDriver,
    actionCleanVerification
} from '../../actions/Verification.action';
import DateUtils from '../../libs/DateUtils.lib';
import EventEmitter from "../../libs/Events.utils";
import BottomPanel from '../../components/BottomPanel/BottomPanel.component';
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import {actionFetchBatch} from "../../actions/Batch.action";
import BottomAction from "./components/BottomActions/BottomAction.component";
import {serviceGetBatchDriverAssigned} from "../../services/Verification.service";


let CreateProvider = null;

class VerificationList extends Component {
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
        this._handleDriverSelection = this._handleDriverSelection.bind(this);
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
        const status = val.is_verifying ? 'Verifying' : 'Pending';
        // const colors = {
        //     [oStatus.UNDELIVERED]: '#d50000',
        //     [oStatus.NO_CASH]: '#d50000',
        //     [oStatus.PENDING]: '#f9a825',
        //     [oStatus.NOT_ASSIGNED]: '#ff9100',
        //     [oStatus.ASSIGNED]: '#f44336',
        //     [oStatus.DELIVERED]: '#1b5e20',
        // }
        const color = val.is_verifying ? '#f9a825' : '#d50000';
        return (<span
            style={{
                ...styles.spanFont,
                fontSize: '12px',
                color: 'white',
                background: `${color}`,
                padding: '3px 10px',
                borderRadius: '20px',
                textTransform: 'capitalize'
            }}>{status}</span>);
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
            CreateProvider = require('./Verification.container').default;
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

    _renderUserInfo(data) {
        const isDisabled = ([Constants.JOB_STATUS.NOT_ASSIGNED]).indexOf(data.status) < 0;
        // let isChecked = ([Constants.JOB_STATUS.NOT_ASSIGNED]).indexOf(data.status) < 0;
        // if (Constants.JOB_STATUS.NO_CASH == data.status) {
        //     isChecked = false;
        // }
        return (
            <div className={styles.flex}>
                <Checkbox
                    disabled={data.is_verifying}
                    onChange={this._handleCheckbox.bind(this, data.id)}
                    checked={this.state.selected.indexOf(data.id) >= 0}
                    value="secondary"
                    color="primary"
                    inputProps={{'aria-label': 'secondary checkbox'}}
                />
                <div>
                    {data.name}
                    <br/>
                    {data.contact}
                </div>
            </div>
        )
    }

    ccyFormat(num) {
        return `${Constants.CURRENCY} ${num.toFixed(2)}`;
    }


    render() {
        const tableStructure = [
            {
                key: 'name',
                label: 'User Info',
                sortable: true,
                // style: { width: '20%'},
                render: (temp, all) => <div>{this._renderUserInfo(all)}</div>,
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
                key: 'distance',
                label: 'Distance',
                sortable: true,
                render: (temp, all) => <div>{all.distance} Km</div>,
            },
            {
                key: 'driver_info',
                label: 'Driver Info',
                sortable: false,
                render: (temp, all) => <div>{all.driver_name} <br/> {all.driver_contact}</div>,
            },

            {
                key: 'geo_tag',
                label: 'Geo Tag',
                sortable: false,
                render: (temp, all) => <div>{all.geotag_name}</div>,
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
            // {
            //     key: 'user_id',
            //     label: 'Action',
            //     render: (temp, all) => (<div><Button onClick={this._handleEdit.bind(this, all)}>Info</Button></div>),
            // },


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
                    {this.state.selected.length > 0 && (<BottomAction
                        selected={this.state.selected.length}
                        handleAssign={this._handleDriverSelection}
                    />)}
                </BottomPanel>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.verification.present,
        total_count: state.verification.all.length,
        currentPage: state.verification.currentPage,
        serverPage: state.verification.serverPage,
        sorting_data: state.verification.sorting_data,
        is_fetching: state.verification.is_fetching,
        query: state.verification.query,
        query_data: state.verification.query_data,
        batches: state.batch.present,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchVerification,
        actionSetPage: actionSetPageVerification,
        actionResetFilter: actionResetFilterVerification,
        actionSetFilter: actionFilterVerification,
        actionChangeStatus: actionChangeStatusVerification,
        actionCreate: actionCreateVerification,
        actionUpdate: actionUpdateVerification,
        actionAssignDriver: actionAssignDriver,
        actionCleanVerification: actionCleanVerification
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VerificationList);
