import React, { ChangeEvent, Component } from "react";
import { Unsubscribe } from "redux";
import { UserModel } from "../../models/userModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./auth.css";
import axios from "axios";
import { rejects } from "assert";

interface AuthState {
  phoneNumber: string,
  code: string,
  message: string,
  isPhoneLegal: boolean,
  isCodeLegal: boolean,
  isDisplayForBtn: boolean,
  allUsers: UserModel[],
  isSmsSent: boolean
}

export class Auth extends Component<any, AuthState> {


  public constructor(props: any) {
    super(props);
    this.state = {
      phoneNumber: "",
      code: "",
      message: "הזינו את מספר הטלפון שלכם כדי להיכנס למערכת",
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
    console.log(code)
  }

  //Demo functions
  public authPhoneNumber = () => {
    const phoneNumber = this.state.phoneNumber;
    const allUsers = [...this.state.allUsers];
    const user = allUsers.find(u => u.phoneNumber?.toString() === phoneNumber);
    console.log(user);

    let message = "";
    let isPhoneLegal = false;

    if (user) {
      if (user.permission === "יצירת דוחות") {
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
        message = "סליחה, אנחנו לא מכירים";
      }
    }
    else {
      message = "סליחה, אנחנו לא מכירים";
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
            store.dispatch({ type: ActionType.changeAuth });
            this.props.history.push('/home');
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

          <div className="auth-titles">
            <h1>Welcome</h1>
            <span className="sub-title">{this.state.message}</span>
          </div>


          {!this.state.isPhoneLegal &&
            <button onClick={this.authPhoneNumber} className="send-btn"><img src="./assets/images/pink_btn_after.svg" /></button>
          }
          {!this.state.isPhoneLegal &&
            <input onChange={this.setPhoneNumber} placeholder="אנא הזן מספר טלפון" type="tel" className="phone-box" />
          }
          <br />

          {this.state.isPhoneLegal &&
            <div className="code-area">
              <input onChange={this.setCode} className="code-num-box-visible" />
              <input className={this.state.code.toString()[0] ? "code-num-box-after" : "code-num-box-before"}
                value={this.state.code.toString()[0] ? this.state.code.toString()[0] : ""} />
              <input className={this.state.code.toString()[1] ? "code-num-box-after" : "code-num-box-before"}
                value={this.state.code.toString()[1] ? this.state.code.toString()[1] : ""} />
              <input className={this.state.code.toString()[2] ? "code-num-box-after" : "code-num-box-before"}
                value={this.state.code.toString()[2] ? this.state.code.toString()[2] : ""} />
              <input className={this.state.code.toString()[3] ? "code-num-box-after" : "code-num-box-before"}
                value={this.state.code.toString()[3] ? this.state.code.toString()[3] : ""} />
            </div>
          }


          <br />
          {this.state.isDisplayForBtn &&
            <button onClick={this.authCode} className="send-btn"><img src="./assets/images/pink_btn_after.svg" /></button>
          }
          <br />


        </div>


      </div>

    )
  }
}