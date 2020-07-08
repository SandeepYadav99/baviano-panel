/**
 * Created by charnjeetelectrovese@gmail.com on 4/23/2020.
 */
import React, { Component } from 'react';
import { Dialog, DialogTitle, List, ListItem, ListItemText, withStyles  } from '@material-ui/core';
import styles from './Style.module.css';

class DriversDialog extends Component {
    constructor(props) {
        super(props);

    }

    _renderDrivers() {
        const {data} = this.props;
        // const data = [];
        // for (let i = 0; i < 100; i++) {
        //     data.push({
        //         driver_id: i,
        //         name: i
        //     })
        // }
        return data.map((val) => {
            return (
                <ListItem button onClick={() => this.props.handleClick(val.driver_id)} key={val.driver_id}>
                    <div className={styles.listItem}>
                        <div className={styles.driverName}>{val.name}</div>
                        <div className={styles.jobText}>Jobs Completed - {val.jobs}</div>
                    </div>
                </ListItem>
            )
        });
    }

    render() {
        const { classes } = this.props;
        return (
            <Dialog classes={{
                paper: classes.paper,
            }} onClose={this.props.handleClose} aria-labelledby="simple-dialog-title" open={this.props.is_open}>
                <DialogTitle id="simple-dialog-title">Online Drivers</DialogTitle>
                <List>
                    {this._renderDrivers()}
                </List>
            </Dialog>
        );
    }

}

const useStyle = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    paper: {
        minWidth: 300,
        maxHeight: 435,
    },
});


export default (withStyles(useStyle, {withTheme: true})(DriversDialog));
