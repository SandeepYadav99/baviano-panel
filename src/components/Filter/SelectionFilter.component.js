/**
 * Created by charnjeetelectrovese@gmail.com on 6/28/2020.
 */

import React, {Component} from 'react';
import {LinearProgress, withStyles} from '@material-ui/core';
import {Search as SearchIcon} from '@material-ui/icons';
import PropTypes from 'prop-types';
import _ from 'lodash';

const styles = {
    flatButton: {
        float: 'right',
    },
};
const useStyles = {
    formControl: {
        minWidth: 120,
    },
}
class SelectionFilter extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false,
            filter: [],
            selectedFilters: [],
            query: ''
        };
        this._handleSearchChange = this._handleSearchChange.bind(this);
        this._handleSearchBlur = this._handleSearchBlur.bind(this);
        this.changedSearch = _.debounce((value) => { this.props.handleSearchValueChange(value); }, 500);
    }
    
    _handleSearchChange(e) {
        this.setState({
            query: e.target.value,
        })
        this.changedSearch(e.target.value);
    }

    _handleSearchBlur() {

    }

   
    addClick() {

    }

    _renderProgress() {
        if(this.props.is_progress ) {
            return ( <LinearProgress  color="primary" /> );
        } else {
            return null;
        }

    }


    render() {
        const { theme } = this.props;
        return (
            <div style={{}}>
                <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end', }}>
                    <div style={{ flex: 1 }}>
                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1px solid #f4f4f4', paddingLeft: '10px', backgroundColor: theme.palette.textColor, color: theme.palette.bgColor.main}}>
                            <SearchIcon style={{ width: 15, height: 15, marginRight: 10 }}/>
                            <input onBlur={this._handleSearchBlur} value={this.state.query} onChange={this._handleSearchChange} style={{ width: '100%', height: '15px', border: 'none', padding: 10, fontSize: 15 }} placeholder={'Search'}/>
                        </div>
                        {this._renderProgress()}
                    </div>
                </div>
            </div>
        );
    }
}
SelectionFilter.defaultTypes = {
    is_progress: false
}
SelectionFilter.propTypes = {
    is_progress: PropTypes.bool
}

export default withStyles(useStyles, { withTheme: true })(SelectionFilter);
