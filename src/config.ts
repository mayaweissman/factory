export class Config {
  public static serverUrl: string;

  public static _initialize() {
    // if (process.env.NODE_ENV === "production") {
      const currentUrl = window.location.href.split("//")[1].split("/")[0];
      if(currentUrl === 'localhost:3000' || currentUrl === 'factory.mccann.co.il'){
        Config.serverUrl = "https://factory-dev.landing-page-media.co.il";
      }
      else if(currentUrl === 'digital.mccann.co.il'){
        Config.serverUrl = "https://digital-dev.landing-page-media.co.il";
      }
    // } else {
    //   Config.serverUrl = "http://localhost:3000";
    // }
  }
}

Config._initialize();
