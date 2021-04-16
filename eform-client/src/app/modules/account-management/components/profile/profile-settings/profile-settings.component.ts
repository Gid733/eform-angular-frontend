import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventBrokerService } from 'src/app/common/helpers';
import { GoogleAuthInfoModel } from 'src/app/common/models/auth';
import { UserSettingsModel } from 'src/app/common/models/settings';
import {
  AuthService,
  GoogleAuthService,
  LocaleService,
  UserSettingsService,
} from 'src/app/common/services/auth';
import { TimezonesModel } from 'src/app/common/models/common/timezones.model';
import { applicationLanguages } from 'src/app/common/const/application-languages.const';
import { countries } from 'src/app/common/const/application-countries.const';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.scss'],
})
export class ProfileSettingsComponent implements OnInit {
  test = true;
  get userRole() {
    return this.authService.currentRole;
  }

  get languages() {
    return applicationLanguages;
  }

  get countries() {
    return countries;
  }

  userSettingsModel: UserSettingsModel = new UserSettingsModel();
  googleAuthInfoModel: GoogleAuthInfoModel = new GoogleAuthInfoModel();
  timeZones: TimezonesModel = new TimezonesModel();
  spinnerCounter = 0;

  constructor(
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private localeService: LocaleService,
    private userSettingsService: UserSettingsService,
    private eventBrokerService: EventBrokerService
  ) {}

  ngOnInit() {
    this.getTimeZones();
    this.getGoogleAuthenticatorInfo();
    this.getUserSettings();
  }

  getGoogleAuthenticatorInfo() {
    this.spinnerStatusCounter(1);
    this.googleAuthService.getGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.model) {
        this.googleAuthInfoModel = data.model;
        this.spinnerStatusCounter(-1);
      }
    });
  }

  getTimeZones() {
    this.spinnerStatusCounter(1);
    this.googleAuthService.allTimeZones().subscribe((data) => {
      if (data && data.model) {
        this.timeZones = data.model;
      }
      this.spinnerStatusCounter(-1);
    });
  }

  getUserSettings() {
    this.spinnerStatusCounter(1);
    this.userSettingsService.getUserSettings().subscribe((data) => {
      this.userSettingsModel = data.model;
      this.spinnerStatusCounter(-1);
    });
  }

  changeDarkTheme(e) {
    if (e.target) {
      this.userSettingsModel.darkTheme = e.target.checked;
    } else {
      return;
    }
  }

  isTwoFactorEnabledCheckBoxChanged(e) {
    if (e.target) {
      this.googleAuthInfoModel.isTwoFactorEnabled = e.target.checked;
    } else {
      return;
    }
    this.spinnerStatusCounter(1);
    this.googleAuthService
      .updateGoogleAuthenticatorInfo(this.googleAuthInfoModel)
      .subscribe((data) => {
        if (data.success) {
          localStorage.removeItem('currentAuth');
          this.router.navigate(['/login']).then();
        }
        this.spinnerStatusCounter(-1);
      });
  }

  deleteGoogleAuthenticatorInfo() {
    this.spinnerStatusCounter(1);
    this.googleAuthService.deleteGoogleAuthenticatorInfo().subscribe((data) => {
      if (data && data.success) {
        this.googleAuthInfoModel.psk = null;
      }
      this.spinnerStatusCounter(-1);
    });
  }

  updateUserProfileSettings() {
    this.spinnerStatusCounter(1);
    this.userSettingsService
      .updateUserSettings(this.userSettingsModel)
      .subscribe(
        (data) => {
          this.localeService.updateUserLocale(this.userSettingsModel.locale);
          this.eventBrokerService.emit('get-navigation-menu', {
            takeFromCache: false,
          });
        },
        (error) => {
          this.spinnerStatusCounter(-1);
        }
      );
  }

  spinnerStatusCounter(counter: number) {
    // console.log('current spinner count is ' + this.spinnerCounter + ' we got a new counter number ' + counter);
    this.spinnerCounter += counter;
    if (this.spinnerCounter === 0) {
    } else {
    }
  }
}
