export default {
    processLanguage: function( language ) {

	var languageCombo = null;
	var threeLetterCode = null;

	if ( (language == "en") || (language == "eng") ) {
	    languageCombo = "English:eng";
	    threeLetterCode = "eng";
	} else if (language == "da") {
	    languageCombo = "Danish:dan";
    	    threeLetterCode = "dan";
	} else if (language == "ca") {
	    languageCombo = "Catalan:cat";
    	    threeLetterCode = "cat";	    
	} else if (language == "hu") {
	    languageCombo = "Hungarian:hun";
    	    threeLetterCode = "hun";
	} else if (language == "it") {
	    languageCombo = "Italian:ita";
    	    threeLetterCode = "ita";	    
	} else if (language == "no") {
	    languageCombo = "Norwegian:nor";
    	    threeLetterCode = "nor";
	} else if (language == "sv") {
	    languageCombo = "Swedish:swe";
    	    threeLetterCode = "swe";
	} else if (language == "de") {
	    languageCombo = "German:deu";
    	    threeLetterCode = "deu";
	} else if (language == "es") {
	    languageCombo = "Spanish:spa";
    	    threeLetterCode = "spa";
	} else if (language == "is") {
	    languageCombo = "Icelandic:isl";
    	    threeLetterCode = "isl";
	} else if (language == "pl") {
	    languageCombo = "Polish:pol";
    	    threeLetterCode = "pol";
	} else if (language == "th") {
	    languageCombo = "Thai:tha";
    	    threeLetterCode = "tha";
	} else if (language == "et") {
	    languageCombo = "Estonian:est";
    	    threeLetterCode = "est";
	} else if (language == "sk") {
	    languageCombo = "Slovak:slk";
    	    threeLetterCode = "slk";
	} else if (language == "sl") {
	    languageCombo = "Slovenian:slv";
    	    threeLetterCode = "slv";
	} else if (language == "ro") {
	    languageCombo = "Romanian:ron";
    	    threeLetterCode = "ron";	    	    	    
	} else if (language == "fi") {
	    languageCombo = "Finnish:fin";
    	    threeLetterCode = "fin";
	} else if (language == "pt") {
	    languageCombo = "Portuguese:por";
    	    threeLetterCode = "por";
	} else if (language == "el") {
	    languageCombo = "Greek:ell";
    	    threeLetterCode = "ell";
	} else if (language == "fr") {
	    languageCombo = "French:fra";
    	    threeLetterCode = "fra";
	} else if (language == "nl") {
	    languageCombo = "Dutch:nld";
    	    threeLetterCode = "nld";
	} else if (language == "ru") {
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
};