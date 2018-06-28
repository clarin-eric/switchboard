// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: ToolInvoker.js
// Time-stamp: <2018-06-26 19:44:30 (zinn)>
// -------------------------------------------

import { map639_1_to_639_3, map639_3_to_639_1 } from './util';
import Request from 'superagent';

function showWebServiceCallResult( result ) {
    var jsonDataWindow = window.open("data:text/json," + result, // data:text/xml
				     "_blank");
    jsonDataWindow.document.title = "Web Service Result";
    if (window.focus) {
	jsonDataWindow.focus();
    }
    //console.log('ToolInvoker/invokeWebService/data: success in calling webservice', "data:text/json," + result);
}

function showWebServiceCallResult_iframe( outputFormat, result, charset, contentType ) {

    //console.log('ToolInvoker/showWebServiceCallResult_iframe', outputFormat, result, charset, contentType );
    var contentString = "";
    switch (outputFormat) {
    case "text/xml":
	contentString = result;
	showWebServiceCallResult_write(result);
	return;
	break;
    case "application/json":
	showWebServiceCallResult_write(result);
	return;
	//^^^^//
	
	var jsonReturn = encodeURIComponent(result); //JSON.parse(result);
	contentString = "data:text/json,"  + JSON.stringify(jsonReturn);
	break;
    default:
	contentString = result;
    }
	
    // var jsonDataWindow  = window.open("data:text/json," + encodeURIComponent(jsonStr), "_blank");
    // jsonDataWindow.document.title = "Web Service Result";
    // if (window.focus) {
    // 	jsonDataWindow.focus();
    // }    
    
    var iframe = "<iframe width='100%' height='100%' src='" + contentString + "'></iframe>"
    var x = window.open();
    if (x === null) {
	alert("Please allow your browser to open pop-up windows!");
    } else {
	x.document.title = "Web Service Result";
	x.document.open();
	x.document.write("<meta http-equiv='Content-Type' content='application/json; charset=utf-8'>");
	x.document.write(iframe);
	x.document.close();
    }
}

function showWebServiceCallResult_write( result ) {
    var x = window.open();
    if (x === null) {
	//console.log('in functon ToolInvoker/showWebServiceCallResult_write', x);
	alert("Please allow your browser to open pop-up windows!");
    } else {
	x.document.open();
	x.document.title = "Web Service Result";    
	// x.document.write('<html><body><pre>' + result + '</pre></body></html>');
	x.document.write('<textarea rows="80" cols="80" style="border:none;">' + result + '</textarea>');
	//			x.document.write(result);			
	x.document.close();
	if (window.focus) {
	    x.focus();
	}
    }
}


export function invokeBrowserBasedTool( URL ) {
    var win = window.open(URL.url, '_blank');
    win.focus();	
}

export function invokeWebService( URL ) {
    let file = URL.formVal;

    // there are a number of web services that are invoked with HTTP GET
    // here, we invoke them in the same way than browser-based tools.
    if (URL.requestType == "get") {
	var win = window.open(URL.url, '_blank');
	win.focus();
    }

    // e.g., the TEI-TCF converter, Nametag, KER
    else if (URL.requestType == "form-data (input key must have file contents)") {
	var read = new FileReader(); 
	read.readAsText(file);  
	read.onloadend = function(){
	    // change the file object into its file contents
	    URL.parameterForm.set(URL.formPar, read.result);
	    for (var key of URL.parameterForm.entries()) {
		console.log('updated values', key[0] + ', ' + key[1]);
	    }
	    Request
		.post(URL.url)
		.send(URL.parameterForm)
		.end((err, res) => {
		    if (err) {
			console.log('ToolInvoker/invokeWebService/form-data: error in calling webservice', err, file.name, URL);
			alert('Result of calling web service: ' + err);
		    } else {
			//console.log('ToolInvoker/invokeWebService with requestType/form-data:', res);
			showWebServiceCallResult_iframe(URL.output, res.text, res.charset, res.header['content-type']);
		    }
		});
	}
    }
    else if (URL.requestType == "form-data (input key must have file value)") {
	Request
	    .post(URL.url)
	    .send(URL.parameterForm)	
	    //.field(URL.formPar, URL.formVal)
	    .end((err, res) => {
		if (err) {
		    console.log('ToolInvoker/invokeWebService/form-data (key must be file): error in calling webservice', err, file.name, URL);
		    alert('Result of calling web service: ' + err);
		} else {
		    //console.log('ToolInvoker/invokeWebService with requestType/form-data (key must be file):', res);
		    showWebServiceCallResult_iframe(URL.output, res.text, res.charset, res.header['content-type']);
		}
	    });
    }    
    // e.g., for the GATE Annie web service (for plain text files, the raw data is being posted)
    else if (URL.requestType == "post") {
	var read = new FileReader(); 
	read.readAsText(file);  

	// deprecated
	// read.readAsBinaryString(file);
	// read.readAsText(file, 'ISO-8859-1'); // by default, UTF-8 is assumed
	
	read.onloadend = function(){
	    Request
		.post(URL.url)
		.send(read.result)
		.set('Content-Type', 'text/plain')	    	    
		.end((err, res) => {
		    if (err) {
			console.log('ToolInvoker/invokeWebService/post: error in calling webservice', err, file.name, URL);
			alert('Result of calling web service: ' + err);
		    } else {
			showWebServiceCallResult_iframe( URL.output, res.text, res.charset, res.header['content-type']);
		    }
		});
	}
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
		    //console.log('parsed JSON', jsonReturn);
		    var jsonStr = JSON.stringify(jsonReturn);
		    //console.log('stringified JSON', jsonStr);		    
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

export function gatherInvocationParameters( toolDescription, resourceDescription ) {

    var rtnValue = { };

    if (typeof resourceDescription === undefined || resourceDescription === null || resourceDescription.length == 0) {
//	console.log('ToolInvoker/gatherInvocationParameters', false);
	return false;
    }

    // need to encode the remote file name in case it contains special characters
    var remoteFilename   =  encodeURIComponent(resourceDescription.remoteFilename);	
    var file             =  resourceDescription.file;
    var language         =  resourceDescription.language.threeLetterCode;
    var mimetype         =  resourceDescription.mimetype;
    var upload           =  resourceDescription.upload;
    
    var langEncoding     = toolDescription.langEncoding;
    var softwareType     = toolDescription.softwareType;
    var requestType      = toolDescription.requestType;
    var output           = toolDescription.output;

//    console.log('ToolInvoker/gatherInvocationParameters at start', toolDescription, resourceDescription, remoteFilename);
    
    // Some tools in the registry require an alternative naming of mediatypes, see e.g.,
    // the CLARIN-DK tools. The registry slot for 'type' is a function that is being evaluated here.
    var parameterType    = toolDescription.parameters.type || "";
    if (parameterType !== "") {
	var fun = new Function("mimetype", parameterType);
	mimetype = fun(mimetype);
    } 

    // the tool expects an encoding of the language parameter in ISO639-1
    if (langEncoding == "639-1") {
	language = map639_3_to_639_1(language);
    } 

    // the mapping

    // parameterStringURL holds the URL encoding of the parameters (browser-based tools using GET)
    var parameterStringURL = "";

    // parameterForm holds the FORM encoding of the parameters (web services using POST)
    var parameterForm = new FormData();
    var formParameter = "data";                  // default value for form

    var parameters = toolDescription.parameters;

    // now, we process the mapping slot if existing in the tool's metadata
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
				parameterForm.append( formParameter, file, file.name);				
			    } else {
				parameterStringURL = parameterStringURL.concat( mapping[parameter]).concat("=").concat( remoteFilename );
			    }
			    break;
			case "lang":
			    parameterStringURL = parameterStringURL.concat( mapping[parameter]).concat("=").concat( language );
			    parameterForm.append( mapping[parameter], language);
			    break;
			case "type":
			    parameterStringURL = parameterStringURL.concat( mapping[parameter]).concat("=").concat( mimetype );
			    parameterForm.append( mapping[parameter], mimetype);			    
			    break;			    
			default:
			    parameterStringURL = parameterStringURL.concat( mapping[parameter]).concat("=").concat(parameters[parameter]);
			    parameterForm.append( mapping[parameter], parameters[parameter]);
			}
		    } else {
			parameterStringURL = parameterStringURL.concat( parameter ).concat("=").concat(parameters[parameter]);
			parameterForm.append(parameter, parameters[parameter]);
		    }
		} else {
		    parameterStringURL = parameterStringURL.concat( parameter ).concat("=").concat(parameters[parameter]);
		    parameterForm.append(parameter, parameters[parameter]);
		}
	    }
	    parameterStringURL = parameterStringURL.concat("&");
	}
    } else {
	// use the givens without mapping
	for (var parameter in parameters) {
	    if (parameters.hasOwnProperty(parameter)) {
		switch (parameter) {
		case "input":
		    if ((softwareType == "webService") && (requestType !== "get")){
			formParameter = parameter;
			parameterForm.append( formParameter, file, file.name);							
		    } else {
			parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat( remoteFilename );
			parameterForm.append( parameter, remoteFilename );			
		    }
		    break;
		case "lang":
		    parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat( language );
		    parameterForm.append( parameter, language );					    
		    break;
		case "type":
		    parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat( mimetype );
		    parameterForm.append( parameter, mimetype );					    		    
		    break;		    
		default:
		    parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat(parameters[parameter]);
		    parameterForm.append(parameter, parameters[parameter]);
		}
		
		parameterStringURL = parameterStringURL.concat("&");		    
	    }
	}
    }

    var urlWithParameters = "";
    if ((softwareType == "webService") && (requestType !== "get")) {
	urlWithParameters = toolDescription.url;
	//console.log('ToolInvoker/urlWithParameters/webService', urlWithParameters, parameterStringURL)
    } else {
	var turl = toolDescription.url;
	// need to check whether toolDescription.url already contains parameters (that is, a '?')
	if ( (turl.indexOf("\?") !== -1 ) || turl.includes('?') || turl.includes('\?'))  {
	    urlWithParameters = turl + "&" + parameterStringURL;
	    //console.log('ToolInvoker/urlWithParameters with ?', turl, urlWithParameters, turl.includes('?'), turl.includes('\?'));
	} else {
	    urlWithParameters = turl + "?" + parameterStringURL;
	    //console.log('ToolInvoker/urlWithParameters without ?', turl, urlWithParameters, turl.includes('?'), turl.includes('\?'));	    
	}
    }

    if (softwareType == "webService") {
	// with web services, things get complicated
	rtnValue =
	    {
		toolType      : "webService",
		url           : urlWithParameters,
		parameterForm : parameterForm,
		formPar       : formParameter,
		formVal       : file,
		requestType   : requestType,
		output        : output
	    };
    } else {
	// browser based tools are invoked with an HTTP get request with parameters URL-encoded
	rtnValue = 
	    {
		toolType    : "browserBased",
		url         : urlWithParameters
	    };
    }

    //console.log('ToolInvoker/gatherInvocationParameters', rtnValue, parameterForm);
    // FormData cannot be logged easily, and the following does not work in Safari, only Chrome and Firefix
    /*
    for (var key of parameterForm.entries()) {
        console.log('ToolInvoker/gatherInvocationParameters:', key[0] + ', ' + key[1]);
    }
    */

    return rtnValue;
}
