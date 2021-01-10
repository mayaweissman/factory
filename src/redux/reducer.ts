import { AppState } from "./appState";
import { Action } from "./action";
import { ActionType } from "./actionType";

export function reducer(oldAppState : AppState, action : Action): AppState{

    const newAppState = {...oldAppState}; //Duplicate the old state into a new state

    switch(action.type){

        case ActionType.getAllClients:
            newAppState.allClients = action.payLoad;
            break;

        case ActionType.addClientToSelectedClients:
            newAppState.selectedClients.push(action.payLoad);
            break;

        case ActionType.unselectAllClients:
            newAppState.selectedClients = [];
            break;

        default: break;
    }

    return newAppState;
}
