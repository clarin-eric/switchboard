function processLanguage( language ) {

    var languageCombo = null;
    var threeLetterCode = null;

    if ( (language == "en") || (language == "eng") ) {
	languageCombo = "English:eng";
	threeLetterCode = "eng";
    } else if ((language == "da") || (language == "dan")) {
	languageCombo = "Danish:dan";
    	threeLetterCode = "dan";
    } else if ((language == "tr") || (language == "tur")) {
	languageCombo = "Turkish:tur";
    	threeLetterCode = "tur";	    
    } else if ((language == "ca") || (language == "cat")) {
	languageCombo = "Catalan:cat";
    	threeLetterCode = "cat";	    
    } else if ((language == "hu") || (language == "hun")) {
	languageCombo = "Hungarian:hun";
    	threeLetterCode = "hun";
    } else if ((language == "it") || (language == "ita")) {
	languageCombo = "Italian:ita";
    	threeLetterCode = "ita";	    
    } else if ((language == "no") || (language == "nor")) {
	languageCombo = "Norwegian:nor";
    	threeLetterCode = "nor";
    } else if ((language == "sv") || (language == "swe")) {
	languageCombo = "Swedish:swe";
    	threeLetterCode = "swe";
    } else if ((language == "de") || (language == "deu")) {
	languageCombo = "German:deu";
    	threeLetterCode = "deu";
    } else if ((language == "cs") || (language == "ces")) {
	languageCombo = "Czech:ces";
    	threeLetterCode = "ces";	    
    } else if ((language == "es") || (language == "spa")) {
	languageCombo = "Spanish:spa";
    	threeLetterCode = "spa";
    } else if ((language == "is") || (language == "isl")) {
	languageCombo = "Icelandic:isl";
    	threeLetterCode = "isl";
    } else if ((language == "pl") || (language == "pol")) {
	languageCombo = "Polish:pol";
    	threeLetterCode = "pol";
    } else if ((language == "th") || (language == "tha")) {
	languageCombo = "Thai:tha";
    	threeLetterCode = "tha";
    } else if ((language == "et") || (language == "est")) {
	languageCombo = "Estonian:est";
    	threeLetterCode = "est";
    } else if ((language == "sk") || (language == "slk")) {
	languageCombo = "Slovak:slk";
    	threeLetterCode = "slk";
    } else if ((language == "sl") || (language == "slv")) {
	languageCombo = "Slovenian:slv";
    	threeLetterCode = "slv";
    } else if ((language == "ro") || (language == "ron")) {
	languageCombo = "Romanian:ron";
    	threeLetterCode = "ron";	    	    	    
    } else if ((language == "fi") || (language == "fin")) {
	languageCombo = "Finnish:fin";
    	threeLetterCode = "fin";
    } else if ((language == "pt") || (language == "por")) {
	languageCombo = "Portuguese:por";
    	threeLetterCode = "por";
    } else if ((language == "el") || (language == "ell")) {
	languageCombo = "Greek:ell";
    	threeLetterCode = "ell";
    } else if ((language == "fr") || (language == "fra")) {
	languageCombo = "French:fra";
    	threeLetterCode = "fra";
    } else if ((language == "nl") || (language == "nld")) {
	languageCombo = "Dutch:nld";
    	threeLetterCode = "nld";
    } else if ((language == "ru") || (language == "rus")) {
	languageCombo = "Russian:rus";
    	threeLetterCode = "rus";
    } else {
	languageCombo = "Please identify language:any";
	threeLetterCode = "any";
    }

    console.log('util/processLanguage', language, languageCombo, threeLetterCode);
    return { languageCombo  : languageCombo,
	     threeLetterCode: threeLetterCode
	   };
}

export default processLanguage;