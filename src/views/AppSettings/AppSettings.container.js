/**
 * Created by charnjeetelectrovese@gmail.com on 5/1/2020.
 */
import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import PageBox from '../../components/PageBox/PageBox.component';
import styles from './Style.module.css';
import {withStyles, Tabs, Tab} from "@material-ui/core";
import Geofencing from './Components/Geofencing/Geofencing.component';
import {WaitingComponent} from "../../components/index.component";
import {actionUpdateGeoFence} from "../../actions/AppSettings.action";

class AppSettings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0,
        };
        this._handleTabs = this._handleTabs.bind(this);
    }

    a11yProps(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    _handleTabs(value, handleValue) {

        this.setState({
            value: handleValue
        });
    }

    _renderPanel(value) {
        const {appSetting, actionUpdateGeoFence} = this.props;
        if (value == 0) {
            return (
                <Geofencing
                    polygon={appSetting.geofence}
                    handleSave={actionUpdateGeoFence}
                />
            );
        }
        return (
            <h1>{value}</h1>
        )
    }
    render() {
        const {data, classes, appSetting} = this.props;
        const { value } = this.state;
        if (appSetting.is_calling) {
            return (<WaitingComponent/>);
        }
        return (
            <PageBox>
                <div className={styles.mainContainer}>
                    <div className={classes.root}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={this._handleTabs}
                            aria-label="Vertical tabs example"
                            className={classes.tabs}
                        >
                            <Tab label="Geo Fence" {...this.a11yProps(0)} />
                            <Tab label="Other" {...this.a11yProps(1)} />
                        </Tabs>
                        <div className={styles.tabPanel}>
                        {this._renderPanel(value)}
                        </div>
                    </div>
                </div>
            </PageBox>
        )
    }
}

const useStyles = theme => ({
    root: {
        // flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
        display: 'flex',
        // height: 224,
    },
    tabs: {
        borderRight: `1px solid ${theme.palette.divider}`,
    },
});

function mapStateToProps(state) {
    return {
        appSetting: state.app_setting,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        actionUpdateGeoFence: actionUpdateGeoFence,
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(useStyles, { withTheme: true })(AppSettings));
