﻿using System;
using eFormAPI.BasePn.Abstractions;
using eFormAPI.BasePn.Infrastructure.Models.API;
using eFormAPI.BasePn.Models;
using eFormAPI.BasePn.Models.Templates;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace eFormAPI.Web.Controllers
{
    [Authorize]
    public class TemplatesController : Controller
    {
        private readonly ITemplatesService _templatesService;

        public TemplatesController(ITemplatesService templatesService)
        {
            _templatesService = templatesService;
        }

        [HttpPost]
        public IActionResult Index([FromBody] TemplateRequestModel templateRequestModel)
        {
            try
            {
                return Ok(_templatesService.Index(templateRequestModel));
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpGet]
        public IActionResult Get(int id)
        {
            try
            {
                return Ok(_templatesService.Get(id));
            }
            catch (Exception)
            {
                return Unauthorized();
            }
        }

        [HttpPost]
        public OperationResult Create([FromBody] EFormXmlModel eFormXmlModel)
        {
            return _templatesService.Create(eFormXmlModel);
        }

        [HttpGet]
        public OperationResult Delete(int id)
        {
            return _templatesService.Delete(id);
        }

        [HttpPost]
        public OperationDataResult<DeployToModel> DeployTo(int id)
        {
            return _templatesService.DeployTo(id);
        }

        [HttpPost]
        public OperationResult Deploy([FromBody] DeployModel deployModel)
        {
            return _templatesService.Deploy(deployModel);
        }
    }
}