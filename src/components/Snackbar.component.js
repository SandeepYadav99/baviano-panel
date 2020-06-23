/**
 * Created by charnjeetelectrovese@gmail.com on 12/17/2019.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import { amber, green, grey } from '@material-ui/core/colors';
import IconButton from '@material-ui/core/IconButton';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {Snackbar} from "@material-ui/core";
import EventEmitter from "../libs/Events.utils";

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
    none: InfoIcon,
};

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    none: {
      backgroundColor: grey[800]
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'info', 'success', 'warning', 'none']).isRequired,
};


class DashboardSnackbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            snackbar: false,
            message: '',
            variant: 'none',
        }
        this._handleError = this._handleError.bind(this);
        this._handleSnackBarClose = this._handleSnackBarClose.bind(this);
    }

    _handleError(t) {
        console.log(t)
        const data = (t);
        data.type = data.type ? data.type : 'none';
        this.setState({
            snackbar: true,
            message: data.error,
            variant: data.type,
        })
    }
    _handleSnackBarClose () {
        this.setState({
            snackbar: false,
        })
    }

    componentDidMount() {
        // if (navigator.platform.indexOf('Win') > -1) {
        //     // eslint-disable-next-line
        //     // const ps = new PerfectScrollbar(this.refs.mainPanel);
        // }
        EventEmitter.subscribe(EventEmitter.THROW_ERROR, this._handleError);
    }

    componentWillUnmount() {
        EventEmitter.unsubscribe(EventEmitter.THROW_ERROR);
    }

    render() {
        return (
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={this.state.snackbar}
                message={this.state.message}
                autoHideDuration={4000}
                onClose={this._handleSnackBarClose}
            >
                <MySnackbarContentWrapper
                    onClose={this._handleSnackBarClose}
                    variant={this.state.variant}
                    message={this.state.message}
                />
            </Snackbar>
        )
    }

}
export default DashboardSnackbar;
