/**
 * Created by charnjeetelectrovese@gmail.com on 12/3/2019.
 */
import React, {Component} from 'react';
import classnames from 'classnames';
import styles from './style.module.css';
import {ButtonBase} from '@material-ui/core';
import {Close} from '@material-ui/icons';

class BottomPanelComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this._handleOpen = this._handleOpen.bind(this);
    }

    _handleOpen() {
        this.props.handleToggle();
    }

    render() {
        const tempStyle = {
            width: '100%',
            // height: '100%',
            backgroundColor: 'white',
            bottom: '0px',
            left: '0px',
            position: 'fixed',
            zIndex: '99',
        };
        tempStyle['bottom'] = (this.props.open ? '0px' : 'calc(-100px)');
        return (
            <div className={classnames(styles.LPTransition, styles.noScrollbar)} style={tempStyle}>
                <div className={styles.noScrollbar} style={{
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    width: 'calc(100%)',
                    height: 'calc(100% - 20px)',
                    padding: '10px'
                }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}

export default BottomPanelComponent;
