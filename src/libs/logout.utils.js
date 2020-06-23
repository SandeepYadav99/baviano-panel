/* eslint-disable linebreak-style,indent,react/forbid-prop-types */
/**
 * Created by charnjeetelectrovese@gmail.com on 1/10/2018.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionLogoutUser } from '../actions/auth_index.action';

class LogoutUtils extends React.Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout() {
        this.props.logout();
    }
}

// eslint-disable-next-line react/forbid-prop-types
LogoutUtils.propTypes = {
};
function mapDispatchWithAction(dispatch) {
    return bindActionCreators({ logout: actionLogoutUser }, dispatch);
}
export default connect(null, mapDispatchWithAction)(LogoutUtils);
