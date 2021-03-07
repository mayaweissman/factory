import React, { Component } from "react";
import { FilteringSideMenu } from "../filtering-side-menu/filtering-side-menu";
import "./bottom-bar.css";

interface BottomBarState {
    isPopUpOpen: boolean
}

export class BottomBar extends Component<any, BottomBarState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            isPopUpOpen: false
        }
    }


    public render() {
        return (
            <>
                <div className={this.state.isPopUpOpen ? "lightbox-bg" : "close-lightbox"}></div>
                <div className={this.state.isPopUpOpen ? "bottom-bar-area open-bar" : "bottom-bar-area close-bar"}>
                    {!this.state.isPopUpOpen && <img className="funnel-icon" src="./assets/images/funnel.svg" onMouseDown={() => this.setState({ isPopUpOpen: true })} />}
                    {this.state.isPopUpOpen && <img className="funnel-icon" src="./assets/images/down-icon.svg" onMouseDown={() => this.setState({ isPopUpOpen: false })} />}
                    <div className={this.state.isPopUpOpen ? "wave opened-bar-bottom" : "wave close-bar-bottom"} onMouseDown={()=>this.setState({isPopUpOpen: this.state.isPopUpOpen ? false : true})}></div>
                    <span style={{display: this.state.isPopUpOpen? "none" : "block"}} className="filtering-title">סינון</span>
                    <div className={this.state.isPopUpOpen ? "opened-filtering-menu-area" : "closed-filtering-menu-area"}>
                        <FilteringSideMenu isOnReport={true} />
                    </div>
                </div>
            </>
        )
    }
}