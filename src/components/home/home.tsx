import React, { Component } from "react";
import { TopCompaniesNav } from "../top-companies-nav/top-companies-nav";
import './home.css';

export class Home extends Component{
    public render(){
        return(
            <div className="home">
                <TopCompaniesNav/>
                <h1>Home page content</h1>
            </div>
        )
    }
}