import React, { ChangeEvent, Component } from "react";
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
import axios from "axios";
import { Config } from "../../config";
import KeyboardArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';

interface AddClientPopUpState {
    allClients: ClientModel[],
    companies: string[],
    clientsToAdd: ClientModel[],
    nonCampaignsClients: ClientModel[],
    searchingLevel: number,
    searchingOptions: ClientModel[],
    clientsToDisplay: ClientModel[]
}

export class AddClientPopUp extends Component<any, AddClientPopUpState>{

    public constructor(props: any) {
        super(props);
        this.state = {
            allClients: store.getState().allClients,
            companies: [],
            clientsToAdd: [],
            nonCampaignsClients: [],
            searchingLevel: 1,
            searchingOptions: [],
            clientsToDisplay: []
        }
    }

    public closePopUp = () => {
        store.dispatch({ type: ActionType.changeDisplayForPopUp, payLoad: true });
    }

    async componentDidMount() {
        try {

            //Load all clients from serv er
            const reponse = await axios.get(Config.serverUrl + "/all-clients/");
            const allClients: ClientModel[] = reponse.data.clients;
            this.setState({ allClients });

            //Remove dupliactes
            let companies: string[] = [];
            allClients.map(client => {
                const duplicate = companies.find(c => c === client.company);
                if (!duplicate) {
                    companies.push(client.company as string);
                }
            })
            this.setState({ companies });
        }
        catch (err) {
            console.log(err.message);
        }
    }

    public stopPropagation = (e: any) => {
        e.stopPropagation();
    }


    //Add client to 'Selected Clients' on specific component. Client will actually be added after user click on 'add' button. 
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
        store.dispatch({ type: ActionType.getDatesRanges, payLoad: "- - / - - / - -" });

    }

    //Change client color on screen if already selected (prevent double choose)
    public isSelcected = (clientId: number) => {
        for (const c of this.state.clientsToAdd) {
            if (c.clientId === clientId) {
                return true;
            }
        }
        return false;
    }

    //Add clients to selected clients on report maker - After user click on 'add' button
    public addClientsToReport = async () => {
        try {

            const selectedClients = store.getState().selectedClients;
            for (const c of this.state.clientsToAdd) {
                selectedClients.push(c);
            }
            store.dispatch({ type: ActionType.updateSelectedClients, payLoad: selectedClients });
            store.dispatch({ type: ActionType.updateClientsToDisplay, payLoad: [] });

            const response = await axios.get(Config.serverUrl + "/all-campaigns/");
            const allCampaignsInDb: CampaignModel[] = response.data.campaigns;

            //Load relevant campaigns for choosen clients
            const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;
            this.state.clientsToAdd.map(client => {
                allCampaignsInDb.map(campaign => {
                    if (campaign.clientId === client.clientId) {
                        selectedCampaigns.push(campaign);
                    }
                })
            })

            const allProductsResponse = await axios.get(Config.serverUrl + "/all-products");
            const allProducts: ProductModel[] = allProductsResponse.data.products;

            store.dispatch({ type: ActionType.getSelectedCampaigns, payLoad: selectedCampaigns });

            //Load relevant products for choosen clients
            const selectedProducts: ProductModel[] = store.getState().selectedProducts;

            this.state.clientsToAdd.map(client => {
                allProducts.map(product => {
                    if (+(product.clientId as number) === client.clientId) {
                        selectedProducts.push(product);

                    }
                })
            })

            store.dispatch({ type: ActionType.getSelectedProducts, payLoad: selectedProducts });


        }
        catch (err) {
            console.log(err.message);
        }
        finally {
            this.isNonCampaignsClientsExists();
            this.closePopUp();

        }
    }

    //Disabled client if already selected 
    public isExist = (clientId: number) => {
        const selectedClients = [...store.getState().selectedClients];
        for (const c of selectedClients) {
            if (c.clientId === clientId) {
                return true;
            }
        }
        return false;
    }

    //Dispaly pop up with clients that choosen and have no campaigns on system (before and after filtering), If exists.  
    public isNonCampaignsClientsExists = () => {
        const selectedClients: ClientModel[] = store.getState().selectedClients;
        const selectedCampaigns: CampaignModel[] = store.getState().selectedCampaigns;
        const campaignsToDisplay: CampaignModel[] = store.getState().campaignsToDisplay;
        const nonCampaignsClients: ClientModel[] = [];

        if (campaignsToDisplay.length === 0) {
            selectedClients.map(client => {
                let isEmpty = true;
                selectedCampaigns.map(campaign => {
                    if (campaign.clientId === client.clientId) {
                        isEmpty = false;
                    }
                });
                if (isEmpty) {
                    nonCampaignsClients.push(client);
                }
            })
        }
        else {
            selectedClients.map(client => {
                let isEmpty = true;
                campaignsToDisplay.map(campaign => {
                    if (campaign.clientId === client.clientId) {
                        isEmpty = false;
                    }
                });
                if (isEmpty) {
                    nonCampaignsClients.push(client);
                }
            })
        }
        this.setState({ nonCampaignsClients });
        if (nonCampaignsClients.length > 0) {
            store.dispatch({ type: ActionType.changeDisplayForNoCampaignsPopUp, payLoad: true });
            store.dispatch({ type: ActionType.getNonCampaignsClients, payLoad: nonCampaignsClients });
        }

    };

    //Not on use. Can toggle it by enable searching option.
    public searchOnClients = (args: ChangeEvent<HTMLInputElement>) => {
        const search = args.target.value;
        if (search) {

            const searchingOptions: ClientModel[] = [];
            for (const c of this.state.allClients) {
                if (c.clientName?.toLowerCase().includes(search)) {
                    searchingOptions.push(c)
                }
                else if (c.clientName?.toUpperCase().includes(search)) {
                    searchingOptions.push(c)
                }
            }
            this.setState({ searchingOptions });
        }
        else {
            this.setState({ searchingOptions: [] })
        }
    }

    public setClientBySearch = (client: ClientModel) => (event: any) => {
        const clientsToDisplay: ClientModel[] = [];
        clientsToDisplay.push(client);
        this.setState({ clientsToDisplay });
        this.setState({ searchingOptions: [] });
        this.setState({ searchingLevel: 1 });
    }

    public isCompanyHaveClients = (company: string) => {
        let isCompanyHaveClients = false;
        if (this.state.clientsToDisplay.length > 0) {
            for (const c of this.state.clientsToDisplay) {
                if (c.company === company) {
                    isCompanyHaveClients = true;
                }
            }
        }
        else {
            for (const c of this.state.allClients) {
                if (c.company === company) {
                    isCompanyHaveClients = true;
                }
            }
        }
        return isCompanyHaveClients;
    }

    public resetSearch = () => {
        this.setState({ searchingLevel: 1 });
        this.setState({ searchingOptions: [] });
        this.setState({ clientsToDisplay: [] });
    }

    public render() {
        return (
            <div className="full-screen-conatiner" onClick={this.closePopUp}>
                <div className="small-conatiner" onClick={this.stopPropagation}>
                    {/*Almost ready searching area for pop up*/}

                    {/* 
                    <div className="searching-area">
                        <input
                            className={this.state.searchingLevel === 1 ? "search-box before" : "search-box after"}
                            type="text" onInput={this.searchOnClients} />
                        <button className="search-btn"
                            onClick={this.state.searchingLevel === 1
                                ? () => { this.setState({ searchingLevel: 2 }) }
                                : this.resetSearch}>
                        {this.state.searchingLevel === 1 && <span><KeyboardArrowLeftIcon />חפש</span>}
                        {this.state.searchingLevel === 2 && <span>כל הלקוחות</span>}
                              </button>

                        {this.state.searchingOptions.length > 0 && <div className="searching-options">
                            {this.state.searchingOptions.map(c =>
                                <div className="client-on-search" onClick={this.setClientBySearch(c)}>
                                    {c.clientName}

                                </div>)}
                        </div>
                        }
                    </div> */}
                    <button className="close-pop-up-btn" onClick={this.closePopUp} ><CloseIcon /></button>
                    <div className="clients-in-pop-up">
                        {this.state.companies?.map(company =>
                            this.isCompanyHaveClients(company) && <div className="company">
                                <span className="company-name">לקוחות {company}</span>
                                <div className="client-in-pop-up">
                                    {this.state.clientsToDisplay.length === 0 && this.state.allClients?.map(client =>
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
                                    {this.state.clientsToDisplay.length > 0 && this.state.clientsToDisplay?.map(client =>
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


                                </div>
                            </div>
                        )}
                    </div>
                    <button onClick={this.addClientsToReport} disabled={this.state.clientsToAdd.length === 0} className="add-client-in-pop-up">הוספה</button>
                </div>
            </div >
        )
    }
}