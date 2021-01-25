import React, { ChangeEvent, Component } from "react";
import { Unsubscribe } from "redux";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./auth.css";

interface AuthState {
    phoneNumber: string,
    code: string,
    message: string,
    isPhoneLegal: boolean,
    isCodeLegal: boolean,
    isDisplayForBtn: boolean
}

export class Auth extends Component<any, AuthState> {


    public constructor(props: any) {
        super(props);
        this.state = {
            phoneNumber: "",
            code: "",
            message: "",
            isPhoneLegal: false,
            isCodeLegal: false,
            isDisplayForBtn: false
        }
    }

    public setPhoneNumber = (args: ChangeEvent<HTMLInputElement>) => {
        const phoneNumber = args.target.value;
        this.setState({ phoneNumber });
    }

    public setCode = (args: ChangeEvent<HTMLInputElement>) => {
        const code = args.target.value;
        this.setState({ isDisplayForBtn: true });
        this.setState({ code });
    }

    public isCodeLegal(){
        new Promise((resolve, reject) => {
            resolve(console.log("Clicked"));
          })
            .then(() =>
              fetch(
                `https://landing-page-media.co.il/projects/phone-auth/code_validation.php?code=${"1234"}&phone=${"0504751786"}`
              )
            )
            .then((response) => response.json())
            .then((data) => {
              if (data.auth) {
               console.log("Success");
              } else {
                alert("הקוד אינו תקין, אנא נסה שנית");
                // this.setState(() => ({ code: "" }));
              }
            })
        
    }

    //Demo functions
    public authPhoneNumber = () => {
        
        const demoAnswer = "0501234567";

        let message = "";
        let isPhoneLegal = false;

        if (this.state.phoneNumber === demoAnswer) {
            message = "שלחנו לך הודעה עם קוד בן 4 ספרות";
            isPhoneLegal = true;
            new Promise((resolve, reject) =>
            resolve(console.log("Resolve"))
          )
            .then(() =>
              fetch(
                `https://landing-page-media.co.il/projects/phone-auth/?phone=0504751786`
              )
            )
            .then((data) => console.log(data.json()))
            .then(()=>this.isCodeLegal())
            .catch((e) => {
              console.log(e)
            });
        
        }
        else {
            message = "מספר טלפון אינו מזוהה";
        }
        this.setState({ message })
        this.setState({ isPhoneLegal })
    }

    public authCode = () => {
        const demoCode = "1234";

        let message = "";
        let isCodeLegal = false;

        if (this.state.code === demoCode) {
            message = "ברוכים הבאים";
            isCodeLegal = true;
            store.dispatch({ type: ActionType.changeAuth });
            this.props.history.push('/home');
        }
        else {
            message = "קוד אינו חוקי";
        }
        this.setState({ message })
        this.setState({ isCodeLegal })
    }

    public render() {
        return (
            <div className="auth">

                <div className="auth-box">

                    <img className="auth-logo" src="/assets/images/logo_factory.svg" />
                    <h1>אימות</h1>

                    <button onClick={this.authPhoneNumber} className="send-btn">שלח</button>
                    <input onChange={this.setPhoneNumber} placeholder="אנא הזן מספר טלפון" type="tel" className="phone-box" />
                    <br />

                    <input onChange={this.setCode} style={{ display: this.state.isPhoneLegal ? "inline-block" : "none" }} placeholder="אנא הזן את הקוד שנשלח" type="text" className="code-box" />
                    <br />
                    {this.state.isDisplayForBtn &&
                        <button onClick={this.authCode} style={{ display: this.state.isPhoneLegal ? "inline-block" : "none" }} className="auth-code-btn">אמת</button>
                    }
                    <br />

                    <span className="message">{this.state.message}</span>

                </div>


            </div>

        )
    }
}