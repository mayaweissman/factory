import { ClientModel} from "../models/clientModel";

export class AppState{
    public allClients: ClientModel[];
    
    public constructor(){
        this.allClients = [];
    }
    
}
