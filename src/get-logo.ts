export class Logo {
  public static logoSrc: string;

  public static _initialize() {
    // if (process.env.NODE_ENV === "production") {
      const currentUrl = window.location.href.split("//")[1].split("/")[0];
      if(currentUrl === 'localhost:3000' || currentUrl === 'factory.mccann.co.il'){
        Logo.logoSrc = "/assets/images/logo_factory.svg";
      }
      else if(currentUrl === 'digital.mccann.co.il'){
        Logo.logoSrc = "/assets/images/logo_mccann.svg";
      }
    // } else {
    //   Config.serverUrl = "http://localhost:3000";
    // }
  }
}

Logo._initialize();
