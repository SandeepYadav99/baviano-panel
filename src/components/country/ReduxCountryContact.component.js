/**
 * Created by charnjeetelectrovese@gmail.com on 1/23/2020.
 */
import React, {Component} from 'react';
import {CountryPhone} from "../index.component";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {FormHelperText} from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";


class ReduxCountryContact extends Component {
    constructor(props) {
        super(props);
        this._handleChange = this._handleChange.bind(this);
    }

    _handleChange(phone) {
        console.log('redux country contact', phone);
        this.props.onChange(phone);
    }

    render() {
        const {value, error, label, country_code, input, helperText} = this.props;
        console.log('contact props', this.props);
        return (
            <div style={{
                marginTop: '8px',
                marginBottom: '4px',
                position: 'relative'
            }}>
                <CountryPhone
                    {...input}
                    inputProps={{
                        name: input.name,
                        onBlur: input.onBlur,
                        onChange: input.onChange,
                        onDragStart: input.onDragStart,
                        onDrop: input.onDrop,
                        onFocus: input.onFocus
                    }}
                    placeholder={label}
                    inputStyle={error ? {borderColor: 'red'} : {}}
                    country={country_code ? country_code.toLowerCase() : 'us'}
                    value={value}
                    onChange={this._handleChange}
                />
                <p style={{
                    color: '#f44336', right: '0px',
                    bottom: '-10px',
                    margin: '0px',
                    position: 'absolute',
                    marginLeft: '5px',
                    fontSize: '0.60rem'
                }}>{helperText}</p>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        country_code: state.auth.user_profile.country_code,
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ReduxCountryContact);
