import { CampaignModel } from "./campaignModel";

export class ClientModel {
  public constructor(
    public clientId?: number,
    public clientName?: string,
    public campaigns?: CampaignModel[],
    public company?: string
  ) {
      this.campaigns = [];
  }
}
