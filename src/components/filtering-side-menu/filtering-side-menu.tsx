import React, { Component } from "react";
import { Unsubscribe } from "redux";
import { ClientModel } from "../../models/clientModel";
import { store } from "../../redux/store";
import "./filtering-side-menu.css";

interface FilteringSideMenuState {
    selectedClients: ClientModel[]
}

export class FilteringSideMenu extends Component<any, FilteringSideMenuState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            selectedClients: store.getState().selectedClients
        }

        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            this.setState({ selectedClients });
        })
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public render() {
        return (
            <div className="filtering-side-menu">
                <span className="reset-filtering">איפוס סננים</span>

                <input className="date-filtering-box" />

                <div className="campaigns-filtering-area">
                    <span className="campaign-filtering-title">קמפיין</span>
                    <br />
                    <div className="campaigns-titles">
                        {this.state.selectedClients.map(client => client.campaigns?.map(campaign =>

                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    {campaign.campaignName}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="products-filtering-area">
                    <span className="products-filtering-title">סוג תוצר</span>
                    <br />
                    <div className="products-titles">

                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    מעברונים
                                </span>
                            </label>
                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    באנרים
                                </span>
                            </label>
                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    פוסטים
                                </span>
                            </label>
                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    סרטים
                                </span>
                            </label>
                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    דיוור
                                </span>
                            </label>
                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    עמוד נחיתה
                                </span>
                            </label>
                            <label className="container">
                                    <input type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                    אחר
                                </span>
                            </label>
                    </div>
                </div>

                <div className="url-sharing-area">
                    <span>יצירת URL לשיתוף</span>
                </div>
            </div>
        )
    }
}