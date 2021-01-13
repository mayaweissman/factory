import React, { Component } from "react";
import { ClientModel } from "../../models/clientModel";
import { ActionType } from "../../redux/actionType";
import { store } from "../../redux/store";
import "./add-client-pop-up.css";
import { getAllClients } from "../../data/clients";
import { CampaignModel } from "../../models/campaignModel";
import { getAllCampaigns } from "../../data/campaigns";
import { getAllProducts } from "../../data/products";
import { ProductModel } from "../../models/productModel";
import CloseIcon from '@material-ui/icons/Close';

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
        const selectedClients = store.getState().selectedClients;
        for (const c of this.state.clientsToAdd) {
            selectedClients.push(c);
        }
        store.dispatch({ type: ActionType.updateSelectedClients, payLoad: selectedClients });

        const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;
        this.state.clientsToAdd.map(client => {
            getAllCampaigns().map(campaign => {
                if (campaign.clientId === client.clientId) {
                    selectedCampaigns.push(campaign);
                }
            })
        })

        store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: selectedCampaigns });

        const selectedProducts: ProductModel[] = store.getState().selectedProducts;
        this.state.clientsToAdd.map(client => {
            getAllProducts().map(product => {
                if (product.clientId === client.clientId) {
                    selectedProducts.push(product);

                }
            })
        })
        store.dispatch({ type: ActionType.getSelectedProducts, payLoad: selectedProducts });

        this.closePopUp();
    }

    public isExist = (clientId: number) => {
        const selectedClients = [...store.getState().selectedClients];
        for(const c of selectedClients){
            if(c.clientId === clientId){
                return true;
            }
        }
        return false;
    }

    public render() {
        return (
            <div className="full-screen-conatiner" onClick={this.closePopUp}>
                <div className="small-conatiner" onClick={this.stopPropagation}>
                    <button className="close-pop-up-btn" onClick={this.closePopUp} ><CloseIcon/></button>
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
                                            onClick={this.addClient(client)} className="pop-up-btn" 
                                            disabled={this.isExist(client.clientId as number)}>
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