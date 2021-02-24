import React from 'react';

import { Route, Link, Switch, Redirect, BrowserRouter } from 'react-router-dom';

import ScrollToTop from './components/ScrollToTop'

import StripBoard from './views/StripBoard'

const ResponsiveContainer = (props) => {
    return (
        <BrowserRouter>
            <ScrollToTop>
                <div>
                    {props.children}
                </div>
            </ScrollToTop>
        </BrowserRouter>
    )
}

const Layout = () => {

    return (
    <ResponsiveContainer>
        <Switch>
            <Route path={["/", "/*"]} component={StripBoard} strict />
        </Switch>
    </ResponsiveContainer>)
}

export default Layout