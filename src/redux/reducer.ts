import { AppState } from "./appState";
import { Action } from "./action";
import { ActionType } from "./actionType";

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
      break;

    default:
      break;
  }

  return newAppState;
}
