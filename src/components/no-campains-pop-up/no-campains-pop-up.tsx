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

    public componentDidMount() {
        setTimeout(() => {
            this.removeNonClientsCampaigns();
        }, 2000);

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
                    ,הלקוחות הבאים הוסרו מהדו"ח
                        <br />
                        :כי וואלה, לא עשינו להם כלום החודש
                        <br />
                    <span>{this.state.nonClientsCampaigns.map(c => {
                        if (this.state.nonClientsCampaigns.indexOf(c) !== (this.state.nonClientsCampaigns.length - 1 )) {
                            return <span>{c.clientName + ", "}</span>
                        }
                        else{
                            return <span>{c.clientName + " "}</span>
                        }
                    }
                    )}
                    </span>
                    <br />
                    <br />
                    <button className="sababa-btn" onClick={this.closePopUp}>סבבה</button>
                    <br />

                </div>
            </div>
        )
    }

}

