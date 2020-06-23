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
import styles from './Vehicle.module.css';
// import DataTables from '../../Datatables/DataTableSrc/DataTables';
import DataTables from '../../Datatables/Datatable.table';
import Constants from '../../config/constants';
import FilterComponent from '../../components/Filter/Filter.component';
import {
    actionFetchVehicles,
    actionChangePageVehicleRequests,
    actionChangeStatusVehicleRequests,
    actionFilterVehicleRequests,
    actionResetFilterVehicleRequests,
    actionSetPageVehicleRequests,
    actionCreateVehicle,
    actionUpdateVehicle
} from '../../actions/VehicleRequest.action';
import {serviceGetListData} from "../../services/index.services";

let CreateProvider = null;

class VehiclesList extends Component {
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
            tour_types: [],
            tour_categories: [],
            is_calling: true,
        };
        this.configFilter = [
            {label: 'Created On', name: 'createdAt', type: 'date'},
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
        this._handleDataSave = this._handleDataSave.bind(this);
    }

    componentDidMount() {
        const request = serviceGetListData();

        request.then((data) => {
            if (!data.error) {
                this.setState({
                    is_calling: false,
                    tour_types: data.data.tour_types,
                    tour_categories: data.data.tour_categories,
                })
            } else {
                this.setState({
                    is_calling: false,
                })
            }
        })
        // if (this.props.total_count <= 0) {
            this.props.actionFetchData();
        // }
    }


    handleCellClick(rowIndex, columnIndex, row, column) {
        console.log(`handleCellClick rowIndex: ${rowIndex} columnIndex: ${columnIndex}`);
    }

    _handlePageChange(type) {
        console.log('_handlePageChange', type);
        this.props.actionSetPage(type);
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

    _queryFilter(key, value) {
        console.log('_queryFilter', key, value);
        this.props.actionSetPage(1);
        this.props.actionFetchData(1, this.props.sorting_data, {
            query: key == 'SEARCH_TEXT' ? value : this.props.query,
            query_data: key == 'FILTER_DATA' ? value : this.props.query_data,
        });
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
        this.props.actionSetPage(1);
        this.props.actionFetchData(1,
            {row, order}, {
            query: this.props.query,
            query_data: this.props.query_data,
        });
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
            CreateProvider = require('./Vehicle.view').default;
        }
        if (this.state.side_panel) {
            const { tour_types, tour_categories } = this.state;
            return (<CreateProvider
                tour_types={tour_types}
                tour_categories={tour_categories}
                handleDataSave={this._handleDataSave}
                data={this.state.edit_data}></CreateProvider>);
        } return null;
    }
    render() {
        const tableStructure = [
            // {
            //     key: 'name',
            //     label: 'Info',
            //     sortable: true,
            //     render: (value, all) => <div>{this.renderFirstCell(all)}</div>,
            // },
            {
                key: 'vehicle_number',
                label: 'Vehicle No',
                sortable: true,
                render: (temp, all) => <div>{all.vehicle_number}</div>,
            },{
                key: 'tour_type',
                label: 'Tour Type',
                sortable: true,
                render: (temp, all) => <div>{all.tour_type_name}</div>,
            },
            {
                key: 'category',
                label: 'Category',
                sortable: true,
                render: (temp, all) => <div>{all.type_category_name}</div>,
            },
            {
                key: 'capacity',
                label: 'Capacity',
                sortable: true,
                render: (temp, all) => <div>{all.capacity}</div>,
            },
            {
                key: 'createdAt',
                label: 'Date',
                sortable: true,
                render: (temp, all) => <div>{all.createdAt}</div>,
            },
            {
                key: 'status',
                label: 'Status',
                sortable: true,
                render: (temp, all) => <div>{this.renderStatus(all.status)}</div>,
            },
            {
                key: 'user_id',
                label: 'Action',
                render: (temp, all) => (<div><Button disabled={this.state.is_calling} onClick={this._handleEdit.bind(this, all)}>Info</Button></div>),
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
                        <span className={styles.title}>Vehicle List</span>
                        <Button disabled={this.state.is_calling}  onClick={this._handleSideToggle} variant={'contained'} color={'primary'}>
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
                    title={'New Vehicle'} open={this.state.side_panel} side={'right'}>
                    {this._renderCreateForm()}
                </SidePanelComponent>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.vehicles.present,
        total_count: state.vehicles.all.length,
        currentPage: state.vehicles.currentPage,
        serverPage: state.vehicles.serverPage,
        sorting_data: state.vehicles.sorting_data,
        is_fetching: state.vehicles.is_fetching,
        query: state.vehicles.query,
        query_data: state.vehicles.query_data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchVehicles,
        actionSetPage: actionSetPageVehicleRequests,
        actionResetFilter: actionResetFilterVehicleRequests,
        actionSetFilter: actionFilterVehicleRequests,
        actionChangeStatus: actionChangeStatusVehicleRequests,
        actionCreate: actionCreateVehicle,
        actionUpdate: actionUpdateVehicle
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(VehiclesList);
