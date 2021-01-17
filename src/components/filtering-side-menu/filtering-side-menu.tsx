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
import { LinkPopUp } from "../link-pop-up/link-pop-up";
import { AddClientPopUp } from "../add-client-pop-up/add-client-pop-up";
import { ReportModel } from "../../models/reportModel";
import 'react-dates/initialize';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-daterangepicker/daterangepicker.css';
import DateRangeIcon from '@material-ui/icons/DateRange';


interface FilteringSideMenuProps {
    isOnReport: boolean

}
interface FilteringSideMenuState {
    selectedClients: ClientModel[],
    selectedCampaigns: CampaignModel[],
    campaignsToDisplay: CampaignModel[],
    selectedProducts: ProductModel[],
    productsToDisplay: ProductModel[],
    datesRange: string
}

export class FilteringSideMenu extends Component<FilteringSideMenuProps, FilteringSideMenuState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: FilteringSideMenuProps) {
        super(props);
        this.state = {
            selectedClients: store.getState().selectedClients,
            selectedCampaigns: store.getState().selectedCampaigns,
            campaignsToDisplay: store.getState().campaignsToDisplay,
            productsToDisplay: store.getState().productsToDisplay,
            selectedProducts: store.getState().selectedProducts,
            datesRange: "--:--:--"
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

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }


    //Display campaigns by campaign id (selected by name on filtering menu)
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

    //Reset all previos filtering
    public resetFiltering = () => {
        store.dispatch({ type: ActionType.resetFiltering });
    }


    //Display only products who match prodyctTypeId by filtering menu 
    public filterByProductType = (productsTypeId: number) => (event: any) => {
        const productsToDisplay: ProductModel[] = [...store.getState().productsToDisplay];
        const duplictes = productsToDisplay.filter(p => p.productTypeId === productsTypeId);
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

    //Open pop-up for link copy on click
    public createReport = () => {
        store.dispatch({ type: ActionType.changeDisplayForLinkPopUp });
    }

    //Checked/unchecked campaigns who choosen on any time
    public isCampaignChecked = (campaignId: number) => {
        const campaigns: CampaignModel[] = [...this.state.campaignsToDisplay];
        const c = campaigns.find(campaign => campaign.campaignId === campaignId);
        if (c !== undefined) {
            return true;
        }
        return false;
    }

    //Checked/unchecked product type who choosen on any time
    public isProductTypeChecked = (productTypeId: number) => {
        const products: ProductModel[] = [...this.state.productsToDisplay];
        const p = products.find(product => product.productTypeId === productTypeId);
        if (p !== undefined) {
            return true;
        }
        return false;
    }


    //Will change  
    public filterByLatest = () => {
        const campaigns: CampaignModel[] = store.getState().campaignsToDisplay;
        for (const c of campaigns) {
            c.timePassed = Date.parse(c.lastUpdate as string)
        }
        campaigns.sort((a, b) => ((a.timePassed as number) > (b.timePassed as number)) ? 1 : -1);
        this.setState({ campaignsToDisplay: campaigns });
    }


    public render() {
        return (
            <div className="filtering-side-menu">
                <span className="reset-filtering" onClick={this.resetFiltering}>איפוס סננים</span>


                <br />
                <DateRangePicker
                    initialSettings={{ startDate: '1/1/2014', endDate: '3/1/2014' }}
                >
                    <button className="date-picker-btn">
                        {this.state.datesRange}
                        <span className="date-range-icon">
                        <DateRangeIcon />
                        </span>
                    </button>
                </DateRangePicker>
                <br />

                <div className="campaigns-filtering-area">
                    <span className="campaign-filtering-title">קמפיין</span>
                    <br />
                    <div className="campaigns-titles">
                        {this.state.selectedCampaigns.map(campaign =>
                            <label className="container-for-check">
                                <input checked={this.isCampaignChecked(campaign.campaignId as number)} onClick={this.filterByCapmaign(campaign)} type="checkbox" />
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
                            <label className="container-for-check">
                                <input checked={this.isProductTypeChecked(type.productsTypeId as number)} type="checkbox" onClick={this.filterByProductType(type.productsTypeId)} />
                                <span className="checkmark"></span>
                                <span className="campaign-name-title">
                                    {type.nameForMany}
                                </span>
                            </label>
                        )}
                    </div>
                </div>


                {!this.props.isOnReport &&
                    <button disabled={this.state.selectedClients.length === 0} className="url-sharing-area" onClick={this.createReport}>
                        <span>יצירת URL לשיתוף</span>
                    </button>
                }


            </div>


        )
    }
}