// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: LanguageMenu.jsx
// Time-stamp: <2019-03-06 21:41:22 (zinn)>
// -------------------------------------------

import React from 'react';
import ReactSelectize from 'react-selectize';

// var MultiSelect = ReactSelectize.MultiSelect;
var SimpleSelect = ReactSelectize.SimpleSelect;

export default class LanguageMenu extends React.Component {

    constructor(props) {
	super(props);
    }

    filterLanguages( toolLanguages, langOptions ) {
    	var langOptionsFiltered = langOptions.filter(
		    (lo) =>   {
			if (toolLanguages.indexOf( lo.value ) != -1) {
			    return lo;
			} 
		    });

	return langOptionsFiltered;
    }
    
    render() {
	const {defaultValue, ...props } = this.props;
	const that = this;
	// mapping language names with ISO 639-3, will be informed by tool registry entries
	var options = [
	    { label: "Please identify language",
	      value: "any"
	    },
	    { label: "Afrikaans",
	      value: "afr"
	    },	    
	    { label: "Albanian",
	      value: "sqi"
	    },
	    { label: "Ancient Greek",
	      value: "grc"
	    },	    
	    { label: "Arabic",
	      value: "ara"
	    },	    
	    { label: "Armenian",
	      value: "hye"
	    },
	    { label: "Belarusian",
	      value: "bel"
	    },	    	    	    
	    { label: "Bosnian",
	      value: "bos"
	    },
	    { label: "Basque",
	      value: "eus"
	    },	    
	    { label: "Bulgarian",
	      value: "bul"
	    },	    
	    { label: "Catalan",
	      value: "cat"
	    },
	    { label: "Chinese",
	      value: "zho"
	    },
	    { label: "Coptic",
	      value: "cop"
	    },	    	    
	    { label: "Croatian",
	      value: "hrv"
	    },
	    { label: "Czech",
	      value: "ces"
	    },	    
	    { label: "Danish",
	      value: "dan"
	    },
	    { label: "Dutch",
	      value: "nld"
	    },	    
	    { label: "English",
	      value: "eng"
	    },
	    { label: "Esperanto",
	      value: "epo"
	    },
	    { label: "Estonian",
	      value: "est"
	    },
	    { label: "Finnish",
	      value: "fin"
	    },	    
	    { label: "French",
	      value: "fra"
	    },
	    { label: "Frysian",
	      value: "fry"
	    },	    
	    { label: "Georgian",
	      value: "kat"
	    },
	    { label: "Galician",
	      value: "glg"
	    },	    
	    { label: "German",
	      value: "deu"
	    },
	    { label: "Gothic",
	      value: "got"
	    },	    	    
	    { label: "Greek",
	      value: "ell"
	    },
	    { label: "Hebrew",
	      value: "heb"
	    },	    	    
	    { label: "Hindi",
	      value: "hin"
	    },	    
	    { label: "Hungarian",
	      value: "hun"
	    },
	    { label: "Icelandic",
	      value: "isl"
	    },
	    { label: "Indonesian",
	      value: "ind"
	    },	    
	    { label: "Italian",
	      value: "ita"
	    },
	    { label: "Irish",
	      value: "gle"
	    },	    	    
	    { label: "Japanese",
	      value: "jap"
	    },
	    { label: "Kannada",
	      value: "kan"
	    },
	    { label: "Kazakh",
	      value: "kaz"
	    },	    
	    { label: "Kurdish",
	      value: "kur"
	    },
	    { label: "Korean",
	      value: "kor"
	    },	    	    	    	    
	    { label: "Latin",
	      value: "lat"
	    },
	    { label: "Latvian",
	      value: "lav"
	    },
	    { label: "Lithuanian",
	      value: "lit"
	    },	    	    
	    { label: "Macedonian",
	      value: "mkd"
	    },
	    { label: "Malagasy",
	      value: "mlg"
	    },
	    { label: "Maltese",
	      value: "mlt"
	    },	    
	    { label: "Norwegian",
	      value: "nor"
	    },
	    { label: "Norwegian Bokmål",
	      value: "nob"
	    },
	    { label: "Norwegian Nynorsk",
	      value: "nno"
	    },	    	    	    
	    { label: "Old Church Slavonic",
	      value: "chu"
	    },
	    { label: "Polish",
	      value: "pol"
	    },	    
	    { label: "Persian",
	      value: "fas"
	    },
	    { label: "Portuguese",
	      value: "por"
	    },	    
	    { label: "Romanian",
	      value: "ron"
	    },
	    { label: "Russian",
	      value: "rus"
	    },
	    { label: "Sanskrit",
	      value: "san"
	    },
	    { label: "Scottish Gaelic",
	      value: "gla"
	    },	    
	    { label: "Slovak",
	      value: "slk"
	    },	    
	    { label: "Slovenian",
	      value: "slv"
	    },	    
	    { label: "Serbian",
	      value: "srp"
	    },
	    { label: "Spanish",
	      value: "spa"
	    },
	    { label: "Swedish",
	      value: "swe"
	    },
	    { label: "Swahili",
	      value: "swa"
	    },	    	    	    
	    { label: "Turkish",
	      value: "tur"
	    },
	    { label: "Tamil",
	      value: "tam"
	    },
	    { label: "Uighur",
	      value: "uig"
	    },	    
	    { label: "Ukrainian",
	      value: "ukr"
	    },
	    { label: "Urdu",
	      value: "urd"
	    },	    	    
	    { label: "Vietnamese",
	      value: "vie"
	    },	    	    
	    { label: "Welsh",
	      value: "cym"
	    }].map(function(language){
                return {label: language.label, value: language.value}
                       });

        return (<SimpleSelect options = {options}
                defaultValue  = {that.props.defaultValue}
                value  = {that.props.defaultValue}
 	                     placeholder = "Select language"
                renderValue = {function(item){
				 var exists = options.map(function(option){
				     return option.label
				 }).indexOf(item.label) != -1
				 
				 return <div 
				 className="simple-value"
				 style={{
				     color: exists ? "black" : "red"
				 }}
				     >{item.label}</div>
				     
	}}
                             onValueChange = {this.props.onLanguageSelection}	
  	       >
	       </SimpleSelect>
	       )}
}
