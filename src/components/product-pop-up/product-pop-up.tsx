import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./product-pop-up.css";
import { ProductModel } from "../../models/productModel";
import CloseIcon from '@material-ui/icons/Close';


interface ProductPopUpProps {
    product: ProductModel
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

    public render() {
        return (
            <div className="full-screen-product-conatiner" onClick={this.closePopUp} >
                <div className="small-product-conatiner" onClick={this.stopPropagation}>
                   <img src={this.props.product.imageSrc}/>
                    <button className="close-product-pop-up-btn" onClick={this.closePopUp} ><CloseIcon/></button>
                   
                </div>
            </div>
        )
    }
}