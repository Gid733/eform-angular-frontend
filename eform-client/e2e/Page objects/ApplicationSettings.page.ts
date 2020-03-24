import {PageWithNavbarPage} from './PageWithNavbar.page';

export class ApplicationSettingsPage extends PageWithNavbarPage {
  constructor() {
    super();
    this.LoginPage = new LoginPageSettings();
    this.SiteHeader = new SiteHeaderSettings();
  }

  public get saveBtn() {
    return $('#applicationSettingsSaveBtn');
  }

  public get siteHeaderMainText() {
    return $('#main-header-text');
  }

  public get siteHeaderSecondaryText() {
    return $('#secondary-header-text');
  }

  public get siteHeaderImage() {
    return $('#site-header-image');
  }


  public LoginPage: LoginPageSettings;
  public SiteHeader: SiteHeaderSettings;

  public save() {
    this.saveBtn.click();
    browser.pause(6000);
  }
}

class LoginPageSettings {
  public get mainTextInput() {
    return $('#mainTextLoginPage');
  }

  public get secondaryTextInput() {
    return $('#secondaryTextLoginPage');
  }

  public get imageUploadBtn() {
    return $('#loginPageImageUploadBtn');
  }

  public get mainTextVisibilityToggleBtn() {
    return $('#loginPageMainTextVisibilityToggler');
  }

  public get secondaryTextVisibilityToggleBtn() {
    return $('#loginPageSecondaryTextVisibilityToggler');
  }

  public get imageVisibilityToggler() {
    return $('#loginPageImageVisibilityToggler');
  }

  public get resetBtn() {
    return $('#loginPageReset');
  }

  public reset() {
    this.resetBtn.click();
    browser.pause(5000);
    browser.refresh();
    browser.pause(10000);
  }
}

class SiteHeaderSettings {
  public get mainTextInput() {
    return $('#headerSettingsMainText');
  }

  public get secondaryTextInput() {
    return $('#headerSettingsSecondaryText');
  }

  public get imageUploadBtn() {
    return $('#siteHeaderUploadBtn');
  }

  public get mainTextVisibilityToggleBtn() {
    return $('#siteHeaderMainTextToggler');
  }

  public get secondaryTextVisibilityToggleBtn() {
    return $('#siteHeaderSecondaryTextToggler');
  }

  public get imageVisibilityToggler() {
    return $('#siteHeaderImageVisibilityToggler');
  }

  public get resetBtn() {
    return $('#siteHeaderReset');
  }

  public reset() {
    this.resetBtn.click();
    browser.pause(25000);
    browser.refresh();
  }
}

const applicationSettingsPage = new ApplicationSettingsPage();
export default applicationSettingsPage;
