import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { FilteringSideMenu } from "../filtering-side-menu/filtering-side-menu";
import "./bottom-bar.css";

interface BottomBarState {
    isPopUpOpen: boolean,
    menuHeight: number

}

export class BottomBar extends Component<any, BottomBarState>{


    public constructor(props: any) {
        super(props);
        this.state = {
            isPopUpOpen: false,
            menuHeight: 52

        }
    }

    // public setMenuHeight = (event: any) => {
    //     const clientY = event.touches[0].clientY;
    //     const windowHeight = window.screen.height;
    //     const height = windowHeight - clientY;

    //     if (height < 550 && height > 52) {
    //         this.setState({ menuHeight: height });
    //     }
    //     if (height >= 550) {
    //         this.setState({ isPopUpOpen: true });
    //         store.dispatch({ type: ActionType.changeDisplayForMobileMenu, payLoad: true });
    //     }
    //     else if (height < 400) {
    //         this.setState({ isPopUpOpen: false });
    //         store.dispatch({ type: ActionType.changeDisplayForMobileMenu, payLoad: false });

    //     }
    // }
    // public fixHeight = (event: any) => {
    //     const height = this.state.menuHeight;
    //     let fixedHeight: number = height as number;

    //     if (height < 350) {
    //         const int = setInterval(() => {
    //             if (fixedHeight > 52) {
    //                 fixedHeight -= 2;
    //                 this.setState({ menuHeight: fixedHeight })
    //             }
    //         }, 1);

    //         if (fixedHeight <= 52) {
    //             clearInterval(int);
    //         }
    //         this.setState({ isPopUpOpen: false });
    //         store.dispatch({ type: ActionType.changeDisplayForMobileMenu, payLoad: false });

    //     }
    //     else {

    //         const int = setInterval(() => {
    //             if (fixedHeight < 550) {
    //                 fixedHeight += 2;
    //                 this.setState({ menuHeight: fixedHeight })
    //             }
    //         }, 1);

    //         if (fixedHeight >= 550) {
    //             clearInterval(int);
    //         }
    //         this.setState({ isPopUpOpen: true });
    //         store.dispatch({ type: ActionType.changeDisplayForMobileMenu, payLoad: true });

    //     }
    // }

    public openBar = () => {
        this.setState({ isPopUpOpen: true });
        store.dispatch({ type: ActionType.changeDisplayForMobileMenu, payLoad: true });
    }

    public closeBar = () => {
        this.setState({ isPopUpOpen: false });
        store.dispatch({ type: ActionType.changeDisplayForMobileMenu, payLoad: false });
    }


    public render() {
        return (
            <>
                <div className={this.state.isPopUpOpen ? "lightbox-bg" : "close-lightbox"}></div>
                <div className={this.state.isPopUpOpen ? "bottom-bar-area open-bar" : "bottom-bar-area close-bar"}>

                    <div className={this.state.isPopUpOpen ? "wave opened-bar-bottom" : "wave close-bar-bottom"}
                        onMouseUp={this.state.isPopUpOpen ? this.closeBar : this.openBar } onTouchMove={this.state.isPopUpOpen ? this.closeBar : this.openBar}>
                        {!this.state.isPopUpOpen && <img className="funnel-icon" src="./assets/images/funnel.svg" />}
                        {this.state.isPopUpOpen && <img className="funnel-icon" src="./assets/images/down-icon.svg"/>}
                        {/*    
                    <div className="wave" style={{ bottom: `${this.state.menuHeight}px` }} draggable={true} onTouchEnd={this.fixHeight} onTouchMove={this.setMenuHeight}>
                    {!this.state.isPopUpOpen && <img className="funnel-icon" src="./assets/images/funnel.svg" onTouchEnd={this.fixHeight} onTouchMove={this.setMenuHeight} />}
                    {this.state.isPopUpOpen && <img className="funnel-icon" src="./assets/images/down-icon.svg" onTouchEnd={this.fixHeight} onTouchMove={this.setMenuHeight} />} */}
                    </div>
                    <span style={{ display: this.state.isPopUpOpen ? "none" : "block" }} className="filtering-title">סינון</span>
                    <div className={this.state.isPopUpOpen ? "opened-filtering-menu-area" : "closed-filtering-menu-area"}>
                        <FilteringSideMenu isOnReport={true} />
                    </div>
                </div>
            </>
        )
    }
}