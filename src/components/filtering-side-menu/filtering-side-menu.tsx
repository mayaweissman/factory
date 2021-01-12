import React, { Component } from "react";
import { Unsubscribe } from "redux";
import { CampaignModel } from "../../models/campaignModel";
import { ClientModel } from "../../models/clientModel";
import { ProductModel } from "../../models/productModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./filtering-side-menu.css";
import { getProductsTypes } from "../../data/products-types";
import { getAllProducts } from "../../data/products";

interface FilteringSideMenuState {
    selectedClients: ClientModel[],
    selectedCampaigns: CampaignModel[],
    selectedProducts: ProductModel[]
}

export class FilteringSideMenu extends Component<any, FilteringSideMenuState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            selectedClients: store.getState().selectedClients,
            selectedCampaigns: store.getState().selectedCampaigns,
            selectedProducts: store.getState().selectedProducts
        }

        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            const selectedCampaigns = store.getState().selectedCampaigns;
            const selectedProducts = store.getState().selectedProducts;
            this.setState({ selectedClients });
            this.setState({ selectedCampaigns });
            this.setState({ selectedProducts });
        })
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public filterByCapmaign = (campaign: CampaignModel) => (event: any) => {
        const campaignsToDisplay: CampaignModel[] = [...store.getState().campaignsToDisplay];
        for (const c of campaignsToDisplay) {
            if (c.campaignId === campaign.campaignId) {
                const index = campaignsToDisplay.indexOf(c);
                campaignsToDisplay.splice(index, 1);
                store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: campaignsToDisplay });
                return;
            }
        }
        campaignsToDisplay.push(campaign);
        store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: campaignsToDisplay });
    }

    public filterByProductType = (productsTypeId: number) => (event: any) => {
        const productsToDisplay: ProductModel[] = [...store.getState().productsToDisplay];
        const duplictes = productsToDisplay.filter(p => p.productTypeId === productsTypeId);
        console.log(duplictes);
        for (const p of duplictes) {
            const index = productsToDisplay.indexOf(p);
            productsToDisplay.splice(index, 1);
        }

        if (duplictes.length === 0) {
            getAllProducts().filter(p => p.productTypeId === productsTypeId).
                forEach(p => productsToDisplay.push(p));
        }

        store.dispatch({ type: ActionType.updateProductsToDisplay, payLoad: productsToDisplay });
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
                        {this.state.selectedCampaigns.map(campaign =>
                            <label className="container">
                                <input onClick={this.filterByCapmaign(campaign)} type="checkbox" />
                                <span className="checkmark"></span>
                                <span className="campaign-name-title">
                                    {campaign.campaignName}
                                </span>
                            </label>
                        )}
                    </div>
                </div>

                <div className="products-filtering-area">
                    <span className="products-filtering-title">סוג תוצר</span>
                    <br />
                    <div className="products-titles">

                        {getProductsTypes().map(type =>
                            <label className="container">
                                <input type="checkbox" onClick={this.filterByProductType(type.productsTypeId)} />
                                <span className="checkmark"></span>
                                <span className="campaign-name-title">
                                    {type.nameForMany}
                                </span>
                            </label>
                        )}
                    </div>
                </div>

                <div className="url-sharing-area">
                    <span>יצירת URL לשיתוף</span>
                </div>
            </div>
        )
    }
}