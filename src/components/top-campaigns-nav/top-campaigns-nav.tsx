import React, { Component, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import { CampaignModel } from "../../models/campaignModel";
import { ClientModel } from "../../models/clientModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { AddClientPopUp } from "../add-client-pop-up/add-client-pop-up";
import { AllClients } from "../all-clients/all-clients";
import "./top-campaigns-nav.css";

interface TopCampaignsNavProps {
    isScroll: boolean
}

interface TopCampaignsNavState {
    selectedClients: ClientModel[],
    isButtonsScrolled: boolean,
    display: boolean
}

export class TopCampaignsNav extends Component<TopCampaignsNavProps, TopCampaignsNavState>{

    private unsubscribeStore: Unsubscribe;
    public buttonsRef = React.createRef<HTMLDivElement>();
    public topNavRef = React.createRef<HTMLDivElement>();


    public constructor(props: TopCampaignsNavProps) {
        super(props);

        this.state = {
            selectedClients: store.getState().selectedClients,
            isButtonsScrolled: false,
            display: store.getState().isPopUpShow
        }
        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            const display = store.getState().isPopUpShow;
            this.setState({ selectedClients });
            this.setState({ display });
        })
    }

    componentDidMount() {
        const topNavWidth: number = this.topNavRef.current?.clientWidth as number;
        const maxWidth = topNavWidth / 100 * 70;

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

    public filterByClientId = (clientId: number) => (event: any) => {
        const campaignsToDisplay: CampaignModel[] = [];
        const allSelectedCampaigns = store.getState().selectedCampaigns;
        for (const c of allSelectedCampaigns) {
            if (c.clientId === clientId) {
                campaignsToDisplay.push(c);
            }
        }
        store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: campaignsToDisplay });
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


    public removeClient = (clientId: number) => (event: any) => {

        //Remove from clients in redux
        const selectedClients = [...this.state.selectedClients];
        const index = selectedClients.findIndex(c => c.clientId === clientId);
        selectedClients.splice(index, 1);
        this.setState({ selectedClients });

        store.dispatch({ type: ActionType.removeClient, payLoad: clientId });

    }

    public openPopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForPopUp, payLoad: false });
    }


    public render() {
        return (
            <div ref={this.topNavRef} className="top-campaigns-nav">
                <div ref={this.buttonsRef} className="campaigns-buttons">
                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="campaigns-start-of-buttons-section" onMouseEnter={this.scrollToRight}></div>

                    <button className="campaigns-client-btn">
                        <button className="campaigns-remove-btn" style={{ opacity: 0 }}>
                            <span>&#10006;</span>
                        </button>
                        <NavLink className="back-to-home-page" to="/home"><span className="campaigns-inside-client-btn">All</span></NavLink>
                    </button>

                    {this.state?.selectedClients.map(client =>
                        <button className="campaigns-client-btn" onClick={this.filterByClientId(client.clientId as number)}>
                            <button className="campaigns-remove-btn" onClick={this.removeClient(client.clientId as number)}>
                                <span>&#10006;</span>
                            </button>
                            <span className="campaigns-inside-client-btn">{client.clientName}</span>
                        </button>
                    )}

                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="campaigns-end-of-buttons-section" onMouseEnter={this.scrollToLeft}>
                        <span className="campaigns-more-buttons-icon">|</span>
                    </div>
                </div>

                <span className="add-client-span" onClick={this.openPopUp}>הוספת לקוח</span>

                <div className="campaigns-top-scroll" style={{ top: this.props.isScroll ? "6vw" : 0 }}></div>

                <NavLink to="/home">
                    <img className="campaigns-logo" src="./assets/images/logo_factory.svg" />
                </NavLink>

                {this.state.display &&
                    <AddClientPopUp />
                }

            </div>

        )
    }
}