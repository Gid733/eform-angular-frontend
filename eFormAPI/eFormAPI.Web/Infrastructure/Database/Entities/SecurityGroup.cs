﻿using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microting.eFormApi.BasePn.Infrastructure.Database.Base;

namespace eFormAPI.Web.Infrastructure.Database.Entities
{
    public class SecurityGroup : BaseEntity
    {
        [StringLength(250)] 
        public string Name { get; set; }

        public virtual ICollection<SecurityGroupUser> SecurityGroupUsers { get; set; }
            = new List<SecurityGroupUser>();

        public virtual ICollection<EformInGroup> EformsInGroup { get; set; }
            = new List<EformInGroup>();
    }
}