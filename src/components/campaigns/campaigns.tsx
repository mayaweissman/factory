import { exec } from "child_process";
import React, { Component } from "react";
import "./campaigns.css";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ClientModel } from "../../models/clientModel";

interface ReportMakerState {
    selectedClients: ClientModel[]
}


export class Campaigns extends Component<any, ReportMakerState>{

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

    public getSuccessRateColor = (successRate: number) => {
        if (successRate <= 50) {
            return "#E4002B";
        }
        else if (successRate > 50 && successRate < 80) {
            return "#FFDB48";
        }

        else if (successRate >= 80) {
            return "#1CE5A2";
        }
    }

    public render() {
        return (
            <div className="campaigns">

                <div className="campaigns-left-filter">
                    <img className="campaigns-filter-by-success-img" src="/assets/images/filter_by_date.svg" />
                    <span className="campaigns-filter-by-high">Highest first</span>
                    <span className="campaigns-separate">|</span>
                    <span className="campaigns-filter-by-low">Lowest first</span>
                </div>

                {this.state.selectedClients?.map(client =>
                    client.campaigns?.map(campaign =>
                        <div className="client-in-campaigns">
                            <h2>{campaign.campaignName}</h2>
                            <div className="grid">
                                {campaign.products?.map(product =>
                                    <div className="campaign">
                                        <img className="campaign-img" src={product.imageSrc} />
                                        <div className="campaign-info">
                                            <span className="product-type-title">{product.productType}</span>
                                            <span className="success-rate">
                                                <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                )}
            </div>
        )
    }
}