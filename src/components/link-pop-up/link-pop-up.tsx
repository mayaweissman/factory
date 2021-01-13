import React, { Component } from "react";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./link-pop-up.css";
import CloseIcon from '@material-ui/icons/Close';


interface LinkPopUpState {
    url: string
}
export class LinkPopUp extends Component<any,LinkPopUpState>{

    public urlInput = React.createRef<HTMLDivElement>();

    public constructor(props:any){
        super(props);
        this.state = {
            url: "https://some-address-on-some-place.com/herecomesuuid"
        }
    }


    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForLinkPopUp });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public copyToClipboard = ()=> {
        document.execCommand("copy");
    }

    public render() {
        return (
            <div className="full-screen-link-conatiner" onClick={this.closePopUp} >
                <div className="small-link-conatiner" onClick={this.stopPropagation}>
                    <button className="close-link-pop-up-btn" onClick={this.closePopUp} ><CloseIcon/></button>

                    <h2 className="link-title">הלינק לשיתוף</h2>
                    <input className="url-box" value={this.state.url}/>

                    <button className="copy-link-btn">Copy link</button>
                   
                </div>
            </div>
        )
    }
}