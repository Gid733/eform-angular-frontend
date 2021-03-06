import {
  DatePipe,
  LocationStrategy,
  PathLocationStrategy,
} from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import {
  AdminGuard,
  AuthGuard,
  CanDeactivateGuard,
  PermissionGuard,
} from 'src/app/common/guards';
import { ClaimsGuard } from 'src/app/common/guards/claims.guard';
import { EventBrokerService } from 'src/app/common/helpers';
import {
  AdminService,
  ApiBaseService,
  AppMenuService,
  AppSettingsService,
  CasePostsService,
  CasesService,
  DeviceUserService,
  EformDocxReportService,
  EformReportService,
  EFormService,
  EformTagService,
  EmailRecipientsService,
  EmailRecipientsTagsService,
  EntitySearchService,
  EntitySelectService,
  FoldersService,
  GoogleAuthService,
  LoaderService,
  LocaleService,
  NavigationMenuService,
  PluginPermissionsService,
  PluginsManagementService,
  SecurityGroupEformsPermissionsService,
  SecurityGroupsService,
  SitesService,
  TemplateFilesService,
  UnitsService,
  WorkersService,
} from 'src/app/common/services';
import { AuthService } from 'src/app/common/services/auth/auth.service';
import { UserSettingsService } from 'src/app/common/services/auth/user-settings.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  HttpErrorInterceptor,
  JwtInterceptor,
  LoaderInterceptor,
  UserClaimsInterceptor,
} from 'src/app/common/interceptors';
import { GALLERY_CONFIG } from '@ngx-gallery/core';
import { AppMenuStateService, AuthStateService } from 'src/app/common/store';
import { persistProviders } from 'src/app/common/store/persist.config';
import { BaseService } from 'src/app/common/services/base.service';
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
  GoogleAuthService,
  LocaleService,
  UserSettingsService,
  AppSettingsService,
  PluginsManagementService,
  AppMenuService,
  DeviceUserService,
  UnitsService,
  SitesService,
  WorkersService,
  FoldersService,
  AdminService,
  EntitySearchService,
  EntitySelectService,
  EFormService,
  EformTagService,
  EformReportService,
  EformDocxReportService,
  EmailRecipientsService,
  EmailRecipientsTagsService,
  CasesService,
  CasePostsService,
  TemplateFilesService,
  SecurityGroupsService,
  SecurityGroupEformsPermissionsService,
  PluginPermissionsService,
  NavigationMenuService,
  LoaderService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: UserClaimsInterceptor, multi: true },
  {
    provide: GALLERY_CONFIG,
    useValue: {
      counterPosition: 'bottom',
    },
  },
  AuthStateService,
  AppMenuStateService,
  // Helpers
  EventBrokerService,
  DatePipe,
  {
    provide: LocationStrategy,
    useClass: PathLocationStrategy,
  },
  ...persistProviders,
  BaseService,
  ApiBaseService,
];
