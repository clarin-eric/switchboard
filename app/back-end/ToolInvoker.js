// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: ToolInvoker.js
// Time-stamp: <2019-01-17 14:54:45 (zinn)>
// -------------------------------------------

import { map639_1_to_639_3, map639_3_to_639_1 } from './util';

export function invokeBrowserBasedTool( URL ) {
    var win = window.open(URL, '_blank');
    win.focus();	
}

export function gatherInvocationParameters( toolDescription, resourceDescription ) {

    var rtnValue = undefined;

    if (typeof resourceDescription === "undefined" ) {
	return false;
    }

    // need to encode the remote file name in case it contains special characters
    var remoteFilename   =  encodeURIComponent(resourceDescription.remoteFilename);	
    var language         =  resourceDescription.language.threeLetterCode;
    var mimetype         =  resourceDescription.mimetype;
    var langEncoding     =  toolDescription.langEncoding;
    
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

    // parameterStringURL holds the URL encoding of the parameters (browser-based tools using GET)
    var parameterStringURL = "";
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
			    break;
			case "type":
			    parameterStringURL = parameterStringURL.concat( mapping[parameter]).concat("=").concat( mimetype );
			    break;			    
			default:
			    parameterStringURL = parameterStringURL.concat( mapping[parameter]).concat("=").concat(parameters[parameter]);
			}
		    } else {
			parameterStringURL = parameterStringURL.concat( parameter ).concat("=").concat(parameters[parameter]);
		    }
		} else {
		    parameterStringURL = parameterStringURL.concat( parameter ).concat("=").concat(parameters[parameter]);
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
		    break;
		case "lang":
		    parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat( language );
		    break;
		case "type":
		    parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat( mimetype );
		    break;		    
		default:
		    parameterStringURL = parameterStringURL.concat(parameter).concat("=").concat(parameters[parameter]);
		}
		
		parameterStringURL = parameterStringURL.concat("&");		    
	    }
	}
    }

    var turl = toolDescription.url;
    
    // need to check whether toolDescription.url already contains parameters (that is, a '?')
    if ( (turl.indexOf("\?") !== -1 ) || turl.includes('?') || turl.includes('\?'))  {
	rtnValue = turl + "&" + parameterStringURL;
    } else {
	rtnValue = turl + "?" + parameterStringURL;
    }

    return rtnValue;
}
