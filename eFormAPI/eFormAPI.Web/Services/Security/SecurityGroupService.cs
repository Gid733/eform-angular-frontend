﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Infrastructure.Database.Entities;
using eFormAPI.Web.Infrastructure.Models.Permissions;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microting.eFormApi.BasePn.Infrastructure.Extensions;
using Microting.eFormApi.BasePn.Infrastructure.Models.API;

namespace eFormAPI.Web.Services.Security
{
    public class SecurityGroupService : ISecurityGroupService
    {
        private readonly ILogger<SecurityGroupService> _logger;
        private readonly ILocalizationService _localizationService;
        private readonly BaseDbContext _dbContext;

        public SecurityGroupService(BaseDbContext dbContext,
            ILogger<SecurityGroupService> logger, 
            ILocalizationService localizationService)
        {
            _dbContext = dbContext;
            _logger = logger;
            _localizationService = localizationService;
        }

        public async Task<OperationDataResult<SecurityGroupsModel>> GetSecurityGroups(
            SecurityGroupRequestModel requestModel)
        {
            try
            {
                var securityGroupsModel = new SecurityGroupsModel();
                IQueryable<SecurityGroup> securityGroupsQuery = _dbContext.SecurityGroups.AsQueryable();
                if (!string.IsNullOrEmpty(requestModel.Sort))
                {
                    if (requestModel.IsSortDsc)
                    {
                        securityGroupsQuery = securityGroupsQuery
                            .CustomOrderByDescending(requestModel.Sort);
                    }
                    else
                    {
                        securityGroupsQuery = securityGroupsQuery
                            .CustomOrderBy(requestModel.Sort);
                    }
                }
                else
                {
                    securityGroupsQuery = _dbContext.SecurityGroups
                        .OrderBy(x => x.Id);
                }

                if (!string.IsNullOrEmpty(requestModel.NameFilter))
                {
                    securityGroupsQuery = securityGroupsQuery.Where(x => x.Name.Contains(requestModel.NameFilter));
                }

                securityGroupsQuery = securityGroupsQuery
                    .Skip(requestModel.Offset)
                    .Take(requestModel.PageSize);

                List<SecurityGroupModel> securityGroupList = await securityGroupsQuery.Select(x => new SecurityGroupModel()
                {
                    Id = x.Id,
                    Name = x.Name,
                    UserAmount = x.SecurityGroupUsers.Count,
                    UsersList = x.SecurityGroupUsers.Select(u => new SecurityGroupUserModel()
                    {
                        Id = u.EformUser.Id,
                        FirstName = u.EformUser.FirstName,
                        LastName = u.EformUser.LastName,
                        Email = u.EformUser.Email,
                    }).ToList()
                }).ToListAsync();
                securityGroupsModel.Total = await _dbContext.SecurityGroups.CountAsync();
                securityGroupsModel.SecurityGroupList = securityGroupList;
                return new OperationDataResult<SecurityGroupsModel>(true, securityGroupsModel);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupsModel>(false, 
                    _localizationService.GetString("ErrorWhileObtainingSecurityGroups"));
            }
        }

        public async Task<OperationDataResult<SecurityGroupModel>> GetSecurityGroup(int id)
        {
            try
            {
                SecurityGroupModel securityGroupModel = await _dbContext.SecurityGroups
                    .Where(x => x.Id == id)
                    .Select(x => new SecurityGroupModel()
                    {
                        Id = x.Id,
                        Name = x.Name,
                        UserAmount = x.SecurityGroupUsers.Count,
                        UsersList = x.SecurityGroupUsers.Select(u => new SecurityGroupUserModel()
                        {
                            Id = u.EformUser.Id,
                            FirstName = u.EformUser.FirstName,
                            LastName = u.EformUser.LastName,
                            Email = u.EformUser.Email,
                        }).ToList()
                    }).FirstOrDefaultAsync();
                if (securityGroupModel == null)
                {
                    return new OperationDataResult<SecurityGroupModel>(false, 
                        _localizationService.GetString("SecurityGroupNotFound"));
                }

                return new OperationDataResult<SecurityGroupModel>(true, securityGroupModel);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupModel>(false, 
                    _localizationService.GetString("ErrorWhileObtainingSecurityGroup"));
            }
        }

        public async Task<OperationResult> CreateSecurityGroup(SecurityGroupCreateModel requestModel)
        {
            try
            {
                if (string.IsNullOrEmpty(requestModel.Name))
                {
                    return new OperationDataResult<SecurityGroupsModel>(false,
                        _localizationService.GetString("SecurityGroupNameIsEmpty"));
                }

                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    SecurityGroup securityGroup = new SecurityGroup
                    {
                        Name = requestModel.Name,
                    };
                    foreach (var userId in requestModel.UserIds)
                    {
                        securityGroup.SecurityGroupUsers.Add(new SecurityGroupUser()
                        {
                            EformUserId = userId,
                        });
                    }

                    await _dbContext.SecurityGroups.AddAsync(securityGroup);
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }

                return new OperationResult(true, 
                    _localizationService.GetString("SecurityGroupCreatedSuccessfully"));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupsModel>(false, 
                    _localizationService.GetString("ErrorWhileCreatingSecurityGroup"));
            }
        }

        public async Task<OperationResult> UpdateSecurityGroup(SecurityGroupUpdateModel requestModel)
        {
            try
            {
                using (var transaction = await _dbContext.Database.BeginTransactionAsync())
                {
                    SecurityGroup securityGroup = await _dbContext.SecurityGroups
                        .Include(x => x.SecurityGroupUsers)
                        .FirstOrDefaultAsync(x => x.Id == requestModel.Id);

                    if (securityGroup == null)
                    {
                        transaction.Rollback();
                        return new OperationDataResult<SecurityGroupsModel>(false,
                            _localizationService.GetString("SecurityGroupNotFound"));
                    }

                    securityGroup.Name = requestModel.Name;
                    // delete old
                    var usersForDelete = _dbContext.SecurityGroupUsers
                        .Where(x => x.SecurityGroupId == requestModel.Id
                                    && !requestModel.UserIds.Contains(x.EformUserId));
                    _dbContext.SecurityGroupUsers.RemoveRange(usersForDelete);
                    // add new
                    foreach (var userId in requestModel.UserIds)
                    {
                        if (securityGroup.SecurityGroupUsers.All(x => x.EformUserId != userId))
                        {
                            securityGroup.SecurityGroupUsers.Add(new SecurityGroupUser()
                            {
                                EformUserId = userId,
                                SecurityGroupId = requestModel.Id
                            });
                        }
                    }

                    _dbContext.SecurityGroups.Update(securityGroup);
                    await _dbContext.SaveChangesAsync();
                    transaction.Commit();
                }

                return new OperationResult(true, 
                    _localizationService.GetString("SecurityGroupUpdatedSuccessfully"));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupsModel>(false, 
                    _localizationService.GetString("ErrorWhileUpdatingSecurityGroup"));
            }
        }


        public async Task<OperationResult> DeleteSecurityGroup(int id)
        {
            try
            {
                SecurityGroup securityGroup = await _dbContext.SecurityGroups.FirstOrDefaultAsync(x => x.Id == id);
                if (securityGroup == null)
                {
                    return new OperationResult(false, 
                        _localizationService.GetString("SecurityGroupNotFound"));
                }

                _dbContext.SecurityGroups.Remove(securityGroup);
                await _dbContext.SaveChangesAsync();
                return new OperationResult(true, 
                    _localizationService.GetString("SecurityGroupRemovedSuccessfully"));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message);
                return new OperationDataResult<SecurityGroupModel>(false, 
                    _localizationService.GetString("ErrorWhileDeletingSecurityGroup"));
            }
        }
    }

}