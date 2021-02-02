import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./reports-history-pop-up.css";
import CloseIcon from '@material-ui/icons/Close';
import { ReportModel } from "../../models/reportModel";
import axios from "axios";
import IconButton from '@material-ui/core/IconButton';
import VisibilityIcon from '@material-ui/icons/Visibility';
import LinkIcon from '@material-ui/icons/Link';
import { Config } from "../../config";
import { CampaignModel } from "../../models/campaignModel";
import { ProductModel } from "../../models/productModel";

interface ReportsHistoryPopUpState {
    reports: ReportModel[]
}

export class ReportsHistoryPopUp extends Component<any, ReportsHistoryPopUpState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            reports: []
        }
    }

    public async componentDidMount() {
        try {
            const user = store.getState().user;
            const response = await axios.get("http://factory-dev.landing-page-media.co.il/reports-by-user/?userId=" + user.userId);
            const reportsStr = response.data;
            if (typeof (reportsStr) === 'object') {
                const reports: ReportModel[] = [];
                reports.push(reportsStr);
                this.setState({ reports });
            }
            else {
                const fixedJson = "[" + reportsStr.replace(/}{/g, "},{") + "]";
                const reports: ReportModel[] = JSON.parse(fixedJson);
                this.setState({ reports });
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }

    public openLinkPopUp = (report: ReportModel) => (event: any) => {
        store.dispatch({type: ActionType.changeDisplayForReportsPopUp});
        store.dispatch({type: ActionType.changeDisplayForReportsLinkPopUp});
        store.dispatch({type: ActionType.getReportToCopy, payLoad: report});
    }

    public watchReport = (report: ReportModel) => async (event: any) => {
        store.dispatch({ type: ActionType.updateSelectedClients, payLoad: report.clients });
        store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: report.campaigns });
        store.dispatch({ type: ActionType.getSelectedProducts, payLoad: report.products });
        store.dispatch({ type: ActionType.getDatesRanges, payLoad: report.datesOnReport });

        const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-campaigns/");
        const allCampaigns: CampaignModel[] = response.data.campaigns;

        if (report.campaigns?.length === 0) {
            const selectedCampaigns: CampaignModel[] = [];
            report.clients?.map(client => {
                allCampaigns.map(campaign => {
                    if (campaign.clientId === client.clientId) {
                        selectedCampaigns.push(campaign);
                    }
                })
            })
            store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: selectedCampaigns });
        }


        if (report.products?.length === 0) {
            const responseForProducts = await axios.get("http://factory-dev.landing-page-media.co.il/all-products");
            const allProductsFromDb: ProductModel[] = responseForProducts.data.products;
            const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;

            const selectedProducts: ProductModel[] = [];
            selectedCampaigns.map(campaign => {
                allProductsFromDb.map(product => {
                    if (product.campaignId === campaign.campaignId) {
                        selectedProducts.push(product);

                    }
                })
            });

            store.dispatch({ type: ActionType.getSelectedProducts, payLoad: selectedProducts });
        }
        store.dispatch({ type: ActionType.changeDisplayForReportsPopUp });
    }

    public render() {
        return (
            <div className="full-screen-link-conatiner">
                <div className="small-reports-conatiner">
                    <button className="close-reports-pop-up-btn"
                        onClick={() => store.dispatch({ type: ActionType.changeDisplayForReportsPopUp })} >
                        <CloseIcon />
                    </button>
                    <h2>היסטוריית הדוחות שלי</h2>
                    <table>
                        <thead>
                            <tr>
                                <th className="name-th">שם הדו"ח</th>
                                <th className="dates-th">תאריכים</th>
                                <th className="watch-th">צפייה</th>
                                <th className="link-th"> קישור</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.reports.length !== 0 && this.state.reports.map(r =>
                                <tr className="white">
                                    <td>{r.reportName}</td>
                                    <td>{r.datesOnReport}</td>
                                    <td>
                                        <IconButton onClick={this.watchReport(r)}>
                                            <VisibilityIcon style={{ fontSize: 25 }} />
                                        </IconButton>
                                    </td>
                                    <td>
                                        <IconButton onClick={this.openLinkPopUp(r as ReportModel)}>
                                            <LinkIcon style={{ fontSize: 25 }} />
                                        </IconButton>
                                    </td>

                                </tr>
                            )}
                        </tbody>
                    </table>


                </div>
            </div>
        )
    }
}