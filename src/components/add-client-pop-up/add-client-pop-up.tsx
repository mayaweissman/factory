import React, { Component } from "react";
import { ClientModel } from "../../models/clientModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./add-client-pop-up.css";
import { getAllClients } from "../../data/clients";

interface AddClientPopUpState {
    allClients: ClientModel[],
    companies: string[],
    clientsToAdd: ClientModel[]
}

export class AddClientPopUp extends Component<any, AddClientPopUpState>{

    private companies: string[] = [];

    public constructor(props: any) {
        super(props);
        this.state = {
            allClients: store.getState().allClients,
            companies: [],
            clientsToAdd: []
        }
    }

    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForPopUp, payLoad: true });
    }

    public componentDidMount() {
        const allClients = getAllClients();
        this.setState({ allClients });

        let companies: string[] = [];
        allClients.map(client => {
            const duplicate = companies.find(c => c === client.company);
            if (!duplicate) {
                companies.push(client.company);
            }
        })
        this.setState({ companies });
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }

    public addClient = (client: ClientModel) => (event: any) => {
        const clientsToAdd = [...this.state.clientsToAdd];
        for (const c of clientsToAdd) {
            if (c.clientId === client.clientId) {
                const index = clientsToAdd.indexOf(c);
                clientsToAdd.splice(index, 1);
                this.setState({ clientsToAdd });
                return;
            }
        }

        clientsToAdd.push(client);
        this.setState({ clientsToAdd });

        console.log(this.state.clientsToAdd);

    }

    public isSelcected = (clientId: number) => {
        for (const c of this.state.clientsToAdd) {
            if (c.clientId === clientId) {
                return true;
            }
        }
        return false;
    }

    public addClientsToReport = () => {
        store.dispatch({type: ActionType.updateSelectedClients, payLoad: this.state.clientsToAdd});
        this.closePopUp();
    }

    public render() {
        return (
            <div className="full-screen-conatiner" onClick={this.closePopUp} style={{ display: this.props.display }}>
                <div className="small-conatiner" onClick={this.stopPropagation}>
                    <img className="close-pop-up-btn" src="/assets/images/X.svg" onClick={this.closePopUp} />
                    <div className="clients-in-pop-up">
                        {this.state.companies?.map(company =>
                            <div className="company">
                                <span className="company-name">לקוחות {company}</span>
                                <div className="client-in-pop-up">
                                    {this.state.allClients?.map(client =>
                                        client.company === company &&
                                        <button style={{
                                            backgroundColor: this.isSelcected(client.clientId as number) ? "black" : "",
                                            color: this.isSelcected(client.clientId as number) ? "white" : ""
                                        }}
                                            onClick={this.addClient(client)} className="pop-up-btn">
                                            {client.clientName}
                                        </button>

                                    )}
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>
                                    <button className="pop-up-btn">
                                        Some
                                        </button>
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>
                                    <button className="pop-up-btn">
                                        Some
                                        </button>
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>
                                    <button className="pop-up-btn">
                                        Some
                                        </button>
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>
                                    <button className="pop-up-btn">
                                        Some
                                        </button>
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>
                                    <button className="pop-up-btn">
                                        Some
                                        </button>
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>
                                    <button className="pop-up-btn">
                                        Some
                                        </button>
                                    <button className="pop-up-btn">
                                        Some company
                                        </button>

                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={this.addClientsToReport} disabled={this.state.clientsToAdd.length === 0} className="add-client-in-pop-up">הוספה</button>
                </div>
            </div>
        )
    }
}