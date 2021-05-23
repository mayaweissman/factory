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
import { ProductPopUp } from "../product-pop-up/product-pop-up";
import { NavLink } from "react-router-dom";
import Aos from "aos";
import "aos/dist/aos.css";
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import axios from "axios";
import { ProductsType } from "../../models/productsTypeModel";
import { Config } from "../../config";
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed'


interface ReportMakerState {
    selectedClients: ClientModel[],
    selectedCampaigns: CampaignModel[],
    selectedProducts: ProductModel[]
    productsToDisplay: ProductModel[],
    campaignsToDisplay: CampaignModel[],
    display: boolean,
    productToPopUp: ProductModel,
    productTypes: ProductsType[]
    campignToPopUp: CampaignModel,
    showLoader: boolean,
    isOnMobile: boolean,
    isScroll: boolean,
    isMobileMenuOpen: boolean,
    isFinishLoading: boolean,
    nonCampaignsClients: ClientModel[]
}




export class Campaigns extends Component<any, ReportMakerState>{

    private unsubscribeStore: Unsubscribe;
    private filteringMenuRef = React.createRef<HTMLDivElement>();


    public constructor(props: any) {
        super(props);
        this.state = {
            selectedClients: store.getState().selectedClients,
            selectedCampaigns: store.getState().selectedCampaigns,
            selectedProducts: store.getState().selectedProducts,
            campaignsToDisplay: store.getState().campaignsToDisplay,
            productsToDisplay: store.getState().productsToDisplay,
            display: store.getState().isPopUpShow,
            productToPopUp: new ProductModel(),
            campignToPopUp: new CampaignModel(),
            productTypes: [],
            isOnMobile: false,
            showLoader: false,
            isScroll: false,
            isMobileMenuOpen: false,
            isFinishLoading: false,
            nonCampaignsClients: []
        }

        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            const selectedCampaigns = store.getState().selectedCampaigns;
            const selectedProducts = store.getState().selectedProducts;
            const campaignsToDisplay = store.getState().campaignsToDisplay;
            const productsToDisplay = store.getState().productsToDisplay;
            const display = store.getState().isProductsPopUpShow;
            const isMobileMenuOpen = store.getState().isMobileMenuShow;
            this.setState({ selectedClients });
            this.setState({ selectedCampaigns });
            this.setState({ selectedProducts });
            this.setState({ campaignsToDisplay });
            this.setState({ productsToDisplay });
            this.setState({ isMobileMenuOpen });
            this.setState({ display });

        })
    }


    public async componentDidMount() {
        try {


            const bodyClass = document.body.classList[0];
            if (bodyClass === "mobile") {
                this.setState({ isOnMobile: true });
            }

            window.addEventListener('scroll', () => {
                const scroll = document.documentElement.scrollTop;
                if (scroll > 600) {
                    this.setState({ isScroll: true });
                }
                else {
                    this.setState({ isScroll: false });
                }
            })


            this.setState({ showLoader: true });
            setTimeout(async () => {

                const response = await axios.get(Config.serverUrl + "/all-campaigns/");
                const allCampaigns: CampaignModel[] = response.data.campaigns;
                Aos.init({ duration: 1000 });

                const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;

                if (store.getState().selectedCampaigns.length === 0) {
                    this.state.selectedClients.map(client => {
                        allCampaigns.map(campaign => {
                            if (campaign.clientId === client.clientId) {
                                selectedCampaigns.push(campaign);
                            }
                        })
                    })
                    this.setState({ selectedCampaigns });
                    store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: selectedCampaigns });
                    // store.dispatch({ type: ActionType.updateCampaignsToDisplay, payLoad: selectedCampaigns });
                }
                this.setState({ showLoader: false });

                if (store.getState().selectedProducts.length === 0) {
                    const responseForProducts = await axios.get(Config.serverUrl + "/all-products");

                    const allProductsFromDb: ProductModel[] = responseForProducts.data.products;

                    const selectedProducts: ProductModel[] = [];
                    selectedCampaigns.map(campaign => {
                        allProductsFromDb.map(product => {
                            if (product.campaignId === campaign.campaignId) {
                                selectedProducts.push(product);

                            }
                        })
                    });

                    this.setState({ selectedProducts });
                    store.dispatch({ type: ActionType.getSelectedProducts, payLoad: selectedProducts });
                    // store.dispatch({ type: ActionType.updateProductsToDisplay, payLoad: selectedProducts });
                    this.setState({ isFinishLoading: true });
                }


                const responseForTypes = await axios.get(Config.serverUrl + "/all-products-types/");
                const productsTypes: ProductsType[] = responseForTypes.data.productsTypes;
                this.setState({ productTypes: productsTypes });

                this.isNonCampaignsClientsExists();
            }, 1500);

        }
        catch (err) {
            console.log(err.message);
        }
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public getProductTypeName = (productTypeId: number) => {

        for (const type of this.state.productTypes) {
            if (type.productsTypeId === productTypeId) {
                return type.nameForSingle;
            }
        }

    }

    public isNonCampaignsClientsExists = () => {
        const selectedClients: ClientModel[] = store.getState().selectedClients;
        const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;
        const campaignsToDisplay: CampaignModel[] = store.getState().campaignsToDisplay;
        const nonCampaignsClients: ClientModel[] = [];

        if (campaignsToDisplay.length === 0) {
            selectedClients.map(client => {
                let isEmpty = true;
                selectedCampaigns.map(campaign => {
                    if (campaign.clientId === client.clientId) {
                        isEmpty = false;
                    }
                });
                if (isEmpty) {
                    nonCampaignsClients.push(client);
                }
            })
        }
        else {
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
        }
        this.setState({ nonCampaignsClients });
        if (nonCampaignsClients.length > 0) {
            store.dispatch({ type: ActionType.changeDisplayForNoCampaignsPopUp, payLoad: true });
            store.dispatch({ type: ActionType.getNonCampaignsClients, payLoad: nonCampaignsClients });
        }

    };

    //Return colors for light button by success rates (green/yellow/red)
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


    //Product is automaticlly sending to Pop Up by props 
    public setProductToDisplayInPopUp = (product: ProductModel, campaign: CampaignModel) => (event: any) => {
        this.setState({ productToPopUp: product });
        this.setState({ campignToPopUp: campaign });
        store.dispatch({ type: ActionType.changeDisplayForProductsPopUp });
    }


    //If campaign have product to disaply - show his name on title
    public isProductsToDisplayOnCampaign = (campaignId: number) => {
        if (this.state.productsToDisplay.length !== 0) {
            const productsToDisplay = this.state.productsToDisplay.filter(p => p.campaignId === campaignId);
            if (productsToDisplay.length === 0) {
                return false;
            }
            return true;

        }
        else {
            return true;
        }
    }

    public getClientName = (clientId: number) => {
        const clients = [...this.state.selectedClients];
        const client = clients.find(c => c.clientId === clientId);
        return client?.clientName as string;

    }

    public getImageSrc = (product: ProductModel)=>{
        let imgSrc = "";
        const images = product.images;
        if(images?.img1){
            imgSrc = images.img1;
        }
        else if(!images?.img1 && images?.img2){
            imgSrc = images?.img2;
        }
        else if(!images?.img1 && !images?.img2 && images?.img3){
            imgSrc = images?.img3;
        }
        return imgSrc;
    }


    public render() {
        return (
            <div className="campaigns" style={{ position: this.state.isOnMobile && this.state.isMobileMenuOpen ? "fixed" : "relative" }}>
                <div className="campaigns-left-filter" ref={this.filteringMenuRef}>
                    <img className="campaigns-filter-by-success-img" src="./assets/images/filter_by_date.svg" />
                    <span className="campaigns-filter-by-high">Highest first</span>
                    <span className="campaigns-separate">|</span>
                    <span className="campaigns-filter-by-low">Lowest first</span>

                </div>
                {this.state.campaignsToDisplay.length === 0 && this.state.selectedCampaigns.length === 0 &&
                    <img className="loader" src="./assets/images/loading.gif"/>
                    }

                {


                    this.state.campaignsToDisplay.length !== 0 && this.state.campaignsToDisplay?.map(campaign =>
                        <div className="client-in-campaigns">

                            {this.isProductsToDisplayOnCampaign(campaign.campaignId as number) && <h2 dangerouslySetInnerHTML={{ __html: campaign.campaignName + " " + this.getClientName(campaign.clientId as number) as string }}></h2>}
                            <div className="grid">

                                {this.state.productsToDisplay.length === 0 && this.state.selectedProducts?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                    <div className="campaign" data-aos={this.state.isOnMobile ? "zoom-in" : "zoom-in"}>
                                        <img className="campaign-img" src={this.getImageSrc(product as ProductModel)} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
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
                                    <div className="campaign" data-aos={this.state.isOnMobile ? "zoom-in" : "zoom-in"}>
                                        <img className="campaign-img" src={this.getImageSrc(product as ProductModel)} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
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
                    )

                }

                {this.state.campaignsToDisplay.length === 0 && this.state.selectedCampaigns?.map(campaign =>
                    <div className="client-in-campaigns">
                        {this.isProductsToDisplayOnCampaign(campaign.campaignId as number) && <h2 dangerouslySetInnerHTML={{ __html: campaign.campaignName + " " + this.getClientName(campaign.clientId as number) as string }}></h2>}
                        <div className="grid">
                            {this.state.productsToDisplay.length === 0 && this.state.selectedProducts?.filter(product => product.campaignId === campaign.campaignId).map(product =>
                                <div className="campaign" data-aos={this.state.isOnMobile ? "zoom-in" : "zoom-in"}>
                                    <img className="campaign-img" src={this.getImageSrc(product as ProductModel)} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
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
                                <div className="campaign" data-aos={this.state.isOnMobile ? "zoom-in" : "zoom-in"}>
                                    <img className="campaign-img" src={this.getImageSrc(product as ProductModel)} onClick={this.setProductToDisplayInPopUp(product, campaign)} />
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


                {this.state.isScroll && <img className="up-btn" onClick={() =>scrollIntoViewIfNeeded(this.filteringMenuRef.current as HTMLDivElement,{behavior: 'smooth', scrollMode: 'if-needed'})} src="/assets/images/pink_btn_after.svg" />}
                {/* {this.state.isScroll && <img className="up-btn" onClick={() => this.filteringMenuRef.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })} src="/assets/images/pink_btn_after.svg" />} */}
                {this.state.display && <ProductPopUp campaign={this.state.campignToPopUp} product={this.state.productToPopUp} />}
            </div>
        )
    }
}