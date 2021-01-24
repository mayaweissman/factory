import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./product-pop-up.css";
import { ProductModel } from "../../models/productModel";
import CloseIcon from '@material-ui/icons/Close';
import { ProductsType } from "../../models/productsTypeModel";
import { getProductsTypes } from "../../data/products-types";
import { CampaignModel } from "../../models/campaignModel";
import ProgressBar from '@ramonak/react-progress-bar';
import axios from "axios";


interface ProductPopUpProps {
    product: ProductModel,
    campaign: CampaignModel,
}

interface ProductPopUpState {
    images: string[]
}

export class ProductPopUp extends Component<ProductPopUpProps, ProductPopUpState>{

    public constructor(props: ProductPopUpProps) {
        super(props);
        this.state = {
            images: []
        }
    }


    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForProductsPopUp });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public getProductType =async (productTypeId: number) => {
        try{
            const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-products-types/");
            const productsTypes:ProductsType[]= response.data.productsTypes;
            if (productTypeId) {
                const productType = productsTypes.filter(t => t.productsTypeId === productTypeId);
                return productType[0].nameForSingle;
            }

        }
        catch(err){
            console.log(err.message);
        }
        
    }

    public componentDidMount() {
        if (!this.props.product) {
            this.closePopUp();
        }
        const images: any[] = [];
        let productImages = this.props.product.images;
        if (productImages) {
            Object.values(productImages).map(i => {
                images.push(i);
            })
           
        }
        this.setState({ images });
    }

    public render() {
        return (
            <div className="full-screen-product-conatiner" onClick={this.closePopUp} >
                <div className="small-product-conatiner" onClick={this.stopPropagation}>


                    <div className="left-area">
                        <div className="grid-product">
                            {this.state.images.map(i =>
                                <img className="product-img" src={i} />
                            )}

                        </div>
                    </div>

                    <div className="right-area">
                        <div className="titlesInRightArea">
                            <div className="right-in-titles">
                                <div className="product-rate">{this.props.product?.successRates} %</div>
                            </div>
                            <div className="left-in-titles">
                                <h1 className="type-title">{this.props.product && this.getProductType(this.props.product?.productTypeId as number)}</h1>
                                <p className="campaign-name-area">{this.props.campaign?.campaignName}</p>
                            </div>
                        </div>


                        <div className="bars-area">
                            <p className="bar-title">Best practice media</p>
                            <p className="bar-rate">65 %</p>
                            <ProgressBar height="7px" borderRadius="0" bgcolor="#FFDB48" completed={65} />
                        </div>

                        <div className="bars-area">
                            <p className="bar-title">Best practice media</p>
                            <p className="bar-rate">95 %</p>
                            <ProgressBar height="7px" borderRadius="0" bgcolor="#1CE5A2" completed={95} />
                        </div>

                        <div className="bars-area">
                            <p className="bar-title">Best practice media</p>
                            <p className="bar-rate">40 %</p>
                            <ProgressBar height="7px" borderRadius="0" bgcolor="#E4002B" completed={40} />
                        </div>

                    </div>
                    <button className="close-product-pop-up-btn" onClick={this.closePopUp} ><CloseIcon /></button>

                </div>
            </div>
        )
    }
}