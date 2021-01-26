import React, { Component } from "react";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { AllClients } from "../all-clients/all-clients";
import { TopClientsNav } from "../top-clients-nav/top-clients-nav";
import './home.css';


interface HomeState {
    isScroll: boolean,
    isAfterAuth: boolean
}

export class Home extends Component<any, HomeState> {

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isScroll: false,
            isAfterAuth: store.getState().isAuthSucceeded
        }


        this.unsubscribeStore = store.subscribe(() => {
            const isAfterAuth = store.getState().isAuthSucceeded;
            this.setState({ isAfterAuth });
        })
    }

    componentDidMount() {

        if (!this.state.isAfterAuth) {
            this.props.history.push("/auth");
            return;
        }
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


    public componentWillUnmount(): void {
        this.unsubscribeStore();
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