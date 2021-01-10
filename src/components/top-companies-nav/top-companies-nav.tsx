import React, { Component, useRef } from "react";
import { Unsubscribe } from "redux";
import { ClientModel } from "../../models/clientModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { AllClients } from "../all-clients/all-clients";
import "./top-companies-nav.css";

interface TopCompaniesNavProps {
    isScroll: boolean
}

interface TopCompaniesNavState {
    selectedClients: ClientModel[],
    isButtonsScrolled: boolean,
}

export class TopCompaniesNav extends Component<TopCompaniesNavProps, TopCompaniesNavState>{

    private unsubscribeStore: Unsubscribe;
    public buttonsRef = React.createRef<HTMLDivElement>();
    public topNavRef = React.createRef<HTMLDivElement>();


    public constructor(props: TopCompaniesNavProps) {
        super(props);

        this.state = {
            selectedClients: [],
            isButtonsScrolled: false
        }
        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            this.setState({ selectedClients });
        })
    }

    componentDidMount() {
        const topNavWidth: number = this.topNavRef.current?.clientWidth as number;
        const maxWidth = topNavWidth / 100 * 60;

        window.addEventListener("click", () => {
            const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
            if (buttonsWidth > maxWidth) {
                this.setState({ isButtonsScrolled: true });
            }
        })
    }


    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public scrollToRight = () => {
        this.buttonsRef.current?.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }

    public scrollToLeft = () => {
        const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
        this.buttonsRef.current?.scrollTo({
            top: 0,
            left: -buttonsWidth,
            behavior: "smooth"
        });
    }

    public removeAllClients = () => {
        store.dispatch({ type: ActionType.unselectAllClients });
    }

    public render() {
        return (
            <div ref={this.topNavRef} className="top-companies-nav">
                <div ref={this.buttonsRef} className="buttons">
                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="start-of-buttons-section" onMouseEnter={this.scrollToRight}></div>

                    {this.state?.selectedClients.map(client =>
                        <button className="client-btn">{client.clientName}</button>
                    )}

                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="end-of-buttons-section" onMouseEnter={this.scrollToLeft}>
                        <span className="more-buttons-icon">|</span>
                    </div>
                </div>


                <div className="top-scroll" style={{ top: this.props.isScroll ? "6vw" : 0 }}></div>

                <div className="other-buttons">
                    <button className="next-btn">
                        &#706;
                    </button>
                    <span className="remove-all" onClick={this.removeAllClients}>הסר הכל</span>
                </div>

                <img className="logo" src="/assets/images/logo.png" />

            </div>

        )
    }
}