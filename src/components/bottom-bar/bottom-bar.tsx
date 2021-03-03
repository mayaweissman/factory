import React, { Component } from "react";
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
                <div className={this.state.isPopUpOpen ? "bottom-bar-area open-bar" : "bottom-bar-area close-bar"}>
                    {!this.state.isPopUpOpen && <img className="funnel-icon" src="assets/images/funnel.svg" onClick={() => this.setState({ isPopUpOpen: true })} />}
                    {this.state.isPopUpOpen && <img className="funnel-icon" src="assets/images/down-icon.svg" onClick={() => this.setState({ isPopUpOpen: false })} />}
                    <div className={this.state.isPopUpOpen ? "wave opened-bar-bottom" : "wave close-bar-bottom"}></div>
                    <span className="filtering-title">סינון</span>

                </div>
        )
    }
}