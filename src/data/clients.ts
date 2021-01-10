export function getAllClients() {
    const companies = [
        {
            clientId: 1,
            clientName: "Partner",
            campaigns: [
                {
                    campaignId: 1,
                    companyId: 1,
                    campaignName: "Some name 1",
                    lastUpdate: "10-01-2020",
                    productType: "Banners",
                    successRates: 85,
                    imageSrc: "https://upload.wikimedia.org/wikipedia/he/thumb/2/24/Partner_logo.svg/1200px-Partner_logo.svg.png"
                },
                {
                    campaignId: 2,
                    companyId: 1,
                    campaignName: "Some name 2",
                    lastUpdate: "10-01-2020",
                    productType: "Banners",
                    successRates: 62,
                    imageSrc: "https://www.partner.co.il/globalassets/global/hp2018/30_giga_desktop-1028x685.png"
                },
                {
                    campaignId: 3,
                    companyId: 1,
                    campaignName: "Some name 3",
                    lastUpdate: "10-01-2020",
                    productType: "Banners",
                    successRates: 49,
                    imageSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKu8C6MDy9ltpTMj-VdN08sV83JPt1XTbKbg&usqp=CAU"
                }
            ],
            company: "Mccann"
        }
    ]
    return companies;
}