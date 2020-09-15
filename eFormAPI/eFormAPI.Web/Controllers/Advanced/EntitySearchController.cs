﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2020 Microting A/S

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
using System.Collections.Generic;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models;
using eFormAPI.Web.Infrastructure.Models.SearchableList;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;
using Microting.eFormApi.BasePn.Infrastructure.Models.Common;

namespace eFormAPI.Web.Controllers.Advanced
{
    [Authorize]
    public class EntitySearchController : Controller
    {
        private readonly IEntitySearchService _entitySearchService;

        public EntitySearchController(IEntitySearchService entitySearchService)
        {
            _entitySearchService = entitySearchService;
        }

        [HttpPost]
        [Route("api/searchable-groups")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Read)]
        public Task<OperationDataResult<EntityGroupList>> Index(
            [FromBody] AdvEntitySearchableGroupListRequestModel requestModel)
        {
            return _entitySearchService.Index(requestModel);
        }
        
        [HttpPost]
        [Route("api/searchable-groups/create")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Create)]
        public Task<OperationResult> Create([FromBody] AdvEntitySearchableGroupEditModel editModel)
        {
            return _entitySearchService.Create(editModel);
        }


        [HttpGet]
        [Route("api/searchable-groups/get/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Read)]
        public Task<OperationDataResult<EntityGroup>> Read(string entityGroupUid)
        {
            return _entitySearchService.Read(entityGroupUid);
        }
        
        [HttpPost]
        [Route("api/searchable-groups/update")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Update)]
        public Task<OperationResult> Update([FromBody] AdvEntitySearchableGroupEditModel editModel)
        {
            return _entitySearchService.Update(editModel);
        }

        [HttpGet]
        [Route("api/searchable-groups/delete/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.EntitySearch.Delete)]
        public Task<OperationResult> Delete(string entityGroupUid)
        {
            return _entitySearchService.Delete(entityGroupUid);
        }


        [HttpGet]
        [Route("api/searchable-groups/dict/{entityGroupUid}")]
        [Authorize(Policy = AuthConsts.EformPolicies.Cases.CaseRead)]
        public Task<OperationDataResult<List<CommonDictionaryTextModel>>> GetEntityGroupDictionary(string entityGroupUid,
            string searchString)
        {
            return _entitySearchService.GetEntityGroupDictionary(entityGroupUid, searchString);
        }
        [HttpPost]
        [Route("api/searchable-groups/send")]
        public Task<OperationResult> SendSearchableGroup(string entityGroupUid)
        {
            return _entitySearchService.SendSearchableGroup(entityGroupUid);
        }
    }
}