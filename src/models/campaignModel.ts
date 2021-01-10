export class CampaignModel {
  public constructor(
    public campaignId?: number,
    public companyId?: number,
    public campaignName?: number,
    public lastUpdate?: string,
    public productType?: string,
    public successRates?: number,
    public imageSrc?: string
  ) {}
}
