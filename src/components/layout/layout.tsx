import React, { Component } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Auth } from "../auth/auth";
import { Home } from "../home/home";
import { PageNotFound } from "../page-not-found/page-not-found";
import { ReportMaker } from "../report-maker/report-maker";
import { Report } from "../report/report";
import axios from "axios";
import "./layout.css";

interface LayoutState {
  isLegalIp: boolean;
  isLegalIpForMobile: boolean;
}

export class Layout extends Component<any, LayoutState> {
  public constructor(props: any) {
    super(props);
    this.state = {
      isLegalIp: false,
      isLegalIpForMobile: false,
    };
  }

  public async componentDidMount() {
    try {
      const bodyClass = document.body.classList;
      if (bodyClass[0] === "mobile") {
        this.setState({ isLegalIpForMobile: true });
      }

      const json = await axios.get("https://api.ipify.org?format=json");
      const ip = json.data.ip;

      const ips = [
        "176.230.160.231",
        "31.168.98.222",
        "82.80.148.180",
        "82.80.148.180",
        "82.81.38.254",
        "176.230.160.195",
        "176.230.160.205",
      ];
      let legalIp = ips.find((i) => i === ip);
      if (legalIp) {
        this.setState({ isLegalIp: true });
      }
    } catch (err) {
      console.log(err.message);
    }
  }

  public render() {
    return (
      <div className="layout">
        {this.state.isLegalIp && !this.state.isLegalIpForMobile && (
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
        )}
        {this.state.isLegalIpForMobile && (
          <BrowserRouter>
            <Switch>
              <Route path="/:uuid" component={Report} />
            </Switch>
          </BrowserRouter>
        )}
      </div>
    );
  }
}
