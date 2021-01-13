import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./link-pop-up.css";
import CloseIcon from '@material-ui/icons/Close';
import { Config } from "../../config";
import { config } from "process";


interface LinkPopUpState {
    url: string
}
export class LinkPopUp extends Component<any, LinkPopUpState>{

    public urlInput = React.createRef<HTMLDivElement>();

    public linkRef = React.createRef<HTMLInputElement>();


    public constructor(props: any) {
        super(props);
        this.state = {
            url: Config.serverUrl + "/213276a8-8eb2-4710-b97d-9d67e9aeaae9"
        }
    }

    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForLinkPopUp });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public copyToClipboard = () => {
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