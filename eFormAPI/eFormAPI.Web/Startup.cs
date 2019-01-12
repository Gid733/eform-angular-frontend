﻿using System;
using System.Collections.Generic;
using System.IO;
using eFormAPI.Web.Abstractions;
using eFormAPI.Web.Abstractions.Advanced;
using eFormAPI.Web.Abstractions.Eforms;
using eFormAPI.Web.Abstractions.Security;
using eFormAPI.Web.Hosting.Extensions;
using eFormAPI.Web.Hosting.Helpers;
using eFormAPI.Web.Infrastructure.Database;
using eFormAPI.Web.Services;
using eFormAPI.Web.Services.Security;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Swashbuckle.AspNetCore.Swagger;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.PlatformAbstractions;
using Microsoft.Extensions.Localization;
using Microting.eFormApi.BasePn;
using Microting.eFormApi.BasePn.Abstractions;
using Microting.eFormApi.BasePn.Infrastructure.Database.Entities;
using Microting.eFormApi.BasePn.Infrastructure.Models.Application;
using Microting.eFormApi.BasePn.Localization;
using Microting.eFormApi.BasePn.Localization.Abstractions;
using Microting.eFormApi.BasePn.Services;

namespace eFormAPI.Web
{
    public class Startup
    {
        public static List<IEformPlugin> Plugins = new List<IEformPlugin>();

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            Plugins = PluginHelper.GetPlugins(Configuration);
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Configuration
            //services.AddSingleton(Configuration);
            services.AddOptions();
            services.AddLogging(loggingBuilder =>
            {
                loggingBuilder.AddConfiguration(Configuration.GetSection("Logging"));
                loggingBuilder.AddConsole();
                loggingBuilder.AddDebug();
            });
            // Entity framework
//#if DEBUG
//            services.AddEntityFrameworkMySql()
//                .AddDbContext<BaseDbContext>(
//                o => o.UseMySql(@"Server = localhost; port = 3306; Database = angular-tests; user = root; Convert Zero Datetime = true;",
//                    b => b.MigrationsAssembly("eFormAPI.Web")));
//#else
            if (!string.IsNullOrEmpty(Configuration.MyConnectionString()))
            {
                if (Configuration.MyConnectionString().ToLower().Contains("convert zero datetime"))
                {
                    services.AddEntityFrameworkMySql()
                        .AddDbContext<BaseDbContext>(o => o.UseMySql(Configuration.MyConnectionString(),
                            b => b.MigrationsAssembly("eFormAPI.Web")));
                }
                else
                {
                    services.AddEntityFrameworkSqlServer()
                        .AddDbContext<BaseDbContext>(o => o.UseSqlServer(Configuration.MyConnectionString(),
                            b => b.MigrationsAssembly("eFormAPI.Web")));
                }   
            }
            
//#endif
            // plugins
            services.AddEFormPluginsDbContext(Configuration, Plugins);
            // Identity services
            services.AddIdentity<EformUser, EformRole>()
                .AddEntityFrameworkStores<BaseDbContext>()
                .AddDefaultTokenProviders();
            // Identity configuration
            services.Configure<IdentityOptions>(options =>
            {
                // Password settings
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireUppercase = false;
                options.Password.RequireLowercase = false;
                // Lockout settings
                options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(30);
                options.Lockout.MaxFailedAccessAttempts = 10;
                options.Lockout.AllowedForNewUsers = true;
                // User settings
                options.User.RequireUniqueEmail = true;
            });

            // Authentication
            services.AddEFormAuth(Configuration);
            // Localiation
            services.AddTransient<IEformLocalizerFactory, JsonStringLocalizerFactory>();
            services.AddTransient<IStringLocalizerFactory, ResourceManagerStringLocalizerFactory>();
            services.AddTransient<IStringLocalizer, JsonStringLocalizer>();
            services.AddLocalization(options => options.ResourcesPath = "Resources");
            // MVC and API services with Plugins
            services.AddEFormMvc(Plugins);
            // Writable options
            services.ConfigureWritable<ConnectionStrings>(Configuration.GetSection("ConnectionStrings"), "connection.json");
            // Database options
            services.ConfigureDbOptions<ApplicationSettings>(Configuration.GetSection("ApplicationSettings"));
            services.ConfigureDbOptions<EmailSettings>(Configuration.GetSection("EmailSettings"));
            services.ConfigureDbOptions<LoginPageSettings>(Configuration.GetSection("LoginPageSettings"));
            services.ConfigureDbOptions<HeaderSettings>(Configuration.GetSection("HeaderSettings"));
            services.ConfigureDbOptions<ConnectionStringsSdk>(Configuration.GetSection("ConnectionStringsSdk"));
            services.ConfigureDbOptions<EformTokenOptions>(Configuration.GetSection("EformTokenOptions"));
            // Form options
            services.Configure<FormOptions>(x =>
            {
                x.ValueLengthLimit = int.MaxValue;
                x.MultipartBodyLengthLimit = long.MaxValue; // In case of multipart
            });
            // Register the Swagger generator, defining one or more Swagger documents
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new Info
                {
                    Version = "v1",
                    Title = "eForm API",
                    Description = "API documentation"
                });
                //Set the comments path for the swagger json and ui.
                var basePath = PlatformServices.Default.Application.ApplicationBasePath;
                var xmlPath = Path.Combine(basePath, "API.doc.xml");
                c.IncludeXmlComments(xmlPath);
                c.AddSecurityDefinition("Bearer", new ApiKeyScheme
                {
                    Description =
                        "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
                    Name = "Authorization",
                    In = "header",
                    Type = "apiKey"
                });
            });
            // plugins
            services.AddEFormPlugins(Plugins);
            ConnectServices(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
        {
            if (env.IsDevelopment())
            {
                app.UseForwardedHeaders(new ForwardedHeadersOptions
                {
                    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
                    // IIS is also tagging a X-Forwarded-For header on, so we need to increase this limit, 
                    // otherwise the X-Forwarded-For we are passing along from the browser will be ignored
                    ForwardLimit = 2
                });
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            if (env.IsDevelopment())
            {
                //loggerFactory.AddConsole(Configuration.GetSection("Logging"));
                //loggerFactory.AddDebug();
            }


            app.UseDefaultFiles();
            app.UseStaticFiles();
            app.UseAuthentication();
            // Plugins
            app.UseEFormLocalization();
            // MVC
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    "default",
                    "api/{controller=Home}/{action=Index}/{id?}");
            });
            if (env.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI(c => { c.SwaggerEndpoint("/swagger/v1/swagger.json", "API V1"); });
            }

            // Plugins
            app.UseEFormPlugins(Plugins);
            // Route all unknown requests to app root
            app.UseAngularMiddleware(env);
        }


        private static void ConnectServices(IServiceCollection services)
        {
            services.AddHttpContextAccessor();
            services.AddSingleton<ILocalizationService, LocalizationService>();
            services.AddScoped<IEFormCoreService, EFormCoreService>();
            services.AddScoped<ITagsService, TagsService>();
            services.AddScoped<ITemplateColumnsService, TemplateColumnsService>();
            services.AddScoped<IUnitsService, UnitsService>();
            services.AddScoped<IWorkersService, WorkersService>();
            services.AddScoped<ISitesService, SitesService>();
            services.AddScoped<ISimpleSitesService, SimpleSitesService>();
            services.AddTransient<IEmailSender, EmailSender>();
            services.AddScoped<IEntitySearchService, EntitySearchService>();
            services.AddScoped<IEntitySelectService, EntitySelectService>();
            services.AddScoped<ICasesService, CasesService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IAccountService, AccountService>();
            services.AddScoped<IAuthService, AuthService>();
            services.AddScoped<IAdminService, AdminService>();
            services.AddScoped<ISettingsService, SettingsService>();
            services.AddScoped<ITemplatesService, TemplatesService>();
            services.AddScoped<ISecurityGroupService, SecurityGroupService>();
            services.AddScoped<IClaimsService, ClaimsService>();
            services.AddScoped<IPermissionsService, PermissionsService>();
            services.AddScoped<IMenuService, MenuService>();
            services.AddScoped<IEformGroupService, EformGroupService>();
            services.AddScoped<IEformPermissionsService, EformPermissionsService>();
            services.AddScoped<IEformReportsService, EformReportsService>();
            services.AddScoped<IPluginsSettingsService, PluginsSettingsService>();
        }
    }
}