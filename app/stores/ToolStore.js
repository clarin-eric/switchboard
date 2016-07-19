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
		  name: "CLARIN-DK Tool Box (CST Tokenizer)",
		  softwareType: "browserBased", 
		  logo: "YourLogoComesHere.png",
		  homepage: "https://clarin.dk/clarindk/forside.jsp",		  
		  location: "Copenhagen, Denmark",
		  creators: ["Bart Jongejan et al."],
		  contact: {
		      person: "Bart Jongejan",
		      email: "bartj@hum.ku.dk",
		  },
		  version: "0.8.3",
		  license: "public",
		  authentification: "no",
		  shortDescription: "CLARIN-DK Tool Box (CST Tokenizer)",
		  longDescription:  "CLARIN-DK Tool Box (CST Tokenizer for English and Danish)",
		  lang_encoding: "639-1",
		  languages: ["dan", "eng"],
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

		  parameter: {  input   : "self.linkToResource", 
				lang    : "self.linkToResourceLanguage",                 
				analysis: "tok",
				UIlanguage: "en"
			     },
		  mapping:   { input        : "URL",
			       lang         : "language"
			     }		  
		},

		{ task: "Lemmatization",
		  name: "CLARIN-DK Tool Box (CST Lemmatizer)",
		  logo: "YourLogoComesHere.png",
		  homepage: "https://clarin.dk/clarindk/forside.jsp",		  
		  location: "Copenhagen, Denmark (CLAM Webservices)",
		  creators: ["Bart Jongejan et al."],
		  contact: {
		      person: "Bart Jongejan",
		      email: "bartj@hum.ku.dk",
		  },
		  version: "0.8.3",
		  license: "public",
		  authentification: "no",		  
		  shortDescription: "CLARIN-DK Tool Box (CST Lemmatizer)",
		  longDescription:  "CLARIN-DK Tool Box (CST Lemmatizer). Lemmatiser for Bulgarian, Czech, Danish, Dutch, English, Estonian, Farsi, French, German, Greek, Hungarian, Icelandic, Italian, Latin, Macedonian, Polish, Portuguese, Romanian, Russian, Slovak, Serbian, Slovene, Spanish, and Ukrainian",
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
		  url: ["https://www.clarin.dk/tools/createByGoalChoice"], 
		  parameter: {  input   : "self.linkToResource", 
				lang    : "self.linkToResourceLanguage",                 
				analysis: "lem",
				UIlanguage: "en"				
			     },

		  // CLARIN-DK calls those parameters differently, namely:
		  mapping:   { input        : "URL",
			       lang         : "language"
			     }		  
		},		
		
		{ task: "Voice Synthesis",
		  name: "CLARIN-DK Tool Box (espeak)",
		  logo: "YourLogoComesHere.png",
		  homepage: "https://clarin.dk/clarindk/forside.jsp",
		  location: "Copenhagen, Denmark (CLAM Webservices)",
		  creators: ["Bart Jongejan et al."],
		  contact: {
		      person: "Bart Jongejan",
		      email: "bartj@hum.ku.dk",
		  },
		  version: "0.8.3",
		  license: "public",
		  authentification: "no",		  
		  shortDescription: "CLARIN-DK Tool Box (espeak)",
		  longDescription:  "Text to speech software. History. Originally known as speak and originally written for Acorn/RISC_OS computers starting in 1995. This version is an enhancement and re-write, including a relaxation of the original memory and processing power constraints, and with support for additional languages.",
		  lang_encoding: "639-1",
		  languages: ["afr", "bul", "bos", "cat", "ces", "cym", "dan", "ell", "eng", "epo", "spa", "est", "fin", "fas", "fra", 
			      "hin", "hrv", "hun", "hye", "ind", "isl", "ita", "kat", "kan", "kur", "lat", "lav", "mkd", "mlg", "nld",
			      "pol", "por", "ron", "rus", "slk", "sqi", "srp", "swe", "swa", "tam", "tur", "ukr", "vie", "zho"],
		  mimetypes: [
			      "text/plain"
			     ],
		  url: ["https://www.clarin.dk/tools/createByGoalChoice"], 
		  parameter: {  input   : "self.linkToResource", 
				lang    : "self.linkToResourceLanguage",                 
				analysis: "voiceSynthesis",
				UIlanguage: "en"				
			     },

		  // CLARIN-DK calls those parameters differently, namely:
		  mapping:   { input        : "URL",
			       lang         : "language"
			     }		  
		},		
		

		{ task: "Named Entity Recognition",
		  name: "CLARIN-DK Tool Box (CST's name recognizer)",
		  logo: "YourLogoComesHere.png",
		  homepage: "https://clarin.dk/clarindk/forside.jsp",		  
		  location: "Copenhagen, Denmark (CLAM Webservices)",
		  creators: ["Bart Jongejan et al."],
		  contact: {
		      person: "Bart Jongejan",
		      email: "bartj@hum.ku.dk",
		  },
		  version: "0.8.3",
		  license: "public",
		  authentification: "no",		  
		  shortDescription: "CLARIN-DK Tool Box (CST's name recognizer)",
		  longDescription:  "CLARIN-DK Tool Box (CST). CST's name recogniser classifies names as proper names, locations (with sub-classes of street, city, land and other types of locations), and other names (called MISC)",
		  lang_encoding: "639-1",
		  languages: ["dan"],
		  mimetypes: ["text/plain"
			     ],
		  url: ["https://www.clarin.dk/tools/createByGoalChoice"], 
		  parameter: {  input   : "self.linkToResource", 
				lang    : "self.linkToResourceLanguage",                 
				analysis: "ner",
				UIlanguage: "en"				
			     },

		  // CLARIN-DK calls those parameters differently, namely:
		  mapping:   { input        : "URL",
			       lang         : "language"
			     }		  
		},		

		{ task: "OCR Engine",
		  name: "CLARIN-DK Tool Box (Tesseract | CuneiForm)",
		  logo: "YourLogoComesHere.png",
		  homepage: "https://clarin.dk/clarindk/forside.jsp",		  		  
		  location: "Copenhagen, Denmark (CLAM Webservices)",
		  creators: ["Bart Jongejan et al."],
		  contact: {
		      person: "Bart Jongejan",
		      email: "bartj@hum.ku.dk",
		  },
		  version: "0.8.3",
		  license: "public",
		  authentification: "no",		  
		  shortDescription: "CLARIN-DK Tool Box (Tesseract | CuneiForm)",
		  longDescription:  "Tesseract is probably the most accurate open source OCR engine available. Combined with the Leptonica Image Processing Library it can read a wide variety of image formats and convert them to text in over 60 languages. It was one of the top 3 engines in the 1995 UNLV Accuracy test. Between 1995 and 2006 it had little work done on it, but since then it has been improved extensively by Google. It is released under the Apache License 2.0. Note that the CLARIN-DL Tool Box GUI gives you also access to the Russian CuneiForm system.",
		  lang_encoding: "639-1",
		  languages: ["dan","eng"],
		  mimetypes: [
			      "image/gif", 
			      "image/jpeg", 
			      "image/png", 
			      "image/tiff", 
			     ],
		  url: ["https://www.clarin.dk/tools/createByGoalChoice"], 
		  parameter: {  input   : "self.linkToResource", 
				lang    : "self.linkToResourceLanguage",                 
				analysis: "txt",
				UIlanguage: "en"				
			     },

		  // CLARIN-DK calls those parameters differently, namely:
		  mapping:   { input        : "URL",
			       lang         : "language"
			     }		  
		},		
		
		{ task: "Tokenisation",
		  name: "Ucto",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "https://languagemachines.github.io/ucto/",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "0.8.3",
		  license: "public",                //but webservice is protected with (free) registration
		  authentification: "yes",
		  shortDescription: "A tokeniser",
		  longDescription: "Ucto is a unicode-compliant tokeniser. It takes input in the form of one or more untokenised texts, and subsequently tokenises them. Several languages are supported, but the software is extensible to other languages.",
		  languages: ["nld", "eng", "deu", "fra", "ita", "fry"],
		  lang_encoding: "639-1",
		  mimetypes: [
		      "text/plain"
		              // , "text/xml",		      
			      // , "application/pdf",
			      // , "application/msword"
		  ],
		  output: ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  		  
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

		{ task: "Text Analytics",
		  name: "Voyant Tools",
		  logo: "voyant-tools.jpg",		  
		  homepage: "http://voyant-tools.org",
		  location: "Canada (Quebec)",		  
		  creators: ["Stéfan Sinclair (McGill Alberta) and Geoffrey Rockwell (U Alberta)"],
		  contact: {
		      person: "Unknown Person",
		      email: "Unknown email",
		  },
		  version: "v2.1",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "Voyant Tools is a web-based text reading and analysis environment. It is a scholarly project that is designed to facilitate reading and interpretive practices for digital humanities students and scholars as well as for the general public.",
		  longDescription: "Use it to learn how computers-assisted analysis works. Check out our examples that show you how to do real academic tasks with Voyant. Use it to study texts that you find on the web or texts that you have carefully edited and have on your computer. Use it to add functionality to your online collections, journals, blogs or web sites so others can see through your texts with analytical tools. Use it to add interactive evidence to your essays that you publish online. Add interactive panels right into your research essays (if they can be published online) so your readers can recapitulate your results. Use it to develop your own tools using our functionality and code.",
		  // virtually any language
		  languages: ["eng", "deu", "spa", "nld", "fra"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain", "application/pdf",
			      "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			      "text/tei+xml;format-variant=tei-dta"
			     ], 
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["http://voyant-tools.org/"],
		  parameter: { 
			       input        : "self.linkToResource"
			     }
		},
		
		{ task: "Conversion",
		  name: "OxGarage (web service)",
		  logo: "YourLogoComesHere.png",
		  softwareType: "webService", 		  
		  homepage: "http://oxgarage.oucs.ox.ac.uk:8080/ege-webclient",
		  location: "Oxford, United Kingdom",		  
		  creators: ["see Github repository at https://github.com/sebastianrahtz/oxgarage"],
		  contact: {
		      person: "Github page",
		      email: "see Github repository at https://github.com/sebastianrahtz/oxgarage",
		  },
		  version: "2.10.0",
		  license: "public",               
		  authentification: "no",
		  shortDescription: "OxGarage webservice to transform XML-based TEI documents to plain text. For more conversions, please go to the homepage.",
		  longDescription: "OxGarage is a web, and RESTful, service to manage the transformation of documents between a variety of formats. The majority of transformations use the Text Encoding Initiative format as a pivot format.",
		  languages: ["nld", "eng", "deu", "fra", "ita", "spa", "por", "tur", "rus", "swe"], // todo
		  lang_encoding: "639-1",
		  // mimetypes: ["text/xml", "application/xml", "application/tei+xml"],
		  mimetypes: ["application/tei+xml",
			      "text/tei+xml;format-variant=tei-dta"], 		  
		  output: ["text/plain"],
		  url: ["http://oxgarage.oucs.ox.ac.uk:8080/ege-webservice/Conversions/TEI%3Atext%3Axml/txt%3Atext%3Aplain/"],
		  parameter: { 
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { 
			     }
		},

		// <form id="f_decode" method="post" enctype="multipart/form-data" accept="application/tei+xml" action="decode.perl">


		{ task: "Conversion",
		  name: "TEI↔TCF encoder+decoder (web service)",
		  logo: "YourLogoComesHere.png",
		  softwareType: "webService", 		  
		  homepage: "http://kaskade.dwds.de/tei-tcf",
		  location: "DWDS, Germany",		  
		  creators: ["Bryan Jurish"],
		  contact: {
		      person: "Bryan Jurish",
		      email: "jurish@bbaw.de",
		  },
		  version: "0.0.3",
		  license: "public",               
		  authentification: "no",
		  shortDescription: "Converts between TCF and TEI",
		  longDescription: "A converter between the two formats TEI and TCF. Beta version.",
		  languages: ["nld", "eng", "deu", "fra", "ita", "spa", "por", "tur", "rus", "swe"], // todo
		  lang_encoding: "639-1",
		  // mimetypes: ["text/xml", "application/xml", "application/tei+xml"],
		  mimetypes: ["application/tei+xml",
			      "text/tei+xml;format-variant=tei-dta",
			      "application/xml;format-variant=weblicht-tcf"
			     ], 		  
		  output: ["text/plain"],
		  url: ["http://kaskade.dwds.de/tei-tcf"], // TODO
		  parameter: { 
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { 
			     }
		},
		
		{ task: "Dependency Parsing",
		  name: "Alpino",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://www.let.rug.nl/vannoord/alp/Alpino/",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "A dependency parser for Dutch",
		  longDescription: "Alpino is a dependency parser for Dutch, developed in the context of the PIONIER Project Algorithms for Linguistic Processing, developed by Gertjan van Noord at the University of Groningen. You can upload either tokenised or untokenised files (which will be automatically tokenised for you using ucto), the output will consist of a zip file containing XML files, one for each sentence in the input document.",
		  languages: ["nld"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], //plain text OR FoLiA XML
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["https://webservices-lst.science.ru.nl/alpino/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "untokinput_url"
			     }
		},


		{ task: "Text Analytics",
		  name: "T-scan",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "https://github.com/proycon/tscan",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "T-scan is a Dutch text analytics tool for readability prediction.",
		  longDescription: "T-scan is a Dutch text analytics tool for readability prediction.",
		  languages: ["nld"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], //plain text OR FoLiA XML
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["https://webservices-lst.science.ru.nl/tscan/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "textinput_url" 
			     }
		},

		{ task: "Machine Translation",
		  name: "Oersetter (NLD-FRY)",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://oersetter.nl/",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "Oersetter is a Dutch-Frisian Machine Translation system.",
		  longDescription: "Oersetter is a Dutch-Frisian Machine Translation system.",
		  languages: ["nld"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], //plain text OR FoLiA XML
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["https://webservices-lst.science.ru.nl/oersetter/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "input-nl_url" 
			     }
		},

		{ task: "Machine Translation",
		  name: "Oersetter (FRY-NLD)",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://oersetter.nl/",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "Oersetter is a Frisian-Dutch Machine Translation system.",
		  longDescription: "Oersetter is a Frisian-Dutch Machine Translation system.",
		  languages: ["fry"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], //plain text OR FoLiA XML
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["https://webservices-lst.science.ru.nl/oersetter/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "input-fy_url" 
			     }
		},		
		

		{ task: "Spelling correction",
		  name: "Fowlt",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://fowlt.net",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "A spelling corrector for English",
		  longDescription: "Fowlt is a English spelling correction system.",
		  languages: ["eng"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/xml","text/plain"], //plain text OR FoLiA XML
		  output: ["text/plain", "text/xml"], //plain text tab seperated output OR FoLiA XML
		  url: ["https://webservices-lst.science.ru.nl/fowlt/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "textinput_url"
			     }
		},

		{ task: "NLP suite for Dutch",
		  name: "Frog (plain text)",
		  logo: "frog.jpg",		  
		  homepage: "https://languagemachines.github.io/frog/",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "NLP suite for Dutch",
		  longDescription: "Frog's current version will tokenize, tag, lemmatize, and morphologically segment word tokens in Dutch text files, will assign a dependency graph to each sentence, will identify the base phrase chunks in the sentence, and will attempt to find and label all named entities.",
		  languages: ["nld"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"],
		  output: ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  
		  url: ["https://webservices-lst.science.ru.nl/frog/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "maininput_url"
			     }
		},		

		{ task: "NLP suite for Dutch",
		  name: "Frog (folia+xml)",
		  logo: "frog.jpg",		  
		  homepage: "https://languagemachines.github.io/frog/",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "NLP suite for Dutch",
		  longDescription: "Frog's current version will tokenize, tag, lemmatize, and morphologically segment word tokens in Dutch text files, will assign a dependency graph to each sentence, will identify the base phrase chunks in the sentence, and will attempt to find and label all named entities.",
		  languages: ["nld"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],
		  output: ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  
		  url: ["https://webservices-lst.science.ru.nl/frog/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "foliainput_url"
			     }
		},		

		{ task: "Spelling correction",
		  name: "Valkuil (plain text)",
		  logo: "valkuil.jpg",		  
		  homepage: "http://valkuil.net",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "A spelling corrector for Dutch",
		  longDescription: "Valkuil is a Dutch spelling correction system.",
		  languages: ["nld"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], 
		  output: ["Tadpole Columned Output Format",
			   "text/folia+xml"], 		  
		  url: ["https://webservices-lst.science.ru.nl/valkuil/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "textinput_url"
			     }
		},
		
		{ task: "Spelling correction",
		  name: "Valkuil (folia+xml)",
		  logo: "valkuil.jpg",		  		  
		  homepage: "https://languagemachines.github.io/Valkuil/",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "A spelling corrector for Dutch",
		  longDescription: "Valkuil is a Dutch spelling correction system.",
		  languages: ["nld"], //iso 639-3
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],
		  output: ["Tadpole Columned Output Format",
			   "text/folia+xml"], 
		  url: ["https://webservices-lst.science.ru.nl/valkuil/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "foliainput_url"
			     }
		},
		
		{ task: "N-Gramming",
		  name: "Colibri Core (plain text)",
		  logo: "colibriCore.jpg",		  		  
		  homepage: "https://github.com/proycon/colibri-core",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "NLP tool for building n-grams and skip-grams.",
		  longDescription: "Colibri core is an NLP tool as well as a C++ and Python library for working with basic linguistic constructions such as n-grams and skipgrams (i.e patte rns with one or more gaps, either of fixed or dynamic size) in a quick and memory-efficient way.",
		  languages: ["nld", "eng", "deu", "fre", "esp", "por", "fry"], //iso 639-3, no GENERIC
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"],
		  output: ["Tadpole Columned Output Format",
			   "text/folia+xml"], 		  
		  url: ["https://webservices-lst.science.ru.nl/colibricore/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource",
			       lang         : "self.linkToResourceLanguage",                 			       
			       sentenceperline_input : "false",
			       sentenceperline_output : "false"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "textinput_untok_url",
			       lang         : "language"
			     }
		},

		{ task: "N-Gramming",
		  name: "Colibri Core (folia+xml)",
		  logo: "colibriCore.jpg",		  
		  homepage: "https://github.com/proycon/colibri-core",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "x.y.z",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "NLP tool for building n-grams and skip-grams.",
		  longDescription: "Colibri core is an NLP tool as well as a C++ and Python library for working with basic linguistic constructions such as n-grams and skipgrams (i.e patte rns with one or more gaps, either of fixed or dynamic size) in a quick and memory-efficient way.",
		  languages: ["nld", "eng", "deu", "fra", "spa", "por", "fry"], //iso 639-3 (generic to be added, todo)
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],
		  output: ["Tadpole Columned Output Format",
			   "text/folia+xml"], 		  		  
		  output: ["text/plain", "text/xml"], 
		  url: ["https://webservices-lst.science.ru.nl/colibricore/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource",
			       lang         : "self.linkToResourceLanguage",                 			       
			       sentenceperline_input : "false",
			       sentenceperline_output : "false"
			     },
		  // mapping the standard parameter names to the ones used by the tools
		  mapping:   { input        : "foliainput_url",
			       lang         : "language"
			     }
		},				
		
		{ task: "Metadata Format Conversion",
		  name: "NaLiDa2Marc21",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://shannon.sfs.uni-tuebingen.de/NaLiDa2Marc21",
		  location: "Tuebingen, Germany",		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
		  licence: "public",
		  longDescription: "Weblicht Easy Chain for German Named Entity Recognition (German).",
		  shortDescription: "Named Entity Recognizer", 
		  languages: ["deu"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht",
		  pid: "",
		  parameter: {  input   :  "self.linkToResource", 
				lang    : "de",                   
				analysis: "ne"                    
			     }
		},

		{ task: "Named Entity Recognition",
		  name: "Weblicht-NamedEntities-EN",
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",
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
		  logo: "weblicht.jpg",		  		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
		  location: "Tuebingen, Germany",		  		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "CLARIN Weblicht Support",
		      email: "wlsupport@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
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
		},

		// just add a webservice for the tools
		{ task: "Keyword Extractor",
		  name: "KER (WebService)",
		  softwareType: "webService", 
		  logo: "YourLogoComesHere.png",
		  homepage: "http://lindat.mff.cuni.cz/services/ker/",
		  location: "Prague, CUNI",
		  creators: ["Jindřich Libovický"],
		  contact: {
		      person: "Jindřich Libovický",
		      email: "libovicky@ufal.mff.cuni.cz",
		  },
		  version: "unknown",
		  authentification: "no",		  
		  license: "unknown", 
		  shortDescription: "Keyword extractor for Czech and English",
		  longDescription:  "KER is a keyword extractor that was designed for scanned texts in Czech and English. It is based on the stadard tf-idf algorithm with the idf tables trained on texts from Wikipedia. To deal with the data sparsity, texts are preprocessed by Morphodita: morphological dictionary and tagger.",
		  lang_encoding: "639-1",
		  languages: ["ces", "eng"],
		  mimetypes: ["text/plain"],
		  url: ["http://lindat.mff.cuni.cz/services/ker"], 

		  parameter: {  input   : "self.linkToResource", 
				lang    : "self.linkToResourceLanguage"
			     },
		  mapping:   { input        : "file",
			       lang         : "language"
			     }		  
		},

		{ task: "Named Entity Recognition",
		  name: "NameTag (WebService)",
		  softwareType: "webService", 
		  logo: "YourLogoComesHere.png",
		  homepage: "http://lindat.mff.cuni.cz/services/nametag/",
		  location: "Prague, CUNI",
		  creators: ["Milan Straka, Jana Straková"],
		  contact: {
		      person: "Milan Straka",
		      email: "straka@ufal.mff.cuni.cz",
		  },
		  version: "unknown",
		  authentification: "no",		  
		  license: "NameTag is a free software under LGPL license and the linguistic models are free for non-commercial use and distributed under CC BY-NC-SA license, although for some models the original data used to create the model may impose additional licensing conditions.", 
		  shortDescription: "Named Entity Recognition for Czech and English",
		  longDescription:  "NameTag is an open-source tool for named entity recognition (NER). NameTag identifies proper names in text and classifies them into predefined categories, such as names of persons, locations, organizations, etc. NameTag is distributed as a standalone tool or a library, along with trained linguistic models. In the Czech language, NameTag achieves state-of-the-art performance (Straková et al. 2013).",
		  lang_encoding: "639-1",
		  languages: ["ces", "eng"],
		  mimetypes: ["text/plain"],
		  url: ["http://lindat.mff.cuni.cz/services/nametag/api/recognize"],
		  parameter: {  input   : "self.linkToResource", 
				lang    : "self.linkToResourceLanguage"
			     },		  
		  parameter: {  input   : "data"
			     },
		},		
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
		name            : entry.name,
		logo            : entry.logo,
		longDescription : entry.longDescription,
		homepage        : entry.homepage,
		url             : entry.url,
		location        : entry.location,
		authentification: entry.authentification,
		id              : entry.id,
		email           : entry.contact.email,
		parameter       : entry.parameter,
		lang_encoding   : entry.lang_encoding,
		softwareType    : entry.softwareType,
		mapping         : entry.mapping,
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


    allTools() {

	var allTools = this.registeredTools;
	var tasks = this.groupTools( allTools );

	if (Object.keys(tasks).length == 0) {
	    alert("Sorry! There is not a single applicable tool...");
	}
	    
	this.setState({
	    applicableTools: allTools,
	    tasks: tasks
	});
    }
    
    // multiple filters to be defined, in particular, language code
    findTools( resourceDescription ) {

	// console.log("ToolStore/findTools at the very start.", resourceDescription);
		    
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

	// console.log('ToolStore/findTools with mimetype', resourceDescription, mimetypeFilter);

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

	if (Object.keys(tasks).length == 0) {
	    alert("Sorry! No applicable tools for the given resource were found!");
	}
	    
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
