import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Home } from "../home/home";
import { getAllClients } from "../../data/clients";
import "./layout.css";

export class Layout extends Component {

    componentDidMount() {
        console.log(getAllClients());
    }

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