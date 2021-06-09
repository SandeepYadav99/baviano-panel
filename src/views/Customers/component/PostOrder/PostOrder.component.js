/**
 * Created by charnjeetelectrovese@gmail.com on 6/26/2020.
 */
import React, {Component} from 'react';
import {Button, Dialog, Slide, withStyles} from "@material-ui/core";
import styles from './Style.module.css';
import FilterComponent from '../../../../components/Filter/SelectionFilter.component';
import DataTables from '../../../../Datatables/SelectionTable';
import {connect} from "react-redux";
import moment from "moment";
import {bindActionCreators} from "redux";
import {serviceGetGiftProducts, serviceGetProduct} from "../../../../services/Product.service";
import Constants from '../../../../config/constants';
import AddToCartBtnComponent from "./AddToCartBtn.component";
import ReduxDatePicker from "../../../../components/ReduxDatePicker/ReduxDatePicker.component";

function Transition(props) {
    return <Slide direction="up" {...props} />;
}


class PostOrder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCalling: true,
            data: [],
            currentPage: 1,
            currentData: [],
            totalShow: 10,
            cart: {},
            selectedDate: new Date()
        };
        this._handleSubmit = this._handleSubmit.bind(this);
        this._initializeData = this._initializeData.bind(this);
        this._handleFilterDataChange = this._handleFilterDataChange.bind(this);
        this._queryFilter = this._queryFilter.bind(this);
        this._handleSearchValueChange = this._handleSearchValueChange.bind(this);
        this._handleSortOrderChange = this._handleSortOrderChange.bind(this);
        this._handleRowSize = this._handleRowSize.bind(this);
        this._handlePageChange = this._handlePageChange.bind(this);
        this._processData = this._processData.bind(this);
        this._handleChangeQuantity = this._handleChangeQuantity.bind(this);
        this._handleDateChange = this._handleDateChange.bind(this);
    }

    _initializeData() {
        this.setState({
            isCalling: true,
        });
        const req = serviceGetProduct({index: 1});
        req.then((res) => {
            if (!res.error) {
                this.setState({
                    data: res.data,
                }, () => {
                    this._processData()
                });
            }
            this.setState({
                isCalling: false,
            });
        })
    }

    componentDidMount() {
        this._initializeData();
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.open != this.props.open) {
            this.setState({
                cart: {},
                selectedDate: new Date()
            })
        }
    }

    _processData() {
        const {data, currentData, currentPage, totalShow} = this.state;
        const from = (((currentPage) * totalShow) - totalShow);
        let to = (((currentPage) * totalShow));
        // all.filter((val, index) => {
        //     if (index >= (((currentPage) * totalShow) - totalShow) && index < (((currentPage) * totalShow))) {
        //         return val;
        //     }
        // });
        if (from <= data.length) {
            to = to <= data.length ? to : data.length;
            this.setState({
                currentData: data.slice(from, to),
            });
        }
    }


    handleCellClick(rowIndex, columnIndex, row, column) {
        console.log(`handleCellClick rowIndex: ${rowIndex} columnIndex: ${columnIndex}`);
    }

    _handlePageChange(type) {
        console.log('_handlePageChange', type);
        const {data, totalShow} = this.state;
        if (Math.ceil(data.length / totalShow) >= (type + 1)) {
            this.setState({
                currentPage: type + 1
            }, () => {
                this._processData();
            });

        }
    }


    _queryFilter(key, value) {
        console.log('_queryFilter', key, value);
        // query: key == 'SEARCH_TEXT' ? value : this.props.query,
        // query_data: key == 'FILTER_DATA' ? value : this.props.query_data,
    }

    _handleFilterDataChange(value) {
        console.log('_handleFilterDataChange', value);
        this._queryFilter('FILTER_DATA', value);
    }

    _handleSearchValueChange(value) {
        console.log('_handleSearchValueChange', value);
        this._queryFilter('SEARCH_TEXT', value);
        if (value) {
            const {data} = this.state;
            const tempData = data.filter((val) => {
                if (val.name.match(new RegExp(value, 'ig')) ) {
                    return val;
                }
            });
            this.setState({
                currentData: tempData,
            });
        } else {
            this._processData();
        }

    }

    handlePreviousPageClick() {
        console.log('handlePreviousPageClick', 'PREV');
    }

    handleNextPageClick() {
        console.log('handleNextPageClick', 'NEXT');
    }

    _handleSortOrderChange(row, order) {
        console.log(`handleSortOrderChange key:${row} order: ${order}`);
    }

    _handleRowSize(page) {
        console.log(page);
    }
    _handleDateChange(date) {
        this.setState({
            selectedDate: date
        });
    }

    _handleSubmit() {
        const { cart, data, selectedDate } = this.state;
        const tempCart = [];
        const keys = Object.keys(cart);
        if (keys.length > 0) {
            Object.keys(cart).forEach((key) => {
                const qty = cart[key];
                let dataIndex = null;
                data.forEach((product, index) => {
                    if (product.id == key) {
                        dataIndex = index;
                    }
                });
                if (dataIndex != null) {
                    const tempProduct = data[dataIndex];
                    tempCart.push({
                        product_id: tempProduct.id,
                        name: tempProduct.name,
                        price: tempProduct.price,
                        qty: qty,
                        unit: tempProduct.unit_name,
                        unit_step: tempProduct.unit_step,
                    });
                }
            });
            this.props.handleSubmit(tempCart, moment(new Date(selectedDate)).format('YYYY-MM-DD'));
        } else {
            this.props.handleSubmit([]);
        }
    }

    _handleChangeQuantity(productId, qty) {
        const {cart} = this.state;
        const tempCart = JSON.parse(JSON.stringify(cart));
        if (qty > 0) {
            let oldQty = 0;
            if (productId in tempCart) {
                oldQty = tempCart[productId];
            }
            oldQty++;
            tempCart[productId] = oldQty;
        } else {
            let oldQty = 0;
            if (productId in tempCart) {
                oldQty = tempCart[productId];
            }
            oldQty--;
            if (oldQty <= 0) {
                delete tempCart[productId];
            } else {
                tempCart[productId] = oldQty;
            }
        }
        this.setState({
            cart: tempCart,
        });

    }

    render() {
        const {handleSubmit, classes} = this.props;
        const {data, cart, selectedDate} = this.state;
        const tableStructure = [
            {
                key: 'title',
                label: 'Title',
                sortable: true,
                render: (value, all) => <div>{all.name}</div>,
            },
            {
                key: 'price',
                label: 'Price',
                sortable: true,
                render: (value, all) => <div>Rs. {all.list_price}</div>,
            },
            {
                key: 'action',
                label: 'Add',
                sortable: true,
                render: (temp, all) => <div>
                    <AddToCartBtnComponent
                        productId={all.id}
                        quantity={(all.id) in cart ? cart[all.id] : 0}
                        changeQuantity={this._handleChangeQuantity}/>
                </div>,
            },

        ];
        const datatableFunctions = {
            onCellClick: this.handleCellClick,
            // onCellDoubleClick: this.handleCellDoubleClick,
            // onFilterValueChange: this._handleSearchValueChange.bind(this),
            onSortOrderChange: this._handleSortOrderChange,
            onPageChange: this._handlePageChange,
            // onRowSelection: this.handleRowSelection,
            onRowSizeChange: this._handleRowSize,
            handleSelectAllClick: this._handleSelectAllClick

        };
        const datatable = {
            ...Constants.DATATABLE_PROPERTIES,
            columns: tableStructure,
            data: this.state.currentData,
            count: this.state.data.length,
            page: this.state.currentPage - 1,
            rowsPerPage: 10,
            allRowSelected: false,
            showSelection: false
        };
        return (
            <Dialog
                open={this.props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
                maxWidth={'md'}
            >
                <div className={styles.dialogCont}>
                    <div className={styles.mainContainer}>
                        <div className={styles.headingTuxi}>
                            <div className={styles.loginHeading}>Add Order</div>
                            <ReduxDatePicker
                                value={selectedDate}
                                onChange={this._handleDateChange}
                            />
                            <FilterComponent
                                is_progress={this.state.isCalling}
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
                            <div style={{float: 'right'}}>
                                <Button variant={'contained'} className={this.props.classes.btnSuccess}
                                        onClick={this._handleSubmit}
                                        type="button">
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>

                </div>
            </Dialog>
        )
    }
}

const useStyle = theme => ({
    btnSuccess: {
        backgroundColor: theme.palette.success.dark,
        color: 'white',
        marginRight: 5,
        marginLeft: 5,
        '&:hover': {
            backgroundColor: theme.palette.success.main,
        }
    },
});

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

function mapStateToProps(state) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyle, {withTheme: true})(PostOrder));
