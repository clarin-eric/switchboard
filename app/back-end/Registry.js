// The CLARIN Language Resource Switchboard
// 2016-17 Claus Zinn
// 
// File: Registry.js
// Time-stamp: <2017-09-06 12:52:38 zinn>
//
// ----------------------------------------------------------------------------------------

// The app registry is a JSON structure, a list of JSON entries to describe all tools.

const Registry =
    [
	{
	    task: "Chunker",
	    name: "Iobbber",
	    logo: "clarin-pl.png",
	    homepage: "http://ws.clarin-pl.eu",
	    location: "Wrocław, Poland",
	    creators: ["Clarin-PL"],
	    contact: {
		person: "Tomasz Walkowiak",
		email: "tomasz.walkowiak@pwr.edu.pl"
	    },
	    version: "1.0",
	    authentication: "no",		  	    
	    licence: "public",
	    longDescription: "Chunker for Polish. It recognises shallow syntactic structure (up to three levels) of phrases (chunks) in Polish texts.",
	    shortDescription: "Chunker for Polish",
	    languages: ["pol"],
	    lang_encoding: "639-1",
	    mimetypes: ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    output: ["text/xml"],
	    url: "http://ws.clarin-pl.eu/weblicht.html",
	    pid: "",
	    parameter: {
		input: "self.linkToResource",
		lang: "pl",
		analysis: "chunker"
	    }
	},

	{ task: "Constituent Parsing",
	  name: "WebLicht-Const-Parsing-DE",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Constituent Parsing",
	  longDescription: "WebLicht Easy Chain for Constituent Parsing (German).",
	  languages: ["deu"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "de",			      
		      analysis:   "const-parsing"
		     }
	},

	{ task: "Constituent Parsing",
	  name: "WebLicht-Const-Parsing-EN",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Constituent Parsing",
	  longDescription: "WebLicht Easy Chain for Constituent Parsing (English).",
	  languages: ["eng"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "en",			      
		      analysis:   "const-parsing"
		     }
	},		

	
	{ task: "Conversion",
	  name: "TEI↔TCF encoder+decoder (web service)",
	  logo: "YourLogoComesHere.png",
	  softwareType: "webService",
	  requestType: "data",		  
	  homepage: "http://kaskade.dwds.de/tei-tcf",
	  location: "DWDS, Germany",		  
	  creators: ["Bryan Jurish"],
	  contact: {
	      person: "Bryan Jurish",
	      email: "jurish@bbaw.de",
	  },
	  version: "0.0.3",
	  licence: "public",               
	  authentication: "no",
	  shortDescription: "Converts between TCF and TEI",
	  longDescription: "A converter between the two formats TEI and TCF. Beta version.",
	  languages: ["generic"], 
	  lang_encoding: "639-1",
	  mimetypes: ["application/tei+xml",
		      "text/tei+xml;format-variant=tei-dta",
		      "application/xml;format-variant=weblicht-tcf"
		     ], 		  
	  output: ["text/plain"],
	  url: ["http://kaskade.dwds.de/tei-tcf/encode.perl"], 
	  parameter: { input : "self.linkToResource" 
		     },
	  
	  mapping:   { input : "f"
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
	  licence: "public",               
	  authentication: "no",
	  shortDescription: "OxGarage webservice to transform XML-based TEI documents to plain text. For more conversions, please go to the homepage.",
	  longDescription: "OxGarage is a web, and RESTful, service to manage the transformation of documents between a variety of formats. The majority of transformations use the Text Encoding Initiative format as a pivot format.",
	  languages: ["nld", "eng", "deu", "fra", "ita", "spa", "por", "tur", "rus", "swe"], 
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
	
	{ task: "Conversion",
	  name: "HTML To TEXT Converter (web service)",
	  softwareType: "webService",
	  requestType: "get",
	  logo: "YourLogoComesHere.png",		  
	  homepage: "EXPERIMENTAL",
	  location: "Copenhagen, Denmark",		  
	  creators: ["Bart Jongejan et al."],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },	  	  
	  version: "unknown",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "This is a converter from text/html to text/plain", 
	  longDescription: "This is a converter from text/html to text/plain", 
	  languages: ["generic"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/html"],
	  output: ["text/plain"],
	  url: ["https://cst.dk/html2text"],
	  pid: "",
	  parameter: { input : "self.linkToResource",
		       iLang : "en",
		       base:  ""
		     },
	  mapping: {    input   : "F",
		   },		  
	  
	},
	
	{
	    "task": "Dependency Parsing",
	    "name": "MaltParser",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "Language dependency parser for Polish (MaltParser)",
	    "shortDescription": "Language dependency parser",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["application/octet-stream"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "parser"
	    }
	},
	
	{ task: "Coreference Resolution",
	  name: "Concraft -> Bartek",
	  logo: "zil.png",		  		  		  
	  homepage: "http://zil.ipipan.waw.pl/Bartek",
	  location: "Warsaw, Poland",		  		  		  
	  creators: ["Institute of Computer Science, Polish Academy of Sciences, Poland"],
	  contact: {
	      person: "MultiService",
	      email: "rjawor@amu.edu.pl"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Coreference Resolution for Polish",
	  longDescription: "Statistical tool for performing Coreference Resolution (CR). Part of: Multiservice, a robust  linguistic  Web service for Polish.",
	  languages: ["pol"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "text/html"],
	  output: ["text/xml"],
	  url: "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      analysis:   "5"
		     }
	},			

	{ task: "Dependency Parsing",
	  name: "Concraft -> DependencyParser",
	  logo: "zil.png",		  		  		  
	  homepage: "http://zil.ipipan.waw.pl/DependencyParser",
	  location: "Warsaw, Poland",		  		  		  
	  creators: ["Institute of Computer Science, Polish Academy of Sciences, Poland"],
	  contact: {
	      person: "MultiService",
	      email: "rjawor@amu.edu.pl"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "A Shallow Parser for Polish" ,
	  longDescription: "Polish dependency parser is trained on the extended version of the Polish dependency treebank (Składnica zależnościowa) with the publicly available parsing systems – MaltParser or MateParser. MaltParser is a transition-based dependency parser that uses a deterministic parsing algorithm. The deterministic parsing algorithm builds a dependency structure of an input sentence based on transitions (shift-reduce actions) predicted by a classifier. The classifier learns to predict the next transition given training data and the parse history. MateParser, in turn, is a graph-based parser that defines a space of well-formed candidate dependency trees for an input sentence, scores them given an induced parsing model, and selects the highest scoring dependency tree as a correct analysis of the input sentence. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
	  languages: ["pol"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "text/html"],
	  output: ["text/xml"],
	  url: "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      analysis:   "4"
		     }
	},
	
	{ task: "Dependency Parsing",
	  name: "WebLicht-Dep-Parsing-DE",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Dependency Parsing",
	  longDescription: "WebLicht Easy Chain for Dependency Parsing (German).",
	  languages: ["deu"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "de",			      
		      analysis:   "dep-parsing"
		     }
	},

	{ task: "Dependency Parsing",
	  name: "WebLicht-Dep-Parsing-NL",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Dependency Parsing (NL)",
	  longDescription: "WebLicht Easy Chain for Dependency Parsing (Dutch).",
	  languages: ["nld"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "nl",			      
		      analysis:   "dep-parsing"
		     }
	},
	

	{ task: "Dependency Parsing",
	  name: "WebLicht-Dep-Parsing-EN",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Dependency Parsing",
	  longDescription: "WebLicht Easy Chain for Dependency Parsing (English).",
	  languages: ["eng"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "en",			      
		      analysis:   "dep-parsing"
		     }
	},


	{ task: "Dependency Parsing",
	  name: "WebLicht-Dep-Parsing-SL (RELDI)",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Dependency Parsing for Slovenian",
	  longDescription: "WebLicht Easy Chain for Dependency Parsing (Slovenian). The easy-chain makes use of the RELDI software (see https://github.com/clarinsi), which tokenizes and lemmatizes the text, performs part-of-speech tagging, and subsequently, does dependency parsing. For RELDI specific inquiries, please contact nljubesi@gmail.com.",
	  languages: ["slv"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "sl",			      
		      analysis:   "dep-parsing"
		     }
	},

	{ task: "Dependency Parsing",
	  name: "WebLicht-Dep-Parsing-HR (RELDI)",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Dependency Parsing for Croatian",
	  longDescription: "WebLicht Easy Chain for Dependency Parsing (Croatian). The easy-chain makes use of the RELDI software (see https://github.com/clarinsi), which tokenizes and lemmatizes the text, performs part-of-speech tagging, and subsequently, does dependency parsing. For RELDI specific inquiries, please contact nljubesi@gmail.com.",
	  languages: ["hrv"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "hr",			      
		      analysis:   "dep-parsing"
		     }
	},

	{ task: "Dependency Parsing",
	  name: "WebLicht-Dep-Parsing-SR (RELDI)",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Dependency Parsing for Serbian",
	  longDescription: "WebLicht Easy Chain for Dependency Parsing (Serbian). The easy-chain makes use of the RELDI software (see https://github.com/clarinsi), which tokenizes and lemmatizes the text, performs part-of-speech tagging, and subsequently, does dependency parsing. For RELDI specific inquiries, please contact nljubesi@gmail.com.",
	  languages: ["srp"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "sr",			      
		      analysis:   "dep-parsing"
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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

	{ task: "Dependency Parsing",
	  name: "UDPipe (web service, CES-only)",
	  softwareType: "webService",
	  requestType: "form",
	  logo: "lindat.jpg",
	  homepage: "http://ufal.mff.cuni.cz/udpipe",
	  location: "Prague, CUNI",
	  creators: ["Milan Straka, Jana Straková"],
	  contact: {
	      person: "Milan Straka",
	      email: "straka@ufal.mff.cuni.cz",
	  },
	  version: "unknown",
	  authentication: "no",		  
	  licence: "UDPipe is a free software under Mozilla Public Licence 2.0 and the linguistic models are free for non-commercial use and distributed under CC BY-NC-SA licence, although for some models the original data used to create the model may impose additional licensing conditions. UDPipe is versioned using Semantic Versioning.", 
	  shortDescription: "Dependency Parsing",
	  longDescription:  "UDPipe is an trainable pipeline for tokenization, tagging, lemmatization and dependency parsing of CoNLL-U files. UDPipe is language-agnostic and can be trained given only annotated data in CoNLL-U format. Trained models are provided for nearly all UD treebanks.",
	  lang_encoding: "639-1",
	  languages: ["ces"],
	  mimetypes: ["text/plain"],
	  url: ["http://lindat.mff.cuni.cz/services/udpipe/api/process?tokenizer&tagger&parser"],
	  parameter: {  input   : "self.linkToResource", 
			lang    : "self.linkToResourceLanguage",
 			model   : "czech"
		     },		  
	  mapping: {    input   : "data",
			lang    : "language"
		   },
	},

	// curl -F 'model=german' -F 'data=@germanText.txt' 'http://lindat.mff.cuni.cz/services/udpipe/api/process?tokenizer&tagger&parser'

	//		grc, ara, eus, bul, hrv, ces, dan, nld, eng, est, fin, fra, deu, got, ell, heb, hin, hun, ind, gle, ita, jpn, lat, nor, chu, fas, pol, por, ron, slv, spa, swe, tam, cat, zho, glg, kaz, lav, rus, tur, cop, san, slk, ukr, uig, vie, bel, kor, lit, urd

	{
	    "task": "Extraction of Polish terminology",
	    "name": "TermoPL",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "TermoPL is a tool for automated extraction of terminology from Polish texts.",
	    "shortDescription": "Terminology extraction for Polish",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["application/json"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "termopl"
	    }
	},
	
	{
	    "task": "Inclusion detection",
	    "name": "Inkluz",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    
	    "longDescription": "Inkluz - detects foreign language inclusions in Polish texts.",
	    "shortDescription": "Foreign language inclusion detection in Polish texts",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["application/octet-stream"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "inkluz"
	    }
	},

	{
	    "task": "Keyword Extractor",
	    "name": "ReSpa",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    
	    "longDescription": "Keywords extraction for Polish by ReSpa based on the representation of text documents as word graphs.",
	    "shortDescription": "ReSpa keyword extractor.",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "respa"
	    }
	},

	{ task: "Keyword Extractor",
	  name: "KER (web service)",
	  softwareType: "webService",
	  requestType: "data",
	  logo: "lindat.jpg",
	  homepage: "http://lindat.mff.cuni.cz/services/ker/",
	  location: "Prague, CUNI",
	  creators: ["Jindřich Libovický"],
	  contact: {
	      person: "Jindřich Libovický",
	      email: "libovicky@ufal.mff.cuni.cz",
	  },
	  version: "unknown",
	  authentication: "no",		  
	  licence: "unknown", 
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
	
	{ task: "Lemmatization",	
	  name: "CLARIN-DK Tool Chain for Lemmatization (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Lemmatization Tool for Danish",	  
	  longDescription: "Performs lemmatization in running text. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-lemmas-notags"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Lemmatization",	
	  name: "CLARIN-DK Tool Chain for Lemmatization (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Lemmatization Tool for English",	  
	  longDescription: "Performs lemmatization in running text. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-lemmas-notags"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Lemmatization",	
	  name: "CLARIN-DK Tool Chain for Lemmatization, including POS tags (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Lemmatization Tool for Danish",	  
	  longDescription: "Performs lemmatization in running text, including POS tags. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-lemmas-wtags"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Lemmatization",	
	  name: "CLARIN-DK Tool Chain for Lemmatization, including POS tags (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Lemmatization Tool for English",	  
	  longDescription: "Performs lemmatization in running text, including POS tags. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-lemmas-wtags"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Lemmatization",	
	  name: "CLARIN-DK Tool Chain for Lemmatization, presented as freqency list (web service).",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",               
	  authentication: "no",
	  shortDescription: "Lemmatization Tool for Danish",	  
	  longDescription: "Performs lemmatization in running text, presented as freqency list. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-frek-lemmas"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Lemmatization",
	  name: "WebLicht-Lemmas-DE",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Lemmatizer",
	  longDescription: "WebLicht Easy Chain for Lemmatization (German).",
	  languages: ["deu"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",,
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "de",			      
		      analysis:   "lemma"
		     }
	},

	{ task: "Lemmatization",
	  name: "WebLicht-Lemmas-EN",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Lemmatizer",
	  longDescription: "WebLicht Easy Chain for Lemmatization (English).",
	  languages: ["eng"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "en",			      
		      analysis:   "lemma"
		     }
	},		
	
	{ task: "Lemmatization",	
	  name: "CLARIN-DK Tool Chain for Lemmatization, presented as freqency list (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Lemmatization Tool for English",	  
	  longDescription: "Performs lemmatization in running text, presented as freqency list. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-frek-lemmas"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},
	
	{
	    "task": "Morphological Analysis",
	    "name": "Morfeusz 2",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    
	    "longDescription": "Morphological analysis of Polish texts by Morfeusz 2 (based on the SGJP dictionary)",
	    "shortDescription": "Morphological analysis of Polish",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "morpho"
	    }
	},

	{
	    "task": "Morpho-syntactic tagger",
	    "name": "WCRFT2",
	    "logo": "clarin-pl.png",
	    "homepage": "http://nlp.pwr.wroc.pl/redmine/projects/wcrft/wiki/",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "Morpho-syntactic tagger for Polish - WCRFT2",
	    "shortDescription": "Morpho-syntactic tagger for Polish",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "tagger"
	    }
	},
	
	{
	    "task": "Named Entity Recognition",
	    "name": "Liner2",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    
	    "longDescription": "Name Entity and Temporal Expression recognition",
	    "shortDescription": "Name Entity Recogniser.",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "ner"
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	
	
	// curl -d @germanet.dc.xml -o output.marc.xml http://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc/rest

	// { task: "Metadata Format Conversion",
	//   name: "NaLiDa2Marc21 (web service)",
	//   softwareType: "webService",
	//   requestType: "data",
	//   logo: "YourLogoComesHere.png",		  
	//   homepage: "http://shannon.sfs.uni-tuebingen.de/NaLiDa2Marc21",
	//   location: "Tuebingen, Germany",		  		  
	//   creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	//   contact: {
	//       person: "NaLiDa Support",
	//       email: "nalida@sfs.uni-tuebingen.de"
	//   },	    
	//   version: "v1.0",
	//   authentication: "no",		  
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
	//   // http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht?input=http://hdl.handle.net/10932/00-017B-E3BC-2D57-CC01-6&lang=de&analysis=ne
	// },		
	
	{ task: "Metadata Format Conversion",
	  name: "CMDI2DC (web service)",
	  softwareType: "webService",
	  requestType: "data",
	  logo: "YourLogoComesHere.png",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Cmdi2DC",
	  location: "Tuebingen, Germany",		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "NaLiDa Support",
	      email: "nalida@sfs.uni-tuebingen.de"
	  },	    
	  version: "v0.9",
	  authentication: "no",		  
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
	  requestType: "data",
	  logo: "YourLogoComesHere.png",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc",
	  location: "Tuebingen, Germany",		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "NaLiDa Support",
	      email: "nalida@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
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
	  requestType: "data",
	  logo: "YourLogoComesHere.png",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Marc2EAD",
	  location: "Tuebingen, Germany",		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "NaLiDa Support",
	      email: "nalida@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
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
	  requestType: "data",
	  logo: "YourLogoComesHere.png",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Marc2MODS",
	  location: "Tuebingen, Germany",		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "NaLiDa Support",
	      email: "nalida@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
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
	  requestType: "data",
	  logo: "YourLogoComesHere.png",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/Marc2RDFDC",
	  location: "Tuebingen, Germany",		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "NaLiDa Support",
	      email: "nalida@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
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
	  requestType: "data",
	  logo: "YourLogoComesHere.png",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/converter/MODS2RDF",
	  location: "Tuebingen, Germany",		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "NaLiDa Support",
	      email: "nalida@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
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

	{ task: "Morphology Analysis",
	  name: "WebLicht-Morphology-DE",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",
	  licence: "public",
	  shortDescription: "Morphology Analysis Tool",
	  longDescription: "WebLicht Easy Chain for Morphology Analysis (German)",
	  languages: ["deu"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "de",			      
		      analysis:   "morphology"
		     }
	},
	
	{ task: "Morphology Analysis",
	  name: "WebLicht-Morphology-EN",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Morphology Analysis Tool",
	  longDescription: "WebLicht Easy Chain for Morphology Analysis (English)",
	  languages: ["eng"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "en",			      
		      analysis:   "morphology"
		     }
	},

	{ task: "Named Entity Recognition",	
	  name: "CLARIN-DK Tool Chain for NER (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "NER Tool for Danish",	  
	  longDescription: "Performs Named Entity Recognition. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-navne"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Named Entity Recognition",	
	  name: "CLARIN-DK Tool Chain for NER including segmentation (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "NER Tool for Danish",	  
	  longDescription: "Performs Named Entity Recognition, including segmentation. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-navne-segments"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Named Entity Recognition",	
	  name: "CLARIN-DK Tool Chain for NER including POS tags (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "NER Tool for Danish",	  
	  longDescription: "Performs Named Entity Recognition, including POS tags. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-navne-POS"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Named Entity Recognition",
	  name: "Concraft -> Nerf",
	  logo: "zil.png",		  		  		  
	  homepage: "http://zil.ipipan.waw.pl/Nerf",
	  location: "Warsaw, Poland",		  		  		  
	  creators: ["Institute of Computer Science, Polish Academy of Sciences, Poland"],
	  contact: {
	      person: "MultiService",
	      email: "rjawor@amu.edu.pl"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  authentication: "no",	  
	  shortDescription: "Named Entity Recognition for Polish" ,
	  longDescription: "Statistical named entity recognition tool based on linear-chain conditional random fields. Part of: Multiservice, a robust linguistic Web service for Polish.",
	  languages: ["pol"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "text/html"],
	  output: ["text/xml"],
	  url: "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      analysis:   "2"
		     }
	},
	{ task: "Named Entity Recognition",
	  name: "WebLicht-NamedEntities-DE",
	  logo: "weblicht.jpg",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Named Entity Recognizer", 
	  longDescription: "WebLicht Easy Chain for German Named Entity Recognition (German).",
	  languages: ["deu"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht",
	  pid: "",
	  parameter: {  input   :  "self.linkToResource", 
			lang    : "de",                   
			analysis: "ne"                    
		     }
	},

	{ task: "Named Entity Recognition",
	  name: "WebLicht-NamedEntities-EN",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Named Entity Recognizer", 
	  longDescription: "WebLicht Easy Chain for German Named Entity Recognition (English).",
	  languages: ["eng"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht",
	  pid: "",
	  parameter: {  input   : "self.linkToResource", 
			lang    : "en",                   
			analysis: "ne"                    
		     }
	},				

	{ task: "Named Entity Recognition",
	  name: "NameTag (web service)",
	  softwareType: "webService",
	  requestType: "form",
	  logo: "lindat.jpg",
	  homepage: "http://lindat.mff.cuni.cz/services/nametag/",
	  location: "Prague, CUNI",
	  creators: ["Milan Straka, Jana Straková"],
	  contact: {
	      person: "Milan Straka",
	      email: "straka@ufal.mff.cuni.cz",
	  },
	  version: "unknown",
	  authentication: "no",		  
	  licence: "NameTag is a free software under LGPL licence and the linguistic models are free for non-commercial use and distributed under CC BY-NC-SA licence, although for some models the original data used to create the model may impose additional licensing conditions.", 
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
	
	{
	    "task": "Named Entity Recognition",
	    "name": "NER NLTK",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    
	    "longDescription": "Name Entity Recogniser for English by NLTK",
	    "shortDescription": "Name Entity Recogniser for English texts.",
	    "languages": ["eng"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "en",
		"analysis": "nerNLTK"
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	
	{ task: "N-Gramming",
	  name: "CLARIN-DK Tool Chain: Computes alphabetic list of words and their frequencies (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Alphabetic list of words with frequencies",
	  longDescription: "Alphabetic list of words with frequencies (uses a lemmatiser, but does not output the lemmas). The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-frek-ord"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "N-Gramming",
	  name: "CLARIN-DK Tool Chain: Computes bigrams, lemmas, sorted by frequency (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "N-Gramming Tool",
	  longDescription: "Computes bigrams, lemmas, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-frek-bigram-lemmas"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "N-Gramming",
	  name: "CLARIN-DK Tool Chain: Computes bigrams, lemmas, sorted by frequency (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "N-Gramming Tool",	  
	  longDescription: "Computes bigrams, lemmas, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-frek-bigram-lemmas"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "N-Gramming",
	  name: "CLARIN-DK Tool Chain: Computes bigrams, words, sorted by frequency (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "N-Gramming Tool",	  
	  longDescription: "Computes bigrams, words, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-frek-bigram-ord"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "N-Gramming",
	  name: "CLARIN-DK Tool Chain: Computes bigrams, words, sorted by frequency (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "N-Gramming Tool",	  
	  longDescription: "Computes bigrams, words, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",	  
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"],
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-frek-bigram-ord"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
	  shortDescription: "NLP tool for building n-grams and skip-grams.",
	  longDescription: "Colibri core is an NLP tool as well as a C++ and Python library for working with basic linguistic constructions such as n-grams and skipgrams (i.e patterns with one or more gaps, either of fixed or dynamic size) in a quick and memory-efficient way.",
	  languages: ["nld", "eng", "deu", "fra", "spa", "por", "fry", "generic"], 
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	
	{ task: "Part-Of-Speech Tagging",
	  name: "WebLicht-POSTags-Lemmas-DE",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "POS Tagger and Lemmatization Tool",		  
	  longDescription: "WebLicht Easy Chain for POS Tagging and Lemmatization (German).",
	  languages: ["deu"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "de",			      
		      analysis:   "pos"
		     }
	},

	{ task: "Part-Of-Speech Tagging",
	  name: "WebLicht-POSTags-Lemmas-FR",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "POS Tagger and Lemmatization Tool",		  
	  longDescription: "WebLicht Easy Chain for POS Tagging and Lemmatization (French).",
	  languages: ["fra"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "fr",			      
		      analysis:   "pos"
		     }
	},		

	{ task: "Part-Of-Speech Tagging",
	  name: "WebLicht-POSTags-Lemmas-IT",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "POS Tagger and Lemmatization Tool",		  
	  longDescription: "WebLicht Easy Chain for POS Tagging and Lemmatization (Italian).",
	  languages: ["ita"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "it",			      
		      analysis:   "pos"
		     }
	},				

	{ task: "Part-Of-Speech Tagging",
	  name: "WebLicht-POSTags-Lemmas-EN",
	  logo: "weblicht.jpg",		  		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "POS Tagger and Lemmatization Tool",
	  longDescription: "WebLicht Easy Chain for POS Tagging and Lemmatization (English).",
	  languages: ["eng"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      lang:       "en",			      
		      analysis:   "pos"
		     }
	},
	
	{ task: "Part-Of-Speech Tagging",
	  name: "Concraft",
	  logo: "zil.png",		  		  		  
	  homepage: "http://zil.ipipan.waw.pl/Concraft",
	  location: "Warsaw, Poland",		  		  		  
	  creators: ["Institute of Computer Science, Polish Academy of Sciences, Poland"],
	  contact: {
	      person: "MultiService",
	      email: "rjawor@amu.edu.pl"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "POS Tagger for Polish" ,
	  longDescription: "Morphosyntactic tagger for Polish based on constrained conditional random fields. Part of: Multiservice, a robust  linguistic Web service for Polish.",
	  languages: ["pol"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "text/html"],
	  output: ["text/xml"],
	  url: "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      analysis:   "0"
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
	  licence: "public",
	  authentication: "no",		  
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

	  mapping:   { input        : "SIGNAL",
		     }		  
	},		

	{
	    "task": "Relation between name entities detection",
	    "name": "Serel",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "Detection of semantic relations between Named Entities in Polish texts by Serel",
	    "shortDescription": "Detection of semantic relations between Named Entities in Polish",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "serel"
	    }
	},
	
	// the tools for CLARIN-DK have little parametrization, everything's hardcoded in the workflow parameter
	{ task: "Segmentation",
	  name: "CLARIN-DK Tool Chain: Computes segmentation without tokenization (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Computes segmentation",
	  longDescription: "Computes segmentation without tokenization. The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"], 		  		  		  
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-segment"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Segmentation",
	  name: "CLARIN-DK Tool Chain: Computes segmentation without tokenization (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Computes segmentation",
	  longDescription: "Computes segmentation without tokenization. The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"], 		  		  		  
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-segment"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Segmentation",
	  name: "CLARIN-DK Tool Chain: Computes segmentation with tokenization (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Computes segmentation",
	  longDescription: "Computes segmentation with tokenization. The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"], 		  		  		  
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-tokensegment"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Segmentation",
	  name: "CLARIN-DK Tool Chain: Computes segmentation with tokenization (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Computes segmentation",
	  longDescription: "Computes segmentation with tokenization. The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"], 		  		  		  
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-tokensegment"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Segmentation",
	  name: "CLARIN-DK Tool Chain: Computes segmentation with tokenization and BRILL POS-Tagging (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Computes segmentation",
	  longDescription: "Computes segmentation with tokenization and BRILL POS-Tagging . The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["dan"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"], 		  		  		  
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "da-tokensegmentPOS"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},

	{ task: "Segmentation",
	  name: "CLARIN-DK Tool Chain: Computes segmentation with tokenization and BRILL POS-Tagging (web service)",
	  softwareType: "webService",
	  requestType: "get",	  
	  logo: "clarindk.jpg",		  
	  homepage: "https://clarin.dk/clarindk/toolchains-wizard.jsp",
	  location: "Nijmegen, The Netherlands (CLAM Webservices)",		  
	  creators: ["Bart Jongejan"],
	  contact: {
	      person: "Bart Jongejan",
	      email: "bartj@hum.ku.dk",
	  },
	  version: "unknown",
	  licence: "public",                
	  authentication: "no",
	  shortDescription: "Computes segmentation",
	  longDescription: "Computes segmentation with tokenization and BRILL POS-Tagging . The web service returns a zip file containing original input and the results of all analyses.",
	  languages: ["eng"],
	  lang_encoding: "639-1",
	  mimetypes: [
	      "text/plain"
	      , "application/rtf"		      
	      , "application/pdf"
	  ],
	  output: ["application/zip"], 		  		  		  
	  url: ["https://clarin.dk/toolchains/run"],
	  parameter: { 
	      input    : "self.linkToResource",
	      type     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	      workflow : "en-tokensegmentPOS"
	  },
	  mapping: {
	      input    : "URL",
	      type     : "Iformat",
	  }
	},


	{ task: "Sentiment Analysis",
	  name: "Concraft -> Sentipejd",
	  logo: "zil.png",		  		  		  
	  homepage: "http://iis.ipipan.waw.pl/2008/proceedings/iis08-20.pdf",
	  location: "Warsaw, Poland",		  		  		  
	  creators: ["Institute of Computer Science, Polish Academy of Sciences, Poland"],
	  contact: {
	      person: "MultiService",
	      email: "rjawor@amu.edu.pl"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Sentiment Analysis for Polish" ,
	  longDescription: " A morphosyntactic tagger extended with a semantic category, expressing properties of positive or negative  sentiment. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
	  languages: ["pol"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "text/html"],
	  output: ["text/xml"],
	  url: "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      analysis:   "3"
		     }
	},
	
	{ task: "Shallow Parsing",
	  name: "Concraft->Spejd",
	  logo: "zil.png",		  		  		  
	  homepage: "http://zil.ipipan.waw.pl/Spejd",
	  location: "Warsaw, Poland",		  		  		  
	  creators: ["Institute of Computer Science, Polish Academy of Sciences, Poland"],
	  contact: {
	      person: "MultiService",
	      email: "rjawor@amu.edu.pl"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "A Shallow Parser for Polish" ,
	  longDescription: "Tool for partial parsing and rule-based morphosyntactic disambiguation. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
	  languages: ["pol"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "text/html"],
	  output: ["text/xml"],
	  url: "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      analysis:   "1"
		     }
	},		
	
	{
	    "task": "Shallow Parsing",
	    "name": "Spejd",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "Spejd - a partial, shallow parser for Polish with rule-based morphosyntactic disambiguation",
	    "shortDescription": "Spejd",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "spejd"
	    }
	},
	{
	    "task": "Spatial expression detection",
	    "name": "Spatial",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    
	    "longDescription": "Recognition of spatial expressions in Polish texts",
	    "shortDescription": "Spatial expression recognition in Polish",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["application/json"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "spatial"
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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

	{
	    "task": "Tagger",
	    "name": "Tagger NLTK",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "Morpho-syntactic  tagger for English texts, NLTK",
	    "shortDescription": "Morpho-syntactic Tagger for English texts (from NLTK).",
	    "languages": ["eng"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "en",
		"analysis": "tagerNLTK"
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
	  authentication: "no",		  
	  licence: "public", //but webservice is protected with (free) registration
	  shortDescription: "Voyant Tools is a web-based text reading and analysis environment. It is a scholarly project that is designed to facilitate reading and interpretive practices for digital humanities students and scholars as well as for the general public.",
	  longDescription: "Use it to learn how computers-assisted analysis works. Check out our examples that show you how to do real academic tasks with Voyant. Use it to study texts that you find on the web or texts that you have carefully edited and have on your computer. Use it to add functionality to your online collections, journals, blogs or web sites so others can see through your texts with analytical tools. Use it to add interactive evidence to your essays that you publish online. Add interactive panels right into your research essays (if they can be published online) so your readers can recapitulate your results. Use it to develop your own tools using our functionality and code.",
	  // virtually any language
	  languages: ["eng", "deu", "spa", "nld", "fra", "generic"], 
	  lang_encoding: "639-1",
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		      "text/tei+xml;format-variant=tei-dta"
		     ], 
	  output: [], 
	  url: ["http://voyant-tools.org/"],
	  parameter: { 
	      input        : "self.linkToResource"
	  }
	},
	
	{
	    "task": "Text Summarization",
	    "name": "Summarize",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "Automated word graph based summarisation of Polish texts",
	    "shortDescription": "Automated summarisation for Polish",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["application/octet-stream"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "summarize"
	    }
	},




	{
	    "task": "TF, IDF, TF-IDF calculation",
	    "name": "TF-IDF",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    	    
	    "longDescription": "TF, IDF, TF-IDF calculation",
	    "shortDescription": "TF-IDF",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/csv"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "tfidf"
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
	  languages: ["swe", "rus", "spa", "por", "nld", "eng", "deu", "fra", "ita"],
	  lang_encoding: "639-3",
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

	{ task: "Tokenisation",
	  name: "ILC Tokenizer (web service)",
	  softwareType: "webService",
	  //softwareType: "browserBased",
	  requestType: "get",	  
	  logo: "YourLogoComesHere.png", // Fix this
	  homepage: "http://ilc4clarin.ilc.cnr.it/services/ltfw/readme",
	  location: "Pisa, Italiy",
	  creators: ["Ricardo del Gratta"],
	  contact: {
	      person: "Riccardo Del Gratta",
	      email: "riccardo.delgratta@gmail.com",
	  },
	  version: "unknown",
	  authentication: "no",		  
	  licence: "unknown.", 
	  shortDescription: "This is the ILC tokenizer for a number of European languages.",
	  longDescription: "This is the ILC tokenizer (web service) for Italian, French, German, English, Spanish und Dutch.",
	  lang_encoding: "639-3",
	  languages: ["ita", "fra", "deu", "eng", "spa", "nld"],
	  mimetypes: ["text/plain"],
	  url: ["http://ilc4clarin.ilc.cnr.it/services/ltfw/wl/tokenizer/lrs"],
	  parameter: {  input   : "self.linkToResource", 
			lang    : "self.linkToResourceLanguage",
		     },		  
	  mapping: {  input   : "url",
		      lang    : "lang" // fix this!
		   },
	},
	
	{ task: "Tokenisation",
	  name: "WebLicht-Tokenization-TUR",
	  logo: "weblicht.jpg",		  
	  homepage: "http://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	  location: "Tuebingen, Germany",		  		  		  
	  creators: ["CLARIN-D Centre at the University of Tuebingen, Germany"],
	  contact: {
	      person: "CLARIN WebLicht Support",
	      email: "wlsupport@sfs.uni-tuebingen.de"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Tokenization for Turkish", 
	  longDescription: "WebLicht Easy Chain for tokenization of Turkish texts.",
	  languages: ["tur"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		     ],
	  output: ["text/xml"],
	  url: "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht",
	  pid: "",
	  parameter: {  input   :  "self.linkToResource", 
			lang    : "tr",                   
			analysis: "token"                    
		     }
	},

	
	// { task: "Voice Synthesis",
	//   name: "CLARIN-DK Tool Box (espeak)",
	//   logo: "clarindk.jpg",		  
	//   homepage: "https://clarin.dk/clarindk/forside.jsp",
	//   location: "Copenhagen, Denmark (CLAM Webservices)",
	//   creators: ["Bart Jongejan et al."],
	//   contact: {
	//       person: "Bart Jongejan",
	//       email: "bartj@hum.ku.dk",
	//   },
	//   version: "0.8.3",
	//   licence: "public",
	//   authentication: "no",		  
	//   shortDescription: "CLARIN-DK Tool Box (espeak)",
	//   longDescription:  "Text to speech software. History. Originally known as speak and originally written for Acorn/RISC_OS computers starting in 1995. This version is an enhancement and re-write, including a relaxation of the original memory and processing power constraints, and with support for additional languages.",
	//   lang_encoding: "639-1",
	//   languages: ["afr", "bul", "bos", "cat", "ces", "cym", "dan", "ell", "eng", "epo", "spa", "est", "fin", "fas", "fra", 
	// 	      "hin", "hrv", "hun", "hye", "ind", "isl", "ita", "kat", "kan", "kur", "lat", "lav", "mkd", "mlg", "nld",
	// 	      "pol", "por", "ron", "rus", "slk", "sqi", "srp", "swe", "swa", "tam", "tur", "ukr", "vie", "zho"],
	//   mimetypes: [  "text/plain",
	// 		"application/pdf" // may add other mimetypes
	// 	     ],
	//   url: ["http://cst.dk:8080/tools/createByGoalChoice"], 
	//   parameter: {  input   : "self.linkToResource", 
	// 		lang    : "self.linkToResourceLanguage",                 
	// 		analysis: "voiceSynthesis",
	// 		UIlanguage: "en"				
	// 	     },

	//   mapping:   { input        : "URL",
	// 	       lang         : "language"
	// 	     }		  
	// },



	// { task: "OCR Engine",
	//   name: "CLARIN-DK Tool Box (Tesseract | CuneiForm)",
	//   logo: "clarindk.jpg",		  		  
	//   homepage: "https://clarin.dk/clarindk/forside.jsp",		  		  
	//   location: "Copenhagen, Denmark (CLAM Webservices)",
	//   creators: ["Bart Jongejan et al."],
	//   contact: {
	//       person: "Bart Jongejan",
	//       email: "bartj@hum.ku.dk",
	//   },
	//   version: "0.8.3",
	//   licence: "public",
	//   authentication: "no",		  
	//   shortDescription: "CLARIN-DK Tool Box (Tesseract | CuneiForm)",
	//   longDescription:  "Tesseract is probably the most accurate open source OCR engine available. Combined with the Leptonica Image Processing Library it can read a wide variety of image formats and convert them to text in over 60 languages. It was one of the top 3 engines in the 1995 UNLV Accuracy test. Between 1995 and 2006 it had little work done on it, but since then it has been improved extensively by Google. It is released under the Apache Licence 2.0. Note that the CLARIN-DL Tool Box GUI gives you also access to the Russian CuneiForm system.",
	//   lang_encoding: "639-1",		  languages: ["dan","eng","generic"],
	//   mimetypes: [
	//       "image/gif", 
	//       "image/jpeg", 
	//       "image/png", 
	//       "image/tiff", 
	//   ],
	//   url: ["http://cst.dk:8080/tools/createByGoalChoice"], 
	//   parameter: {  input   : "self.linkToResource", 
	// 		lang    : "self.linkToResourceLanguage",                 
	// 		analysis: "txt",
	// 		UIlanguage: "en"				
	// 	     },
	//   mapping:   { input        : "URL",
	// 	       lang         : "language"
	// 	     }		  
	// },		


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
	  authentication: "yes",		  
	  licence: "public", //but webservice is protected with (free) registration
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

	{
	    task: "Text Enhancement",
	    name: "Apache Stanbol Enhancer",
	    logo: "acdh.png",		  		
	    homepage: "https://stanbol.apache.org",
	    homepage: "http://www.oeaw.ac.at/acdh",
	    location: "Vienna, Austria",		    
	    creators: ["Apache Foundation (software), Austrian Center of Digital Humanities (enhancement chains and configuration)"],
	    contact: {
		person: "Matej Durco",
		email: "acdh-tech@oeaw.ac.at <mailto:acdh-tech@oeaw.ac.at>"
	    },
	    version: "v1.0",
	    authentification: "no",		
	    licence: "public",
	    shortDescription: "Text Enhancement",
	    longDescription: "This is a stateless interface to allow clients to submit content to analyze by the EnhancementEngines and get the resulting RDF enhancements at once without storing anything on the server-side.",
	    languages: ["eng"],
	    lang_encoding: "639-1",		
	    mimetypes: ["text/plain"],
	    output: ["application/json"],
	    url: ["https://enrich-lrs.acdh.oeaw.ac.at/StanbolWrapper"],		
	    pid: "",
	    parameter: {
		input     : "self.linkToResource",
		outFormat : "application%2Fjson"
	    },
	    mapping:   {
		input     : "resourceUri" 
	    }
	},

	{ task: "Text Summarization",
	  name: "Concraft -> Bartek -> NicolasSummarizer",
	  logo: "zil.png",		  		  		  
	  homepage: "http://zil.ipipan.waw.pl/Nicolas",
	  location: "Warsaw, Poland",		  		  		  
	  creators: ["Institute of Computer Science, Polish Academy of Sciences, Poland"],
	  contact: {
	      person: "MultiService",
	      email: "rjawor@amu.edu.pl"
	  },	    
	  version: "v1.0",
	  authentication: "no",		  
	  licence: "public",
	  shortDescription: "Text Summarization for Polish",
	  longDescription: "Java coreference-based summarization tool; its creation was cofunded by the European Union from resources of the European Social Fund -- Project PO KL 'Information technologies: Research and their interdisciplinary applications'. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
	  languages: ["pol"],
	  lang_encoding: "639-1",		  
	  mimetypes: ["text/plain",
		      "text/html"],
	  output: ["text/xml"],
	  url: "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
	  pid: "",
	  parameter: {input :     "self.linkToResource",
		      analysis:   "6"
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
	  licence: "public",
	  authentication: "no",		  
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

	  mapping:   { input        : "INPUT_TEXT",
		     }		  
	},


	{
	    "task": "Word sense disambiguation",
	    "name": "WoSeDon",
	    "logo": "clarin-pl.png",
	    "homepage": "http://ws.clarin-pl.eu",
	    "location": "Wrocław, Poland",
	    "creators": ["Clarin-PL"],
	    "contact": {
		"person": "Tomasz Walkowiak",
		"email": "tomasz.walkowiak@pwr.edu.pl"
	    },
	    "version": "1.0",
	    "licence": "public",
	    "authentication": "no",	    
	    "longDescription": "Word Sense Disambiguation for Polish texts based on plWordNet - the Polish wordnet (weakly supervised, for all words)",
	    "shortDescription": "Word Sense Disambiguation for Polish",
	    "languages": ["pol"],
	    "lang_encoding": "639-1",
	    "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	    "output": ["text/xml"],
	    "url": "http://ws.clarin-pl.eu/weblicht.html",
	    "pid": "",
	    "parameter": {
		"input": "self.linkToResource",
		"lang": "pl",
		"analysis": "wsd"
	    }
	},

	// <form id="f_decode" method="post" enctype="multipart/form-data" accept="application/tei+xml" action="decode.perl">

	// curl -X POST  "http://localhost:8080/wl/tokenizer/plainget?lang=ita&url=https://raw.githubusercontent.com/clarin-eric/LRS-Hackathon/master/samples/resources/txt/hermes-it.txt"

	// /kaf/tokenizer/plainget (it.cnr.ilc.tokenizer.service.resources.TokenizerKafResource)
	
	// wget "http://localhost:8080/wl/tokenizer/plainget?lang=it&url=https://raw.githubusercontent.com/clarin-eric/LRS-Hackathon/master/samples/resources/txt/hermes-it.txt" -O test

    ];

export default Registry;
