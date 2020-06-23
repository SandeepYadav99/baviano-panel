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
import styles from './Tour.module.css';
// import DataTables from '../../Datatables/DataTableSrc/DataTables';
import DataTables from '../../Datatables/Datatable.table';
import Constants from '../../config/constants';
import FilterComponent from '../../components/Filter/Filter.component';
import {
    actionFetchTours,
    actionChangePageTourRequests,
    actionChangeStatusTourRequests,
    actionFilterTourRequests,
    actionResetFilterTourRequests,
    actionSetPageTourRequests,
    actionCreateTour,
    actionUpdateTour, actionDeleteTourImage
} from '../../actions/Tour.action';
import {serviceGetVehiclesList} from "../../services/Vehicle.service";
import {serviceGetDriversList} from "../../services/Category.service";
import {serviceGetListData} from "../../services/index.services";

let CreateProvider = null;
class TourList extends Component {
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
            vehicles: [],
            drivers: [],
            tour_types: [],
            tour_categories: [],
            is_calling: true,
            categories: [],
            service_areas: [],
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
        this._handleImageDelete = this._handleImageDelete.bind(this);
    }

    componentDidMount() {
        const request = serviceGetListData();

        request.then((data) => {
            if (!data.error) {
                this.setState({
                    is_calling: false,
                    vehicles: data.data.vehicles,
                    drivers: data.data.drivers,
                    tour_types: data.data.tour_types,
                    tour_categories: data.data.tour_categories,
                    categories: data.data.categories,
                    service_areas: data.data.service_areas
                })
            } else {
                this.setState({
                    is_calling: false,
                })
            }
        })
        if (this.props.total_count <= 0) {
            this.props.actionFetchData();
        }
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
            this.props.actionCreateTour(data)
        } else {
            this.props.actionUpdateTour(data)
        }
        this.setState({
            side_panel: !this.state.side_panel,
            edit_data: null,
        });
    }

    _handleImageDelete(id, index) {
        this.props.actionDeleteImage(id, index);
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
        const tempEmailRender = user.tour_type_name ? (<span style={{textTransform: 'lowercase'}}>{(user.tour_type_name)} - {user.category_name}</span>) : null;
        return (
            <div className={'userDetailLeague'} title={user.otp}>
                <div className={classNames('userDetailLeagueText', 'openSans')}>
                    <span><strong>{`${user.name}`}</strong></span> <br/>
                    {tempEmailRender}
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
        if (this.state.side_panel && CreateProvider == null) {
            // import CreateProvider from './Create.container';
            CreateProvider = require('./Tour.view').default;
        }
        if (CreateProvider) {
            if (this.state.side_panel) {
            return (<CreateProvider
                tour_types={this.state.tour_types}
                tour_categories={this.state.tour_categories}
                vehicles={this.state.vehicles}
                drivers={this.state.drivers}
                categories={this.state.categories}
                service_areas={this.state.service_areas}
                handleDataSave={this._handleDataSave}
                handleImageDelete={this._handleImageDelete}
                data={this.state.edit_data}></CreateProvider>);
            } return null;
        } else {
            return  null;
        }
    }

    render() {
        const tableStructure = [
            {
                key: 'name',
                label: 'Info',
                sortable: true,
                style: { width: '20%'},
                render: (value, all) => <div style={{wordBreak:'break-word'}} >{this.renderFirstCell(all)}</div>,
            }, {
                key: 'overview',
                label: 'Overview',
                sortable: true,
                style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}} >{all.overview}</div>,
            },{
                key: 'description',
                label: 'Description',
                sortable: true,
                style: { width: '20%'},
                render: (temp, all) => <div style={{wordBreak:'break-word'}}  >{all.description}</div>,
            },
            {
                key: 'start_loc',
                label: 'Start - End Location',
                sortable: false,
                render: (temp, all) => (<div>
                    <div>{all.start_loc.name}</div>
                    <div>{all.end_loc.name}</div>
                </div>)
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
                render: (temp, all) => (<div><Button disabled={this.state.is_calling}  onClick={this._handleEdit.bind(this, all)}>Info</Button></div>),
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
                        <span className={styles.title}>Tour List</span>
                        <Button disabled={this.state.is_calling} onClick={this._handleSideToggle} variant={'contained'} color={'primary'}>
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
                    title={'New Tour'} open={this.state.side_panel} side={'right'}>
                    {this._renderCreateForm()}
                </SidePanelComponent>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        data: state.tours.present,
        total_count: state.tours.all.length,
        currentPage: state.tours.currentPage,
        serverPage: state.tours.serverPage,
        sorting_data: state.tours.sorting_data,
        is_fetching: state.tours.is_fetching,
        query: state.tours.query,
        query_data: state.tours.query_data,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionFetchData: actionFetchTours,
        actionSetPage: actionSetPageTourRequests,
        actionResetFilter: actionResetFilterTourRequests,
        actionSetFilter: actionFilterTourRequests,
        actionChangeStatus: actionChangeStatusTourRequests,
        actionCreateTour: actionCreateTour,
        actionUpdateTour: actionUpdateTour,
        actionDeleteImage: actionDeleteTourImage
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TourList);
