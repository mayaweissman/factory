import { exec } from "child_process";
import React, { Component } from "react";
import "./campaigns.css";
import { Unsubscribe } from "redux";
import { store } from "../../redux/store";
import { ClientModel } from "../../models/clientModel";
import { getAllClients } from "../../data/clients";
import { ActionType } from "../../redux/actionType";
import { CampaignModel } from "../../models/campaignModel";
import { getAllCampaigns } from "../../data/campaigns";
import { getAllProducts } from "../../data/products";
import { ProductModel } from "../../models/productModel";
import { getProductsTypes } from "../../data/products-types";

interface ReportMakerState {
    selectedClients: ClientModel[],
    selectedCampaigns: CampaignModel[],
    selectedProducts: ProductModel[]
    productsToDisplay: ProductModel[],
    campaignsToDisplay: CampaignModel[]
}




export class Campaigns extends Component<any, ReportMakerState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            selectedClients: store.getState().selectedClients,
            selectedCampaigns: store.getState().selectedCampaigns,
            selectedProducts: store.getState().selectedProducts,
            campaignsToDisplay: store.getState().campaignsToDisplay,
            productsToDisplay: store.getState().campaignsToDisplay
        }

        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            const selectedCampaigns = store.getState().selectedCampaigns;
            const selectedProducts = store.getState().selectedProducts;
            const campaignsToDisplay = store.getState().campaignsToDisplay;
            const productsToDisplay = store.getState().productsToDisplay;
            this.setState({ selectedClients });
            this.setState({ selectedCampaigns });
            this.setState({ selectedProducts });
            this.setState({ campaignsToDisplay });
            this.setState({ productsToDisplay });
        })
    }

    public getProductTypeName = (productTypeId: number) => {
        for(const type of getProductsTypes()){
            if(type.productsTypeId === productTypeId){
                return type.nameForSingle;
            }
        }
    }

    public componentDidMount() {
        const selectedCampaigns: CampaignModel[] = [];
        this.state.selectedClients.map(client => {
            getAllCampaigns().map(campaign => {
                if (campaign.clientId === client.clientId) {
                    selectedCampaigns.push(campaign);
                }
            })
        })

        this.setState({ selectedCampaigns });
        store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: selectedCampaigns });

        const selectedProducts: ProductModel[] = [];
        selectedCampaigns.map(campaign => {
            getAllProducts().map(product => {
                if (product.campaignId === campaign.campaignId) {
                    selectedProducts.push(product);

                }
            })
        })
        this.setState({ selectedProducts });
        store.dispatch({ type: ActionType.getSelectedProducts, payLoad: selectedProducts });
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

                {this.state.campaignsToDisplay.length !== 0 && this.state.campaignsToDisplay?.map(campaign =>
                    <div className="client-in-campaigns">
                        <h2>{campaign.campaignName}</h2>
                        <div className="grid">
                            {this.state.productsToDisplay.length === 0 && this.state.selectedProducts?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign">
                                    <img className="campaign-img" src={product.imageSrc} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>


                            )}
                            {this.state.productsToDisplay.length !== 0 && this.state.productsToDisplay?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign">
                                    <img className="campaign-img" src={product.imageSrc} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>


                            )}
                        </div>
                    </div>
                )}

                {this.state.campaignsToDisplay.length === 0 && this.state.selectedCampaigns?.map(campaign =>
                    <div className="client-in-campaigns">
                        <h2>{campaign.campaignName}</h2>
                        <div className="grid">
                            {this.state.productsToDisplay.length === 0 && this.state.selectedProducts?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign">
                                    <img className="campaign-img" src={product.imageSrc} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>


                            )}
                            {this.state.productsToDisplay.length !== 0 && this.state.productsToDisplay?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign">
                                    <img className="campaign-img" src={product.imageSrc} />
                                    <div className="campaign-info">
                                        <span className="product-type-title">{this.getProductTypeName(product.productTypeId as number)}</span>
                                        <span className="success-rate">
                                            <li className="success-color" style={{ color: this.getSuccessRateColor(product.successRates as number) }}> </li>
                                           % {product.successRates}
                                        </span>
                                    </div>
                                </div>


                            )}
                        </div>
                    </div>
                )}
            </div>
        )
    }
}