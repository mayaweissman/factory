import React, { ChangeEvent, Component } from "react";
import { Unsubscribe } from "redux";
import { UserModel } from "../../models/userModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./auth-for-watching-only.css";
import axios from "axios";
import { rejects } from "assert";
import TextField from '@material-ui/core/TextField';
import InputCode from "../auth/InputCode";
import { Config } from "../../config";
import { Logo } from "../../get-logo";

interface AuthForWatchingOnlyState {
  phoneNumber: string,
  code: string,
  message: string,
  isPhoneLegal: boolean,
  isCodeLegal: boolean,
  isDisplayForBtn: boolean,
  allUsers: UserModel[],
  isSmsSent: boolean,
  title: string,
  user: UserModel,
  isStartTyping: boolean,
  resendMessage: string,
  displayErrorsArea: boolean

}

export class AuthForWatchingOnly extends Component<any, AuthForWatchingOnlyState> {

  private firstInput = React.createRef<HTMLInputElement>();
  private secondInput = React.createRef<HTMLInputElement>();
  private thirdInput = React.createRef<HTMLInputElement>();
  private fourthInput = React.createRef<HTMLInputElement>();


  public constructor(props: any) {
    super(props);
    this.state = {
      phoneNumber: "",
      code: "",
      message: "",
      title: "יש להזין מספר טלפון על מנת להתחבר",
      isPhoneLegal: false,
      isCodeLegal: false,
      isDisplayForBtn: false,
      allUsers: [],
      isSmsSent: false,
      user: new UserModel(),
      isStartTyping: false,
      resendMessage: "",
      displayErrorsArea: false

    }
  }


  public countForResend = () => {
    let count = 30;
    const int = setInterval(() => {
      if (count > 1) {
        count--;
        const message = 'נוכל לשלוח לך את הקוד פעם נוספת בעוד ' + count + " שניות";
        this.setState({ resendMessage: message });
      }
      else if (count === 1) {
        const message = "אפשר לנסות שוב ממש כאן";
        this.setState({ resendMessage: message });
        clearInterval(int);
      }
    }, 1000);
  }


  public async componentDidMount() {
    try {
      const response = await axios.get(Config.serverUrl + "/all-users/");
      const allUsers: UserModel[] = response.data.users;
      this.setState({ allUsers });

    }
    catch (err) {
      console.log(err.message);
    }
  }

  public linsenToKeyPress = (e: any) => {
    e.keyCode === 13 &&
      this.authPhoneNumber();
  }


  public setPhoneNumber = (args: ChangeEvent<HTMLInputElement>) => {
    const phoneNumber = args.target.value;
    const fixedPhone = phoneNumber.replace(/[a-zA-Z$&@#*^%()!]/g, "");
    this.setState({ phoneNumber: fixedPhone });
    this.setState({ message: "" })

  }


  //Demo functions
  public authPhoneNumber = () => {
    const phoneNumber = this.state.phoneNumber;
    const allUsers = [...this.state.allUsers];
    const user = allUsers.find(u => u.phoneNumber?.toString() === phoneNumber);
    

    let message = "";
    let isPhoneLegal = false;
    let displayErrorsArea = false;


    if (user) {
      this.setState({ user });
      message = "";
      isPhoneLegal = true;
      displayErrorsArea = false;
      this.setState({ title: "יש להזין את הקוד שקיבלת" });
      this.countForResend();
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
          this.setState({ displayErrorsArea: false });
        }
        )
        .catch((e) => {
          console.log(e)
        });
    }
    else {
      message = "מספר הטלפון שהוזן אינו מספר מורשה";
      displayErrorsArea = true;
    }

    this.setState({ message });
    this.setState({ isPhoneLegal });
    this.setState({ displayErrorsArea });
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
            store.dispatch({ type: ActionType.loginWatchingMode, payLoad: this.state.user });
          } else {
            message = "קוד אינו חוקי";
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

          <img className="auth-logo" src={Logo.logoSrc} />

          <div className="auth-titles">
            <h1>מערכת תוצר</h1>
          </div>

          {this.state.displayErrorsArea && <div className="errors-area">
            <span className="auth-errors-message">.יש לך אחלה מספר, אבל הוא לא ברשימה שלנו <br />
            ...אולי טעות בספרה ואולי צריך לבקש רשות
            <br />
              <a href={`mailto:naorB@mccann.co.il; advaA@mccann.co.il&subject=אני רוצה אישור לצפייה בתוצרי הפקטורי&body=Pretty%20please...%20My%20number%20is%20${this.state.phoneNumber}`} className="allow-permission">.לבקשת רשות קליק קטן כאן</a>
            </span>
            <img className="error-img" src="./assets/images/error.gif" />

          </div>
          }

          {!this.state.isPhoneLegal &&
            <button onClick={this.authPhoneNumber} className={this.state.isStartTyping ? "send-btn btn-typed" : "send-btn"}><img src="./assets/images/pink_btn_after.svg" /></button>
          }
          <div className={this.state.isStartTyping ? "phone-field typed" : "phone-field"} onFocus={() => this.setState({ isStartTyping: true })}>
            <TextField id="standard-basic"
              label="יש להזין מספר טלפון כדי לצפות בתוצרים"
              color="primary"
              type="tel"
              onChange={this.setPhoneNumber}
              onKeyDown={this.linsenToKeyPress}
              className={this.state.isPhoneLegal ? "out" : ""}
              value={this.state.phoneNumber}
              style={{
                borderBottom: this.state.message === "" ? "2px solid black" : "2px solid red",
              }} />
            {!this.state.isPhoneLegal && <span className="err-message">{this.state.message}</span>}
            <br />
          </div>


          {this.state.isPhoneLegal &&
            <div className="code-area">
              <InputCode
                length={4}
                label="יש להזין את הקוד שקיבלת"
                loading={() => { }}
                onComplete={(code: any) => {
                  this.setState({ code });
                  setTimeout(() => {
                    this.authCode();
                  }, 1000);
                }} />

              <span className="err-message">{this.state.message}</span>
              <span className="re-send-area"><span className="rtl">לא קיבלת sms עם הקוד?</span>
              <br />
                <p className={this.state.resendMessage === "אפשר לנסות שוב ממש כאן" ? "resend-btn" : "resend-timer"}
                  onClick={this.state.resendMessage === "אפשר לנסות שוב ממש כאן" ? this.authPhoneNumber : () => console.log("Not yet")}>{this.state.resendMessage}</p>
              </span>


            </div>
          }





        </div>


      </div >

    )
  }
}