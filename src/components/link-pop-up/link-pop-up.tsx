import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./link-pop-up.css";
import CloseIcon from '@material-ui/icons/Close';
import { Config } from "../../config";
import { config } from "process";
import { ReportModel } from "../../models/reportModel";
import { getAllReports } from "../../data/report";
import axios from "axios";

interface LinkPopUpState {
    url: string,
    uuid: string
}
export class LinkPopUp extends Component<any, LinkPopUpState>{

    public urlInput = React.createRef<HTMLDivElement>();

    public linkRef = React.createRef<HTMLInputElement>();


    public constructor(props: any) {
        super(props);
        this.state = {
            url:  "",
            uuid: ""
        }
    }


    public uuid = () => {
        const hashTable = [
            'a', 'b', 'c', 'd', 'e', 'f',
            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
        ]
        let uuid = []
        for (let i = 0; i < 35; i++) {
            if (i === 7 || i === 12 || i === 17 || i === 22) {
                uuid[i] = '-'
            } else {
                uuid[i] = hashTable[Math.floor(Math.random() * hashTable.length - 1)]
            }
        }
        return uuid.join('');
    }

    public componentDidMount(){
        const uuid =  this.uuid();
        this.setState({uuid});

        let url = Config.serverUrl + "/" + uuid;
        this.setState({url});
    }

    public postToReports = async () => {
        try {
            //Made new report
            const report = new ReportModel();
            const allReports = getAllReports();
            report.reportId = allReports.length + 1;
            const uuid: string = this.state.uuid;
            report.uuid = uuid;

            //Push new report all selections
            report.clients = store.getState().selectedClients;
            report.campaigns = store.getState().campaignsToDisplay;
            report.products = store.getState().productsToDisplay;

            let formData = new FormData();
            formData.append("state", JSON.stringify(report));
            formData.append("uuid", uuid);
            await axios.post("http://factory-dev.landing-page-media.co.il/create-report/", formData);
        }
        catch (err) {
            console.log(err.message);
        }

    }


    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForLinkPopUp });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public copyToClipboard = () => {
        this.postToReports();

        this.linkRef.current?.select();
        document.execCommand("copy");
    };

    public render() {
        return (
            <div className="full-screen-link-conatiner" onClick={this.closePopUp} >
                <div className="small-link-conatiner" onClick={this.stopPropagation}>
                    <button className="close-link-pop-up-btn" onClick={this.closePopUp} ><CloseIcon /></button>

                    <h2 className="link-title">הלינק לשיתוף</h2>
                    <input ref={this.linkRef} className="url-box" value={this.state.url} />

                    <button onClick={this.copyToClipboard} className="copy-link-btn">Copy link</button>

                </div>
            </div>
        )
    }
}