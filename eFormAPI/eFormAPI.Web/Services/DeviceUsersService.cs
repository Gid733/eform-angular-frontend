﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2021 Microting A/S

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.DeviceUsers;
using Microsoft.EntityFrameworkCore;
using Microting.eForm.Infrastructure;
using Microting.eForm.Infrastructure.Constants;
using Microting.eForm.Infrastructure.Data.Entities;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class DeviceUsersService : IDeviceUsersService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public DeviceUsersService(ILocalizationService localizationService,
            IEFormCoreService coreHelper)
        {
            _localizationService = localizationService;
            _coreHelper = coreHelper;
        }

        public async Task<OperationDataResult<List<DeviceUser>>> Index()
        {
            var core = await _coreHelper.GetCore();
            await using MicrotingDbContext db = core.DbContextHelper.GetDbContext();
            List<DeviceUser> deviceUsers = new List<DeviceUser>();

            List<Site> matches = await db.Sites.Where(x => x.WorkflowState != Constants.WorkflowStates.Removed).ToListAsync().ConfigureAwait(false);
            foreach (Site aSite in matches)
            {
                Unit unit = null;
                Worker worker = null;
                int? unitCustomerNo = null;
                int? unitOptCode = null;
                int? unitMicrotingUid = null;
                int? workerMicrotingUid = null;
                string workerFirstName = null;
                string workerLastName = null;
                try
                {
                    unit = await db.Units.FirstAsync(x => x.SiteId == aSite.Id);
                    unitCustomerNo = unit.CustomerNo;
                    unitOptCode = unit.OtpCode ?? 0;
                    unitMicrotingUid = (int) unit.MicrotingUid;
                }
                catch
                {
                }

                try
                {
                    SiteWorker siteWorker = await db.SiteWorkers.FirstAsync(x => x.SiteId == aSite.Id);
                    worker = await db.Workers.SingleAsync(x => x.Id == siteWorker.WorkerId);
                    workerMicrotingUid = worker.MicrotingUid;
                    workerFirstName = worker.FirstName;
                    workerLastName = worker.LastName;
                }
                catch
                {
                }

                if (aSite.LanguageId == 0)
                {
                    aSite.LanguageId = db.Languages.Single(x => x.Name == "Danish").Id;
                    await aSite.Update(db);
                }

                Language language = db.Languages.Single(x => x.Id == aSite.LanguageId);
                DeviceUser deviceUser = new DeviceUser()
                {
                    CustomerNo = unitCustomerNo,
                    FirstName = workerFirstName,
                    LastName = workerLastName,
                    LanguageId = aSite.LanguageId,
                    OtpCode = unitOptCode,
                    SiteId = aSite.Id,
                    SiteUid = aSite.MicrotingUid,
                    SiteName = aSite.Name,
                    UnitId = unitMicrotingUid,
                    WorkerUid = workerMicrotingUid,
                    Language = language.Name,
                    LanguageCode = language.LanguageCode,
                };
                deviceUsers.Add(deviceUser);
            }

            // var siteDto = await core.SiteReadAll(false);
            return new OperationDataResult<List<DeviceUser>>(true, deviceUsers);
        }

        public async Task<OperationResult> Create(DeviceUserModel deviceUserModel)
        {
            var core = await _coreHelper.GetCore();
            var siteName = deviceUserModel.UserFirstName + " " + deviceUserModel.UserLastName;
            await using var db = core.DbContextHelper.GetDbContext();


            try
            {
                var siteDto = await core.SiteCreate(siteName, deviceUserModel.UserFirstName, deviceUserModel.UserLastName,
                    null, deviceUserModel.LanguageCode);

                // if (siteDto != null)
                // {
                //     Site site = await db.Sites.SingleAsync(x => x.MicrotingUid == siteDto.SiteId);
                //     site.LanguageId = language.Id;
                //     await site.Update(db);
                // }

                return siteDto != null
                    ? new OperationResult(true,
                        _localizationService.GetStringWithFormat("DeviceUserParamCreatedSuccessfully", siteDto.SiteName))
                    : new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeCreated"));
            }
            catch (Exception ex)
            {
                try
                {
                    if (ex.InnerException.Message == "The remote server returned an error: (402) Payment Required.")
                    {
                        return new OperationResult(false, _localizationService.GetString("YouNeedToBuyMoreLicenses"));
                    }
                    else
                    {
                        return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeCreated"));
                    }
                }
                catch
                {
                    return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeCreated"));
                }
            }
        }

        public async Task<OperationDataResult<DeviceUser>> Edit(int id)
        {
            var core = await _coreHelper.GetCore();
            await using var db = core.DbContextHelper.GetDbContext();

            //var siteDto = await core.SiteRead(id);
            DeviceUser deviceUser = null;
            Site site = await db.Sites.SingleOrDefaultAsync(x => x.MicrotingUid == id);
            if (site == null)
                return null;

            SiteWorker siteWorker = db.SiteWorkers.Where(x => x.SiteId == site.Id).ToList().First();
            Worker worker = await db.Workers.SingleAsync(x => x.Id == siteWorker.WorkerId);
            List<Unit> units = db.Units.Where(x => x.SiteId == site.Id).ToList();

            if (units.Any() && worker != null)
            {
                Unit unit = units.First();
                Language language = db.Languages.Single(x => x.Id == site.LanguageId);
                deviceUser = new DeviceUser()
                {
                    CustomerNo = unit.CustomerNo,
                    FirstName = worker.FirstName,
                    Language = language.Name,
                    LanguageCode = language.LanguageCode,
                    LanguageId = site.LanguageId,
                    LastName = worker.LastName,
                    OtpCode = unit.OtpCode,
                    SiteId = site.Id,
                    SiteName = site.Name,
                    SiteUid = site.MicrotingUid,
                    UnitId = unit.Id,
                    UnitUid = unit.MicrotingUid
                };
                //return new SiteDto((int)site.MicrotingUid, site.Name, worker.FirstName, worker.LastName, (int)unit.CustomerNo, unit.OtpCode ?? 0, (int)unit.MicrotingUid, worker.MicrotingUid);
            }

            return deviceUser != null
                ? new OperationDataResult<DeviceUser>(true, deviceUser)
                : new OperationDataResult<DeviceUser>(false,
                    _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeEdited", id));
        }

        public async Task<OperationResult> Update(DeviceUserModel deviceUserModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                await using var db = core.DbContextHelper.GetDbContext();
                Language language = db.Languages.Single(x => x.LanguageCode == deviceUserModel.LanguageCode);
                var siteDto = await core.SiteRead(deviceUserModel.Id);
                if (siteDto.WorkerUid != null)
                {
                    var workerDto = await core.Advanced_WorkerRead((int) siteDto.WorkerUid);
                    if (workerDto != null)
                    {
                        var fullName = deviceUserModel.UserFirstName + " " + deviceUserModel.UserLastName;
                        var isUpdated = await core.SiteUpdate(deviceUserModel.Id, fullName, deviceUserModel.UserFirstName,
                            deviceUserModel.UserLastName, workerDto.Email, deviceUserModel.LanguageCode);

                        if (isUpdated)
                        // {
                        //     Site site = await db.Sites.SingleAsync(x => x.MicrotingUid == deviceUserModel.Id);
                        //     site.LanguageId = language.Id;
                        //     await site.Update(db);
                        // }
                        return isUpdated
                            ? new OperationResult(true, _localizationService.GetString("DeviceUserUpdatedSuccessfully"))
                            : new OperationResult(false,
                                _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeUpdated", deviceUserModel.Id));
                    }

                    return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeObtained"));
                }

                return new OperationResult(false, _localizationService.GetString("DeviceUserNotFound"));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetString("DeviceUserCouldNotBeUpdated"));
            }
        }

        public async Task<OperationResult> Delete(int id)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var siteNameDto = await core.Advanced_SiteItemRead(id);

                return await core.SiteDelete(siteNameDto.SiteUId)
                    ? new OperationResult(true,
                        _localizationService.GetStringWithFormat("DeviceUserParamDeletedSuccessfully", siteNameDto.SiteName))
                    : new OperationResult(false,
                        _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeDeleted", siteNameDto.SiteName));
            }
            catch (Exception)
            {
                return new OperationResult(false, _localizationService.GetStringWithFormat("DeviceUserParamCouldNotBeDeleted", id));
            }
        }
    }
}