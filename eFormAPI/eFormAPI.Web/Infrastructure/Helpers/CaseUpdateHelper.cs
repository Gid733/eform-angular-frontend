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
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using eFormAPI.Web.Infrastructure.Models.Cases.Request;

namespace eFormAPI.Web.Infrastructure.Helpers
{
    public static class CaseUpdateHelper
    {
        public static List<string> GetStatusByEditRequest(CaseEditRequest editRequest)
        {
            var list = new List<string>();
            switch (editRequest.Status)
            {
                case "approved":
                    list.Add($"{editRequest.Id}|approved");
                    break;
                case "not_approved":
                    list.Add($"{editRequest.Id}|not_approved");
                    break;
                case "review":
                    list.Add($"{editRequest.Id}|review");
                    break;
            }

            return list;
        }

        public static List<string> GetCheckList(CaseEditRequest editRequest)
        {
            var list = new List<string>();
            list.AddRange(GetStatusByEditRequest(editRequest));
            editRequest?.ElementList?.ForEach(edit => { list.AddRange(GetCheckList(edit)); });
            return list;
        }


        public static List<string> GetFieldValuesByRequestField(CaseEditRequestField editRequestField)
        {
            var list = new List<string>();

            switch (editRequestField.FieldType)
            {
                case "CheckBox":
                    var checkBoxfirst = editRequestField?.FieldValues?.First();
                    if (checkBoxfirst?.Value != null && checkBoxfirst?.FieldId != null)
                    {
                        string val;
                        if (checkBoxfirst.Value.ToString() == "1" || checkBoxfirst.Value.ToString() == "checked")
                        {
                            val = $"{checkBoxfirst.FieldId}|checked";
                        }
                        else
                        {
                            val = $"{checkBoxfirst.FieldId}|unchecked";
                        }
                        list.Add(val);
                    }

                    break;
                case "Comment":
                    var commentFirst = editRequestField?.FieldValues?.First();
                    if (commentFirst?.Value != null && commentFirst?.FieldId != null)
                    {
                        var val = $"{commentFirst.FieldId}|{commentFirst.Value.ToString().Replace("</p>", "<br>").Replace("<p>", "").Replace("<div>", "").Replace("</div>", "<br>").Replace("&nbsp;", "").Replace("</span>", "").Replace("<span style=\"font-size: 1rem;\">", "").Replace("</br>", "<br>")}";
                        list.Add(val);
                    }

                    break;
                case "Number":
                    var numberFirst = editRequestField?.FieldValues?.First();
                    if (numberFirst?.Value != null && numberFirst?.FieldId != null)
                    {
                        var val = $"{numberFirst.FieldId}|{numberFirst.Value.ToString()}";
                        list.Add(val);
                    }

                    break;
                case "Text":
                    var textFirst = editRequestField?.FieldValues?.First();
                    if (textFirst?.Value != null && textFirst?.FieldId != null)
                    {
                        var val = $"{textFirst.FieldId}|{textFirst.Value.ToString()}";
                        list.Add(val);
                    }

                    break;
                case "Date":
                    var dateFirst = editRequestField?.FieldValues?.First();
                    if (dateFirst?.Value != null && dateFirst?.FieldId != null)
                    {
                        try
                        {
                            var dateResult =
                                DateTime.TryParseExact(dateFirst.Value.ToString(),
                                    "yyyy-MM-dd",
                                    null,
                                    DateTimeStyles.None,
                                    out DateTime date);
                            if (dateResult)
                            {
                                var val = $"{dateFirst.FieldId}|{date:yyyy-MM-dd}";
                                list.Add(val);
                            }
                        }
                        catch (Exception e)
                        {
                            Console.WriteLine(e);
                        }
                    }

                    break;
                case "SingleSelect":
                    var singleSelect = editRequestField?.FieldValues?.First();
                    if (singleSelect?.Value != null && singleSelect?.Value != "0" && singleSelect?.FieldId != null)
                    {
                        var val = $"{singleSelect.FieldId}|{singleSelect.Value.ToString()}";
                        list.Add(val);
                    }

                    break;
                case "EntitySearch":
                    var entitySearch = editRequestField?.FieldValues?.First();
                    if (entitySearch?.Value != null && entitySearch?.Value != "0" && entitySearch?.FieldId != null)
                    {
                        var val = $"{entitySearch.FieldId}|{entitySearch.Value.ToString()}";
                        list.Add(val);
                    }

                    break;
                case "EntitySelect":
                    var entitySelect = editRequestField?.FieldValues?.First();
                    if (entitySelect?.Value != null && entitySelect?.FieldId != null)
                    {
                        var val = $"{entitySelect.FieldId}|{entitySelect.Value.ToString()}";
                        list.Add(val);
                    }

                    break;
                case "MultiSelect":
                    var multiFirst = editRequestField?.FieldValues?.First();
                    if (multiFirst?.Value != null && multiFirst?.FieldId != null)
                    {
                        var val = $"{multiFirst.FieldId}|{multiFirst.Value.ToString()}";
                        list.Add(val);
                    }

                    break;
                case "Audio":
                    var audioFirst = editRequestField?.FieldValues?.First();
                    if (audioFirst?.Value != null && audioFirst?.FieldId != null)
                    {
                        var val = $"{audioFirst.FieldId}|{audioFirst.Value.ToString()}";
                        list.Add(val);
                    }

                    break;
            }

            return list;
        }


        public static List<string> GetFieldList(CaseEditRequest editRequest)
        {
            var list = new List<string>();
            // case 1 (It is field list)
            editRequest.Fields.ForEach(field => { list.AddRange(GetFieldValuesByRequestField(field)); });
            // case 2 (It is group field list)
            editRequest.GroupFields.ForEach(fields =>
            {
                fields.Fields.ForEach(field => { list.AddRange(GetFieldValuesByRequestField(field)); });
            });
            // case 3 (It is element list)
            editRequest?.ElementList?.ForEach(edit => { list.AddRange(GetFieldList(edit)); });
            return list;
        }
    }
}