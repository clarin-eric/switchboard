import { iso_639_3_to_639_1, image, findAllIndices } from './utils';

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
            let index = 1;
            for (const value of getServiceParameter(param, resourceList, tool.inputs, match)) {
                if (value.error) {
                    return {error: value.error}
                }
                if (queryParams !== "") {
                    queryParams += "&";
                }
                let name = param.name.replace(/\$\{index\}/, index);
                queryParams += encodeURIComponent(name);
                queryParams += "=";
                queryParams += encodeURIComponent(value);
                index += 1;
            }
        }
    }

    let pathParams = "";
    if (webapp.pathParameters) {
        for (const param of webapp.pathParameters) {
            for (const value of getServiceParameter(param, resourceList, tool.inputs, match)) {
                if (value.error) {
                    return {error: value.error}
                }
                pathParams += "/";
                pathParams += encodeURIComponent(value);
            }
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


function getServiceParameter(param, resourceList, inputs, match) {
    if (!param.bind) {
        if (param.value) {
            return [param.value];
        } else {
            console.error("missing param bind and value:", param);
            return [{error: "Incorrect tool specification: " + param.name}];
        }
    }

    const [inputID, bind] = param.bind.split("/");
    const inputIndex = inputs.findIndex(input => input.id == inputID);
    if (inputIndex < 0) {
        console.error("cannot find input with id:", inputID);
        return [{error: "Incorrect tool specification: " + inputID}];
    }

    const resourceIndices = findAllIndices(match, inputIndex);

    const ret = resourceIndices
        .map(resourceIndex => resourceList[resourceIndex])
        .map(resource => getResourceValueFromBind(resource, inputs[inputIndex], bind, param.encoding));
    return ret;
}

function getResourceValueFromBind(resource, input, bind, encoding) {
    if (!resource.localLink) {
        return {error: "Incomplete resource description"};
    }

    if (input.maxSize && input.maxSize < resource.fileLength) {
        return {error: "Resource is too big"};
    }

    if (bind === 'dataurl') {
        if (!resource.profile || !resource.profile.mediaType) {
            return resource.localLink;
        }
        const encodedMediatype = encodeURIComponent(resource.profile.mediaType);
        return `${resource.localLink}?mediatype=${encodedMediatype}`;
    } else if (bind === 'language') {
        let lang = resource.profile.language;
        if (encoding == "639-1") {
            // some tools expect an ISO 639-1 language parameter
            lang = iso_639_3_to_639_1(lang);
        }
        return lang ? lang : {error: "Unknown language"};
    } else if (bind === 'type') {
        return resource.profile.mediaType ? resource.profile.mediaType : {error: "Unknown media type"};
    } else if (bind === 'content') {
        return resource.content ? resource.content : {error: "Content is not available"};
    }

    console.error("unexpected bind value:", bind);
    return {error: "Incorrect tool specification: " + bind};
}
