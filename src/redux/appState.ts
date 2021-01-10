import { ClientModel } from "../models/clientModel";

export class AppState {
  public allClients: ClientModel[];
  public selectedClients: ClientModel[];

  public constructor() {
    this.allClients = [];
    this.selectedClients = [];
  }
}
