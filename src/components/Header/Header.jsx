import React from "react";
import PropTypes from "prop-types";
import {Menu as MenuIcon, MoreVert as OptionIcon} from "@material-ui/icons";
import {connect} from "react-redux";
import { bindActionCreators } from 'redux';
import {
    withStyles,
    AppBar,
    Toolbar,
    IconButton,
    Hidden,
    Button,
    Menu,
    MenuItem,
    Switch
} from "@material-ui/core";
import cx from "classnames";

import headerStyle from "../../assets/jss/material-dashboard-react/headerStyle.jsx";
import {actionLogoutUser} from "../../actions/auth_index.action";
import { actionChangeTheme } from '../../actions/AppSettings.action';
// import HeaderLinks from "./HeaderLinks";

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            anchorEl: null,
            dark:false
        };
        this._handleClick = this._handleClick.bind(this);
        this._handleClose = this._handleClose.bind(this);
        this._handleLogout = this._handleLogout.bind(this);
        this._handleChangeTheme = this._handleChangeTheme.bind(this)
    }

    makeBrand() {
        var name = 'Admin Panel';
        this.props.routes.map((prop, key) => {
            if (prop.path === this.props.location.pathname) {
                name = prop.navbarName;
            }
            return null;
        });
        return name;
    }


    _handleClick = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    _handleClose = () => {
        this.setState({anchorEl: null});
    };
    _handleLogout() {
        this.props.actionLogoutUser();
        this.setState({anchorEl: null});
    }

    _handleChangeTheme(){
        const { themeType } = this.props;
        this.props.actionChangeTheme(themeType == 'dark' ? 'light' : 'dark');
    }

    render() {
        const {classes, color, themeType} = this.props;
        const { anchorEl } = this.state;
        const appBarClasses = cx({
            [" " + classes[color]]: color
        });

        const palletType = this.state.dark ? "dark" : "light";
        const mainPrimaryColor = this.state.dark ? '' : '';
        const mainSecondaryColor = this.state.dark ? '' : '';

        return (
            <AppBar position={"static"} className={classes.appBar + appBarClasses}>
                <Toolbar className={classes.container}>
                    <IconButton className={classes.menuButton} onClick={this.props.handleHeaderClick} color="inherit"
                                aria-label="Menu">
                        <MenuIcon/>
                    </IconButton>
                    <Button href="#" className={classes.title}>
                        {this.makeBrand()}
                    </Button>
                    <div className={classes.flexGrow}>
                        <Switch checked={themeType == 'dark'} onChange={this._handleChangeTheme}/>
                    </div>
                    <div>
                        <Button
                            aria-owns={anchorEl ? 'simple-menu' : undefined}
                            aria-haspopup="true"
                            onClick={this._handleClick}
                            style={{ color: 'white' }}
                        >
                            <OptionIcon/>
                        </Button>
                        <Menu
                            id="simple-menu"
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={this._handleClose}
                        >
                            {/*<MenuItem onClick={this._handleClose}>Profile</MenuItem>*/}
                            {/*<MenuItem onClick={this._handleClose}>My account</MenuItem>*/}
                            <MenuItem onClick={this._handleLogout}>Logout</MenuItem>
                        </Menu>
                    </div>
                    {/*<IconButton*/}
                    {/*className={classes.appResponsive}*/}
                    {/*color="inherit"*/}
                    {/*aria-label="open drawer"*/}
                    {/*onClick={props.handleDrawerToggle}*/}
                    {/*>*/}
                    {/*<Menu />*/}
                    {/*</IconButton>*/}
                </Toolbar>
            </AppBar>
        );
    }
}

Header.propTypes = {
    classes: PropTypes.object.isRequired,
    color: PropTypes.oneOf(["primary", "info", "success", "warning", "danger"])
};

const temp = withStyles(headerStyle)(Header);

function mapDispatchToProps(dispatch){
    return bindActionCreators({
        actionLogoutUser: actionLogoutUser,
        actionChangeTheme: actionChangeTheme,
    }, dispatch);
}
function mapStateToProps(state) {
    return {
        themeType: state.app_setting.theme,
    }
}

export  default  connect(mapStateToProps, mapDispatchToProps)(temp);
