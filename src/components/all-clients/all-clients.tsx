import React, { Component } from "react";
import { ClientModel } from "../../models/clientModel";
import "./all-clients.css";
import { getAllClients } from "../../data/clients";
import { store } from "../../redux/store";
import { ActionType } from "../../redux/actionType";
import { Unsubscribe } from "redux";
import AddIcon from '@material-ui/icons/Add';
import axios from "axios";

interface AllClientsState {
    allClients: ClientModel[],
    companies: string[],
    isPopUpShow: boolean,
    clientsToShow: ClientModel[],
    selectedClients: ClientModel[]
}

export class AllClients extends Component<any, AllClientsState>{

    private unsubscribeStore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            allClients: [],
            companies: [],
            isPopUpShow: false,
            clientsToShow: [],
            selectedClients: store.getState().selectedClients
        }

        this.unsubscribeStore = store.subscribe(() => {
            const selectedClients = store.getState().selectedClients;
            this.setState({ selectedClients });
        })
    }

    async componentDidMount() {
        try {
            const response = await axios.get("http://factory-dev.landing-page-media.co.il/all-clients/");
            const allClients: ClientModel[] = response.data.clients;
            this.setState({ allClients });
            this.setState({ clientsToShow: allClients });

            store.dispatch({ type: ActionType.getAllClients, payLoad: allClients });
        }
        catch (err) {
            console.log(err.message);
        }

    }


    //Display latest campaigns who changed first  
    public filterByLatest = () => {
        const allClients = [...this.state.allClients];
        for (const client of allClients) {
            client.timePassed = Date.parse(client.lastUpdate as string)
        }
        allClients.sort((a, b) => ((a.timePassed as number) > (b.timePassed as number)) ? -1 : 1);
        this.setState({ clientsToShow: allClients });
    }

    public componentWillUnmount(): void {
        this.unsubscribeStore();
    }



    //Add client to clients top list
    public selectClient = (client: ClientModel) => (event: any) => {
        const selectedClients: ClientModel[] = store.getState().selectedClients;
        let isUnique: boolean = true;
        selectedClients.map(selectedClient => {
            if (selectedClient.clientId === client.clientId) {
                isUnique = false;
                store.dispatch({ type: ActionType.removeClient, payLoad: client.clientId });
                return;
            }
        })
        if (isUnique) {
            let selectedClients = [...this.state.selectedClients];
            selectedClients.push(client);
            this.setState({ selectedClients });
            store.dispatch({ type: ActionType.addClientToSelectedClients, payLoad: client });
        }
    }


    //Filter companies by company in Mccann
    public filterByCompany = (companyName: string) => (event: any) => {

        if (companyName === "הכל") {
            const allClients = [...this.state.allClients];
            this.setState({ clientsToShow: allClients });
            return;
        }

        const clientsToShow = this.state.allClients.filter(c => c.company === companyName);
        this.setState({ clientsToShow });
    }

    public filterAlphabetically = () => {
        const clientsByAlphabetically = this.state.allClients.map(c => c.clientName).sort();
        let clientsToShow: ClientModel[] = [];
        for (let i = 0; i <= clientsByAlphabetically.length; i++) {
            for (const client of this.state.allClients) {
                if (client.clientName === clientsByAlphabetically[i]) {
                    clientsToShow.push(client);
                }
            }
        }
        this.setState({ clientsToShow });
    }



    public render() {
        return (
            <div className="all-clients">

                <div className="filter-area">
                    <div className="left-filter">
                        <img className="filter-by-date-img" src="./assets/images/filter_by_date.svg" />
                        <span className="filter-by-new" onClick={this.filterByLatest}>Latest</span>
                        <span className="separate">|</span>
                        <span className="filter-by-name" onClick={this.filterAlphabetically}>A <span className="inside-filter">to</span> Z</span>
                    </div>


                    <span onMouseEnter={() => this.setState({ isPopUpShow: true })}
                        onMouseLeave={() => this.setState({ isPopUpShow: false })}
                        className="filter-by-company">דוח לפי חברה</span>

                </div>

                {this.state.clientsToShow.length === 0 &&
                    <div className="no-clients-area">
                        <h1>אין לקוחות להצגה</h1>
                    </div>
                }

                {this.state.clientsToShow.length !== 0 && this.state.clientsToShow.map(client =>
                    <div className="client">
                        <img src={client.clientImageSrc} onClick={this.selectClient(client)} />
                        <div className="client-info">

                            <button className={this.state.selectedClients.filter(c => c.clientId === client.clientId).length === 0 ? "btn-before" : "btn-after"}>
                                <AddIcon className="plus-icon" onClick={this.selectClient(client)} />
                            </button>
                            <span>{client.clientName}</span>
                        </div>
                    </div>)}

             

                <div style={{ display: this.state.isPopUpShow ? "block" : "none" }} className="company-filter-pop-up-menu"
                    onMouseEnter={() => this.setState({ isPopUpShow: true })}
                    onMouseLeave={() => this.setState({ isPopUpShow: false })}>
                    <span onClick={this.filterByCompany("הכל")} className="company-name">כל הלקוחות</span>
                    <span onClick={this.filterByCompany("Mccann")} className="company-name">לקוחות Mccann</span>
                    <span onClick={this.filterByCompany("MRM")} className="company-name">לקוחות MRM</span>
                    <span onClick={this.filterByCompany("Valley")} className="company-name">לקוחות Valley</span>
                    <span onClick={this.filterByCompany("UMD")} className="company-name">לקוחות UMD</span>

                </div>

            </div>
        )
    }
}