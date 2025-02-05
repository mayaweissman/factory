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
import RestoreIcon from '@material-ui/icons/Restore';
import { setTimeout } from "timers";
import { Config } from "../../config";
import { IsOnFactory } from "../../is-on-factory";

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
    productsTypesToDisplay: ProductsType[],
    showDatesError: boolean,
    isOnMobile: boolean,
    report: ReportModel,
    nonCampaignsClients: ClientModel[],
    buckets: string[]
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
            productsTypesToDisplay: [],
            selectedProducts: store.getState().selectedProducts,
            allProducts: [],
            report: store.getState().currentReport,
            productsTypes: [],
            datesRange: store.getState().datesRange,
            showDatesError: false,
            isOnMobile: false,
            nonCampaignsClients: [],
            buckets: []
        }

        //Subscribe to store
        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            const selectedCampaigns = store.getState().selectedCampaigns;
            const selectedProducts = store.getState().selectedProducts;
            const campaignsToDisplay = store.getState().campaignsToDisplay;
            const productsToDisplay = store.getState().productsToDisplay;
            const datesRange = store.getState().datesRange;
            this.setState({ selectedClients });
            this.setState({ selectedCampaigns });
            this.setState({ selectedProducts });
            this.setState({ campaignsToDisplay });
            this.setState({ productsToDisplay });
            this.setState({ datesRange });
        })
    }

    public async componentDidMount() {
        try {
            const bodyClass = document.body.classList[0];
            if (bodyClass === "mobile") {
                this.setState({ isOnMobile: true });
            }


            //Load all products types from server
            const response = await axios.get(Config.serverUrl + "/all-products-types/");
            const productsTypes: ProductsType[] = response.data.productsTypes;
            this.setState({ productsTypes });

            setTimeout(async () => {

                //Filtering only relevant products types to choosen products (from seelcted clients)
                const selectedProducts: ProductModel[] = store.getState().selectedProducts;
                const productsTypesToDisplay: ProductsType[] = [];
                const allExistingTypes: ProductsType[] = [];
                selectedProducts.map(p =>
                    productsTypes.map(t => {
                        if (t.productsTypeId === p.productTypeId) {
                            allExistingTypes.push(t);
                        }
                    }));

                allExistingTypes.map(t => {
                    let isUnique = true;
                    productsTypesToDisplay.map(d => {
                        if (d.productsTypeId === t.productsTypeId) {
                            isUnique = false;
                        }
                    })
                    if (isUnique) {
                        productsTypesToDisplay.push(t);
                    }
                });
                this.setState({ productsTypesToDisplay });

                //Get all products from server
                const responseForProducts = await axios.get(Config.serverUrl + "/all-products");
                const allProducts: ProductModel[] = responseForProducts.data.products;
                this.setState({ allProducts });

                //Filtering only relevant buckets to choosen products (from seelcted clients)
                const allBuckets: string[] = [];
                selectedProducts.map(p => allBuckets.push(p.bucket as string));

                const buckets: string[] = [];
                allBuckets.map(b => {
                    let isUnique = true;
                    buckets.map(ub => {
                        if (b === ub) {
                            isUnique = false;
                        }
                    })
                    if (isUnique && b) {
                        buckets.push(b);
                    }
                })
                this.setState({ buckets });

            }, 3000);
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
        store.dispatch({ type: ActionType.getDatesRanges, payLoad: "- - / - - / - -" });
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

    //Display only products who match bucket by filtering menu 
    public filterByBucket = (bucket: string) => (event: any) => {
        const productsToDisplay: ProductModel[] = [...store.getState().productsToDisplay];
        const duplictes = productsToDisplay.filter(p => p.bucket === bucket);
        for (const p of duplictes) {
            const index = productsToDisplay.indexOf(p);
            productsToDisplay.splice(index, 1);
        }

        if (duplictes.length === 0) {
            this.state.allProducts.filter(p => p.bucket === bucket).
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

    //Checked/unchecked bucket type who choosen on any time
    public isBucketChecked = (bucket: string) => {
        const products: ProductModel[] = [...this.state.productsToDisplay];
        const p = products.find(product => product.bucket === bucket);
        if (p !== undefined) {
            return true;
        }
        return false;
    }

    //Return if product type is Disabled - Meaning no products match on page
    public isDisabled = (productTypeId: number) => {
        let productsToDisplay: ProductModel[] = [];
        if (store.getState().productsToDisplay.length > 0) {
            productsToDisplay = store.getState().productsToDisplay;
        }
        else if (store.getState().campaignsToDisplay.length === 0) {
            const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;
            const products: ProductModel[] = [];
            this.state.allProducts.map(p => {
                selectedCampaigns.map(c => {
                    if (p.campaignId === c.campaignId) {
                        products.push(p);
                    }
                })
            })
            productsToDisplay = products;
        }
        else {
            const selectedCampaigns: CampaignModel[] = store.getState().campaignsToDisplay;
            const products: ProductModel[] = [];
            this.state.allProducts.map(p => {
                selectedCampaigns.map(c => {
                    if (p.campaignId === c.campaignId) {
                        products.push(p);
                    }
                })
            })
            productsToDisplay = products;
        }
        const p = productsToDisplay.find(p => p.productTypeId === productTypeId);
        if (p) {
            return true;
        }
        return false;

    }

    //Return if bucket is Disabled - Meaning no products match on page. Only on Digital system.
    public isBucketDisabled = (bucket: string) => {
        let productsToDisplay: ProductModel[] = [];
        if (store.getState().productsToDisplay.length > 0) {
            productsToDisplay = store.getState().productsToDisplay;
        }
        else if (store.getState().campaignsToDisplay.length === 0) {
            const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;
            const products: ProductModel[] = [];
            this.state.allProducts.map(p => {
                selectedCampaigns.map(c => {
                    if (p.campaignId === c.campaignId) {
                        products.push(p);
                    }
                })
            })
            productsToDisplay = products;
        }
        else {
            const selectedCampaigns: CampaignModel[] = store.getState().campaignsToDisplay;
            const products: ProductModel[] = [];
            this.state.allProducts.map(p => {
                selectedCampaigns.map(c => {
                    if (p.campaignId === c.campaignId) {
                        products.push(p);
                    }
                })
            })
            productsToDisplay = products;
        }
        const p = productsToDisplay.find(p => p.bucket === bucket);
        if (p) {
            return true;
        }
        return false;

    }

    //Return if campaign is Disabled - Meaning no campaigns match on page
    public isCampgaignDisabled = (campaignId: number) => {
        const campaignsToDisplay: CampaignModel[] = store.getState().campaignsToDisplay;
        const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;

        if (campaignsToDisplay.length > 0) {
            const c = campaignsToDisplay.find(campaign => campaign.campaignId === campaignId);
            if (c) {
                return true;
            }
        }
        else {
            const c = selectedCampaigns.find(campaign => campaign.campaignId === campaignId);
            if (c) {
                return true;
            }
        }

        return false;

    }

    //Dispaly pop up with clients that choosen and have no campaigns on system (before and after filtering), If exists.  
    public isNonCampaignsClientsExists = () => {
        const selectedClients: ClientModel[] = store.getState().selectedClients;
        const campaignsToDisplay: CampaignModel[] = store.getState().campaignsToDisplay;
        const nonCampaignsClients: ClientModel[] = [];


        selectedClients.map(client => {
            let isEmpty = true;
            campaignsToDisplay.map(campaign => {
                if (campaign.clientId === client.clientId) {
                    isEmpty = false;
                }
            });
            if (isEmpty) {
                nonCampaignsClients.push(client);
            }
        })

        this.setState({ nonCampaignsClients });
        if (nonCampaignsClients.length > 0) {
            store.dispatch({ type: ActionType.changeDisplayForNoCampaignsPopUp, payLoad: true });
            store.dispatch({ type: ActionType.getNonCampaignsClients, payLoad: nonCampaignsClients });
        }
    }


    //Function will use after connecting to UMBI system.
    public filterByLatest = () => {
        const campaigns: CampaignModel[] = store.getState().campaignsToDisplay;
        for (const c of campaigns) {
            c.timePassed = Date.parse(c.lastUpdate as string)
        }
        campaigns.sort((a, b) => ((a.timePassed as number) > (b.timePassed as number)) ? 1 : -1);
        this.setState({ campaignsToDisplay: campaigns });
    }

    //Get start & end dates from user and display only campaigns that created on that range.
    public filterByDatesRange = (event: any, picker: any) => {
        const startDate = picker.startDate._d;
        const endDate = picker.endDate._d;

        const min = Date.parse(startDate);
        const max = Date.parse(endDate);

        this.setState({ showDatesError: false });

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
            if (newCampaignsToDisplay.length === 0) {
                store.dispatch({ type: ActionType.updateNoCampaignsAfterFiltering, payLoad: true });
                return;
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
            if (newCampaignsToDisplay.length === 0) {
                store.dispatch({ type: ActionType.updateNoCampaignsAfterFiltering, payLoad: true });
                return;
            }
            store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: newCampaignsToDisplay });
        }

        //Update state for display
        const startDateStr = new Date(startDate).toLocaleDateString().replace(".", "/");
        const endDateStr = new Date(endDate).toLocaleDateString().replace(".", "/");
        const strToState = `${endDateStr.replace(".", "/")} - ${startDateStr.replace(".", "/")}`;
        this.setState({ datesRange: strToState });
        store.dispatch({ type: ActionType.getDatesRanges, payLoad: strToState });

        this.isNonCampaignsClientsExists();
    }


    //Reset dates display on input and display report pop up.
    public createReport = () => {

        if (this.state.datesRange === "- - / - - / - -") {
            this.setState({ showDatesError: true });
        }
        else {
            store.dispatch({ type: ActionType.changeDisplayForLinkPopUp })

        }

    }


    public render() {
        return (
            <div className="filtering-side-menu">

                <span className="reset-filtering" onClick={this.resetFiltering}>איפוס סננים</span>
                <br />

                {this.props.isOnReport && !this.state.isOnMobile &&
                    <span className="dates-on-filtering">דו"ח תוצרים לתאריכים: <span className="underline">{this.state.report.datesOnReport}</span></span>
                }

                {!this.props.isOnReport &&
                    <>
                        <DateRangePicker
                            onApply={this.filterByDatesRange}
                            initialSettings={{ showDropdowns: true }}
                        >
                            <button className="date-picker-btn"
                                style={{ borderBottom: this.state.showDatesError ? "1px solid #f14646" : "1px solid white" }}>
                                {this.state.datesRange}
                                <span className="date-range-icon">
                                    <DateRangeIcon style={{ fontSize: "1.2vw" }} />
                                </span>
                            </button>
                        </DateRangePicker>
                        <br />
                        {this.state.showDatesError && <span className="dates-range-err">לא נבחרו תאריכים להצגה</span>}
                    </>
                }
                <br />
                {!this.props.isOnReport &&

                    <div className="history-field" onClick={() => store.dispatch({ type: ActionType.changeDisplayForReportsPopUp })}>
                        <IconButton>
                            <RestoreIcon style={{ color: "white" }} />
                            <span className="history-title">היסטוריית הדוחות שלי</span>
                        </IconButton>
                    </div>
                }
                <div className={this.props.isOnReport ? "scrolling-area scroliing-on-report" : "scrolling-area"}>
                    <div className="campaigns-filtering-area">
                        <span className="campaign-filtering-title">קמפיין</span>
                        <br />
                        <div className="campaigns-titles">

                            {this.state.selectedCampaigns.map(campaign =>
                                <label className={this.isCampgaignDisabled(campaign.campaignId as number) ? "container-for-check" : "container-for-check disabled"}>
                                    <input
                                        disabled={this.isCampgaignDisabled(campaign.campaignId as number) ? false : true}
                                        checked={this.isCampaignChecked(campaign.campaignId as number)} onClick={this.filterByCapmaign(campaign)} type="checkbox" />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title" dangerouslySetInnerHTML={{ __html: campaign.campaignName as string }}>
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
                                <label className={this.isDisabled(type.productsTypeId as number) ? "container-for-check" : "container-for-check disabled"}>
                                    <input disabled={this.isDisabled(type.productsTypeId as number) ? false : true}
                                        checked={this.isProductTypeChecked(type.productsTypeId as number)} type="checkbox" onClick={this.filterByProductType(type.productsTypeId as number)} />
                                    <span className="checkmark"></span>
                                    <span className="campaign-name-title">
                                        {type.nameForMany}
                                    </span>
                                </label>
                            )}
                        </div>
                    </div>

                    {!IsOnFactory.IsOnFactory &&
                        <div className="buckets-filtering-area">
                            <span className="buckets-filtering-title">Bucket</span>
                            <br />
                            <div className="buckets-titles">

                                {this.state.buckets.map(b =>
                                    <label className={this.isBucketDisabled(b as string) ? "container-for-check" : "container-for-check disabled"}>
                                        <input disabled={this.isBucketDisabled(b as string) ? false : true}
                                            checked={this.isBucketChecked(b as string)} type="checkbox" onClick={this.filterByBucket(b as string)} />
                                        <span className="checkmark"></span>
                                        <span className="campaign-name-title">
                                            {b}
                                        </span>
                                    </label>
                                )}
                            </div>
                        </div>
                    }
                </div>

                {!this.props.isOnReport &&
                    <button disabled={this.state.selectedClients.length === 0 || this.state.showDatesError}
                        className="url-sharing-area"
                        onClick={this.createReport}>
                        <span>הפקת דו"ח תוצרים</span>
                    </button>
                }


            </div>


        )
    }
}