import React, { Component, useRef } from "react";
import { NavLink } from "react-router-dom";
import { Unsubscribe } from "redux";
import { Logo } from "../../get-logo";
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
    showLogout: boolean
}

export class TopClientsNav extends Component<TopClientsNavProps, TopClientsNavState>{

    private unsubscribeStore: Unsubscribe;
    public buttonsRef = React.createRef<HTMLDivElement>();
    public topNavRef = React.createRef<HTMLDivElement>();


    public constructor(props: TopClientsNavProps) {
        super(props);

        this.state = {
            selectedClients: store.getState().selectedClients,
            isButtonsScrolled: false,
            showLogout: false
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

    // public scrollToRight = () => {
    //     const offsetLeft = this.buttonsRef.current?.scrollLeft as number;
    //     const x = offsetLeft + 30;

    //     this.buttonsRef.current?.scrollTo({
    //         top: 0,
    //         left: x,
    //         behavior: "smooth"
    //     });
    // }

    public scrollBar = (event: any) => {
        const x = event.clientX;
        const width = this.buttonsRef.current?.offsetWidth as number;
        const offsetLeft = this.buttonsRef.current?.offsetLeft as number;
        const scrollLeft = this.buttonsRef.current?.scrollLeft as number;


        const buttonsWidth = this.buttonsRef.current?.scrollWidth as number;
        const topNavWidth: number = this.topNavRef.current?.clientWidth as number;

        const position = x - (topNavWidth - width);
        const half = width / 2;
        let precentages;

        if (position < half) { precentages = 0; }
        if (position >= half) { precentages = 1; }

        if (precentages && precentages > 0) {
            this.buttonsRef.current?.scrollTo({
                top: 0,
                left: scrollLeft + x,
                behavior: "smooth"
            });

        }
        else {
            this.buttonsRef.current?.scrollTo({
                top: 0,
                left: -(scrollLeft + x),
                behavior: "smooth"
            });
        }

    }


    public removeAllClients = () => {
        this.setState({ selectedClients: [] })
        store.dispatch({ type: ActionType.unselectAllClients });
        store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: [] });
        store.dispatch({ type: ActionType.getSelectedProducts, payLoad: [] });
        store.dispatch({ type: ActionType.updateClientsToDisplay, payLoad: [] });
        store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: [] });
        store.dispatch({ type: ActionType.updateProductsToDisplay, payLoad: [] });

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
                <img src="./assets/images/add-client-circle-off.svg" className="no-selected-img" style={{ display: this.state.selectedClients.length === 0 ? "block" : "none" }} />
                <img src="./assets/images/add-client-circle-on.svg" className="no-selected-img" style={{ display: this.state.selectedClients.length > 0 ? "block" : "none" }} />

                <div ref={this.buttonsRef} className="buttons" onMouseMove={this.scrollBar}>
                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="start-of-buttons-section"></div>

                    {this.state?.selectedClients.map(client =>
                        <button className="client-btn">
                            <button className="remove-btn" onClick={this.removeClient(client.clientId as number)}>
                                <span>&#10006;</span>
                            </button>
                            <span className="inside-client-btn">{client.clientName}</span>
                        </button>
                    )}

                    <div style={{ display: this.state.isButtonsScrolled ? "block" : "none" }}
                        className="end-of-buttons-section">
                        <span className="more-buttons-icon">|</span>
                    </div>
                </div>


                <div className="top-scroll" style={{ top: this.props.isScroll ? this.topNavRef.current?.clientHeight : 0 }}></div>
                <img src="./assets/images/pink_btn_before.svg" className="next-btn-pink" style={{ display: this.state.selectedClients.length === 0 ? "block" : "none" }} />
                <NavLink to="/report-maker" className="link-to-report-maker" exact>
                    <img src="./assets/images/pink_btn_after.svg" className="next-btn-pink" style={{ display: this.state.selectedClients.length > 0 ? "block" : "none" }} />
                </NavLink>
                <div className="other-buttons">
                    <span className="remove-all" onClick={this.removeAllClients}>מההתחלה</span>
                </div>

                <span className="logout-span" onClick={() => this.setState({ showLogout: true })}>logout</span>

                <div className="logo-container"></div>
                <img className="logo" src={Logo.logoSrc} />

                {this.state.showLogout &&
                    <div className="logout-dialog" >
                        <span className="logout-subtitle">התנתקות מהמערכת תמחק את כל הבחירות הנוכחיות</span>
                        <br />
                        <span className="logout-title">מה ברצונך לעשות?</span>
                        <br />
                        <button className="logout-cancel-btn" onClick={() => this.setState({ showLogout: false })}>אני רוצה להישאר</button>
                        <button className="logout-confirm-btn" onClick={() => store.dispatch({ type: ActionType.logoutEditingMode })}>אני רוצה להתנתק</button>
                    </div>
                }


            </div>

        )
    }
}