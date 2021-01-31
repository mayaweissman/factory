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
  isSmsSent: boolean,
  title: string,
  user: UserModel
}

export class Auth extends Component<any, AuthState> {

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
      user: new UserModel()
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

    if (user) {
      this.setState({user});
      if (user.permission === "יצירת דוחות") {
        message = "";
        isPhoneLegal = true;
        this.setState({ title: "יש להזין את הקוד שקיבלת" })
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
        message = "מספר הטלפון שהוזן אינו מספר מורשה";
      }
    }
    else {
      message = "מספר הטלפון שהוזן אינו מספר מורשה";
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
          console.log(data);
          console.log(code);
          if (data.auth) {
            message = "ברוכים הבאים";
            isCodeLegal = true;
            store.dispatch({ type: ActionType.loginEditingMode , payLoad: this.state.user});
            this.props.history.push('/home');
          } else {
            message = "קוד אינו חוקי";
          }
          this.setState({ message })
          this.setState({ isCodeLegal })
        })
    }
  }


  public setCode = (args: ChangeEvent<HTMLInputElement>) => {
    const number = args.target.value;
    let currentCode = this.state.code;
    const code = currentCode += number;

    const fixedCode = code.replace(/[a-zA-Z$&@#*^%()!]/g, "");
    this.setState({ isDisplayForBtn: true });
    this.setState({ code: fixedCode });

    switch (code.length) {
      case 1:
        this.secondInput.current?.focus();
        break;
      case 2:
        this.thirdInput.current?.focus();
        break;
      case 3:
        this.fourthInput.current?.focus();
        break;
      case 4:
        setTimeout(() => {
          this.authCode();
        }, 500); break;

      default:
        this.secondInput.current?.focus();
    }

  }

  public render() {
    return (
      <div className="auth">

        <div className="auth-box">

          <img className="auth-logo" src="/assets/images/logo_factory.svg" />

          <div className="auth-titles">
            <h1>מערכת תוצר</h1>
            <span className="sub-title">{this.state.title}</span>
          </div>


          {!this.state.isPhoneLegal &&
            <button onClick={this.authPhoneNumber} className="send-btn"><img src="./assets/images/pink_btn_after.svg" /></button>
          }
          <div className="phone-field">
            <span className="err-message">{this.state.message}</span>
            <input onChange={this.setPhoneNumber} onKeyDown={this.linsenToKeyPress}
              style={{ border: this.state.message === "" ? "2px solid black" : "2px solid red" }}
              placeholder="אנא הזן מספר טלפון" type="tel" className={this.state.isPhoneLegal ? "phone-box out" : "phone-box"}
              value={this.state.phoneNumber} />

            <br />
          </div>


          {this.state.isPhoneLegal &&
            <div className="code-area">

              <input autoFocus className={this.state.code.toString()[0] ? "code-num-box-after" : "code-num-box-before"}
                maxLength={1} onChange={this.setCode} ref={this.firstInput} />
              <input className={this.state.code.toString()[1] ? "code-num-box-after" : "code-num-box-before"}
                maxLength={1} onChange={this.setCode} ref={this.secondInput} />
              <input className={this.state.code.toString()[2] ? "code-num-box-after" : "code-num-box-before"}
                maxLength={1} onChange={this.setCode} ref={this.thirdInput} />
              <input className={this.state.code.toString()[3] ? "code-num-box-after" : "code-num-box-before"}
                maxLength={1} onChange={this.setCode} ref={this.fourthInput} />

            </div>
          }





        </div>


      </div>

    )
  }
}