using EPiServer.Cms.Shell;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Mvc;
using Optimizely.Cms.Preview1.Content;
using Optimizely.Cms.Preview1.Content.Models;

namespace AlloyMvcTemplates.Controllers;
[Route("api/[controller]")]
[ApiController]
public class ReactController : ControllerBase
{
    private readonly IContentRepository _contentRepositoryInteApi;

    public ReactController(IContentRepository contentRepositoryInteApi)
    {
        _contentRepositoryInteApi = contentRepositoryInteApi;
    }

    [HttpGet("GetFormInPageByUrl")]
    public async Task<IActionResult> GetFormInPageByUrl(string url)
    {
        var builder = new EPiServer.UrlBuilder(url);
        var content = UrlResolver.Current.Route(builder, ContextMode.Default);

        if (content is null)
        {
            return NoContent();
        }
        CancellationTokenSource source = new CancellationTokenSource();
        CancellationToken token = source.Token;
        var key = ContentKey.FormatAsKey(content.ContentGuid);
        var pageModel = new PageModel();
        var contentHeadless = await _contentRepositoryInteApi.GetAsync(key, content.LanguageBranch());

        pageModel.Title = contentHeadless.DisplayName;
        pageModel.PageUrl = UrlResolver.Current.GetUrl(content.ContentLink);

        if (contentHeadless.Properties.ContainsKey("MainContentArea"))
        {
            pageModel.Childrens.AddRange(contentHeadless.Properties["MainContentArea"] as IList<IContentComponent>);
        }

        return Ok(pageModel);
    }
}

public class PageModel
{
    public string Title { get; set; }
    public string PageUrl { get; set; }
    public List<IContentComponent> Childrens { get; set; } = new List<IContentComponent>();
}
