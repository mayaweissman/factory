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
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import { ProductsType } from "../../models/productsTypeModel";

interface FilteringSideMenuProps {
    isOnReport: boolean

}
interface FilteringSideMenuState {
    selectedClients: ClientModel[],
    selectedCampaigns: CampaignModel[],
    campaignsToDisplay: CampaignModel[],
    selectedProducts: ProductModel[],
    productsToDisplay: ProductModel[],
    datesRange: string,
    allProducts: ProductModel[],
    productsTypes: ProductsType[],
    uuid: string
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
            allProducts: [],
            productsTypes: [],
            datesRange: "- - / - - / - -",
            uuid: ""
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

    public async componentDidMount() {
        try {
            const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-products-types/");
            const productsTypes: ProductsType[] = response.data.productsTypes;
            this.setState({ productsTypes });

            const responseForProducts = await axios.get("http://factory-dev.landing-page-media.co.il/all-products");
            const allProducts: ProductModel[] = responseForProducts.data.products;
            this.setState({ allProducts });
        }
        catch (err) {
            console.log(err.message);
        }
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
        this.setState({ datesRange: "- - / - - / - -" })
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
            this.state.allProducts.filter(p => p.productTypeId === productsTypeId).
                forEach(p => productsToDisplay.push(p));
        }

        store.dispatch({ type: ActionType.updateProductsToDisplay, payLoad: productsToDisplay });

    }

    //Checked/unchecked campaigns who choosen on any time
    public isCampaignChecked = (campaignId: number) => {
        const campaigns: CampaignModel[] = [...this.state.campaignsToDisplay];
        const allCampaigns: CampaignModel[] = [...store.getState().selectedCampaigns];
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

    public filterByDatesRange = (event: any, picker: any) => {
        const startDate = picker.startDate._d;
        const endDate = picker.endDate._d;

        const min = Date.parse(startDate);
        const max = Date.parse(endDate);

        const campaignsToDisplay: CampaignModel[] = store.getState().campaignsToDisplay;
        if (campaignsToDisplay.length > 0) {
            for (const campaign of campaignsToDisplay) {
                campaign.timePassed = Date.parse(campaign.lastUpdate as string);
            }

            const newCampaignsToDisplay: CampaignModel[] = [];
            for (const c of campaignsToDisplay) {
                if ((c.timePassed as number) > min && (c.timePassed as number) < max) {
                    newCampaignsToDisplay.push(c);
                }
            }
            store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: newCampaignsToDisplay });
        }
        else {
            const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;
            for (const campaign of selectedCampaigns) {
                campaign.timePassed = Date.parse(campaign.lastUpdate as string);
            }

            const newCampaignsToDisplay: CampaignModel[] = [];
            for (const c of selectedCampaigns) {
                if ((c.timePassed as number) > min && (c.timePassed as number) < max) {
                    newCampaignsToDisplay.push(c);
                }
            }
            store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: newCampaignsToDisplay });
        }

        //Update state for display
        const startDateStr = new Date(startDate).toLocaleDateString().replace(".", "/");
        const endDateStr = new Date(endDate).toLocaleDateString().replace(".", "/");
        const strToState = `${startDateStr.replace(".", "/")} - ${endDateStr.replace(".", "/")}`;
        this.setState({ datesRange: strToState });


    }

    public changeDisplayForMobileMenu = () => {
        store.dispatch({ type: ActionType.changeDisplayForMobileMenu })
    }

    public createReport = async () => {
        try {
            //Made new report
            const report = new ReportModel();
            const uuid = this.uuid();
            this.setState({ uuid });
            store.dispatch({ type: ActionType.getUuid, payLoad: uuid });
            report.uuid = uuid;

            const allClients: ClientModel[] = store.getState().selectedClients;
            //Push new report all selections
            report.clients = allClients;
            report.campaigns = store.getState().campaignsToDisplay;
            report.products = store.getState().productsToDisplay;

            if (report.campaigns && report.campaigns?.length > 0) {
                report.clients = [];
                const filteredClients: ClientModel[] = [];
                report.campaigns?.map(campaign => {
                    allClients.filter(client => client.clientId === campaign.clientId)
                        .forEach(c => filteredClients.push(c));
                });
                report.clients = filteredClients;
            }


            let formData = new FormData();
            formData.append("state", JSON.stringify(report));
            formData.append("uuid", uuid);
            await axios.post("http://factory-dev.landing-page-media.co.il/create-report/", formData);

            store.dispatch({ type: ActionType.changeDisplayForLinkPopUp });
        }
        catch (err) {
            console.log(err.message);
        }

    }

    public uuid = () => {
        const hashTable = [
            'a', 'b', 'c', 'd', 'e', 'f',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ]
        let uuid = []
        for (let i = 0; i < 35; i++) {
            if (i === 7 || i === 12 || i === 17 || i === 22) {
                uuid[i] = '-'
            } else {
                uuid[i] = hashTable[Math.floor(Math.random() * hashTable.length - 1)]
            }
        }
        return uuid.join('');
    }


    public render() {
        return (
            <div className="filtering-side-menu">

                <IconButton className="close-menu-icon" onClick={this.changeDisplayForMobileMenu}>
                    <HighlightOffIcon />
                </IconButton>
                <span className="reset-filtering" onClick={this.resetFiltering}>איפוס סננים</span>
                <br />
                <DateRangePicker
                    onApply={this.filterByDatesRange}
                >
                    <button className="date-picker-btn">
                        {this.state.datesRange}
                        <span className="date-range-icon">
                            <DateRangeIcon style={{ fontSize: "1.2vw" }} />
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

                        {this.state.productsTypes.map(type =>
                            <label className="container-for-check">
                                <input checked={this.isProductTypeChecked(type.productsTypeId as number)} type="checkbox" onClick={this.filterByProductType(type.productsTypeId as number)} />
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