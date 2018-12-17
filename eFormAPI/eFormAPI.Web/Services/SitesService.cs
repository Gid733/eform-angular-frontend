﻿using System;
using System.Collections.Generic;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormCore;
using eFormShared;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Models;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services
{
    public class SitesService : ISitesService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;

        public SitesService(IEFormCoreService coreHelper, 
           ILocalizationService localizationService)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
        }

        public OperationDataResult<List<SiteName_Dto>> Index()
        {
            Core core = _coreHelper.GetCore();
            List<SiteName_Dto> siteNamesDto = core.Advanced_SiteItemReadAll(false);

            return new OperationDataResult<List<SiteName_Dto>>(true, siteNamesDto);
        }

        public OperationDataResult<SiteName_Dto> Edit(int id)
        {
            Core core = _coreHelper.GetCore();
            SiteName_Dto siteNameDto = core.Advanced_SiteItemRead(id);

            return !siteNameDto.Equals(null)
                ? new OperationDataResult<SiteName_Dto>(true, siteNameDto)
                : new OperationDataResult<SiteName_Dto>(false);
        }

        public OperationResult Update(SiteNameModel siteNameModel)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                SiteName_Dto siteNameDto = core.Advanced_SiteItemRead(siteNameModel.Id);

                if (!siteNameDto.Equals(null))
                {
                    core.Advanced_SiteItemUpdate(siteNameDto.SiteUId, siteNameModel.SiteName);
                    return new OperationResult(true);
                }

                return new OperationResult(false);
            }
            catch (Exception)
            {
                return new OperationResult(false,
                    _localizationService.GetString("SiteParamCouldNotBeUpdated", siteNameModel.Id));
            }
        }

        public OperationResult Delete(int id)
        {
            try
            {
                Core core = _coreHelper.GetCore();
                SiteName_Dto siteDto = core.Advanced_SiteItemRead(id);

                if (siteDto.Equals(null))                    
                {
                    return new OperationResult(false, _localizationService.GetString("SiteParamNotFound", id));
                }

                return core.Advanced_SiteItemDelete(id)
                    ? new OperationResult(true,
                        _localizationService.GetString("SiteParamDeletedSuccessfully", siteDto.SiteName))
                    : new OperationResult(false,
                        _localizationService.GetString("SiteParamCouldNotBeDeleted", siteDto.SiteName));
            }

            catch (Exception)
            {
                return new OperationDataResult<SiteNameModel>(false,
                    _localizationService.GetString("SiteParamCouldNotBeDeleted", id));
            }
        }
    }
}