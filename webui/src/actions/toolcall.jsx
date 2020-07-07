import { processLanguage, processMediatype, iso_639_3_to_639_1, image } from './utils';

export function getInvocationURL(tool, resource) {
    if (!resource) {
        return false;
    }

    const parameters = {};
    let pathParams = "";
    for (const param in tool.parameters) {
        if (tool.mapping && tool.mapping[param] === null) {
            // this is a path parameter
            continue;
        }

        const key = (tool.mapping && tool.mapping[param]) || param;
        const isPathParam = (tool.mapping && tool.mapping[param] === "");

        let value = tool.parameters[param];
        if (param === 'input') {
            // use locallink to allow cors (see https://github.com/clarin-eric/switchboard/issues/2)
            value = resource.localLink;
        } else if (param === 'content' && resource.content) {
            value = resource.content;
        } else if (param === 'lang') {
            if (tool.langEncoding == "639-1") {
                // some tools expect an ISO 639-1 language parameter
                value = iso_639_3_to_639_1(resource.profile.language);
            } else {
                value = resource.profile.language;
            }
        } else if (param === 'type') {
            value = resource.profile.mediaType;
        }

        if (isPathParam) {
            pathParams += "/";
            pathParams += encodeURIComponent(value);
        } else {
            parameters[key] = value;
        }
    }
    // console.log("parameters=", parameters);

    const queryString = Object.entries(parameters)
        .map(kv => kv.map(encodeURIComponent).join('='))
        .join('&');

    let url = tool.url;
    if (pathParams) {
        if (url.endsWith('/')) {
            url = url.substring(0, url.length-1);
        }
        url += pathParams;
    }
    if (queryString) {
        // need to check whether tool.url already contains parameters (that is, a '?')
        if (tool.url.indexOf("\?") !== -1  || tool.url.includes('?') || tool.url.includes('\?'))  {
            url += "&" + queryString;
        } else {
            url += "?" + queryString;
        }
    }
    return url;
}
