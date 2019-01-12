﻿using Microting.eFormApi.BasePn.Infrastructure.Database.Base;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class SecurityGroupUser : BaseEntity
    {
        public int SecurityGroupId { get; set; }
        public virtual SecurityGroup SecurityGroup { get; set; }

        public int EformUserId { get; set; }
        public virtual EformUser EformUser { get; set; }
    }
}