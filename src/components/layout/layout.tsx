import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Home } from "../home/home";
import "./layout.css";

export class Layout extends Component {

    public render() {
        return (
            <div className="layout">
                <BrowserRouter>

                    <Switch>
                        <Route path="/home" component={Home} exact />
                        <Redirect from="/" to="/home" exact />
                    </Switch>

                </BrowserRouter>
            </div>
        )
    }
}