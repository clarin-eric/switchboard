
export const urlPath     = process.env.URL_PATH;
export const fileStorage = process.env.FILE_STORAGE;
export const b2drop_user = process.env.B2DROP_USER;
export const b2drop_pass = process.env.B2DROP_PASS;
export const lrsVersion  = process.env.VERSION;
export const emailContact = process.env.CONTACT;
export const emailContactCommand = "mailto:"+emailContact+"?subject=CLARIN-PLUS LRS";

// for creation of link
export const fileStorageServerMPG_remote     = 'http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/';

// see nginx.conf for reverse-proxying
export const fileStorageServerMPG_localhost       = window.location.origin.concat(urlPath).concat('/storage/');
export const fileStorageServerNEXTCLOUD_localhost = window.location.origin.concat(urlPath).concat('/nextcloud/');
export const fileStorageServerB2DROP_localhost    = window.location.origin.concat(urlPath).concat('/btwodrop/');

export function unfoldHandle( handle ) {
    var hdlShortPrefix = "hdl:";
    var protocol = window.location.protocol;
    var hdlLongPrefix  = protocol.concat("//hdl.handle.net/");	
    var index = handle.indexOf(hdlShortPrefix);

    var expandedHandle = decodeURIComponent(handle);

    console.log('handle', expandedHandle)

    if (index > -1) {
	expandedHandle = hdlLongPrefix.concat( handle.substring(index+hdlShortPrefix.length, handle.length) );
    } else {
	console.log('util.js/unfoldHandle not need to unfold', handle);
    }
    return expandedHandle;
}

/* This is a CORS relict, see the rewriting in nginx.conf.
   - Note that B2DROP does not work with this 'trick', so here's a (browser-external)
     Python script is used for downloading 
   - iCloud does not provide a direct link to access a shared file (login etc. required)
   - b2drop.eudat.eu is not active yet, but there is a test instance at https://fsd-cloud48.zam.kfa-juelich.de
   - the first if condition shadows all subsequent nextcloud-based conditions
   - aim at getting rid of 'clrs' part of url
   - paste events are always fetched via the Python script
*/

export function rewriteURL( caller, fileURL ) {
    var corsLink = "";
    if (caller == "B2DROP") {
	fileURL = fileURL.concat('/download')
    } else if ( caller == "PASTE") {
	// nop
    } else if ( fileURL.indexOf("https://www.dropbox.com") !== -1 ) {
	corsLink = fileURL.replace('https://www.dropbox.com', '/www-dropbox-com');
	corsLink = corsLink.replace('?dl=0', '?dl=1');
    } else if ( fileURL.indexOf("https://b2drop.eudat.eu") !== -1 ) {
	corsLink = fileURL.replace('https://b2drop.eudat.eu', '/b2drop-eudat-eu').concat('/download');	
    } else if ( fileURL.indexOf("https://fsd-cloud48.zam.kfa-juelich.de") !== -1 ) {
	corsLink = fileURL.replace('https://fsd-cloud48.zam.kfa-juelich.de', '/zam-kfa-juelich').concat('/download');
    } else if ( fileURL.indexOf("https://weblicht.sfs.uni-tuebingen.de/nextcloud") !== -1 ) {
	corsLink = fileURL.replace('https://weblicht.sfs.uni-tuebingen.de/nextcloud', '/weblicht-sfs-nextcloud').concat('/download');
    } else {
	corsLink = fileURL;
    }

    if ( (caller == "B2DROP") || (fileURL.indexOf('hdl.handle.net') > 1) || (caller == "PASTE") ) {
	return window.location.origin.concat('/clrs/download?input='+encodeURI(fileURL)) // the reverse proxy to the python script
    } else {
	return window.location.origin.concat('/clrs').concat(corsLink);                  // the reverse proxy to the clouds
    }
}

const langEncodingMap = {
    "generic" : "generic",
    
    "af" : "afr",
    "sq" : "sqi",
    "hy" : "hye",
    "bs" : "bos",
    "bg" : "bul",
    "ca" : "cat",
    "cs" : "ces",
    "zh" : "zho",
    "hr" : "hrv",
    "eo" : "epo",
    "et" : "est",
    "ka" : "kat",
    "hi" : "hin",
    "hu" : "hun",
    "is" : "isl",
    "id" : "ind",
    "ja" : "jpn",
    "kn" : "kan",
    "ku" : "kur",
    "lv" : "lav",
    "mk" : "mkd",
    "ml" : "mlg",
    "pl" : "pol",
    "fa" : "fas",
    "ro" : "ron",
    "sk" : "slk",
    "sl" : "slv",
    "sr" : "srp",
    "sw" : "swa",
    "ta" : "tam",
    "vi" : "vie",
    "cy" : "cym",
    "uk" : "ukr",
    "de" : "deu",
    "en" : "eng",
    "da" : "dan",
    "nl" : "nld",
    "fr" : "fra",
    "it" : "ita",
    "es" : "spa",
    "pt" : "por",
    "tr" : "tur",
    "ru" : "rus",
    "sv" : "swe",
    "fy" : "fry"
}
	
export const map639_1_to_639_3 = function( key ) {
    return langEncodingMap[key];
}

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
    } else if ((language == "da") || (language == "dan")) {
	languageName = "Danish";
    	threeLetterCode = "dan";
    } else if ((language == "tr") || (language == "tur")) {
	languageName = "Turkish";
    	threeLetterCode = "tur";	    
    } else if ((language == "ca") || (language == "cat")) {
	languageName = "Catalan";
    	threeLetterCode = "cat";	    
    } else if ((language == "hu") || (language == "hun")) {
	languageName = "Hungarian";
    	threeLetterCode = "hun";
    } else if ((language == "it") || (language == "ita")) {
	languageName = "Italian";
    	threeLetterCode = "ita";	    
    } else if ((language == "no") || (language == "nor")) {
	languageName = "Norwegian";
    	threeLetterCode = "nor";
    } else if ((language == "sv") || (language == "swe")) {
	languageName = "Swedish";
    	threeLetterCode = "swe";
    } else if ((language == "de") || (language == "deu")) {
	languageName = "German";
    	threeLetterCode = "deu";
    } else if ((language == "cs") || (language == "ces")) {
	languageName = "Czech";
    	threeLetterCode = "ces";	    
    } else if ((language == "es") || (language == "spa")) {
	languageName = "Spanish";
    	threeLetterCode = "spa";
    } else if ((language == "is") || (language == "isl")) {
	languageName = "Icelandic";
    	threeLetterCode = "isl";
    } else if ((language == "pl") || (language == "pol")) {
	languageName = "Polish";
    	threeLetterCode = "pol";
    } else if ((language == "th") || (language == "tha")) {
	languageName = "Thai";
    	threeLetterCode = "tha";
    } else if ((language == "hr") || (language == "hrv")) {
	languageName = "Croatian";
    	threeLetterCode = "hrv";	
    } else if ((language == "et") || (language == "est")) {
	languageName = "Estonian";
    	threeLetterCode = "est";
    } else if ((language == "sk") || (language == "slk")) {
	languageName = "Slovak";
    	threeLetterCode = "slk";
    } else if ((language == "sl") || (language == "slv")) {
	languageName = "Slovenian";
    	threeLetterCode = "slv";
    } else if ((language == "ro") || (language == "ron")) {
	languageName = "Romanian";
    	threeLetterCode = "ron";	    	    	    
    } else if ((language == "fi") || (language == "fin")) {
	languageName = "Finnish";
    	threeLetterCode = "fin";
    } else if ((language == "pt") || (language == "por")) {
	languageName = "Portuguese";
    	threeLetterCode = "por";
    } else if ((language == "el") || (language == "ell")) {
	languageName = "Greek";
    	threeLetterCode = "ell";
    } else if ((language == "fr") || (language == "fra")) {
	languageName = "French";
    	threeLetterCode = "fra";
    } else if ((language == "nl") || (language == "nld")) {
	languageName = "Dutch";
    	threeLetterCode = "nld";
    } else if ((language == "ru") || (language == "rus")) {
	languageName = "Russian";
    	threeLetterCode = "rus";
    } else {
	languageName = "Please identify language";
	threeLetterCode = "any";
    }

    // console.log('processLanguage', languageName, threeLetterCode)

    return { language  : languageName,
	     threeLetterCode: threeLetterCode
	   };
}

