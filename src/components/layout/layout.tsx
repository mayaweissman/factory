import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Auth } from "../auth/auth";
import { Home } from "../home/home";
import { PageNotFound } from "../page-not-found/page-not-found";
import { ReportMaker } from "../report-maker/report-maker";
import { Report } from "../report/report";
import "./layout.css";

export class Layout extends Component {

    public render() {
        return (
            <div className="layout">
                <BrowserRouter>

                    <Switch>
                        <Route path="/auth" component={Auth} exact />
                        <Route path="/report-maker" component={ReportMaker} exact />
                        <Route path="/home" component={Home} exact />
                        <Route path="/page-not-found" component={PageNotFound} exact />
                        <Route path="/:uuid" component={Report} />
                        <Redirect from="/" to="/home" />
                    </Switch>

                </BrowserRouter>
            </div>
        )
    }
}