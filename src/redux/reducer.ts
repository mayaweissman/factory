import { AppState } from "./appState";
import { Action } from "./action";
import { ActionType } from "./actionType";
import { act } from "react-dom/test-utils";

export function reducer(oldAppState: AppState, action: Action): AppState {
  const newAppState = { ...oldAppState }; //Duplicate the old state into a new state

  switch (action.type) {
    case ActionType.getAllClients:
      newAppState.allClients = action.payLoad;
      break;

    case ActionType.getAllCampaigns:
      newAppState.allCampaigns = action.payLoad;
      break;

    case ActionType.getAllProducts:
      newAppState.allProducts = action.payLoad;
      break;

    case ActionType.addClientToSelectedClients:
      newAppState.selectedClients.push(action.payLoad);
      break;

    case ActionType.unselectAllClients:
      newAppState.selectedClients = [];
      break;

    case ActionType.updateSelectedClients:
      newAppState.selectedClients = action.payLoad;
      break;

    case ActionType.getSelectedProducts:
      newAppState.selectedProducts = action.payLoad;
      break;

    case ActionType.updateCampaignsToDisplay:
      newAppState.campaignsToDisplay = action.payLoad;
      break;

    case ActionType.updateProductsToDisplay:
      newAppState.productsToDisplay = action.payLoad;
      break;

    case ActionType.resetFiltering:
      newAppState.campaignsToDisplay = newAppState.selectedCampaigns;
      newAppState.productsToDisplay = newAppState.selectedProducts;
      break;

    case ActionType.getSelectedCampaigns:
      newAppState.selectedCampaigns = action.payLoad;
      break;

    case ActionType.changeDisplayForPopUp:
      if (newAppState.isPopUpShow) {
        newAppState.isPopUpShow = false;
      }
      else {
        newAppState.isPopUpShow = true;
      }
      break;

    case ActionType.removeClient:
      const clientId = action.payLoad;
      const index = newAppState.selectedClients.findIndex(
        (c) => c.clientId === clientId
      );
      newAppState.selectedClients.splice(index, 1);
      newAppState.selectedCampaigns = newAppState.selectedCampaigns.filter(c => c.clientId !== action.payLoad);
      newAppState.campaignsToDisplay = newAppState.campaignsToDisplay.filter(c => c.clientId !== action.payLoad);
      newAppState.selectedProducts = newAppState.selectedProducts.filter(c => c.clientId !== action.payLoad);
      newAppState.productsToDisplay = newAppState.productsToDisplay.filter(c => c.clientId !== action.payLoad);
      break;

    default:
      break;
  }

  return newAppState;
}
