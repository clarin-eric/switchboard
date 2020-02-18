import { processLanguage, processMediatype, iso_639_3_to_639_1, image } from './utils';

export function getInvocationURL(tool, resource) {
    if (!resource) {
        return false;
    }

    const parameters = {};
    for (const param in tool.parameters) {
        const key = (tool.mapping && tool.mapping[param]) || param;

        let value = tool.parameters[param];
        if (param === 'input') {
            // use locallink to allow cors (see https://github.com/clarin-eric/switchboard/issues/2)
            value = resource.localLink;
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

        parameters[key] = value;
    }
    // console.log("parameters=", parameters);

    const queryString = Object.entries(parameters)
        .map(kv => kv.map(encodeURIComponent).join('='))
        .join('&');

    let url = "";
    // need to check whether tool.url already contains parameters (that is, a '?')
    if (tool.url.indexOf("\?") !== -1  || tool.url.includes('?') || tool.url.includes('\?'))  {
        url = tool.url + "&" + queryString;
    } else {
        url = tool.url + "?" + queryString;
    }
    return url;
}
