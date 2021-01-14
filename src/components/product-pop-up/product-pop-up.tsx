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



interface ProductPopUpProps {
    product: ProductModel,
    campaign: CampaignModel
}


export class ProductPopUp extends Component<ProductPopUpProps>{

    public constructor(props: ProductPopUpProps) {
        super(props);
    }


    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForProductsPopUp });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public getProductType = (productTypeId: number) => {
        const productType = getProductsTypes().filter(t => t.productsTypeId === productTypeId);
        return productType[0].nameForSingle;
    }

    public render() {
        return (
            <div className="full-screen-product-conatiner" onClick={this.closePopUp} >
                <div className="small-product-conatiner" onClick={this.stopPropagation}>

                    <div className="left-area">
                        <div className="grid-product">
                            <img className="product-img" src={this.props.product.images?.img1} />

                        </div>
                    </div>

                    <div className="right-area">
                        <div className="titlesInRightArea">
                            <div className="right-in-titles">
                                <div className="product-rate">{this.props.product.successRates} %</div>
                            </div>
                            <div className="left-in-titles">
                                <h1 className="type-title">{this.getProductType(this.props.product.productTypeId as number)}</h1>
                                <p className="campaign-name-area">{this.props.campaign.campaignName}</p>
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