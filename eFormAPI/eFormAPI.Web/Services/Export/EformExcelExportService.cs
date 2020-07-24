﻿namespace eFormAPI.Web.Services.Export
{
    using System;
    using System.Globalization;
    using System.IO;
    using System.Threading.Tasks;
    using Abstractions;
    using Controllers.Eforms;
    using eFormAPI.Web.Infrastructure.Models;
    using Microsoft.Extensions.Logging;
    using Microting.eForm.Dto;
    using Microting.eFormApi.BasePn.Abstractions;
    using Microting.eFormApi.BasePn.Infrastructure.Models.API;
    using OfficeOpenXml;

    public class EformExcelExportService : IEformExcelExportService
    {
        private readonly IEFormCoreService _coreHelper;
        private readonly ILocalizationService _localizationService;
        private readonly ILogger<EformExcelExportService> _logger;

        public EformExcelExportService(
            IEFormCoreService coreHelper,
            ILocalizationService localizationService,
            ILogger<EformExcelExportService> logger)
        {
            _coreHelper = coreHelper;
            _localizationService = localizationService;
            _logger = logger;
        }


        public async Task<OperationDataResult<Stream>> EformExport(EformDownloadExcelModel excelModel)
        {
            try
            {
                var core = await _coreHelper.GetCore();
                var cultureInfo = new CultureInfo("de-DE");
                TimeZoneInfo timeZoneInfo;

                try
                {
                    timeZoneInfo = TimeZoneInfo.FindSystemTimeZoneById("Europe/Copenhagen");
                }
                catch
                {
                    timeZoneInfo = TimeZoneInfo.Local;
                }

                var customPathForUploadedData = $"{await core.GetSdkSetting(Settings.httpServerAddress)}/" +
                                                "api/template-files/get-image/";

                var dataSet = await core.GenerateDataSetFromCases(
                    excelModel.TemplateId,
                    excelModel.DateFrom,
                    excelModel.DateTo,
                    customPathForUploadedData,
                    ",",
                    "",
                    false,
                    cultureInfo,
                    timeZoneInfo);

                if (dataSet == null)
                {
                    return new OperationDataResult<Stream>(
                        false,
                        _localizationService.GetString("DataNotFound"));
                }

                var fileName = $"{excelModel.TemplateId}_eform_excel.xlsx";
                var excelSaveFolder =
                    Path.Combine(await core.GetSdkSetting(Settings.fileLocationPicture),
                        Path.Combine("excel", fileName));

                Stream stream;
                if (core.GetSdkSetting(Settings.swiftEnabled).Result.ToLower() == "true")
                {
                    var swiftResult = await core.GetFileFromSwiftStorage(fileName);
                    if (!swiftResult.IsSuccess)
                    {
                        return new OperationDataResult<Stream>(
                            false,
                            _localizationService.GetString("ExcelTemplateNotFoundInStorage"));
                    }

                    stream = swiftResult.ObjectStreamContent;
                }
                else if (core.GetSdkSetting(Settings.s3Enabled).Result.ToLower() == "true")
                {
                    var s3Result = await core.GetFileFromS3Storage(fileName);

                    if (s3Result == null)
                    {
                        return new OperationDataResult<Stream>(
                            false,
                            _localizationService.GetString("ExcelTemplateNotFoundInStorage"));
                    }

                    stream = s3Result.ResponseStream;
                }
                else
                {
                    if (File.Exists(excelSaveFolder))
                    {
                        stream = File.Open(excelSaveFolder, FileMode.Open);
                    }
                    else
                    {
                        return new OperationDataResult<Stream>(
                            false,
                            _localizationService.GetString("ExcelTemplateNotFoundInStorage"));
                    }
                }

                Stream result;
                using (var package = new ExcelPackage(stream))
                {
                    var worksheet = package.Workbook.Worksheets.Add(_localizationService.GetString("eFormReport"));

                    for (var y = 0; y < dataSet.Count; y++)
                    {
                        var dataX = dataSet[y];
                        for (var x = 0; x < dataX.Count; x++)
                        {
                            var dataY = dataX[x];

                            worksheet.Cells[x+1, y+1].Value = dataY;

                            if (x == 0)
                            {
                                worksheet.Cells[x + 1, y + 1].Style.Font.Bold = true;
                            }
                        }
                    }


                    result = new MemoryStream(package.GetAsByteArray());
                    stream.Dispose();
                }

                return new OperationDataResult<Stream>(true, result);
            }
            catch (Exception e)
            {
                _logger.LogError(e, e.Message);
                return new OperationDataResult<Stream>(
                    false,
                    _localizationService.GetString("ErrorWhileExportingExcelFile"));
            }
        }
    }
}