using EPiServer;
using EPiServer.Core;
using EPiServer.Forms.Implementation.Elements;
using EPiServer.SpecializedProperties;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace AlloyMvcTemplates.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ReactController : ControllerBase
{
    private readonly IUrlResolver _urlResolver;
    private readonly IContentLoader _contentLoader;

    public ReactController(IUrlResolver urlResolver, IContentLoader contentLoader)
    {
        _urlResolver = urlResolver;
        _contentLoader = contentLoader;
    }

    [HttpGet("GetFormInPageByUrl")]
    public IActionResult GetFormInPageByUrl(string url)
    {
        var builder = new UrlBuilder(url);

        var routeData = _urlResolver.Route(builder, new RouteArguments
        {
            ContextMode = ContextMode.Default,
            MatchHost = HostMatching.Default
        });

        var pageContent = routeData?.Content;

        if (pageContent is null)
        {
            return NoContent();
        }

        var pageModel = new PageModel
        {
            Title = pageContent.Name,
            PageUrl = _urlResolver.GetUrl(pageContent.ContentLink, null, null)
        };

        var contentArea = (pageContent.Property["MainContentArea"] as PropertyContentArea)?.ContentArea;
        foreach (var item in contentArea?.Items ?? Enumerable.Empty<ContentAreaItem>())
        {
            var contentItem = _contentLoader.Get<IContent>(item.ContentLink);

            if (contentItem is FormContainerBlock)
            {
                pageModel.FormKeys.Add(contentItem.ContentGuid.ToString("N"));
            }
        }

        return Ok(pageModel);
    }
}

public class PageModel
{
    public string Title { get; set; }
    public string PageUrl { get; set; }
    public List<string> FormKeys { get; set; } = new List<string>();
}