import { iso_639_3_to_639_1, image } from './utils';

/// returns an object which can contain the 'invocationURL' or 'error' keys
export function getInvocationURL(tool, resourceList) {
    if (!tool.webApplication) {
        return {};
    }
    if (!resourceList || !resourceList.length) {
        return {};
    }
    const webapp = tool.webApplication;
    const match = tool.matches[tool.invokeMatchIndex];

    let queryParams = "";
    if (webapp.queryParameters) {
        for (const param of webapp.queryParameters) {
            const value = getBoundValue(param, resourceList, tool.inputs, match);
            if (value.error) {
                return {error: value.error}
            }
            if (queryParams !== "") {
                queryParams += "&";
            }
            queryParams += encodeURIComponent(param.name);
            queryParams += "=";
            queryParams += encodeURIComponent(value);
        }
    }

    let pathParams = "";
    if (webapp.pathParameters) {
        for (const param of webapp.pathParameters) {
            const value = getBoundValue(param, resourceList, tool.inputs, match);
            if (value.error) {
                return {error: value.error}
            }
            pathParams += "/";
            pathParams += encodeURIComponent(value);
        }
    }

    let url = webapp.url;

    if (pathParams) {
        if (url.endsWith('/')) {
            url = url.substring(0, url.length-1);
        }
        url += pathParams;
    }

    if (queryParams) {
        // need to check whether webapp.url already contains parameters (that is, a '?')
        if (webapp.url.indexOf("\?") !== -1  || webapp.url.includes('?') || webapp.url.includes('\?'))  {
            url += "&" + queryParams;
        } else {
            url += "?" + queryParams;
        }
    }

    return {invocationURL: url};
}


function getBoundValue(param, resourceList, inputs, match) {
    if (!param.bind) {
        if (param.value) {
            return param.value
        } else {
            console.error("missing param bind and value:", param);
            return {error: "Incorrect tool specification: " + param.name};
        }
    }

    const [inputID, bind] = param.bind.split("/");

    const inputIndex = inputs.findIndex(input => input.id == inputID);
    if (inputIndex < 0) {
        console.error("cannot find input with id:", inputID);
        return {error: "Incorrect tool specification: " + inputID};
    }
    const resourceIndex = match[inputIndex];
    const resource = resourceList[resourceIndex];

    if (inputs[inputIndex].maxSize && inputs[inputIndex].maxSize < resource.fileLength) {
        return {error: "Resource is too big"};
    }

    if (bind === 'dataurl') {
        const encodedMediatype = encodeURIComponent(resource.profile.mediaType);
        return `${resource.localLink}?mediatype=${encodedMediatype}`;
    } else if (bind === 'language') {
        let lang = resource.profile.language;
        if (param.encoding == "639-1") {
            // some tools expect an ISO 639-1 language parameter
            lang = iso_639_3_to_639_1(lang);
        }
        return lang ? lang : {error: "Unknown language"};
    } else if (bind === 'type') {
        return resource.profile.mediaType ? resource.profile.mediaType : {error: "Unknown media type"};
    } else if (bind === 'content') {
        return resource.content ? resource.content : {error: "Content is not available"};
    } else {
        console.error("unexpected bind value:", bind);
        return {error: "Incorrect tool specification: " + bind};
    }
}
