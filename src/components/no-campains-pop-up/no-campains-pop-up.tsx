import React, { Component } from "react";
import "./no-campains-pop-up.css";
import CloseIcon from '@material-ui/icons/Close';
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import { ClientModel } from "../../models/clientModel";
import { Unsubscribe } from "redux";

interface NoCampaignsPopUpState {
    nonClientsCampaigns: ClientModel[]
}


export class NoCampaignsPopUp extends Component<any, NoCampaignsPopUpState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            nonClientsCampaigns: store.getState().nonCampaignsClients
        }

        this.unsubscribeStore = store.subscribe(() => {
            const nonClientsCampaigns = store.getState().nonCampaignsClients;
            this.setState({ nonClientsCampaigns });

        })
    }


    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }


    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForNoCampaignsPopUp, payLoad: false });
    }

    public componentDidMount(){
        setTimeout(() => {
            this.removeNonClientsCampaigns();
        }, 2000);
        setTimeout(() => {
            store.dispatch({ type: ActionType.changeDisplayForNoCampaignsPopUp, payLoad: false });
        }, 6000);

    }

    public removeNonClientsCampaigns = () => {
        this.state.nonClientsCampaigns.map(c => {
            store.dispatch({ type: ActionType.removeClient, payLoad: c.clientId });
        })
    }


    public render() {
        return (
            <div className="no-campaigns-pop-up">
                <div className="inside-no-campaigns-pop-up">
                    <button className="close-link-pop-up-no-campaigns-btn" onClick={this.closePopUp} ><CloseIcon /></button>
                    <span>,היי</span>
                    <br/>
                   :שמנו לב שללקוחות הבאים
                        <br />
                    <span>{this.state.nonClientsCampaigns.map(c =>
                        <span className="non-campaigns-client-name">{c.clientName + " "}</span>
                    )}
                        <br />אין קמפיינים רלוונטים להצגה
                    </span>
                    <br />
                    <span>!לכן הסרנו אותם עבורך</span>
                    <br />

                </div>
            </div>
        )
    }

}

