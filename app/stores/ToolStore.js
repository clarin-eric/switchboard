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
	
	this.registeredTools = 
	    [
		{ task: "Tokenisation",
		  name: "CLARIN-DK Tool Box (CST Tokenizer)",
		  softwareType: "browserBased",
		  logo: "clarindk.jpg",		  
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
		  url: ["https://www.clarin.dk/tools/createByGoalChoice"], 

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
		  logo: "clarindk.jpg",
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
		  logo: "clarindk.jpg",		  
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

		// seems like BAS only offers German voice(s) of Mary. @ Jul 25, website mary.dfki.de not working.
		{ task: "Voice Synthesis",
		  name: "Mary TTS (web service)",
		  logo: "mary.jpg",
		  softwareType: "webService", 		  
		  homepage: "http://mary.dfki.de",
		  location: "BAS, Muenchen",
		  creators: ["Marc Schröder et al."],
		  contact: {
		      person: "Marc Schroeder",
		      email: "",
		  },
		  version: "> 5.1",
		  license: "public",
		  authentification: "no",		  
		  shortDescription: "Speech Synthesis System for German (hosted by BAS)",
		  longDescription:  "MaryTTS is an open-source, multilingual Text-to-Speech Synthesis platform written in Java. It was originally developed as a collaborative project of DFKI’s Language Technology Lab and the Institute of Phonetics at Saarland University. It is now maintained by the Multimodal Speech Processing Group in the Cluster of Excellence MMCI and DFKI.",
		  lang_encoding: "639-1",
		  languages: ["deu"],
		  mimetypes: [
			      "text/plain"
			     ],
		  url: ["https://clarin.phonetik.uni-muenchen.de/BASWebServices/services/runTTSFile"], 
		  parameter: {  input   : "self.linkToResource", 
				AUDIO   : "WAVE_FILE",
				INPUT_TYPE : "TEXT",
				VOICE : "bits1unitselautolabel",
				OUTPUT_TYPE : "AUDIO"
			     },

		  // CLARIN-DK calls those parameters differently, namely:
		  mapping:   { input        : "INPUT_TEXT",
			     }		  
		},

		{ task: "Phonetic Transcription",
		  name: "runMinni (web service)",
		  logo: "YourLogoComesHere.png",		  		  
		  softwareType: "webService", 		  
		  homepage: "http://www.phonetik.uni-muenchen.de/forschung/Bas/BasWebserviceseng.html",
		  location: "BAS, Muenchen",
		  creators: ["Florian Schiel, Andreas Kipp, Thomas Kisler (BAS)"],
		  contact: {
		      person: "Florian Schiel, Andreas Kipp, Thomas Kisler (BAS)",
		      email: "",
		  },
		  version: "x.y.z",
		  license: "public",
		  authentification: "no",		  
		  shortDescription: "Segments and labels a speech audio file into SAM-PA (or IPA) phonetic segments without any text/phonological input.",
		  longDescription:  "Segments and labels a speech audio file into SAM-PA (or IPA) phonetic segments without any text/phonological input; results are stored either in praat compatible TextGrid file (configuration parameter OUTFORMAT=TextGrid) or a CSV table (the BPF MAU tier, configuration parameter OUTFORMAT=csv).",
		  lang_encoding: "639-1",
		  languages: ["deu"],
		  mimetypes: [
			      "audio/wav"
			     ],
		  url: ["https://clarin.phonetik.uni-muenchen.de/BASWebServices/services/runMINNI"], 
		  parameter: {  input      : "self.linkToResource", 
				OUTIPA     : "false", 
				OUTFORMAT  : "TextGrid", 
				LANGUAGE   : "deu-DE", 
				WEIGHT     : "default",
				MAUSSHIFT  : "default", 
				OUTSYMBOL  : "sampa", 
				MINPAUSLEN : "5",
				USETRN     : "force",
				INSPROB    : "0.0"
			     },

		  // CLARIN-DK calls those parameters differently, namely:
		  mapping:   { input        : "SIGNAL",
			     }		  
		},		


		{ task: "Named Entity Recognition",
		  name: "CLARIN-DK Tool Box (CST's name recognizer)",
		  logo: "clarindk.jpg",		  
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
		  mapping:   { input        : "URL",
			       lang         : "language"
			     }		  
		},		

		{ task: "OCR Engine",
		  name: "CLARIN-DK Tool Box (Tesseract | CuneiForm)",
		  logo: "clarindk.jpg",		  		  
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
		  languages: ["dan","eng","generic"],
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
		  languages: ["eng", "deu", "spa", "nld", "fra", "generic"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain", "application/pdf",
			      "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			      "text/tei+xml;format-variant=tei-dta"
			     ], 
		  output: [], 
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
		  mimetypes: ["application/tei+xml",
			      "text/tei+xml;format-variant=tei-dta"], 		  
		  output: ["text/plain"],
		  url: ["http://oxgarage.oucs.ox.ac.uk:8080/ege-webservice/Conversions/TEI%3Atext%3Axml/txt%3Atext%3Aplain/"],
		  parameter: { 
			       input        : "self.linkToResource"
		  },
		  mapping:   { 
			     }
		},

		// <form id="f_decode" method="post" enctype="multipart/form-data" accept="application/tei+xml" action="decode.perl">


		{ task: "Conversion",
		  name: "TEI↔TCF encoder+decoder (web service)",
		  logo: "YourLogoComesHere.png",
		  softwareType: "webService",
		  postSubmit: "data",		  
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
		  languages: ["generic"], 
		  lang_encoding: "639-1",
		  mimetypes: ["application/tei+xml",
			      "text/tei+xml;format-variant=tei-dta",
			      "application/xml;format-variant=weblicht-tcf"
			     ], 		  
		  output: ["text/plain"],
		  url: ["http://kaskade.dwds.de/tei-tcf/encode.perl"], // TODO
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     },
		  
		  mapping:   { input : "f"
			     }
		},
		
		{ task: "Dependency Parsing",
		  name: "Alpino",
		  logo: "alpino.jpg",		  
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
		  languages: ["nld"], 
		  lang_encoding: "639-1",
		  // tokenized vs. untokenized input (currently set to untokenized input)
		  mimetypes: ["text/plain"],      
		  output: ["alpinooutput", "text/folia+xml", "tokoutput"], 
		  url: ["https://webservices-lst.science.ru.nl/alpino/"],
		  parameter: {
		      project      : "new",
		      input        : "self.linkToResource"
			     },
		  mapping:   {
		      input        : "untokinput_url"
			     }
		},


		{ task: "Text Analytics",
		  name: "T-scan",
		  logo: "tscan.jpg",		  
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
		  longDescription: "T-Scan is a new tool for analyzing Dutch text. It aims at extracting text features that are theoretically interesting, in that they relate to genre and text complexity, as well as practically interesting, in that they enable users and text producers to make text-specific diagnoses. T-Scan derives it features from tools such as Frog and Alpino, and resources such as SoNaR, SUBTLEX-NL and Referentie Bestand Nederlands.",
		  languages: ["nld"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], 
		  output: ["text/folia+xml", "xsl", "wordcsv",
			   "sencsv", "parcsv", "doccsv",
			   "totalwordcsv", "totalsencsv", "totalparcsv", "totaldoccsv"],
		  url: ["https://webservices-lst.science.ru.nl/tscan/"],
		  parameter: {
		      project      : "new",
		      input        : "self.linkToResource"
			     },
		  mapping:   {
		      input        : "textinput_url" 
			     }
		},

		{ task: "Machine Translation",
		  name: "Oersetter (NLD-FRY)",
		  logo: "oersetter.jpg",		  
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
		  longDescription: "Oersetter is a statistical machine translation (SMT) system for Frisian to Dutch and Dutch to Frisian. A parallel training corpus has been established, which has subsequently been used to automatically learn a phrase-based SMT model. The translation system is built around the open-source SMT software Moses.",
		  languages: ["nld"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], 
		  output: ["text/plain"], 
		  url: ["https://webservices-lst.science.ru.nl/oersetter/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  mapping:   { input        : "input-nl_url" 
			     }
		},

		{ task: "Machine Translation",
		  name: "Oersetter (FRY-NLD)",
		  logo: "oersetter.jpg",		  
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
		  languages: ["fry"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], 
		  output: ["text/plain"], 
		  url: ["https://webservices-lst.science.ru.nl/oersetter/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  mapping:   { input        : "input-fy_url" 
			     }
		},		
		

		{ task: "Spelling correction",
		  name: "Fowlt (plain text)",
		  logo: "fowlt.jpg",		  
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
		  longDescription: "Fowlt is an online, free-to-use context-sensitive English spelling checker. It follows the setup of the Dutch spelling checker Valkuil.net. Both Valkuil and Fowlt are unlike the typical spelling checkers: whereas the latter mostly try to find errors by comparing all words to a built-in dictionary and flag the word as an error if they can't find a match, Fowlt is context sensitive, taking into account the words around every word. Fowlt makes use of language models. These models are created by giving lots of texts to machine learning software (TiMBL and WOPR).",
		  languages: ["eng"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"],
		  output: ["text/folia+xml"], 
		  url: ["https://webservices-lst.science.ru.nl/fowlt/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  mapping:   { input        : "textinput_url"
			     }
		},

		{ task: "Spelling correction",
		  name: "Fowlt (xml+folia)",
		  logo: "fowlt.jpg",		  
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
		  longDescription: "Fowlt is an online, free-to-use context-sensitive English spelling checker. It follows the setup of the Dutch spelling checker Valkuil.net. Both Valkuil and Fowlt are unlike the typical spelling checkers: whereas the latter mostly try to find errors by comparing all words to a built-in dictionary and flag the word as an error if they can't find a match, Fowlt is context sensitive, taking into account the words around every word. Fowlt makes use of language models. These models are created by giving lots of texts to machine learning software (TiMBL and WOPR).",
		  languages: ["eng"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],
		  output: ["text/folia+xml"], 
		  url: ["https://webservices-lst.science.ru.nl/fowlt/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  mapping:   { input        : "foliainput_url"
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
		  languages: ["nld"],
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"],
		  output: ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  
		  url: ["https://webservices-lst.science.ru.nl/frog/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
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
		  languages: ["nld"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],
		  output: ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  
		  url: ["https://webservices-lst.science.ru.nl/frog/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
		  mapping:   { input        : "foliainput_url"
			     }
		},
		
		{ task: "N-Gramming",
		  name: "FoLiA-stats",
		  logo: "foliastats.jpg",		  		  
		  homepage: "https://github.com/LanguageMachines/foliautils",
		  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
		  creators: ["Ko van der Sloot (TiCC, Tilburg University)"],
		  contact: {
		      person: "Maarten van Gompel",
		      email: "proycon@anaproy.nl",
		  },
		  version: "0.2",
		  authentification: "no",		  
		  license: "public", //but webservice is protected with (free) registration
		  shortDescription: "N-gram frequency list generation on FoLiA input.",
		  longDescription: "N-gram frequency list generation on FoLiA input.",
		  languages: ["nld", "generic"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],		  
		  output: ["wordfreqlist", "lemmafreqlist", "lemmaposfreqlist"], 		  		  
		  url: ["https://webservices-lst.science.ru.nl/foliastats/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
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
		  languages: ["nld"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/plain"], 
		  output: ["Tadpole Columned Output Format",
			   "text/folia+xml"], 		  
		  url: ["https://webservices-lst.science.ru.nl/valkuil/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
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
		  languages: ["nld"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],
		  output: ["Tadpole Columned Output Format",
			   "text/folia+xml"], 
		  url: ["https://webservices-lst.science.ru.nl/valkuil/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource"
			     },
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
		  languages: ["nld", "eng", "deu", "fre", "esp", "por", "fry", "generic"], 
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
		  languages: ["nld", "eng", "deu", "fra", "spa", "por", "fry", "generic"], 
		  lang_encoding: "639-1",
		  mimetypes: ["text/folia+xml"],
		  output: ["Tadpole Columned Output Format",
			   "text/folia+xml"], 		  		  
		  url: ["https://webservices-lst.science.ru.nl/colibricore/"],
		  parameter: { project      : "new",
			       input        : "self.linkToResource",
			       lang         : "self.linkToResourceLanguage",                 			       
			       sentenceperline_input : "false",
			       sentenceperline_output : "false"
			     },
		  mapping:   { input        : "foliainput_url",
			       lang         : "language"
			     }
		},				

		// curl -d @germanet.dc.xml -o output.marc.xml http://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc/rest

		// { task: "Metadata Format Conversion",
		//   name: "NaLiDa2Marc21 (web service)",
		//   softwareType: "webService",
		//   postSubmit: "data",
		//   logo: "YourLogoComesHere.png",		  
		//   homepage: "http://shannon.sfs.uni-tuebingen.de/NaLiDa2Marc21",
		//   location: "Tuebingen, Germany",		  		  
		//   creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		//   contact: {
		//       person: "NaLiDa Support",
		//       email: "nalida@sfs.uni-tuebingen.de"
		//   },	    
		//   version: "v1.0",
		//   authentification: "no",		  
		//   licence: "public",
		//   shortDescription: "Bibliographic Format Converter", // controlled vocabulary, change name?
		//   longDescription: "Webservice converting NaLiDa-based CMDI profiles to Marc21",
		//   languages: ["generic"], 
		//   mimetypes: ["text/xml"],
		//   output: ["text/xml"],
		//   url: "http://shannon.sfs.uni-tuebingen.de:8080/NaLiDa2Marc-1.0",
		//   pid: "",
		//   parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
		// 	     }
		  
		//   // URL to get called:
		//   // http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht?input=http://hdl.handle.net/10932/00-017B-E3BC-2D57-CC01-6&lang=de&analysis=ne
		// },		
		
		{ task: "Metadata Format Conversion",
		  name: "CMDI2DC (web service)",
		  softwareType: "webService",
		  postSubmit: "data",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Cmdi2DC",
		  location: "Tuebingen, Germany",		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v0.9",
		  authentification: "no",		  
		  licence: "public",
		  shortDescription: "Bibliographic Format Converter: CMDI to Dublin Core (DC)", 
		  longDescription: "Webservice converting CMDI metadata to XML-based Dublin Core metadata",
		  languages: ["generic"], 
		  mimetypes: ["text/xml", "application/octet-stream"],
		  output: ["text/xml"],
		  url: ["http://weblicht.sfs.uni-tuebingen.de/converter/Cmdi2DC/rest"],
		  pid: "",
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     }
		},

		
		{ task: "Metadata Format Conversion",
		  name: "DC2MARC21 (web service)",
		  softwareType: "webService",
		  postSubmit: "data",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc",
		  location: "Tuebingen, Germany",		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
		  licence: "public",
		  shortDescription: "Bibliographic Format Converter: DC to MARC 21", 
		  longDescription: "Webservice converting XML-based Dublin Core metadata to XML-based MARC 21 metadata",
		  languages: ["generic"], 
		  mimetypes: ["text/xml", "application/octet-stream"],
		  output: ["text/xml"],
		  url: ["http://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc/rest"],
		  pid: "",
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     }
		},
		
		{ task: "Metadata Format Conversion",
		  name: "MARC2EAD (web service)",
		  softwareType: "webService",
		  postSubmit: "data",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Marc2EAD",
		  location: "Tuebingen, Germany",		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
		  licence: "public",
		  shortDescription: "Bibliographic Format Converter: from MARC 21 to EAD", 
		  longDescription: "Webservice converting XML-based MARC 21 metadata to XML-based EAD metadata",
		  languages: ["generic"], 
		  mimetypes: ["text/xml", "application/octet-stream"],
		  output: ["text/xml"],
		  url: ["http://weblicht.sfs.uni-tuebingen.de/converter/Marc2EAD/rest"],
		  pid: "",
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     }
		},

		{ task: "Metadata Format Conversion",
		  name: "Marc2MODS (web service)",
		  softwareType: "webService",
		  postSubmit: "data",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Marc2MODS",
		  location: "Tuebingen, Germany",		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
		  licence: "public",
		  shortDescription: "Bibliographic Format Converter: from MARC 21 to MODS", 
		  longDescription: "Webservice converting XML-based MARC 21 metadata to XML-based MODS metadata",
		  languages: ["generic"], 
		  mimetypes: ["text/xml", "application/octet-stream"],
		  output: ["text/xml"],
		  url: ["http://weblicht.sfs.uni-tuebingen.de/converter/Marc2MODS/rest"],
		  pid: "",
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     }
		},
		
		{ task: "Metadata Format Conversion",
		  name: "Marc2RDFDC (web service)",
		  softwareType: "webService",
		  postSubmit: "data",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Marc2RDFDC",
		  location: "Tuebingen, Germany",		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
		  licence: "public",
		  shortDescription: "Bibliographic Format Converter: from MARC 21 to RDF-DC", 
		  longDescription: "Webservice converting XML-based MARC 21 metadata to XML-based RDF-DC metadata",
		  languages: ["generic"], 
		  mimetypes: ["text/xml", "application/octet-stream"],
		  output: ["text/xml"],
		  url: ["http://weblicht.sfs.uni-tuebingen.de/converter/Marc2RDFDC/rest"],
		  pid: "",
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     }
		},				

		{ task: "Metadata Format Conversion",
		  name: "MODS2RDF (web service)",
		  softwareType: "webService",
		  postSubmit: "data",
		  logo: "YourLogoComesHere.png",		  
		  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/MODS2RDF",
		  location: "Tuebingen, Germany",		  		  
		  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
		  contact: {
		      person: "NaLiDa Support",
		      email: "nalida@sfs.uni-tuebingen.de"
		  },	    
		  version: "v1.0",
		  authentification: "no",		  
		  licence: "public",
		  shortDescription: "Bibliographic Format Converter: from MODS to RDF", 
		  longDescription: "Webservice converting XML-based MODS metadata to XML-based RDF metadata",
		  languages: ["generic"], 
		  mimetypes: ["text/xml", "application/octet-stream"],
		  output: ["text/xml"],
		  url: ["http://weblicht.sfs.uni-tuebingen.de/converter/MODSRDF/rest"],
		  pid: "",
		  parameter: { input : "self.linkToResource" // for demo upload site, to be instantiated
			     }
		},				
		
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
		  shortDescription: "Named Entity Recognizer", 
		  longDescription: "Weblicht Easy Chain for German Named Entity Recognition (German).",
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
		  shortDescription: "Named Entity Recognizer", 
		  longDescription: "Weblicht Easy Chain for German Named Entity Recognition (English).",
		  languages: ["eng"],
		  lang_encoding: "639-1",		  
		  mimetypes: ["text/plain"],
		  output: ["text/xml"],
		  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8888/weblicht",
		  pid: "",
		  parameter: {  input   : "self.linkToResource", 
				lang    : "en",                   
				analysis: "ne"                    
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
		  shortDescription: "Constituent Parsing",
		  longDescription: "Weblicht Easy Chain for Constituent Parsing (German).",
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
		  shortDescription: "Constituent Parsing",
		  longDescription: "Weblicht Easy Chain for Constituent Parsing (English).",
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
		  shortDescription: "Dependency Parsing",
		  longDescription: "Weblicht Easy Chain for Dependency Parsing (German).",
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
		  shortDescription: "Dependency Parsing",
		  longDescription: "Weblicht Easy Chain for Dependency Parsing (English).",
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
		  shortDescription: "Lemmatizer",
		  longDescription: "Weblicht Easy Chain for Lemmatization (German).",
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
		  shortDescription: "Lemmatizer",
		  longDescription: "Weblicht Easy Chain for Lemmatization (English).",
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
		  shortDescription: "POS Tagger and Lemmatization Tool",		  
		  longDescription: "Weblicht Easy Chain for POS Tagging and Lemmatization (German).",
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
		  shortDescription: "POS Tagger and Lemmatization Tool",
		  longDescription: "Weblicht Easy Chain for POS Tagging and Lemmatization (English).",
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
		  shortDescription: "Morphology Analysis Tool",
		  longDescription: "Weblicht Easy Chain for Morphology Analysis (German)",
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
		  shortDescription: "Morphology Analysis Tool",
		  longDescription: "Weblicht Easy Chain for Morphology Analysis (English)",
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

		// Here comes a list of webserves (unsure whether to include them at this stage)
		{ task: "Keyword Extractor",
		  name: "KER (WebService)",
		  softwareType: "webService",
		  postSubmit: "form",
		  logo: "lindat.jpg",
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
		  postSubmit: "form",
		  logo: "lindat.jpg",
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
		  mapping: {  input   : "data",
				lang    : "language"
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
		postSubmit      : entry.postSubmit,
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

						       // for tools that are capable for processing any language
						       result = tool.languages.indexOf("generic");
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
