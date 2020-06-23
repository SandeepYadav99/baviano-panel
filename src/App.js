import React, {Component} from 'react';
import {Router, Route, Switch} from "react-router-dom";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import RouteComponent from './routes/index.route';
import './App.css';
import themes, {overrides} from './themes';
import history from './libs/history.utils';

// const history = createBrowserHistory();

const themeDefault = themes.default;
// themeDefault['palette']['type'] = 'dark';
const theme = createMuiTheme({...themeDefault, ...overrides});
console.log({ ['palette.type']: 'dark' });

class App extends Component {
    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <Router history={history}>
                    <RouteComponent/>
                </Router>
            </MuiThemeProvider>
        );
    }
}

export default App;
