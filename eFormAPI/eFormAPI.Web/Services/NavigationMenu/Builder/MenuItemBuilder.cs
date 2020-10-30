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

namespace eFormAPI.Web.Services.NavigationMenu.Builder
{
    using eFormAPI.Web.Infrastructure.Database;
    using eFormAPI.Web.Infrastructure.Database.Entities.Menu;
    using System.Collections.Generic;

    public class MenuItemBuilder
    {
        public NavigationMenuItemModel MenuItemModel { get; set; }

        private int currentPosition = 0;
        private List<AbstractBehavior> _behaviors;

        private readonly BaseDbContext _dbContext;

        public MenuItemBuilder(BaseDbContext dbContext, NavigationMenuItemModel menuItemModel, int currentPosition, int? parentId = null)
        {
            MenuItemModel = menuItemModel;
            _dbContext = dbContext;
            this.currentPosition = currentPosition;
            _behaviors = new List<AbstractBehavior>()
                {
                    new SimpleLinkBehavior(_dbContext, MenuItemModel, parentId),
                    new CustomLinkBehavior(_dbContext, MenuItemModel, parentId),
                    new DropdownBehavior(_dbContext, MenuItemModel, parentId),
                };
        }

        public MenuItem Build()
        {
            var menuItemParent = new MenuItem()
            {
                Position = currentPosition,
                Type = MenuItemModel.Type,
                Link = MenuItemModel.Link,
            };

            foreach (var behavior in _behaviors)
            {
                if (behavior.IsExecute())
                {
                    behavior.Setup(menuItemParent);
                }
            }

            return menuItemParent;
        }
    }
}