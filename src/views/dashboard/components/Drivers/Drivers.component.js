/**
 * Created by charnjeetelectrovese@gmail.com on 4/30/2020.
 */
/**
 * Created by charnjeetelectrovese@gmail.com on 4/30/2020.
 */
import React, {Component} from "react";
import {Grid, Divider, List, ListItem, withStyles, Typography, Paper} from "@material-ui/core";
import styles from './Styles.module.css';

class DriversList extends Component {

    constructor(props) {
        super(props);
        this._renderDriverList = this._renderDriverList.bind(this);
    }


    componentDidMount() {

    }

    _renderDriverList() {
        const {data} = this.props;
        return data.map((val) => {
            return (
                <div className={styles.listItem}>
                    <div className={styles.listCont}>
                        <div className={styles.driverName}>{val.name}</div>
                        <div className={styles.jobsDone}>Jobs Done <span>{val.jobs}</span></div>

                    </div>
                    <hr/>
                </div>);
        })
    }

    render() {
        const {
            theme,
            classes
        } = this.props;
        return (
            <Paper className={classes.paper} classes={{root: classes.widgetRoot}}>
                <div className={styles.header}>
                    <Typography variant="h5" color="textSecondary">
                        Online Drivers
                    </Typography>
                </div>
                <hr className={styles.line}/>
                <div className={styles.list}>
                {this._renderDriverList()}
                </div>
            </Paper>
        );
    }
}

const classStyles = theme => ({
    paper: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        overflow: "hidden"
    },
    widgetHeader: {
        padding: theme.spacing.unit * 3,
        paddingBottom: theme.spacing.unit,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    widgetRoot: {
        boxShadow: theme.customShadows.widget
    },
});

export default withStyles(classStyles, {withTheme: true})(DriversList);
