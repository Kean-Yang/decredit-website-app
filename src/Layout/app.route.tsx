/**
 * 全局路由
 * @author
 * @create
 */

import React, { Suspense } from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import DdRoute from './app.layout';
import { createBrowserHistory } from 'history';
import Loading from '../components/Load/Loading';
const history = createBrowserHistory();

const AppRoute = () => {
    return (
        <Router history={history}>
            <Suspense fallback={<Loading></Loading>}>
                <Switch>
                    <Route
                        path="/"
                        render={() => {
                            return <Redirect to="/dashboard" />;
                        }}
                        exact={true}
                    />
                    <Route basename="/" component={DdRoute} />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default AppRoute;
