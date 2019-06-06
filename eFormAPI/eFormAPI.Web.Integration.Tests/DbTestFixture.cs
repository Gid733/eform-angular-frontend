﻿/*
The MIT License (MIT)

Copyright (c) 2007 - 2019 Microting A/S

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
using eFormAPI.Web.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;

namespace eFormAPI.Web.Integration.Tests
{
    [TestFixture]
    public abstract class DbTestFixture
    {
        protected BaseDbContext DbContext;
        protected string ConnectionString;

        private void GetContext(string connectionStr)
        {

            DbContextOptionsBuilder<BaseDbContext> dbContextOptionsBuilder = new DbContextOptionsBuilder<BaseDbContext>();

            if (ConnectionString.ToLower().Contains("convert zero datetime"))
            {
                dbContextOptionsBuilder.UseMySql(connectionStr);
            }
            else
            {
                dbContextOptionsBuilder.UseSqlServer(connectionStr);
            }
            dbContextOptionsBuilder.UseLazyLoadingProxies(true);
            DbContext = new BaseDbContext(dbContextOptionsBuilder.Options);

            DbContext.Database.Migrate();
            DbContext.Database.EnsureCreated();
        }

        [SetUp]
        public void Setup()
        {
            if (RuntimeInformation.IsOSPlatform(OSPlatform.Windows))
            {
                ConnectionString = @"data source=(LocalDb)\SharedInstance;Initial catalog=angular-tests;Integrated Security=True";
            }
            else
            {
                ConnectionString = @"Server = localhost; port = 3306; Database = angular-tests; user = root; Convert Zero Datetime = true;";
            }

            GetContext(ConnectionString);


            DbContext.Database.SetCommandTimeout(300);

            try
            {
                ClearDb();
            }
            catch
            {

                DbContext.Database.Migrate();

            }

            DoSetup();
        }

        [TearDown]
        public void TearDown()
        {

            ClearDb();

            DbContext.Dispose();
        }

        public void ClearDb()
        {

            Console.WriteLine("ClearDb called.");
            List<string> modelNames = new List<string>();
            modelNames.Add("UserTokens");
            modelNames.Add("UserRoles");
            modelNames.Add("UserLogins");
            modelNames.Add("UserClaims");
            modelNames.Add("SecurityGroups");
            modelNames.Add("Users");
            modelNames.Add("Roles");
            modelNames.Add("RoleClaims");
            modelNames.Add("GroupPermissions");
            modelNames.Add("EformPermissions");
            modelNames.Add("EformInGroups");
            modelNames.Add("MenuItems");
            modelNames.Add("Permissions");
            modelNames.Add("SecurityGroupUsers");


            foreach (var modelName in modelNames)
            {
                try
                {
                    string sqlCmd = string.Empty;
                    if (DbContext.Database.IsMySql())
                    {
                        sqlCmd = string.Format("SET FOREIGN_KEY_CHECKS = 0;TRUNCATE `{0}`.`{1}`", "eformsdk-tests", modelName);
                    }
                    else
                    {
                        sqlCmd = string.Format("DELETE FROM [{0}]", modelName);
                    }
                    DbContext.Database.ExecuteSqlCommand(sqlCmd);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

        }

        public virtual void DoSetup() { }

    }
}
