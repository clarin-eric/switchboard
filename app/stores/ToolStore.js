// todo: clean-up code base. Single store vs. multiple store
// naming: registeredTools vs. applicableTools
// harvesting registeredTools from where. App registry helper app?
// 

import uuid from 'node-uuid';
import assign from 'object-assign';
import alt from '../libs/alt';
import ToolActions from '../actions/ToolActions';

// inquire the internal state of language and mimetype menu
// import LanguageMenu from './../components/LanguageMenu.jsx';
// import MimetypeMenu from './../components/MimetypeMenu.jsx';

class ToolStore {
    constructor() {
	this.bindActions(ToolActions);

	this.applicableTools = [];
	
	// an initial list of tools that we are aware of.
	this.tools = 
	    [
		{ task: "tokenisation",
		  name: "Ucto",
		  homepage: "https://proycon.github.io/ucto",
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "0.8.3",
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "A tokeniser",
		  longDescription: "Ucto is a unicode-compliant tokeniser. It takes input in the form of one or more untokenised texts, and subsequently tokenises them. Several languages are supported, but the software is extensible to other languages.",
		  languages: ["nld", "eng", "deu", "fra", "ita", "spa", "por", "tur", "rus", "swe"], //iso 639-3
		  mimetypes: ["text/xml","text/plain"], //plain text OR FoLiA XML
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["https://webservices-lst.science.ru.nl/ucto/"],
		  parameter: { "project"        : "new",
			       "untokinput_url" : "self.linkToResource"
			     }
		},
		
		{ task: "Conversion of image format to jpg",
		  name: "imageFormat2jpeg",
		  homepage: "http://image.online-convert.com/convert-to-png",
		  creators: ["Some guy somewhere"],
		  contact: {
		      person: "to_be_filled_out",
		      email: "to_be_filled_out"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Converts a pdf document in jpg",
		  shortDescription: "PDF2JPG Converter", 
		  languages: ["n/a"], 
		  mimetypes: ["image/jpeg"],
		  output: ["image/png"],
		  url: "http://image.online-convert.com/convert-to-png",
		  pid: "",
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     },
		},

		{ task: "Conversion of pdf to jpg",
		  name: "pdf2jpg",
		  homepage: "http://pdf2jpg.net",
		  creators: ["Some guy somewhere"],
		  contact: {
		      person: "to_be_filled_out",
		      email: "to_be_filled_out"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Converts a pdf document in jpg",
		  shortDescription: "PDF2JPG Converter", 
		  languages: ["n/a"], 
		  mimetypes: ["application/pdf"],
		  output: ["image/jpeg"],
		  url: "http://pdf2jpg.net",
		  pid: "",
		  parameter: { input :     "self.linkToResource" // for demo upload site, to be instantiated
			     },
		},		

		{ task: "Metadata format conversion",
		  name: "NaLiDa2Marc21",
		  homepage: "http://shannon.sfs.uni-tuebingen.de/NaLiDa2Marc21",
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Webservice converting NaLiDa-based CMDI profiles to Marc21",
		  shortDescription: "Bibliographic Format Converter", // controlled vocabulary, change name?
		  languages: ["n/a"], 
		  mimetypes: ["text/xml"],
		  output: ["text/xml"],
		  url: "http://shannon.sfs.uni-tuebingen.de:8080/NaLiDa2Marc-1.0/",
		  pid: "",
		  parameter: { input :     "self.linkToResource" // for demo upload site, to be instantiated
			     },
		  
		  // URL to get called: https://weblicht.sfs.uni-tuebingen.de/weblicht/?input=/link/to/resource&chainName=NamedEntities-DE
		},		

		{ task: "Named Entity Recognizer (for German)",
		  name: "Weblicht-NamedEntities-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for German Named Entity Recognition. For, more information start Weblicht with easychain.",
		  shortDescription: "Named Entity Recognizer", // controlled vocabulary, change name?
		  languages: ["deu"], 
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://shannon.sfs.uni-tuebingen.de:8888/weblicht/",
		  pid: "",
		  parameter: {chainName : "NamedEntities-DE",
			      input :     "self.linkToResource" // for demo upload site
			     },
		  
		  // URL to get called: https://weblicht.sfs.uni-tuebingen.de/weblicht/?input=/link/to/resource&chainName=NamedEntities-DE
		},		
		
		{ task: "Part-of-speech tagging and lemmatization (for German)",
		  name: "Weblicht-POSTags-Lemmas-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for POS Tagging and Lemmatization. For, more information start Weblicht with easychain.",
		  shortDescription: "POS Tagger",
		  languages: ["deu"], 
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://shannon.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {chainName : "POSTags-Lemmas-DE",
			      input :     "self.linkToResource" 
			     },
		},
		
		{ task: "Text-2-Speech Generation",
		  name: "Mary Text-to-Speech system",
		  homepage: "http://mary.dfki.de",
		  creators: ["DFKI Language Technology Lab"],
		  contact: {
		      person: "",
		      email: ""
		  },	    
		  version: "MaryTTS 5.12", // to check with version employed by web service
		  licence: "GNU Lesser General Public License v3.0",
		  longDescription: "Mary Text-to-Speech System",
		  shortDescription: "Text-2-Speech",
		  languages: ["deu"], 
		  mimetypes: ["text/plain"], // to adapt
		  output: ["text/xml"],
		  url: "https://clarin.phonetik.uni-muenchen.de/BASWebServices/services/runTTS",
		  pid: "",
		  
		  // assp:  query parameters can be given in any order
		  parameterTemplate: "curl -v -X POST -H 'content-type: application/x-www-form-urlencoded' 'https://clarin.phonetik.uni-muenchen.de/BASWebServices/services/runTTS?AUDIO=WAVE_FILE&INPUT_TYPE=TEXT&INPUT_TEXT=<TEXT>&VOICE=bits1unitselautolabel&OUTPUT_TYPE=AUDIO'"
		},	  
	    ];
	
	this.exportPublicMethods({
	    get: this.get.bind(this),
	    getTool: this.getTool.bind(this)	    
	});
    }
    
    create(tool) {
	const tools = this.tools;
	
	tool.id = uuid.v4();
	
	this.setState({
	    tools: tools.concat(tool)
	});
	
	return tool;
    }

    reset () {
	this.setState({
	    applicableTools: []
	});

	console.log('ToolStore/reset');
    }
    
    update(updatedTool) {
	const tools = this.tools.map((tool) => {
	    if(tool.id === updatedTool.id) {
		return assign({}, tool, updatedTool);
	    }
	    
	    return tool;
	});
	
	this.setState({tools});
    }
    
    delete(id) {
	this.setState({
	    tools: this.tools.filter((tool) => tool.id !== id)
	});
    }

    getTool(toolId) {
	console.log('ToolStore/getTool at start with id: ', toolId);	
	const tool = this.tools.filter((tool) => tool.id == toolId);
	console.log('ToolStore/getTool having identified tool: ', tool[0]);

	// modify state
	this.setState({
	    selectedTool: [].concat(tool)
	});

	return { tool: tool[0] }; // todo
    }

    // multiple filters to be defined, in particular, language code
    findTools( resourceDescription ) {

	console.log("ToolStore/findTools at the very start.");
	// first, retrieve the mimetypes and languages that the user might have changed
	// var languages = LanguageMenu.getState();
	// console.log("ToolStore/findTools", LanguageMenu, LanguageMenu().selectedLanguages);
		    
	// first filter: mimetype
	var filteredTools = this.tools.filter((tool) =>
					      {
						  var result = tool.mimetypes.indexOf(resourceDescription.mimetype);
					          if (result != -1) {
						      // attach id to the tool
						      tool.id = uuid.v4();
						      return tool;
						  }
					      });

	console.log('ToolStore/findTools with mimetype', resourceDescription, filteredTools);

	// second filter: language code (TODO)
	if (resourceDescription.language != null) {
	    console.log("ToolStore: need to filter for language code", resourceDescription.languageCode);
	} else {
	    console.log("ToolStore: resource has no language code information available")
	}
	
	this.setState({
	    applicableTools: filteredTools
	});
	
	return filteredTools;
    }
    
    get(ids) {
	return (ids || []).map(
	    (id) => this.tools.filter((tool) => tool.id === id)
	).filter((a) => a.length).map((a) => a[0]);
    }
}

export default alt.createStore(ToolStore, 'ToolStore');
