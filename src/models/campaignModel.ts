export class CampaignModel {
  public constructor(
    public campaignId?: number,
    public clientId?: number,
    public campaignName?: string,
    public lastUpdate?: string,
    public productType?: string,
    public successRates?: number,
    public imageSrc?: string
  ) {}
}
