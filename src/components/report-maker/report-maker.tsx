import React, { Component } from "react";
import { Campaigns } from "../campaigns/campaigns";
import { FilteringSideMenu } from "../filtering-side-menu/filtering-side-menu";
import { TopCampaignsNav } from "../top-campaigns-nav/top-campaigns-nav";
import "./report-maker.css";
import { store } from "../../redux/store";
import { Unsubscribe } from "redux";
import { LinkPopUp } from "../link-pop-up/link-pop-up";

interface ReportMakerState {
    isScroll: boolean,
    display: boolean,
    windowWidth: number

}

export class ReportMaker extends Component<any, ReportMakerState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            isScroll: false,
            display: store.getState().isLinksPopUpShow,
            windowWidth: 0

        }

        this.unsubscribeStore = store.subscribe(() => {
            const display = store.getState().isLinksPopUpShow;
            this.setState({ display });
        })
    }


    public componentDidMount() {

        window.addEventListener('scroll', (e) => {
            const YPosition = window.pageYOffset;
            if (YPosition === 0) {
                this.setState({ isScroll: false });
            }
            else {
                this.setState({ isScroll: true });
            }
        });

        const windowWidth = window.screen.width;
        this.setState({ windowWidth });
        console.log(windowWidth);
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }

    public render() {
        return (
            <div className="report-maker">
                <main>
                    <div className="header">
                        <TopCampaignsNav isScroll={this.state.isScroll} />
                    </div>

                    <Campaigns />
                </main>

                <aside>
                    {this.state.windowWidth > 600 &&
                        <FilteringSideMenu isOnReport={false} />
                    }


                    {this.state.windowWidth <= 600 && store.getState().isMobileMenuShow &&
                        <FilteringSideMenu isOnReport={false} />
                    }
                </aside>
                {this.state.display && <LinkPopUp />}

            </div>

        )
    }
}