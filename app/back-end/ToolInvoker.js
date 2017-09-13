import { map639_1_to_639_3, map639_3_to_639_1 } from './util';
import Request from 'superagent';

export function invokeBrowserBasedTool( URL ) {
    var win = window.open(URL.url, '_blank');
    win.focus();	
}

export function invokeWebService( URL ) {
    let file = URL.formVal;
    //console.log('ToolInvoker/invokeWebService', URL);
    if (URL.requestType == "get") {
	// same as invokeBrowserBasedTool
	var win = window.open(URL.url, '_blank');
	win.focus();
    } else if (URL.requestType == "data") {
	Request
	    .post(URL.url)
	    .send(file)
	    .end((err, res) => {
		if (err) {
		    console.log('ToolInvoker/invokeWebService/data: error in calling webservice', err, file.name, URL);
		    alert('Result of calling web service: ' + err);
		} else {
		    var jsonDataWindow = window.open("data:text/json," + encodeURIComponent(res.text),
						     "_blank");
		    if (window.focus) {
			jsonDataWindow.focus();
		    }
//		    console.log('ToolInvoker/invokeWebService/data: success in calling webservice', "data:text/json," + encodeURIComponent(res.text));
//		    console.log('ToolInvoker/invokeWebService entire response:', res);
		}
	    });
    } else {
	let data = new FormData();
	//data.set( URL.formPar, file, file.name);
	data.append( URL.formPar, file, file.name);
	Request
	    .post(URL.url)
	    .send(data)
	//		.set('Content-Type', 'text/plain')	    
	    .end((err, res) => {
		if (err) {
		    console.log('ToolInvoker/invokeWebService/form: error in calling webservice', err, file.name, data, URL);
		    alert('Result of calling web service: ' + err);
		} else {
		    // var jsonDataWindow = window.open("data:text/json," + encodeURIComponent(res.text), "_blank");
		    // if (window.focus) {		    
		    // 	jsonDataWindow.focus();
		    // }
		    
		    // var anotherJsonDataWindow = window.open("data:," + encodeURIComponent(res.text), "_blank");
		    // if (window.focus) {
		    // 	anotherJsonDataWindow.focus();
		    // }
		    
//		    console.log('ToolInvoker/invokeWebService/form: success in calling webservice', "data:," + encodeURIComponent(res.text));
//		    console.log('ToolInvoker/invokeWebService entire response:', res);

		    var jsonReturn = JSON.parse(res.text);
		    console.log('parsed JSON', jsonReturn);
		    var jsonStr = JSON.stringify(jsonReturn);
		    console.log('stringified JSON', jsonStr);		    
		    var jsonDataWindow = window.open("data:text/json," + encodeURIComponent(jsonStr), "_blank");
		    jsonDataWindow.document.title = "Web Service Result";
		    if (window.focus) {		    
			jsonDataWindow.focus();
		    }
		    
		    // var x = window.open();
		    // x.document.open();
		    // x.document.write('<html><body><pre>' + res.text + '</pre></body></html>');
		    // x.document.close();
		    // x.document.title = URL.url;
		    // if (window.focus) {
		    // 	x.focus();
		    // }		    
		}
	    });
    }
}

export function constructToolURL( toolDescription, resourceDescription ) {

    var fileServerURL = "";
    var rtnValue = { };

    //console.log('ToolInvoker/constructToolURL', resourceDescription);
    if (typeof resourceDescription === undefined || resourceDescription === null || resourceDescription.length == 0) {
	console.log('ToolInvoker/constructToolURL', false);
	return false;
    }

    // need to encode the remote file name in case it contains special characters
    var remoteFilename   =  encodeURIComponent(resourceDescription.remoteFilename);	
    var file             =  resourceDescription.file;
    var language         =  resourceDescription.language.threeLetterCode;
    var mimetype         =  resourceDescription.mimetype;
    var upload           =  resourceDescription.upload;
    
    var lang_encoding    = toolDescription.lang_encoding;
    var softwareType     = toolDescription.softwareType;
    var requestType      = toolDescription.requestType;
    var parameterType    = toolDescription.parameter.type || "";

    if (parameterType !== "") {
	// console.log("ToolInvoker/constructToolURL (before)", mimetype);
	var fun = new Function("mimetype", parameterType);
	mimetype = fun(mimetype);
	// console.log("ToolInvoker/constructToolURL (after)", mimetype);	
    } 

    // the tool expects an encoding of the language parameter in ISO639-1
    if (lang_encoding == "639-1") {
	language = map639_3_to_639_1(language);
    } 

    // the mapping
    var parameterString = "";
    var parameters = toolDescription.parameter;

    // default value for form
    var formParameter = "data";
    
    if ( (toolDescription.hasOwnProperty('mapping') && (! (toolDescription['mapping'] === undefined )))) {
	for (var parameter in parameters) {
	    if (parameters.hasOwnProperty(parameter)) {
		if (toolDescription.hasOwnProperty('mapping')) {
		    var mapping = toolDescription['mapping'];
		    if (mapping.hasOwnProperty(parameter)) {
			switch (parameter) {
			case "input":
			    if ( (softwareType == "webService") && (requestType !== "get") ){
				formParameter = mapping[parameter];
			    } else {
				parameterString = parameterString.concat( mapping[parameter]).concat("=").concat( remoteFilename );
			    }
			    break;
			case "lang":
			    parameterString = parameterString.concat( mapping[parameter]).concat("=").concat( language );
			    break;
			case "type":
			    parameterString = parameterString.concat( mapping[parameter]).concat("=").concat( mimetype );
			    break;			    
			default:
			    parameterString = parameterString.concat( mapping[parameter]).concat("=").concat(parameters[parameter]);
			}
		    } else {
			parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
		    }
		} else
		    parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
	    }
	    parameterString = parameterString.concat("&");
	}
    } else {
	// use the givens without mapping
	for (var parameter in parameters) {
	    if (parameters.hasOwnProperty(parameter)) {
		switch (parameter) {
		case "input":
		    if ((softwareType == "webService") && (requestType !== "get")){
			formParameter = parameter;
		    } else {
			parameterString = parameterString.concat(parameter).concat("=").concat( remoteFilename );
		    }
		    break;
		case "lang":
		    parameterString = parameterString.concat(parameter).concat("=").concat( language );
		    break;
		case "type":
		    parameterString = parameterString.concat(parameter).concat("=").concat( mimetype );
		    break;		    
		default:
		    parameterString = parameterString.concat(parameter).concat("=").concat(parameters[parameter]);			
		}
		
		parameterString = parameterString.concat("&");		    
	    }
	}
    }

    // var parameterString = "?input=" + remoteFilename + "&lang=" + toolDescription.parameter.lang + "&analysis=" + toolDescription.parameter.analysis;
    var urlWithParameters = "";
    if ((softwareType == "webService") && (requestType !== "get")){
	urlWithParameters = toolDescription.url;
    } else {
	urlWithParameters = toolDescription.url + "?" + parameterString;
    }

    if (softwareType == "webService") {
	rtnValue =
	    {
		toolType   : "webService",
		url        : urlWithParameters,
		formPar    : formParameter,
		formVal    : file,
		requestType : requestType
	    };
    } else	{
	rtnValue = 
	    {
		toolType : "browserBased",
		url      : urlWithParameters
	    };
    }

    // console.log('ToolInvoker/constructToolURL', rtnValue);
    return rtnValue;
}
