import React from 'react';
import ReactSelectize from 'react-selectize';
import LaneActions from '../actions/LaneActions';

// var MultiSelect = ReactSelectize.MultiSelect;
var SimpleSelect = ReactSelectize.SimpleSelect;
export default class LanguageMenu extends React.Component {

    constructor(props) {
	super(props);
    }

    render() {

	const { onLanguageSelection, ...props } = this.props;
	
	// mapping language names with ISO 639-3, will be informed by tool registry entries
	var options = [
	    { label: "Any Language",
	      value: "any"
	    },
	    { label: "Afrikaans",
	      value: "afr"
	    },
	    { label: "Albanian",
	      value: "sqi"
	    },
	    { label: "Arabic",
	      value: "ara"
	    },	    
	    { label: "Armenian",
	      value: "hye"
	    },	    	    	    
	    { label: "Bosnian",
	      value: "bos"
	    },
	    { label: "Bulgarian",
	      value: "bul"
	    },	    
	    { label: "Catalan",
	      value: "cat"
	    },
	    { label: "Czech",
	      value: "ces"
	    },
	    { label: "Chinese",
	      value: "zho"
	    },	    
	    { label: "Croatian",
	      value: "hrv"
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
	    { label: "German",
	      value: "deu"
	    },	    
	    { label: "Greek",
	      value: "ell"
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
	    { label: "Japanese",
	      value: "jap"
	    },
	    { label: "Kannada",
	      value: "kan"
	    },
	    { label: "Kurdish",
	      value: "kur"
	    },	    	    	    
	    { label: "Latin",
	      value: "lat"
	    },
	    { label: "Latvian",
	      value: "lav"
	    },	    
	    { label: "Macedonian",
	      value: "mkd"
	    },
	    { label: "Malagasy",
	      value: "mlg"
	    },	    
	    { label: "Polish",
	      value: "pol"
	    },
	    { label: "Persian",
	      value: "fas"
	    },
	    { label: "Portugese",
	      value: "por"
	    },	    
	    { label: "Romanian",
	      value: "ron"
	    },
	    { label: "Russian",
	      value: "rus"
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
	    { label: "Ukrainian",
	      value: "ukr"
	    },	    
	    { label: "Vietnamese",
	      value: "vie"
	    },	    	    
	    { label: "Welsh",
	      value: "cym"
	    }].map(function(language){
                return {label: language.label, value: language.value}
                       });
	
        return <SimpleSelect options = {options}
 	                     placeholder = "Select language"
	                     onValueChange = {this.props.onLanguageSelection}
  	       >
	       </SimpleSelect>
    }
}
