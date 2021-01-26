import React, { ChangeEvent, Component } from "react";
import { Unsubscribe } from "redux";
import { UserModel } from "../../models/userModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./auth-for-watching-only.css";
import axios from "axios";
import { rejects } from "assert";

interface AuthForWatchingOnlyState {
  phoneNumber: string,
  code: string,
  message: string,
  isPhoneLegal: boolean,
  isCodeLegal: boolean,
  isDisplayForBtn: boolean,
  allUsers: UserModel[],
  isSmsSent: boolean
}

export class AuthForWatchingOnly extends Component<any, AuthForWatchingOnlyState> {


  public constructor(props: any) {
    super(props);
    this.state = {
      phoneNumber: "",
      code: "",
      message: "",
      isPhoneLegal: false,
      isCodeLegal: false,
      isDisplayForBtn: false,
      allUsers: [],
      isSmsSent: false
    }
  }

  public async componentDidMount() {
    try {
      const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-users/");
      const allUsers: UserModel[] = response.data.users;
      this.setState({ allUsers });
    }
    catch (err) {
      console.log(err.message);
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

  //Demo functions
  public authPhoneNumber = () => {
    const phoneNumber = this.state.phoneNumber;
    const allUsers = [...this.state.allUsers];
    const user = allUsers.find(u => u.phoneNumber?.toString() === phoneNumber);

    let message = "";
    let isPhoneLegal = false;

    if (user) {
        message = "שלחנו לך הודעה עם קוד בן 4 ספרות";
        isPhoneLegal = true;
        new Promise((resolve, reject) => {
          resolve(() => console.log(""))
        }
  
        )
          .then(() =>
            fetch(
              `https://landing-page-media.co.il/projects/phone-auth/?phone=${phoneNumber}`
            )
          )
          .then((data) => {
            this.setState({ isSmsSent: true });
          }
          )
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
    const code = this.state.code;
    const phoneNumber = this.state.phoneNumber;
    let message = "";
    let isCodeLegal = false;

    if (this.state.isSmsSent) {
      new Promise((resolve, reject) => {
        resolve(console.log(""));
      })
        .then(() =>
          fetch(
            `https://landing-page-media.co.il/projects/phone-auth/code_validation.php?code=${code}&phone=${phoneNumber}`
          )
        )
        .then((response) => response.json())
        .then((data) => {
          if (data.auth) {
            message = "ברוכים הבאים";
            isCodeLegal = true;
            store.dispatch({ type: ActionType.changeAuthForReport });
          } else {
            message = "קוד אינו חוקי";
            this.setState(() => ({ code: "" }));
          }
          this.setState({ message })
          this.setState({ isCodeLegal })
        })
    }
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