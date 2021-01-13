import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Home } from "../home/home";
import { ReportMaker } from "../report-maker/report-maker";
import "./layout.css";

export class Layout extends Component {

    public render() {
        return (
            <div className="layout">
                <BrowserRouter>

                    <Switch>
                        <Route path="/factory/report-maker" component={ReportMaker} exact />
                        <Route path="/factory/home" component={Home} exact />
                        <Redirect from="/" to="/factory/home" />
                    </Switch>

                </BrowserRouter>
            </div>
        )
    }
}