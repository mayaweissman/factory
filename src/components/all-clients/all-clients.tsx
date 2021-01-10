import React, { Component } from "react";
import { ClientModel } from "../../models/clientModel";
import "./all-clients.css";
import { getAllClients } from "../../data/clients";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";


interface AllClientsState {
    allClients: ClientModel[],
    companies: string[],
    isPopUpShow: boolean,
    clientsToShow: ClientModel[],
    selectedClients: ClientModel[]
}

export class AllClients extends Component<any, AllClientsState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            allClients: [],
            companies: [],
            isPopUpShow: false,
            clientsToShow: [],
            selectedClients: []
        }
    }

    componentDidMount() {
        const allClients: ClientModel[] = getAllClients();
        this.setState({ allClients });
        this.setState({ clientsToShow: allClients });

        const companies: string[] = [];
        companies.push(allClients[0].company as string);
        companies.map(company => {
            allClients.map(client => {
                if (client.company !== company) {
                    companies.push(client.company as string);
                }
            })
        })

        this.setState({ companies });
    }


    public selectClient = (client: ClientModel) => (event: any) => {
        const selectedClients: ClientModel[] = store.getState().selectedClients;
        let isUnique: boolean = true;
        selectedClients.map(selectedClient => {
            if (selectedClient.clientId === client.clientId) {
                isUnique = false;
            }
        })
        if (isUnique) {
            store.dispatch({ type: ActionType.addClientToSelectedClients, payLoad: client });
        }
    }

    public filterByCompany = (companyName: string) => (event: any) => {

        if (companyName === "הכל") {
            const allClients = [...this.state.allClients];
            this.setState({ clientsToShow: allClients });
            return;
        }

        const clientsToShow = this.state.allClients.filter(c => c.company === companyName);
        this.setState({ clientsToShow });
    }


    public render() {
        return (
            <div className="all-clients">


                <div className="filter-area">
                    <div className="left-filter">
                        <span className="filter-by-new">Latest</span>
                        <span className="separate">|</span>
                        <span className="filter-by-name">A <span className="inside-filter">to</span> Z</span>
                    </div>


                    <span onMouseEnter={() => this.setState({ isPopUpShow: true })}
                        onMouseLeave={() => this.setState({ isPopUpShow: false })}
                        className="filter-by-company">דוח לפי חברה</span>

                </div>

                {this.state.clientsToShow.map(client =>
                    <div className="client">
                        <img src={client.clientImageSrc} />
                        <div className="client-info">
                            <button onClick={this.selectClient(client)}
                                className="add-client-btn">
                                <span className="add-inside-text">
                                    &#43;</span>
                            </button>
                            <span>{client.clientName}</span>
                        </div>
                    </div>)}

                <div style={{ display: this.state.isPopUpShow ? "block" : "none" }} className="company-filter-pop-up-menu"
                    onMouseEnter={() => this.setState({ isPopUpShow: true })}
                    onMouseLeave={() => this.setState({ isPopUpShow: false })}>
                    <span onClick={this.filterByCompany("הכל")} className="company-name">כל הלקוחות</span>
                    {this.state.companies.map(company =>
                        <span onClick={this.filterByCompany(company as string)} className="company-name">לקוחות {company}</span>)}
                </div>

            </div>
        )
    }
}