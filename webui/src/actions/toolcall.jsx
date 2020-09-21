import { iso_639_3_to_639_1, image } from './utils';

export function getInvocationURL(tool, resourceList, matchIndex) {
    if (!resourceList || !resourceList.length) {
        return false;
    }
    let queryParams = "";
    if (tool.queryParameters) {
        for (const param of tool.queryParameters) {

            const value = getBoundValue(param, resourceList, tool.inputs, tool.matches[matchIndex]);
            if (queryParams !== "") {
                queryParams += "&";
            }
            queryParams += encodeURIComponent(param.name);
            queryParams += "=";
            queryParams += encodeURIComponent(value);
        }
    }

    let pathParams = "";
    if (tool.pathParameters) {
        for (const param of tool.pathParameters) {
            const value = getBoundValue(param, resourceList, tool.inputs, tool.matches[matchIndex]);
            pathParams += "/";
            pathParams += encodeURIComponent(value);
        }
    }

    let url = tool.url;

    if (pathParams) {
        if (url.endsWith('/')) {
            url = url.substring(0, url.length-1);
        }
        url += pathParams;
    }

    if (queryParams) {
        // need to check whether tool.url already contains parameters (that is, a '?')
        if (tool.url.indexOf("\?") !== -1  || tool.url.includes('?') || tool.url.includes('\?'))  {
            url += "&" + queryParams;
        } else {
            url += "?" + queryParams;
        }
    }

    return url;
}


function getBoundValue(param, resourceList, inputs, match) {
    if (!param.bind) {
        return param.value;
    }

    const [inputID, bind] = param.bind.split("/");

    const inputIndex = inputs.findIndex(input => input.id == inputID);
    if (inputIndex < 0) {
        console.error("cannot find input with id:", inputID);
        return null;
    }
    const resourceIndex = match[inputIndex];
    const resource = resourceList[resourceIndex];

    if (bind === 'dataurl') {
        return resource.localLink;
    } else if (bind === 'language') {
        const lang = resource.profile.language;
        if (param.encoding == "639-1") {
            // some tools expect an ISO 639-1 language parameter
            return iso_639_3_to_639_1(lang);
        }
        return lang;
    } else if (bind === 'type') {
        return resource.profile.mediaType;
    } else if (bind === 'content') {
        return resource.content;
    } else {
        console.error("unexpected bind value:", bind);
        return null;
    }
}
