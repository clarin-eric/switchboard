// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: util.js
// Time-stamp: <2019-02-28 16:40:24 (zinn)>
// -------------------------------------------

export const inclToolsReqAuth = process.env.INCL_TOOLS_REQ_AUTH;
export const fileStorage      = "optionNoLongerActive"; // process.env.FILE_STORAGE;

// todo
export const nextcloud_user   = process.env.FILE_STORAGE_USER;
export const nextcloud_pass   = process.env.FILE_STORAGE_TOKEN;

export const lrsVersion       = process.env.VERSION;
export const emailContact     = process.env.CONTACT;
export const appContextPath   = process.env.APP_CONTEXT_PATH;
//export const emailContactCommand = "mailto:"+emailContact+"?subject=CLARIN-PLUS LRS";
export const emailContactCommand = "mailto:"+emailContact;

/* new environment variable:
   - used to communicate between CLRS and CLRS-REST
   - production version of the switchboard only calls tools deemed to have production status
   - development version of the switchboard includes tools with a more beta-like development status
   - used by MatcherRemote.js
*/
export const deploymentStatus = process.env.NODE_ENV;


// for creation of link
export const fileStorageServerMPG_remote     = 'http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/';

// see nginx.conf for reverse-proxying (all pathnames are local)
export const fileStorageServerMPG_localhost       = '/storage/';
export const fileStorageServerNEXTCLOUD_localhost = '/nextcloud/';
export const fileStorageServerNEXPRESS_localhost  = '/nexpress/';

export const matcherURL = '/matcher';

export const TOOLTYPE_QUANTITATIVE_TOOLS = 0;
export const TOOLTYPE_ALL_TOOLS = 1;
export const TOOLTYPE_QUALITATIVE_TOOLS = 2;

export const TOOL_AUTH_REQUIRED  = 0;
export const TOOL_AUTH_ALL_TOOLS = 1;
    
export const TOOLORDER_BY_TOOL_TASK = 0;
export const TOOLORDER_BY_TOOL_NAME = 1;

export function unfoldHandle( handle ) {
    var hdlShortPrefix = "hdl:";
    var protocol = window.location.protocol;
    var hdlLongPrefix  = protocol.concat("//hdl.handle.net/");	
    var index = handle.indexOf(hdlShortPrefix);
    var expandedHandle = decodeURIComponent(handle);

    if (index > -1) {
	expandedHandle = hdlLongPrefix.concat( handle.substring(index+hdlShortPrefix.length, handle.length) );
	console.log('util/unfoldHandle expanded handle', handle, expandedHandle)
    }
    return expandedHandle;
}


export function fileExtensionChooser (mimetype) {
    var extension = "txt";
    switch (mimetype) {
    case "application/pdf":
	extension = "pdf";
	break;
    case "text/plain":
	extension = "txt";
	break;
    case "text/html":
	extension = "html";
	break;	
    case "application/msword":
	extension = "doc";
	break;
    case "application/rtf":
	extension = "rtf";
	break;
    case "application/zip":
    extension = "zip";
    break;
	// https://github.com/clarin-eric/LRSwitchboard/issues/63
    default:
	extension = "mp4";
    }

    console.log('util/fileExtensionChooser', mimetype, extension);
    
    return extension;
}

/* What B2DROP advertises as shared link is not a true one as the link points
   to a HTML page with a download button. Only if '/download' is appended, the link
   points directly to the source. Similar behaviour for Dropbox.

   Some users may know that and provide the correct suffixes, hence the second conjuction
   in the if condition.

   This is only required for PASTE actions. When the LRS is invoked from the B2DROP interface,
   the plugin takes care of the suffix.
*/

export function rewriteURL( fileURL ) {
    const windowAppContextPath = window.APP_CONTEXT_PATH;

    if ( (fileURL.indexOf("https://b2drop.eudat.eu") !== -1) &&
	 (fileURL.indexOf("/download") == -1)) {
	fileURL = fileURL.concat('/download');
    }
    
    if ( (fileURL.indexOf("https://www.dropbox.com") !== -1) &&
	 (fileURL.indexOf("?dl=1") == -1)) {
	
	fileURL = fileURL.replace('?dl=0', '?dl=1');
    }

    return windowAppContextPath.concat('/download?input='+encodeURI(fileURL));
}

const langEncodingMap = {
    "generic" : "generic",

    // no ISO 639-1 code for Ancient Greek (grc), Coptic (cop), Gothic (got)
    "af" : "afr",
    "ar" : "ara",
    "be" : "bel",   
    "bg" : "bul",
    "bs" : "bos",
    "ca" : "cat",
    "cs" : "ces",
    "cu" : "chu",
    "cy" : "cym",
    "da" : "dan",
    "de" : "deu",
    "el" : "ell",
    "en" : "eng",
    "eo" : "epo",
    "es" : "spa",
    "et" : "est",
    "eu" : "eus",
    "fa" : "fas",
    "fi" : "fin",
    "fr" : "fra",
    "fy" : "fry",
    "ga" : "gle",
    "gl" : "glg",
    "he" : "heb",
    "hi" : "hin",
    "hr" : "hrv",
    "hu" : "hun",
    "hy" : "hye",
    "id" : "ind",
    "is" : "isl",
    "it" : "ita",
    "ja" : "jpn",
    "ka" : "kat",
    "kk" : "kaz",
    "kn" : "kan",
    "ko" : "kor",
    "ku" : "kur",
    "la" : "lat",
    "lt" : "lit",
    "lv" : "lav",
    "mk" : "mkd",
    "ml" : "mlg",
    "nl" : "nld",
    "xx" : "cop",
    "xx" : "got",
    "xx" : "grc",
    "no" : "nor",
    "nn" : "nno",
    "nb" : "nob",
    "pl" : "pol",
    "pt" : "por",
    "ro" : "ron",
    "ru" : "rus",
    "sa" : "san",
    "sk" : "slk",
    "sl" : "slv",
    "sq" : "sqi",
    "sr" : "srp",
    "sv" : "swe",
    "sw" : "swa",
    "ta" : "tam",
    "tr" : "tur",
    "ug" : "uig",
    "uk" : "ukr",
    "ur" : "urd", 
    "vi" : "vie",
    "zh" : "zho"
}

// not used
export const map639_1_to_639_3 = function( key ) {
    return langEncodingMap[key];
}


/* in the tool metadata, the languages slot contains ISO 639-3 codes.
   (but some tools may need to be invoked with corresponding ISO 639-1 code.
*/
export const map639_3_to_639_1 = function( value ) {
	    for (var key in langEncodingMap) {
		if (langEncodingMap[key] == value) {
		    return key;
		}
	    }
	
	    return null;
	}


export function processLanguage( language ) {

    var languageName = null;
    var threeLetterCode = null;

    if ( (language == "en") || (language == "eng") ) {
	languageName = "English";
	threeLetterCode = "eng";
	

    } else if (language == "cop") {
	languageName = "Coptic";
    	threeLetterCode = "cop";	
    } else if (language == "got") {
	languageName = "Gothic";
    	threeLetterCode = "got";
    } else if (language == "grc") {
	languageName = "Ancient Greek";
    	threeLetterCode = "grc";

    } else if ((language == "af") || (language == "afr")) {
	languageName = "Afrikaans";
    	threeLetterCode = "afr";
    } else if ((language == "sq") || (language == "sqi")) {
	languageName = "Albanian";
    	threeLetterCode = "sqi";	
    } else if ((language == "ar") || (language == "ara")) {
	languageName = "Arabic";
    	threeLetterCode = "ara";
    } else if ((language == "hy") || (language == "hye")) {
	languageName = "Armenian";
    	threeLetterCode = "hye";		
    } else if ((language == "eu") || (language == "eus")) {
	languageName = "Basque";
    	threeLetterCode = "eus";		
    } else if ((language == "be") || (language == "bel")) {
	languageName = "Belarusian";
    	threeLetterCode = "bel";
    } else if ((language == "bs") || (language == "bos")) {
	languageName = "Bosnian";
    	threeLetterCode = "bos";			
    } else if ((language == "bg") || (language == "bul")) {
	languageName = "Bulgarian";
    	threeLetterCode = "bul";
    } else if ((language == "ca") || (language == "cat")) {
	languageName = "Catalan";
    	threeLetterCode = "cat";
    } else if ((language == "hr") || (language == "hrv")) {
	languageName = "Croatian";
    	threeLetterCode = "hrv";		
    } else if ((language == "cu") || (language == "chu")) {
	languageName = "Old Church Slavonic";
    	threeLetterCode = "chu";
    } else if ((language == "cs") || (language == "ces")) {
	languageName = "Czech";
    	threeLetterCode = "ces";	    	
    } else if ((language == "da") || (language == "dan")) {
	languageName = "Danish";
    	threeLetterCode = "dan";
    } else if ((language == "nl") || (language == "nld")) {
	languageName = "Dutch";
    	threeLetterCode = "nld";	
    } else if ((language == "eo") || (language == "epo")) {
	languageName = "Esperanto";
    	threeLetterCode = "epo";
    } else if ((language == "et") || (language == "est")) {
	languageName = "Estonian";
    	threeLetterCode = "est";		
    } else if ((language == "ga") || (language == "gle")) {
	languageName = "Irish";
    	threeLetterCode = "gle";
    } else if ((language == "fi") || (language == "fin")) {
	languageName = "Finnish";
    	threeLetterCode = "fin";
    } else if ((language == "fr") || (language == "fra")) {
	languageName = "French";
    	threeLetterCode = "fra";
    } else if ((language == "fy") || (language == "fry")) {
	languageName = "Frisian";
    	threeLetterCode = "fry";		
    } else if ((language == "gl") || (language == "glg")) {
	languageName = "Galician";
    	threeLetterCode = "glg";
    } else if ((language == "ka") || (language == "kat")) {
	languageName = "Georgian";
    	threeLetterCode = "kat";	
    } else if ((language == "de") || (language == "deu")) {
	languageName = "German";
    	threeLetterCode = "deu";
    } else if ((language == "el") || (language == "ell")) {
	languageName = "Greek";
    	threeLetterCode = "ell";	
    } else if ((language == "he") || (language == "heb")) {
	languageName = "Hebrew";
    	threeLetterCode = "heb";
    } else if ((language == "hi") || (language == "hin")) {
	languageName = "Hindu";
    	threeLetterCode = "hin";
    } else if ((language == "hu") || (language == "hun")) {
	languageName = "Hungarian";
    	threeLetterCode = "hun";
    } else if ((language == "is") || (language == "isl")) {
	languageName = "Icelandic";
    	threeLetterCode = "isl";	
    } else if ((language == "id") || (language == "ind")) {
	languageName = "Indonesian";
    	threeLetterCode = "ind";
    } else if ((language == "it") || (language == "ita")) {
	languageName = "Italian";
    	threeLetterCode = "ita";	    
    } else if ((language == "ja") || (language == "jpn")) {
	languageName = "Japanese";
    	threeLetterCode = "jpn";
    } else if ((language == "kn") || (language == "kan")) {
	languageName = "Kannada";
    	threeLetterCode = "kan";
    } else if ((language == "kk") || (language == "kaz")) {
	languageName = "Kazakh";
    	threeLetterCode = "kaz";	
    } else if ((language == "ko") || (language == "kor")) {
	languageName = "Korean";
    	threeLetterCode = "kor";
    } else if ((language == "ku") || (language == "kur")) {
	languageName = "Kurdish";
    	threeLetterCode = "kur";		
    } else if ((language == "la") || (language == "lat")) {
	languageName = "Latin";
    	threeLetterCode = "lat";			
    } else if ((language == "lv") || (language == "lav")) {
	languageName = "Latvian";
    	threeLetterCode = "lav";	
    } else if ((language == "lt") || (language == "lit")) {
	languageName = "Lithuanian";
    	threeLetterCode = "lit";
    } else if ((language == "mk") || (language == "mkd")) {
	languageName = "Macedonian";
    	threeLetterCode = "mkd";
    } else if ((language == "ml") || (language == "mlg")) {
	languageName = "Malagasy";
    	threeLetterCode = "mlg";		
    } else if ((language == "no") || (language == "nor")) {
	languageName = "Norwegian";
    	threeLetterCode = "nor";
    } else if ((language == "nb") || (language == "nob")) {
	languageName = "Norwegian Bokmål";
    	threeLetterCode = "nob";
    } else if ((language == "nn") || (language == "nno")) {
	languageName = "Norwegian Nynorsk";
    	threeLetterCode = "nno";	
    } else if ((language == "fa") || (language == "fas")) {
	languageName = "Persian";
    	threeLetterCode = "fas";			
    } else if ((language == "pl") || (language == "pol")) {
	languageName = "Polish";
    	threeLetterCode = "pol";
    } else if ((language == "pt") || (language == "por")) {
	languageName = "Portuguese";
    	threeLetterCode = "por";
    } else if ((language == "ro") || (language == "ron")) {
	languageName = "Romanian";
    	threeLetterCode = "ron";
    } else if ((language == "ru") || (language == "rus")) {
	languageName = "Russian";
    	threeLetterCode = "rus";
    } else if ((language == "sa") || (language == "san")) {
	languageName = "Sanskrit";
    	threeLetterCode = "san";
    } else if ((language == "sr") || (language == "srp")) {
	languageName = "Serbian";
    	threeLetterCode = "srp";		
    } else if ((language == "sk") || (language == "slk")) {
	languageName = "Slovak";
    	threeLetterCode = "slk";
    } else if ((language == "sl") || (language == "slv")) {
	languageName = "Slovenian";
    	threeLetterCode = "slv";
    } else if ((language == "es") || (language == "spa")) {
	languageName = "Spanish";
    	threeLetterCode = "spa";
    } else if ((language == "sw") || (language == "swa")) {
	languageName = "Swahili";
    	threeLetterCode = "swa";		
    } else if ((language == "sv") || (language == "swe")) {
	languageName = "Swedish";
    	threeLetterCode = "swe";	
    } else if ((language == "ta") || (language == "tam")) {
	languageName = "Tamil";
    	threeLetterCode = "tam";
    } else if ((language == "th") || (language == "tha")) {
	languageName = "Thai";
    	threeLetterCode = "tha";	
    } else if ((language == "tr") || (language == "tur")) {
	languageName = "Turkish";
    	threeLetterCode = "tur";
    } else if ((language == "uk") || (language == "ukr")) {
	languageName = "Ukrainian";
    	threeLetterCode = "ukr";	    		
    } else if ((language == "ur") || (language == "urd")) {
	languageName = "Urdu";
    	threeLetterCode = "urd";
    } else if ((language == "ug") || (language == "uig")) {
	languageName = "Uighur";
    	threeLetterCode = "uig";
    } else if ((language == "vi") || (language == "vie")) {
	languageName = "Vietnamese";
    	threeLetterCode = "vie";
    } else if ((language == "cy") || (language == "cym")) {
	languageName = "Welsh";
    	threeLetterCode = "cym";	
    } else if ((language == "zh") || (language == "zho")) {
	languageName = "Chinese";
    	threeLetterCode = "zho";		

    } else {
	languageName = "Please identify language";
	threeLetterCode = "any";
    }

    console.log('util/processLanguage', languageName, threeLetterCode)

    return { language  : languageName,
	     threeLetterCode: threeLetterCode
	   };
}

