﻿using System.Collections.Generic;
using eFormData;

namespace eFormAPI.Common.Models.SearchableList
{
    public class AdvEntitySearchableGroupEditModel
    {
        public string Name { get; set; }
        public string GroupUid { get; set; }
        public List<EntityItem> AdvEntitySearchableItemModels { get; set; }
    }
}
