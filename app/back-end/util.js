// export const fileStorageServerMPG    = '//weblicht.sfs.uni-tuebingen.de/clrs/storage/';
export const fileStorageServerMPG_localhost  = '//localhost/clrs/storage/';
export const fileStorageServerMPG_remote     = '//ws1-clarind.esc.rzg.mpg.de/drop-off/storage/';
// export const fileStorageServerB2DROP = '//weblicht.sfs.uni-tuebingen.de/owncloud';

// VPN @ shannon (reverse proxying)
export const fileStorageServerB2DROP_wc = "http://switchboard:clarin-plus@shannon.sfs.uni-tuebingen.de";

// official site, won't work because of CORS-related issue, reverse proxying needed
export const fileStorageServerB2DROP_offical = 'https://b2drop.eudat.eu';
export const fileStorageServerB2DROP_offcial_wc = "claus.zinn@uni-tuebingen.de:sPL-Fh2-7SS-hCJ@https://b2drop.eudat.eu"

// on localhost
export const fileStorageServerB2DROP_localhost_wc = "http://switchboard:clarin-plus@localhost"; 
export const fileStorageServerB2DROP = "http://localhost/owncloud";

export function unfoldHandle( handle ) {
    var hdlShortPrefix = "hdl:";
    var protocol = window.location.protocol;
    var hdlLongPrefix  = protocol.concat("//hdl.handle.net/");	
    var index = handle.indexOf(hdlShortPrefix);

    var result = decodeURIComponent(handle);

    if (index > -1) {
	result = hdlLongPrefix.concat( handle.substring(index+hdlShortPrefix.length, handle.length) );
    } else {
	console.log('UrlArea/unfoldHandle not need to unfold', handle);
    }

    return result;
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

