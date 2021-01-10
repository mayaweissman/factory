import { AppState } from "./appState";
import { Action } from "./action";
import { ActionType } from "./actionType";

export function reducer(oldAppState : AppState, action : Action): AppState{

    const newAppState = {...oldAppState}; //Duplicate the old state into a new state

    switch(action.type){

        case ActionType.GetAllCompanies:
            newAppState.allClients = action.payLoad;
            break;

        default: break;
    }

    return newAppState;
}
