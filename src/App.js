import React, {Component} from 'react';
import {Router, Route, Switch} from "react-router-dom";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import RouteComponent from './routes/index.route';
import './App.css';
import themes, {overrides} from './themes';
import history from './libs/history.utils';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

// const history = createBrowserHistory();



class App extends Component {
    render() {
        const { themeType } = this.props;
        const themeDefault = themeType == 'dark' ? themes.dark : themes.default;
// themeDefault['palette']['type'] = 'dark';
        const theme = createMuiTheme({...themeDefault, ...overrides});
        return (
            <MuiThemeProvider theme={theme}>
                <Router history={history}>
                    <RouteComponent/>
                </Router>
            </MuiThemeProvider>
        );
    }
}
function mapDispatchToProps(dispatch) {
    return bindActionCreators({

    })
}

function mapStateToProps(state) {
    return {
        themeType: state.app_setting.theme,
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
