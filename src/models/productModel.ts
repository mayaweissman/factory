export class ProductModel {
    public constructor(
      public productId?: number,
      public campaignId?: number,
      public clientId?: number,
      public productType?: string,
      public successRates?: number,
      public imageSrc?: string
    ) {}
  }
  