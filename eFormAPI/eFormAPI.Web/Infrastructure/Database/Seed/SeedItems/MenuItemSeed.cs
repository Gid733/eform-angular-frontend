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

namespace eFormAPI.Web.Infrastructure.Database.Seed.SeedItems
{
    using Const;
    using Entities.Menu;
    using Microsoft.EntityFrameworkCore;

    public static class MenuItemSeed
    {
        public static ModelBuilder AddDefaultMenu(this ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MenuItem>().HasData(
                new MenuItem
                {
                    Id = 1,
                    MenuTemplateId = MenuTemplateIds.MyEforms,
                    Position = 0,
                },
                new MenuItem
                {
                    Id = 2,
                    MenuTemplateId = MenuTemplateIds.DeviceUsers,
                    Position = 1,
                },
                new MenuItem
                {
                    Id = 3,
                    MenuTemplateId = MenuTemplateIds.Advanced,
                    Position = 2,
                },
                new MenuItem
                {
                    Id = 4,
                    MenuTemplateId = MenuTemplateIds.Sites,
                    Position = 0,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 5,
                    MenuTemplateId = MenuTemplateIds.Workers,
                    Position = 1,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 6,
                    MenuTemplateId = MenuTemplateIds.Units,
                    Position = 2,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 7,
                    MenuTemplateId = MenuTemplateIds.SearchableList,
                    Position = 3,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 8,
                    MenuTemplateId = MenuTemplateIds.SelectableList,
                    Position = 4,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 9,
                    MenuTemplateId = MenuTemplateIds.ApplicationSettings,
                    Position = 6,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 10,
                    MenuTemplateId = MenuTemplateIds.PluginsSettings,
                    Position = 8,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 11,
                    MenuTemplateId = MenuTemplateIds.Folders,
                    Position = 5,
                    ParentId = 3,
                },
                new MenuItem
                {
                    Id = 12,
                    MenuTemplateId = MenuTemplateIds.EmailRecipients,
                    Position = 7,
                    ParentId = 3,
                }
            );
            return modelBuilder;
        }
    }
}