import React, { Component } from "react";
import { Campaigns } from "../campaigns/campaigns";
import { FilteringSideMenu } from "../filtering-side-menu/filtering-side-menu";
import { TopCampaignsNav } from "../top-campaigns-nav/top-campaigns-nav";
import "./report-maker.css";

interface ReportMakerState {
    isScroll: boolean
}

export class ReportMaker extends Component<any, ReportMakerState>{


    public constructor(props: any) {
        super(props);
        this.state = {
            isScroll: false
        }
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
                    <FilteringSideMenu />
                </aside>

            </div>

        )
    }
}