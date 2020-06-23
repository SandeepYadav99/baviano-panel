/**
 * Created by charnjeetelectrovese@gmail.com on 1/20/2020.
 */
import React, { Component } from 'react';
import { CircularProgress } from '@material-ui/core';

class WaitingComponent extends Component {
    render() {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <CircularProgress />
            </div>
        )
    }
}

export default WaitingComponent;
