// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: ToolInvoker.js
// Time-stamp: <2018-11-30 22:58:42 (zinn)>
// -------------------------------------------

import { map639_1_to_639_3, map639_3_to_639_1 } from './util';

export function invokeBrowserBasedTool( URL ) {
    var win = window.open(URL.url, '_blank');
    win.focus();	
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

    // parameterForm holds the FORM encoding of the parameters
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
			    parameterStringURL = parameterStringURL.concat( mapping[parameter]).concat("=").concat( remoteFilename );
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
		    parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat( remoteFilename );
		    parameterForm.append( parameter, remoteFilename );			
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
    var turl = toolDescription.url;
    // need to check whether toolDescription.url already contains parameters (that is, a '?')
    if ( (turl.indexOf("\?") !== -1 ) || turl.includes('?') || turl.includes('\?'))  {
	urlWithParameters = turl + "&" + parameterStringURL;
    } else {
	urlWithParameters = turl + "?" + parameterStringURL;
    }

    rtnValue = 
	{
	    toolType    : "browserBased",
	    url         : urlWithParameters
	};

    // FormData cannot be logged easily, and the following does not work in Safari, only Chrome and Firefix
    /*
    for (var key of parameterForm.entries()) {
        console.log('ToolInvoker/gatherInvocationParameters:', key[0] + ', ' + key[1]);
    }
    */

    return rtnValue;
}
