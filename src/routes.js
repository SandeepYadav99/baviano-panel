/**
 * Created by charnjeetelectrovese@gmail.com on 12/4/2018.
 */
/* eslint-disable react/jsx-indent,indent */
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import OneView from './views/One.view';
import TwoView from './views/Two.view';

 const RouteCompoennt =  () => (
                <Switch>
                    <Route exact path="/" component={TwoView} />
                    <Route  path="/one" component={OneView} />
                    <Route   path="two" component={TwoView} />
                </Switch>
        )
export default RouteCompoennt;