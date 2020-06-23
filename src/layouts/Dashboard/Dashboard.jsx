/* eslint-disable indent,no-mixed-spaces-and-tabs */
import React from 'react';
import PropTypes from 'prop-types';
import {Switch, Route, Redirect} from 'react-router-dom';
import classNames from 'classnames';
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Snackbar, withStyles} from '@material-ui/core';
import {Header, Sidebar} from '../../components/index.component';
import dashboardRoutes from '../../routes/dashboard';
import appStyle from '../../assets/jss/material-dashboard-react/appStyle';
import logo from '../../assets/img/reactlogo.png';
import CustomRouter from '../../libs/CustomRouter.utils';
import DashboardSnackbar from '../../components/Snackbar.component';


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mobileOpen: false,
            drawerOpen: true,
            snackbar: false,
            message: ''
        };
        this._handleHeaderClick = this._handleHeaderClick.bind(this);
        this._switchRoutes = this._switchRoutes.bind(this);
        this._sideBarRoutes = this._sideBarRoutes.bind(this);
        this._handleResize = this._handleResize.bind(this);
    }

    handleDrawerToggle = () => {
        this.setState({mobileOpen: !this.state.mobileOpen});
    };

    getRoute() {
        return this.props.location.pathname !== '/maps';
    }

    componentDidMount() {
        window.addEventListener('resize', this._handleResize)
        // if (navigator.platform.indexOf('Win') > -1) {
        //     // eslint-disable-next-line
        //     // const ps = new PerfectScrollbar(this.refs.mainPanel);
        // }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this._handleResize)
    }

    _handleResize(e) {
        if (window.innerWidth < 767) {
            this.setState({
                drawerOpen: false
            })
        } else {
            this.setState({
                drawerOpen: true
            })
        }
    }

    componentDidUpdate() {
        this.refs.mainPanel.scrollTop = 0;
    }

    _handleHeaderClick() {
        this.setState({drawerOpen: !this.state.drawerOpen});
    }

    _switchRoutes() {
        const tempRoutes = [];
        dashboardRoutes.forEach((prop, key) => {
            if (this.props.user_profile.is_verified || !prop.is_protect) {
                tempRoutes.push(<CustomRouter is_protect={prop.is_protect} private exact path={prop.path}
                                              component={prop.component} desktopComponent={prop.desktopComponent}
                                              key={key}
                                              check={'dsds'}/>);
            }
        })
        return (<Switch>
            {tempRoutes}
        </Switch>)
    };

    _sideBarRoutes() {
        return dashboardRoutes.filter((val, index) => {
            if (this.props.user_profile.is_verified || !val.is_protect) {
                return true;
            }
        })
    }
    render() {
        const {classes, ...rest} = this.props;
        return (
            <div className={classes.wrapper}>
                <Sidebar
                    routes={this._sideBarRoutes()}
                    logoText={this.props.title}
                    logo={logo}
                    handleDrawerToggle={this.handleDrawerToggle}
                    open={this.state.drawerOpen}
                    color="blue"
                    {...rest}
                />
                <div className={classNames(classes.appBar, {
                    [classes.appBarShift]: this.state.drawerOpen,
                })} ref="mainPanel"
                >
                    <Header
                        handleHeaderClick={this._handleHeaderClick}
                        routes={this._sideBarRoutes()}
                        handleDrawerToggle={this.handleDrawerToggle}
                        {...rest}
                    />
                    <div className={classes.content}>
                        <div className={classes.container}>
                            {this._switchRoutes()}
                        </div>
                    </div>
                </div>
                <DashboardSnackbar/>
            </div>
        );
    }
}

App.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
    return {
        user_profile: state.auth.user_profile,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(appStyle)(App));
