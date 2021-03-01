import React, { Component, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import { Logo } from "../../get-logo";
import { CampaignModel } from "../../models/campaignModel";
import { ClientModel } from "../../models/clientModel";
import { ProductModel } from "../../models/productModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { AddClientPopUp } from "../add-client-pop-up/add-client-pop-up";
import { AllClients } from "../all-clients/all-clients";
import "./top-report-nav.css";

interface TopReportNavProps {
    isScroll: boolean
}

interface TopReportNavState {
    selectedClients: ClientModel[],
    isButtonsScrolled: boolean,
    display: boolean,
    filteringBefore: {
        beforeCampaignsToDisplay: CampaignModel[],
        beforeProductsToDisplay: ProductModel[]

    }
}

export class TopReportNav extends Component<TopReportNavProps, TopReportNavState>{

    private unsubscribeStore: Unsubscribe;
    public buttonsRef = React.createRef<HTMLDivElement>();
    public topNavRef = React.createRef<HTMLDivElement>();


    public constructor(props: TopReportNavProps) {
        super(props);

        this.state = {
            selectedClients: store.getState().selectedClients,
            isButtonsScrolled: false,
            display: store.getState().isPopUpShow,
            filteringBefore: {
                beforeCampaignsToDisplay: [],
                beforeProductsToDisplay: []
            }
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
        const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;

        if (buttonsWidth > maxWidth) {
            this.setState({ isButtonsScrolled: true });
        }
        else {
            this.setState({ isButtonsScrolled: false });
        }

        window.addEventListener("click", () => {
            const topNavWidth: number = this.topNavRef.current?.clientWidth as number;
            const maxWidth = topNavWidth / 100 * 70;
            const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
            console.log(maxWidth);
            console.log(buttonsWidth);
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

        const filteringBefore = { ...this.state.filteringBefore };
        filteringBefore.beforeCampaignsToDisplay = store.getState().campaignsToDisplay;
        filteringBefore.beforeProductsToDisplay = store.getState().productsToDisplay;
        this.setState({ filteringBefore });

        const allSelectedCampaigns = store.getState().selectedCampaigns;
        for (const c of allSelectedCampaigns) {
            if (c.clientId === clientId) {
                campaignsToDisplay.push(c);
            }
        }
        store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: campaignsToDisplay });
     

        const clientsToDisplay: ClientModel[] = [];
        const allSelectedClients = store.getState().selectedClients;
        for (const c of allSelectedClients) {
            if (c.clientId === clientId) {
                clientsToDisplay.push(c);
            }
        }

        store.dispatch({ type: ActionType.updateClientsToDisplay, payLoad: clientsToDisplay });
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


    public openPopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForPopUp, payLoad: false });
    }

    public resetClientsToDisplay = () => {
        store.dispatch({ type: ActionType.updateClientsToDisplay, payLoad: [] });
        store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: this.state.filteringBefore.beforeCampaignsToDisplay });
        store.dispatch({ type: ActionType.updateProductsToDisplay, payLoad: this.state.filteringBefore.beforeProductsToDisplay });
    }

    public scrollBar = (event: any) => {
        const x = event.clientX;
        const width = this.buttonsRef.current?.offsetWidth as number;
        const offsetLeft = this.buttonsRef.current?.offsetLeft as number;

        const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
        const topNavWidth: number = this.topNavRef.current?.clientWidth as number;

        const position = x - (topNavWidth - width);
        const half = width / 2;
        let precentages;

        if (position < half) { precentages = 0; }
        if (position >= half) { precentages = 1; }

        if(precentages && precentages > 0){
            this.buttonsRef.current?.scrollTo({
                top: 0,
                left: buttonsWidth - (offsetLeft +  x),
                behavior: "smooth"
            });
    
        }
        else{
            this.buttonsRef.current?.scrollTo({
                top: 0,
                left: -(buttonsWidth - (offsetLeft +  x)),
                behavior: "smooth"
            });
        }

    }

    public render() {
        return (
            <div ref={this.topNavRef} className="top-campaigns-nav-report">
                <div ref={this.buttonsRef} className="campaigns-buttons" onMouseMove={this.scrollBar}>
                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="campaigns-start-of-buttons-section"></div>

                    <button className="campaigns-client-btn" onClick={this.resetClientsToDisplay}>
                        <button className="campaigns-remove-btn" style={{ opacity: 0 }}>
                            <span>&#10006;</span>
                        </button>
                        <span className="campaigns-inside-client-btn">All</span>
                    </button>


                    {this.state?.selectedClients.map(client =>
                        <button className="campaigns-client-btn" onClick={this.filterByClientId(client.clientId as number)}>
                            <span className="campaigns-inside-client-btn">{client.clientName}</span>
                        </button>
                    )}

                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="campaigns-end-of-buttons-section">
                        <span className="campaigns-more-buttons-icon">|</span>
                    </div>
                </div>

                <span className="logout-span" onClick={()=>store.dispatch({type:ActionType.logoutWatchingMode})}>logout</span>

                <div className="campaigns-top-scroll" style={{ top: this.props.isScroll ? "7vw" : 0 }}></div>

                <img className="campaigns-logo" src={Logo.logoSrc} />

                {this.state.display &&
                    <AddClientPopUp />
                }

            </div>

        )
    }
}