/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import {Button, Paper} from '@material-ui/core';

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
import {
    actionFetchCoupons,
    actionChangePageCoupons,
    actionChangeStatusCoupons,
    actionFilterCoupons,
    actionResetFilterCoupons,
    actionSetPageCoupons,
    actionCreateCoupons,
    actionUpdateCoupons,
    actionDeleteCoupons
} from '../../actions/Coupon.action';
import {serviceGetCustomList} from "../../services/Common.service";
import DateUtils from "../../libs/DateUtils.lib";

let CreateProvider = null;
class TourTypeList extends Component {
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
            is_calling: true,
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
        this._handleDelete = this._handleDelete.bind(this);
    }

    componentDidMount() {
        // if (this.props.total_count <= 0) {
        this.props.actionFetchData();
        const request = serviceGetCustomList(['CATEGORY', 'PRODUCT', 'USER']);
        request.then((data)=> {
            if(!data.error){
                this.setState({
                    listData: data.data,
                    is_calling: false
                })
            }
        });
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
        const status = val.replace('_', ' ');
        let color = 'green';
        if (status == 'REJECTED') {
            color = 'red';
        } else if (status == 'SUSPENDED' || status == 'DELETED') {
            color = '#ff4610';
        } else if (status == 'PENDING' || val == 'INACTIVE') {
            color = 'orange'
        }
        return (<span style={{
            ...styles.spanFont,
            fontSize: '12px',
            color: 'white',
            background: `${color}`,
            padding: '3px 10px',
            borderRadius: '20px',
            textTransform: 'capitalize'
        }}>{(status)}</span>);
    }

    renderFirstCell(user) {
        const tempEmailRender = (<span style={{textTransform: 'lowercase'}}>{(user.count)}</span>);
        return (
            <div className={styles.firstCellFlex}>
                {/*<div>*/}
                {/*    <img src={user.image} alt=""/>*/}
                {/*</div>*/}
                <div className={classNames(styles.firstCellInfo, 'openSans')}>
                    <span><strong>{user.coupon}</strong></span> <br/>
                    Use Counts: {tempEmailRender}
                </div>
            </div>
        );
    }

    _handleDelete(id) {
        this.props.actionDeleteCoupons(id);
        this.setState({
            side_panel: !this.state.side_panel,
            edit_data: null,
        });
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
            CreateProvider = require('./Coupon.container').default;
        }
        if (this.state.side_panel) {
            const { id } = this.props.match.params;
            return (<CreateProvider data={this.state.edit_data}
                                    listData={this.state.listData}
                                    handleDataSave={this._handleDataSave}
                                    handleDelete={this._handleDelete}></CreateProvider>);
        } return null;
    }
    _handleChangeStatus(data, type) {
        this.props.actionChangeStatus({...data, type: type});
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

    render() {
        const tableStructure = [
            {
                key: 'name',
                label: 'Name',
                sortable: true,
                render: (value, all) => <div>{this.renderFirstCell(all)}</div>,
            },
            {
                key: 'discount',
                label: 'Discount',
                sortable: true,
                render: (temp, all) => <div >{all.discount} - {all.discount_type}</div>,
            },
            {
                key: 'type',
                label: 'Type',
                sortable: true,
                render: (temp, all) => <div >{all.type}</div>,
            },
            {
                key: 'valid_till',
                label: 'Valid Till',
                sortable: false,
                render: (temp, all) => <div>{DateUtils.changeTimeStamp(all.valid_till,'DD-MM-YYYY')}</div>,
            },
            // {
            //     key: 'representative_name',
            //     label: 'Representative',
            //     sortable: true,
            //     render: (temp, all) => <div title={all.otp}>{all.representative_name}</div>,
            // },
            // {
            //     key: 'city',
            //     label: 'Address',
            //     sortable: true,
            //     render: (temp, all) => <div>{all.city}, {all.country}</div>,
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
                key: 'user_id',
                label: 'Action',
                render: (temp, all) => (<div><Button disabled={this.state.listData==null} onClick={this._handleEdit.bind(this, all)}>Info</Button></div>),
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
                        <span className={styles.title}>Coupons List</span>
                        <Button onClick={this._handleSideToggle} variant={'contained'} color={'primary'} disabled={this.state.is_calling}>
                            <Add></Add> Create
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
                    title={'Coupons '} open={this.state.side_panel} side={'right'}>
                    {this._renderCreateForm()}
                </SidePanelComponent>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.coupons.present,
        total_count: state.coupons.all.length,
        currentPage: state.coupons.currentPage,
        serverPage: state.coupons.serverPage,
        sorting_data: state.coupons.sorting_data,
        is_fetching: state.coupons.is_fetching,
        query: state.coupons.query,
        query_data: state.coupons.query_data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchCoupons,
        actionSetPage: actionSetPageCoupons,
        actionResetFilter: actionResetFilterCoupons,
        actionSetFilter: actionFilterCoupons,
        actionChangeStatus: actionChangeStatusCoupons,
        actionCreate: actionCreateCoupons,
        actionUpdate: actionUpdateCoupons,
        actionDeleteCoupons: actionDeleteCoupons
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TourTypeList);
