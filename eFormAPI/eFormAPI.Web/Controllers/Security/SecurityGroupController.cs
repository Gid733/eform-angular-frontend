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
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Controllers.Security
{
    [Authorize]
    public class SecurityGroupController : Controller
    {
        private readonly ISecurityGroupService _securityGroupService;

        public SecurityGroupController(ISecurityGroupService securityGroupService)
        {
            _securityGroupService = securityGroupService;
        }

        [HttpGet]
        [Route("api/security/groups")]
        [Authorize(Policy = AuthConsts.EformPolicies.UserManagement.Read)]
        public async Task<OperationDataResult<SecurityGroupsModel>> GetEntityGroups(SecurityGroupRequestModel requestModel)
        {
            return await _securityGroupService.GetSecurityGroups(requestModel);
        }

        [HttpGet]
        [Route("api/security/groups/{id}")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationDataResult<SecurityGroupModel>> GetEntityGroup(int id)
        {
            return await _securityGroupService.GetSecurityGroup(id);
        }

        [HttpPost]
        [Route("api/security/groups")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationResult> CreateSecurityGroup([FromBody] SecurityGroupCreateModel model)
        {
            return await _securityGroupService.CreateSecurityGroup(model);
        }

        [HttpPut]
        [Route("api/security/groups")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationResult> UpdateSecurityGroup([FromBody] SecurityGroupUpdateModel model)
        {
            return await _securityGroupService.UpdateSecurityGroup(model);
        }

        [HttpDelete]
        [Route("api/security/groups/{id}")]
        [Authorize(Roles = EformRole.Admin)]
        public async Task<OperationResult> DeleteSecurityGroup(int id)
        {
            return await _securityGroupService.DeleteSecurityGroup(id);
        }
    }
}
