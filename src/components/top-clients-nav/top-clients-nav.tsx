import React, { Component, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import { ClientModel } from "../../models/clientModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { AllClients } from "../all-clients/all-clients";
import "./top-clients-nav.css";

interface TopClientsNavProps {
    isScroll: boolean
}

interface TopClientsNavState {
    selectedClients: ClientModel[],
    isButtonsScrolled: boolean,
}

export class TopClientsNav extends Component<TopClientsNavProps, TopClientsNavState>{

    private unsubscribeStore: Unsubscribe;
    public buttonsRef = React.createRef<HTMLDivElement>();
    public topNavRef = React.createRef<HTMLDivElement>();


    public constructor(props: TopClientsNavProps) {
        super(props);

        this.state = {
            selectedClients: store.getState().selectedClients,
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
            else {
                this.setState({ isButtonsScrolled: false });
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
        this.setState({ selectedClients: [] })
        store.dispatch({ type: ActionType.unselectAllClients });
    }

    public removeClient = (clientId: number) => (event: any) => {
        const selectedClients = [...this.state.selectedClients];
        const index = selectedClients.findIndex(c => c.clientId === clientId);
        selectedClients.splice(index, 1);
        this.setState({ selectedClients });

        store.dispatch({ type: ActionType.removeClient, payLoad: clientId });
    }

    public render() {
        return (
            <div ref={this.topNavRef} className="top-companies-nav">
                <button className="no-selected-button" style={{ display: this.state.selectedClients.length === 0 ? "block" : "none" }}>
                    +
                </button>
                <div ref={this.buttonsRef} className="buttons">
                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="start-of-buttons-section" onMouseEnter={this.scrollToRight}></div>

                    {this.state?.selectedClients.map(client =>
                        <button className="client-btn">
                            <button className="remove-btn" onClick={this.removeClient(client.clientId as number)}>
                                <span>&#10006;</span>
                            </button>
                            <span className="inside-client-btn">{client.clientName}</span>
                        </button>
                    )}

                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="end-of-buttons-section" onMouseEnter={this.scrollToLeft}>
                        <span className="more-buttons-icon">|</span>
                    </div>
                </div>


                <div className="top-scroll" style={{ top: this.props.isScroll ? "6vw" : 0 }}></div>
                <img src="./assets/images/pink_btn_before.svg" className="next-btn-pink" style={{ display: this.state.selectedClients.length === 0 ? "block" : "none" }} />
                <NavLink onClick={() => console.log(store.getState().selectedClients)} to="/report-maker" className="link-to-report-maker" exact>
                    <img src="./assets/images/pink_btn_after.svg" className="next-btn-pink" style={{ display: this.state.selectedClients.length > 0 ? "block" : "none" }} />
                </NavLink>
                <div className="other-buttons">
                    <span className="remove-all" onClick={this.removeAllClients}>הסר הכל</span>
                </div>

                <div className="logo-container"></div>
                <img className="logo" src="./assets/images/logo_factory.svg" />

            </div>

        )
    }
}