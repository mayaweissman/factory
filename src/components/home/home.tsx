import React, { Component } from "react";
import { AllClients } from "../all-clients/all-clients";
import { TopClientsNav } from "../top-clients-nav/top-clients-nav";
import './home.css';


interface HomeState {
    isScroll: boolean
}

export class Home extends Component<any, HomeState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            isScroll: false
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', (e) => {
            const YPosition = window.pageYOffset;
            if (YPosition === 0) {
                this.setState({ isScroll: false });
            }
            else {
                this.setState({ isScroll: true });
            }
        });
    }

    public render() {
        return (
            <div className="home">
                <TopClientsNav isScroll={this.state.isScroll} />

                <AllClients />
            </div>
        )
    }
}