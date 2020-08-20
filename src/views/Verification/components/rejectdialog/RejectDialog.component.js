/**
 * Created by charnjeetelectrovese@gmail.com on 4/28/2020.
 */
import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

class RejectDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            select: 'Items unavailable',
        };
        this._handleReject = this._handleReject.bind(this);
        this._handleSelect = this._handleSelect.bind(this);
    }

    _renderMenu() {
        const options = [
            'Items unavailable',
            'Location out of service area',
            'Duplicate order',
            'Riders unavailable',
            'Customer Verification failed',
            // 'Other',
        ];
        return options.map((val) => {
            return (<MenuItem value={val}>{val}</MenuItem>);
        })
    }

    _handleReject() {
        this.props.handleSubmit({
            reject_reason: this.state.select
        });
    }

    _handleSelect(e, val) {
        this.setState({
            select: e.target.value
        });
    }

    render () {
        const { open,  } = this.props;
        return (
            <Dialog
                open={open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{"Reason For Rejecting?"}</DialogTitle>
                <DialogContent>
                    <Select
                        fullWidth={true}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={this.state.select}
                        onChange={this._handleSelect}
                    >
                        {this._renderMenu()}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this._handleReject} color="primary">
                        Ok
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }
}

export default RejectDialog;
