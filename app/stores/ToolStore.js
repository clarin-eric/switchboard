// todo: clean-up code base. Single store vs. multiple store
// harvesting registeredTools from where. App registry helper app?
// 

import uuid from 'node-uuid';
import assign from 'object-assign';
import alt from '../libs/alt';
import ToolActions from '../actions/ToolActions';
import NoteStore from './NoteStore';

class ToolStore {
    constructor() {
	this.bindActions(ToolActions);
	this.applicableTools = [];
	this.tasks = [];

	this.groupTools = this.groupTools.bind(this);
	
	// an initial list of tools that we are aware of.
	this.registeredTools = 
	    [
		{ task: "Tokenisation",
		  name: "CLARIN-DK Tool Box",
		  homepage: "https://www.clarin.dk/tools/createByGoalChoice",
		  location: "Copenhagen, Danmark",
		  creators: ["Bart Jongejan et al."],
		  contact: {
		      person: "Bart Jongejan",
		      email: "bartj@hum.ku.dk",
		  },
		  version: "0.8.3",
		  license: "public", 
		  shortDescription: "CLARIN-DK Tool Box",
		  longDescription:  "CLARIN-DK Tool Box",
		  lang_encoding: "639-1",
		  languages: ["bul", "ces", "dan", "deu", "ell", "eng", "spa", "est", "fas", "fra",
			      "hun", "isl", "ita", "lat", "mkd", "nld", "pol", "por", "ron", "rus",
			      "slk", "slv", "srp", "tur", "ukr"],
		  mimetypes: ["application/pdf",
			      "application/vnd.ms-powerpoint", // (PPT)
			      "application/vnd.openxmlformats-officedocument.presentationml.presentation", // (PPTX)
			      "application/vnd.oasis.opendocument.presentation", // (ODP)
			      "application/vnd.ms-excel", // (XLS)
			      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // (XLSX)
			      "application/vnd.oasis.opendocument.spreadsheet", // (ODS)
			      "application/x-download", //    (If it is PDF or RTF)
			      "application/octet-stream", //  (If it is PDF or RTF)
			      "application/msword", //         (RTF, DOC, DOCX)
			      "application/vnd.oasis.opendocument.text", // (ODT)
			      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // (DOCX)
			      "text/html", // (HTML)
			      "text/rtf",  // (RTF)
			      "text/plain", 
			      "text/x-conll", // (CONLL)
			      "image/gif", 
			      "image/jpeg", 
			      "image/pjpeg", 
			      "image/png", 
			      "image/svg+xml", 
			      "image/tiff", 
			      "image/vnd.microsoft.icon"
			     ],
		  url: ["https://www.clarin.dk/tools/createByGoalChoice"], // todo
		  parameter: { "project"        : "new",
			       "untokinput_url" : "self.linkToResource"
			     }
		},
		
		{ task: "Tokenisation",
		  name: "Ucto",
		  homepage: "https://proycon.github.io/ucto",
		  location: "Nijmegen, The Netherlands",		  
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
		  lang_encoding: "639-1",
		  mimetypes: ["text/xml","text/plain"], //plain text OR FoLiA XML
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["https://webservices-lst.science.ru.nl/ucto/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource",
			       lang         : "self.linkToResourceLanguage",
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "untokinput_url",
			       lang         : "untokinput_language"
			     }
		},
		
		{ task: "Metadata Format Conversion",
		  name: "NaLiDa2Marc21",
		  homepage: "http://shannon.sfs.uni-tuebingen.de/NaLiDa2Marc21",
		  location: "Tuebingen, Germany",		  		  
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
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     }
		  
		  // URL to get called:
		  // http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht?input=http://hdl.handle.net/10932/00-017B-E3BC-2D57-CC01-6&lang=de&analysis=ne
		},		

		// todo: 'en' version for the other weblicht services
		// --------------------------------------------------
		
		{ task: "Named Entity Recognition",
		  name: "Weblicht-NamedEntities-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for German Named Entity Recognition (German).",
		  shortDescription: "Named Entity Recognizer", // controlled vocabulary, change name?
		  languages: ["deu"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht",
		  pid: "",
		  parameter: {  input   :  "self.linkToResource", // for demo upload site (will be initialized)
				lang    : "de",                   // German
				analysis: "ne"                    // Named Entities
			     }
		},

		{ task: "Named Entity Recognition",
		  name: "Weblicht-NamedEntities-EN",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for German Named Entity Recognition (English).",
		  shortDescription: "Named Entity Recognizer", // controlled vocabulary, change name?
		  languages: ["eng"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht",
		  pid: "",
		  parameter: {  input   :  "self.linkToResource", // for demo upload site (will be initialized)
				lang    : "en",                   // German
				analysis: "ne"                    // Named Entities
			     }
		},				
		
		{ task: "Constituent Parsing",
		  name: "Weblicht-Const-Parsing-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Constituent Parsing (German).",
		  shortDescription: "Constituent Parsing",
		  languages: ["deu"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "de",			      
			      analysis:   "const-parsing"
			     }
		},

		{ task: "Constituent Parsing",
		  name: "Weblicht-Const-Parsing-EN",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Constituent Parsing (English).",
		  shortDescription: "Constituent Parsing",
		  languages: ["eng"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "en",			      
			      analysis:   "const-parsing"
			     }
		},		
		
		{ task: "Dependency Parsing",
		  name: "Weblicht-Dep-Parsing-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Dependency Parsing (German).",
		  shortDescription: "Dependency Parsing",
		  languages: ["deu"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "de",			      
			      analysis:   "dep-parsing"
			     }
		},

		{ task: "Dependency Parsing",
		  name: "Weblicht-Dep-Parsing-EN",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Dependency Parsing (English).",
		  shortDescription: "Dependency Parsing",
		  languages: ["eng"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "en",			      
			      analysis:   "dep-parsing"
			     }
		},				

		{ task: "Lemmatization",
		  name: "Weblicht-Lemmas-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Lemmatization (German).",
		  shortDescription: "Lemmatizer",
		  languages: ["deu"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "de",			      
			      analysis:   "lemma"
			     }
		},

		{ task: "Lemmatization",
		  name: "Weblicht-Lemmas-EN",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Lemmatization (English).",
		  shortDescription: "Lemmatizer",
		  languages: ["eng"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "en",			      
			      analysis:   "lemma"
			     }
		},		
		
		{ task: "Part-Of-Speech Tagging",
		  name: "Weblicht-POSTags-Lemmas-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for POS Tagging and Lemmatization (German).",
		  shortDescription: "POS Tagger",
		  languages: ["deu"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "de",			      
			      analysis:   "pos"
			     }
		},		

		{ task: "Part-Of-Speech Tagging",
		  name: "Weblicht-POSTags-Lemmas-EN",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for POS Tagging and Lemmatization (English).",
		  shortDescription: "POS Tagger",
		  languages: ["eng"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "en",			      
			      analysis:   "pos"
			     }
		},		
		
		{ task: "Morphology Analysis",
		  name: "Weblicht-Morphology-DE",
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Morphology Analysis (German)",
		  shortDescription: "Morphology",
		  languages: ["deu"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "de",			      
			      analysis:   "morphology"
			     }
		},
		
		{ task: "Morphology Analysis",
		  name: "Weblicht-Morphology-EN",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for Morphology Analysis (English)",
		  shortDescription: "Morphology",
		  languages: ["eng"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht/",		  
		  pid: "",
		  parameter: {input :     "self.linkToResource",
			      lang:       "en",			      
			      analysis:   "morphology"
			     }
		}		
	    ];
	
	this.exportPublicMethods({
	    get: this.get.bind(this),
	    getTool: this.getTool.bind(this)	    
	});
    }
    
    create(tool) {
	const registeredTools = this.registeredTools;
	
	tool.id = uuid.v4();
	tool.notes = tool.notes || [];
	
	this.setState({
	    registeredTools: registeredTools.concat(tool)
	});
	
	return tool;
    }

    reset () {
	this.setState({
	    applicableTools: [],
	    tasks: []
	});

	console.log('ToolStore/reset');
    }
    
    update(updatedTool) {
	const registeredTools = this.registeredTools.map((tool) => {
	    if(tool.id === updatedTool.id) {
		return assign({}, tool, updatedTool);
	    }
	    
	    return tool;
	});
	
	this.setState({registeredTools});
    }
    
    delete(id) {
	this.setState({
	    registeredTools: this.registeredTools.filter((tool) => tool.id !== id)
	});
    }

    getTool(toolId) {
	console.log('ToolStore/getTool at start with id: ', toolId);	
	const tool = this.registeredTools.filter((tool) => tool.id == toolId);
	console.log('ToolStore/getTool having identified tool: ', tool[0]);

	// modify state
	this.setState({
	    selectedTool: [].concat(tool)
	});

	return { tool: tool[0] }; // todo
    }

        // groups tools in terms of the tasks/analyses they can perform
    groupTools( applicTools ){

	var toolGroups = {};

	for (var i = 0; i<applicTools.length; i++) {
	    const entry = applicTools[i];
	    const tinfo = [ {
		name : entry.name,
		longDescription : entry.longDescription,
		url  : entry.url,
		location : entry.location,
		id   : entry.id,
		email : entry.contact.email,
		parameter : entry.parameter,
		lang_encoding: entry.lang_encoding,
		mapping : entry.mapping,
		} ];

	    if (entry.task in toolGroups) { // obj.hasOwnProperty("key")
		toolGroups[ entry.task ] = toolGroups[ entry.task ].concat( tinfo );
	    } else {
		toolGroups[ entry.task ] = [].concat( tinfo );		
	    }
	}

	console.log('ToolStore/groupTools', toolGroups);
	return toolGroups;
	
    }


    // multiple filters to be defined, in particular, language code
    findTools( resourceDescription ) {

	console.log("ToolStore/findTools at the very start.", resourceDescription);
		    
	// first filter: mimetype
	var mimetypeFilter = this.registeredTools.filter((tool) =>
					      {
						  var result = tool.mimetypes.indexOf(resourceDescription.mimetype);
					          if (result != -1) {
						      // attach id to the tool
						      tool.id = uuid.v4();
						      return tool;
						  }
					      });

	console.log('ToolStore/findTools with mimetype', resourceDescription, mimetypeFilter);

	var languageFilter = mimetypeFilter;
	
	// second filter: language code 
	if ( (resourceDescription.language == null) || (resourceDescription.language.length == 0)) {
	    console.log('ToolStore/findTools: empty language', resourceDescription.language); 
	} else {
	    languageFilter = mimetypeFilter.filter((tool) =>
						   {
						       console.log('ToolStore/findTools: NON-empty language, checking',
								   resourceDescription.language, tool);
						       
						       var result = tool.languages.indexOf(resourceDescription.language);
					               if (result != -1) {
							   // attach id to the tool
							   tool.id = uuid.v4();
							   return tool;
						       }
						   });
	}

	// --------------------------------	
	// additional filters coming here..
	// --------------------------------

	// now, for the task-oriented view
	var tasks = this.groupTools( languageFilter );
	    
	this.setState({
	    applicableTools: languageFilter,
	    tasks: tasks
	});
	
	return languageFilter;
    }
    
    get(ids) {
	return (ids || []).map(
	    (id) => this.registeredTools.filter((tool) => tool.id === id)
	).filter((a) => a.length).map((a) => a[0]);
    }
}

export default alt.createStore(ToolStore, 'ToolStore');
