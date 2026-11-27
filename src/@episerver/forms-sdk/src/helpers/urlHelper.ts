export const extractParams = (urlPath: string) => {
    let relativePath = (urlPath.length > 1 && urlPath !== "/search") ? urlPath : '/en'
    let contentId
    let workId = undefined

    const epiContentPrefix = "/EPiServer/CMS/Content/";
    if (relativePath.startsWith(epiContentPrefix)) {
        relativePath = relativePath.substring(epiContentPrefix.length - 1);
    }

    if (relativePath.endsWith('/')) {
        relativePath = relativePath.slice(0, -1)
    }

    if (relativePath.includes(",")) {
        const [, , idString] = relativePath.split(",")
        if (idString.includes("_")) {
            [contentId, workId] = idString.split("_").map(x => parseInt(x));

        } else {
            contentId = parseInt(idString)
        }
        relativePath = relativePath.substring(0, relativePath.indexOf(','));
    }

    if (relativePath.endsWith('/')) {
        relativePath = relativePath.slice(0, -1)
    }

    const urlSegments = relativePath.split('/')
    let language = urlSegments.length ? 
        urlSegments.find(s => 
            s.length === 2 || //2 letter language code, ex: en, sv,...
            (s.indexOf("-") === 2 && s.length === 5) //##-## format language code, ex: nl-BE, vi-VN,...
        ) 
        : "en"

    return { relativePath, locales: language, language, contentId, workId }
}

/**
 * Resolves the "redirect after submit" URL of a form.
 * The API returns it relative to the CMS site (for example `/globalassets/image.jpg`),
 * and the CMS site is the host of the Headless Form API, so it is resolved against `baseUrl`.
 * Absolute URLs are returned unchanged.
 *
 * @param redirectToPage URL returned by the API
 * @param baseUrl Base URL of the Headless Form API, the same value passed to the Form component
 * @param origin Used when `baseUrl` is relative (for example "/" when the frontend proxies the API) or invalid
 */
export const resolveRedirectUrl = (redirectToPage: string, baseUrl?: string, origin: string = window.location.origin): string => {
    let base: URL;
    try {
        base = new URL(baseUrl || "/", origin);
    } catch {
        base = new URL(origin);
    }

    return new URL(redirectToPage, base).href;
}
