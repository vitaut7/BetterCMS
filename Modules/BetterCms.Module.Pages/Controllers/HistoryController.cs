﻿using System.Web.Mvc;

using BetterCms.Core.Security;
using BetterCms.Module.Pages.Command.History.DestroyContentDraft;
using BetterCms.Module.Pages.Command.History.GetContentHistory;
using BetterCms.Module.Pages.Command.History.GetContentVersion;
using BetterCms.Module.Pages.Command.History.RestoreContentVersion;
using BetterCms.Module.Root;
using BetterCms.Module.Root.Mvc;

using Microsoft.Web.Mvc;

namespace BetterCms.Module.Pages.Controllers
{
    /// <summary>
    /// Content history management.
    /// </summary>
    [BcmsAuthorize]
    [ActionLinkArea(PagesModuleDescriptor.PagesAreaName)]
    public class HistoryController : CmsControllerBase
    {
        /// <summary>
        /// Contents the history.
        /// </summary>
        /// <param name="contentId">The content id.</param>
        /// <returns>Content history view html.</returns>
        [HttpGet]
        [BcmsAuthorize(RootModuleConstants.UserRoles.EditContent, RootModuleConstants.UserRoles.PublishContent, RootModuleConstants.UserRoles.Administration)]
        public ActionResult ContentHistory(string contentId)
        {
            var model = GetCommand<GetContentHistoryCommand>().ExecuteCommand(new GetContentHistoryRequest
                                                                                      {
                                                                                          ContentId = contentId.ToGuidOrDefault(),
                                                                                      });
            return View(model);
        }

        /// <summary>
        /// Contents the history.
        /// </summary>
        /// <param name="request">The request.</param>
        /// <returns>Content history view html.</returns>
        [HttpPost]
        [BcmsAuthorize(RootModuleConstants.UserRoles.EditContent, RootModuleConstants.UserRoles.PublishContent)]
        public ActionResult ContentHistory(GetContentHistoryRequest request)
        {
            var model = GetCommand<GetContentHistoryCommand>().ExecuteCommand(request);

            return View(model);
        }

        /// <summary>
        /// Contents the version.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Content preview html.</returns>
        [HttpGet]
        [BcmsAuthorize(RootModuleConstants.UserRoles.EditContent, RootModuleConstants.UserRoles.PublishContent, RootModuleConstants.UserRoles.Administration)]
        public ActionResult ContentVersion(string id)
        {
            var model = GetCommand<GetContentVersionCommand>().ExecuteCommand(id.ToGuidOrDefault());

            return View(model);
        }

        /// <summary>
        /// Restores the page content version.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <returns>Json result.</returns>
        [HttpPost]
        [BcmsAuthorize(RootModuleConstants.UserRoles.PublishContent, RootModuleConstants.UserRoles.Administration)]
        public ActionResult RestorePageContentVersion(string id)
        {
            var result = GetCommand<RestoreContentVersionCommand>().ExecuteCommand(id.ToGuidOrDefault());

            return WireJson(result);
        }

        /// <summary>
        /// Destroys the content draft.
        /// </summary>
        /// <param name="id">The id.</param>
        /// <param name="version">The version.</param>
        /// <returns>
        /// Json result.
        /// </returns>
        [HttpPost]
        [BcmsAuthorize(RootModuleConstants.UserRoles.EditContent, RootModuleConstants.UserRoles.Administration)]
        public ActionResult DestroyContentDraft(string id, string version)
        {
            var request = new DestroyContentDraftCommandRequest
                              {
                                  Id = id.ToGuidOrDefault(),
                                  Version = version.ToIntOrDefault()
                              };
            var response = GetCommand<DestroyContentDraftCommand>().ExecuteCommand(request);

            return WireJson(response != null, response);
        }
    }
}
