import { CampaignModel } from "./campaignModel";
import { ClientModel } from "./clientModel";
import { ProductModel } from "./productModel";

export class ReportModel {
    public constructor(
        public reportId?: number,
        public creatorId?: number,
        public creationDate?: string,
        public uuid?: string,
        public clients?: ClientModel[],
        public campaigns?: CampaignModel[],
        public products?: ProductModel[]
    ) {
    }
}
