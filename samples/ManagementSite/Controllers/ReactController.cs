using EPiServer.Web;
using EPiServer.Web.Routing;
using Microsoft.AspNetCore.Mvc;
using Optimizely.Cms.Content;
using Optimizely.Cms.Content.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

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

        var key = ContentKey.FormatAsKey(content.ContentGuid);
        var pageModel = new PageModel();
        var contentHeadless = await _contentRepositoryInteApi.GetAsync(new ContentReference(key), new GetContentOptions());

        pageModel.Title = contentHeadless.DisplayName;
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
    public List<IContentComponent> Childrens { get; set; } = new List<IContentComponent>();
}
