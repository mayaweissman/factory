import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Auth } from "../auth/auth";
import { Home } from "../home/home";
import { ReportMaker } from "../report-maker/report-maker";
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
                        <Redirect from="/" to="/home" />
                    </Switch>

                </BrowserRouter>
            </div>
        )
    }
}