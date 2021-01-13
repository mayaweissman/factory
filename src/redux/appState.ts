import { CampaignModel } from "../models/campaignModel";
import { ClientModel } from "../models/clientModel";
import { ProductModel } from "../models/productModel";

export class AppState {
  public allClients: ClientModel[];
  public allProducts: ProductModel[];
  public allCampaigns: CampaignModel[];
  public selectedClients: ClientModel[];
  public selectedCampaigns: CampaignModel[];
  public selectedProducts: ProductModel[];
  public campaignsToDisplay: CampaignModel[];
  public productsToDisplay: CampaignModel[];
  public isPopUpShow: boolean;
  public isProductsPopUpShow: boolean;
  public isLinksPopUpShow: boolean;
  public isAuthSucceeded: boolean

  public constructor() {
    this.allClients = [];
    this.allProducts = [];
    this.allCampaigns = [];
    this.selectedClients = [];
    this.selectedCampaigns = [];
    this.selectedProducts = [];
    this.campaignsToDisplay = [];
    this.productsToDisplay = [];
    this.isPopUpShow = false;
    this.isProductsPopUpShow = false;
    this.isLinksPopUpShow = false;
    this.isAuthSucceeded = false;
  }
}
