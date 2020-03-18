import {DatePipe, LocationStrategy, PathLocationStrategy} from '@angular/common';
import {CookieService} from 'ngx-cookie-service';
import {ToastrService} from 'ngx-toastr';
import {AdminGuard, AuthGuard, CanDeactivateGuard, PermissionGuard} from 'src/app/common/guards';
import {ClaimsGuard} from 'src/app/common/guards/claims.guard';
import {EventBrokerService} from 'src/app/common/helpers';
import {
  EntitySearchService,
  EntitySelectService,
  SitesService, SiteTagsService,
  UnitsService,
  WorkersService
} from 'src/app/common/services/advanced';
import {AppMenuService, AppSettingsService} from 'src/app/common/services/settings';
import {AuthService, LocaleService, UserSettingsService} from 'src/app/common/services/auth';
import {CasePostsService, CasesService, ImageService} from 'src/app/common/services/cases';
import {DeviceUserService} from 'src/app/common/services/device-users';
import {EformReportService, EFormService, EformTagService} from 'src/app/common/services/eform';
import {SecurityGroupEformsPermissionsService, SecurityGroupsService} from 'src/app/common/services/security';
import {AdminService} from 'src/app/common/services/users';
import {FoldersService} from './common/services/advanced/folders.service';
import {PluginPermissionsService, PluginsManagementService} from './common/services/plugins-management';
import {EmailRecipientsService, EmailRecipientsTagsService} from './common/services/email-recipients';
// Guards

export let providers = [
  // Guards
  AuthGuard,
  AdminGuard,
  CanDeactivateGuard,
  ClaimsGuard,
  PermissionGuard,
  // Libs services
  ToastrService,
  CookieService,
  // Services
  AuthService,
  LocaleService,
  UserSettingsService,
  AppSettingsService,
  PluginsManagementService,
  AppMenuService,
  DeviceUserService,
  UnitsService,
  SitesService,
  SiteTagsService,
  WorkersService,
  FoldersService,
  AdminService,
  EntitySearchService,
  EntitySelectService,
  EFormService,
  EformTagService,
  EformReportService,
  EmailRecipientsService,
  EmailRecipientsTagsService,
  CasesService,
  CasePostsService,
  ImageService,
  SecurityGroupsService,
  SecurityGroupEformsPermissionsService,
  PluginPermissionsService,
  // Helpers
  EventBrokerService,
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy
  }
];
