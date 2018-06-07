// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: Registry.js
// Time-stamp: <2018-06-07 13:58:14 (zinn)>
// -------------------------------------------

const Registry = [
    { "task": "Chunker",
      "name": "Iobber",
      "logo": "clarin-pl.png",
      "homepage": "http://ws.clarin-pl.eu",
      "location": "Wrocław, Poland",
      "creators": "Clarin-PL",
      "contact": {
	  "person": "Tomasz Walkowiak",
	  "email": "tomasz.walkowiak@pwr.edu.pl"
      },
      "version": "1.0",
      "authentication": "no",		  	    
      "licence": "public",
      "description": "Chunker for Polish. It recognises shallow syntactic structure (up to three levels) of phrases (chunks) in Polish texts.",
      "languages": ["pol"],
      "langEncoding": "639-1",
      "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
      "output": ["application/xml"],
      "url": "http://ws.clarin-pl.eu/weblicht.html",
      "parameters": {
	  "input": "self.linkToResource",
	  "lang": "pl",
	  "analysis": "chunker"
      }
    },
    
    { "task": "Constituent Parsing",
      "name": "WebLicht-Const-Parsing-DE",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Constituent Parsing (German). The pipeline makes use of WebLicht's TCF converter, the tokenizer and sentence boundary detector of the IMS/Stuttgart , and the constituent parser from the Berkeley NLP project. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["deu"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],
// old PATH      "url": "http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht/",
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "de",			      
	  "analysis":   "const-parsing"
      }
    },

    { "task": "Constituent Parsing",
      "name": "WebLicht-Const-Parsing-EN",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Constituent Parsing (English). The pipeline makes use of WebLicht's TCF converter, the Stanford tokenizer, and the statistical BLLIP/Charniak parser. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["eng"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		        
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "en",			      
	  "analysis":   "const-parsing"
      }
    },		
    
    { "task": "Conversion",
      "name": "TCF-TEI decoder (web service)",
      "logo": "YourLogoComesHere.png",
      "softwareType": "webService",
      "requestType": "form-data (input key must have file value)",		  
      "homepage": "http://kaskade.dwds.de/tei-tcf",
      "location": "DWDS, Germany",		  
      "creators": "Bryan Jurish",
      "contact": {
	  "person": "Bryan Jurish",
	  "email": "jurish@bbaw.de",
      },
      "version": "0.0.4",
      "licence": "public",               
      "authentication": "no",
      "description": "A conversion service from TCF to TEI (this is an experimental service).",
      "languages": ["generic"], 
      "langEncoding": "639-1",
      "mimetypes": ["application/tcf+xml",
		    "application/xml;format-variant=weblicht-tcf"
		   ], 		  
      "output": "application/xml",      
      "url": "http://kaskade.dwds.de/tei-tcf/decode.perl", 
      "parameters": {
	  "input" : "self.linkToResource" 
      },
      
      "mapping":   {
	  "input" : "f"
      }
    },

    { "task": "Conversion",
      "name": "TEI -> TCF encoder (web service)",
      "logo": "YourLogoComesHere.png",
      "softwareType": "webService",
      "requestType": "form-data (input key must have file value)",		  
      "homepage": "http://kaskade.dwds.de/tei-tcf",
      "location": "DWDS, Germany",		  
      "creators": "Bryan Jurish",
      "contact": {
	  "person": "Bryan Jurish",
	  "email": "jurish@bbaw.de",
      },
      "version": "0.0.4",
      "licence": "public",               
      "authentication": "no",
      "description": "A conversion service from TEI to TCF (this is an experimental service).",
      "languages": ["generic"], 
      "langEncoding": "639-1",
      "mimetypes": ["application/tei+xml",
		    "text/tei+xml;format-variant=tei-dta"
		   ], 		  
      "output": "application/xml",
      "url": "http://kaskade.dwds.de/tei-tcf/encode.perl", 
      "parameters": {
	  "input" : "self.linkToResource" 
      },
      
      "mapping":   {
	  "input" : "f"
      }
    },    

    { "task": "Conversion",
      "name": "OxGarage (web service)",
      "logo": "YourLogoComesHere.png",
      "softwareType": "webService",
      "requestType": "form-data (input key must have file value)",		        
      "homepage": "http://oxgarage.oucs.ox.ac.uk:8080/ege-webclient",
      "location": "Oxford, United Kingdom",		  
      "creators": "see Github repository at https://github.com/sebastianrahtz/oxgarage",
      "contact": {
	  "person": "Github page",
	  "email": "see Github repository at https://github.com/sebastianrahtz/oxgarage",
      },
      "version": "2.10.0",
      "licence": "public",               
      "authentication": "no",
      "description": "OxGarage is a web, and RESTful, service to manage the transformation of documents between a variety of formats. The majority of transformations use the Text Encoding Initiative format as a pivot format.",
      "languages": ["nld", "eng", "deu", "fra", "ita", "spa", "por", "tur", "rus", "swe"], 
      "langEncoding": "639-1",
      "mimetypes": ["application/tei+xml",
		    "text/tei+xml;format-variant=tei-dta"], 		  
      "output": "text/plain",
      "url": "http://oxgarage.oucs.ox.ac.uk:8080/ege-webservice/Conversions/TEI%3Atext%3Axml/txt%3Atext%3Aplain/",
      "parameters": { 
	  "input"        : "self.linkToResource"
      },
      "mapping":   { 
      }
    },
    
    { "task": "Conversion",
      "name": "HTML To TEXT Converter (web service)",
      "softwareType": "webService",
      "requestType": "get",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "http://cst.ku.dk/english/vaerktoejer/",
      "location": "Copenhagen, Denmark",		  
      "creators": "Bart Jongejan et al.",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },	  	  
      "version": "unknown",
      "authentication": "no",		  
      "licence": "public",
      "description": "Converter from text/html to text/plain (this is an experimental service).", 
      "languages": ["generic"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/html"],
      "output": "text/plain",
      "url": "https://cst.dk/html2text",
      "parameters": {
	  "input" : "self.linkToResource",
	  "iLang" : "en",
	  "base":  ""
      },
      "mapping": {
	  "input"   : "F",
      },		  
      
    },
    
    { "task": "Dependency Parsing",
      "name": "MaltParser",
      "logo": "clarin-pl.png",
      "homepage": "http://ws.clarin-pl.eu",
      "location": "Wrocław, Poland",
      "creators": "Clarin-PL",
      "contact": {
	  "person": "Tomasz Walkowiak",
	  "email": "tomasz.walkowiak@pwr.edu.pl"
      },
      "version": "1.0",
      "licence": "public",
      "authentication": "no",	    	    
      "description": "A language dependency parser chain for Polish. The used tools include Morfeusz-2 with SGJP dictionary (for morphological analysis), wcrft2 (for tagging), and the MaltParser with a model for Polish. The CONLL output can be visualised with DepSVG, a dependency tree and predicate-argument structure visualizer.",
      "languages": ["pol"],
      "langEncoding": "639-1",
      "mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
      "output" : ["CoNLL Format"],      
      "url": "http://ws.clarin-pl.eu/weblicht.html",
      "parameters": {
	  "input": "self.linkToResource",
	  "lang": "pl",
	  "analysis": "parser"
      }
    },
    
    { "task": "Coreference Resolution",
      "name": "Concraft -> Bartek",
      "logo": "zil.png",		  		  		  
      "homepage": "http://zil.ipipan.waw.pl/Bartek",
      "location": "Warsaw, Poland",		  		  		  
      "creators": "Institute of Computer Science, Polish Academy of Sciences, Poland",
      "contact": {
	  "person": "MultiService",
	  "email": "rjawor@amu.edu.pl"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "A statistical tool chain for performing Coreference Resolution. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
      "languages": ["pol"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "text/html"],
      "output": ["application/json", "CoNLL format", "Visualization"],            
      "url": "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "analysis":   "5"
      }
    },			

    { "task": "Dependency Parsing",
      "name": "Concraft -> DependencyParser",
      "logo": "zil.png",		  		  		  
      "homepage": "http://zil.ipipan.waw.pl/DependencyParser",
      "location": "Warsaw, Poland",		  		  		  
      "creators": "Institute of Computer Science, Polish Academy of Sciences, Poland",
      "contact": {
	  "person": "MultiService",
	  "email": "rjawor@amu.edu.pl"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "The Polish dependency parser is trained on the extended version of the Polish dependency treebank (Składnica zależnościowa) with the publicly available parsing systems – MaltParser or MateParser. MaltParser is a transition-based dependency parser that uses a deterministic parsing algorithm. The deterministic parsing algorithm builds a dependency structure of an input sentence based on transitions (shift-reduce actions) predicted by a classifier. The classifier learns to predict the next transition given training data and the parse history. MateParser, in turn, is a graph-based parser that defines a space of well-formed candidate dependency trees for an input sentence, scores them given an induced parsing model, and selects the highest scoring dependency tree as a correct analysis of the input sentence. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
      "languages": ["pol"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "text/html"],
      "output": ["application/json", "CoNLL format", "Visualization"],		            
      "url": "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "analysis":   "4"
      }
    },
    
    { "task": "Dependency Parsing",
      "name": "WebLicht-Dep-Parsing-DE",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Dependency Parsing (German). The pipeline makes use of WebLicht's TCF converter, the IMS tokenizer, the POS Tagger from the OpenNLP projet, and the MaltParser, a system for data-driven dependency parsing. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["deu"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],      
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "de",			      
	  "analysis":   "dep-parsing"
      }
    },
    
    { "task": "Dependency Parsing",
      "name": "WebLicht-Dep-Parsing-NL-ALPINO",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Dependency Parsing (Dutch). The pipeline makes use of WebLicht's TCF converter, the tokenizer and sentence splitter from Alpino, and the Alpino dependency parser for Dutch. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["nld"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],            
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "nl",			      
	  "analysis":   "dep-parsing"
      }
    },
    
    
    { "task": "Dependency Parsing",
      "name": "WebLicht-Dep-Parsing-EN",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Dependency Parsing (English). The pipeline makes use of WebLicht's TCF converter, the Stanford tokenizer, the Jitar POS Tagger, and TurboParser, a multilingual dependency parser based on linear programming relaxations. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["eng"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],            
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "en",			      
	  "analysis":   "dep-parsing"
      }
    },

    { "task": "Dependency Parsing",
      "name": "WebLicht-Dep-Parsing-SL (RELDI)",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Dependency Parsing (Slovenian). The easy-chain makes use of the RELDI software (see https://github.com/clarinsi), which tokenizes and lemmatizes the text, performs part-of-speech tagging, and subsequently, does dependency parsing. For RELDI specific inquiries, please contact nljubesi@gmail.com.",
      "languages": ["slv"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],                  
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "sl",			      
	  "analysis":   "dep-parsing"
      }
    },
    
    { "task": "Dependency Parsing",
      "name": "WebLicht-Dep-Parsing-HR (RELDI)",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Dependency Parsing (Croatian). The easy-chain makes use of the RELDI software (see https://github.com/clarinsi), which tokenizes and lemmatizes the text, performs part-of-speech tagging, and subsequently, does dependency parsing. For RELDI specific inquiries, please contact nljubesi@gmail.com.",
      "languages": ["hrv"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],                        
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "hr",			      
	  "analysis":   "dep-parsing"
      }
    },
    
    { "task": "Dependency Parsing",
      "name": "WebLicht-Dep-Parsing-SR (RELDI)",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Dependency Parsing (Serbian). The easy-chain makes use of the RELDI software (see https://github.com/clarinsi), which tokenizes and lemmatizes the text, performs part-of-speech tagging, and subsequently, does dependency parsing. For RELDI specific inquiries, please contact nljubesi@gmail.com.",
      "languages": ["srp"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],                        
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "sr",			      
	  "analysis":   "dep-parsing"
      }
    },
    
    { "task": "Dependency Parsing",
      "name": "Alpino",
      "logo": "alpino.jpg",		  
      "homepage": "http://www.let.rug.nl/vannoord/alp/Alpino/",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "Alpino is a dependency parser for Dutch, developed in the context of the PIONIER Project Algorithms for Linguistic Processing, developed by Gertjan van Noord at the University of Groningen. You can upload either tokenised or untokenised files (which will be automatically tokenised for you using ucto), the output will consist of a zip file containing XML files, one for each sentence in the input document.",
      "languages": ["nld"], 
      "langEncoding": "639-1",
      // tokenized vs. untokenized input (currently set to untokenized input)
      "mimetypes": ["text/plain"],      
      "output": ["alpinooutput", "text/folia+xml", "tokoutput"], 
      "url": "https://webservices-lst.science.ru.nl/alpino/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "untokinput_url"
      }
    },

    { "task": "Dependency Parsing",
      "name": "UDPipe",
      "logo": "lindat.jpg",
      "homepage": "http://ufal.mff.cuni.cz/udpipe",
      "location": "Charles University, Prague, Czech Republic",      
      "creators": "Milan Straka, Jana Straková",
      "contact": {
	  "person": "Milan Straka",
	  "email": "straka@ufal.mff.cuni.cz",
      },
      "version": "v1.2",
      "authentication": "no",		  
      "licence": "UDPipe is a free software under Mozilla Public Licence 2.0 and the linguistic models are free for non-commercial use and distributed under CC BY-NC-SA licence, although for some models the original data used to create the model may impose additional licensing conditions. UDPipe is versioned using Semantic Versioning.", 
      "description":  "UDPipe is an trainable pipeline for tokenization, tagging, lemmatization and dependency parsing of CoNLL-U files. UDPipe is language-agnostic and can be trained given only annotated data in CoNLL-U format. Trained models are provided for nearly all UD treebanks.",
      "langEncoding": "639-1",
      "languages": ["grc", "ara", "bel", "bul", "cat", "cop", "hrv", "ces", "dan", "nld", "eng", "eus", "est", "fin", "fra", "glg", "deu", "got", "ell", "heb", "hin", "hun", "ind", "gle", "ita", "jpn", "kaz", "kor", "lat", "lav", "lit", "nor", "nno", "nob", "chu", "fas", "pol", "por", "ron", "rus", "san", "slk", "slv", "spa", "swe", "tam", "tur", "ukr", "urd", "uig", "vie", "zho"],
      "mimetypes": ["text/plain"],
      "output" : ["CoNLL-U Format"],
      "url": "https://lindat.mff.cuni.cz/services/udpipe/",
      "parameters": {
	  "input"   : "self.linkToResource", 
	  "lang"    : "self.linkToResourceLanguage"
      },		  
      "mapping": {
	  "input"   : "data",
	  "lang"    : "model"
      },
    },

    { "task": "Dependency Parsing",
      "name": "UDPipe (web service)",
      "softwareType": "webService",
      "requestType": "form-data (input key must have file contents)",
      "logo": "lindat.jpg",
      "homepage": "http://ufal.mff.cuni.cz/udpipe",
      "location": "Charles University, Prague, Czech Republic",      
      "creators": "Milan Straka, Jana Straková",
      "contact": {
	  "person": "Milan Straka",
	  "email": "straka@ufal.mff.cuni.cz",
      },
      "version": "unknown",
      "authentication": "no",		  
      "licence": "UDPipe is a free software under Mozilla Public Licence 2.0 and the linguistic models are free for non-commercial use and distributed under CC BY-NC-SA licence, although for some models the original data used to create the model may impose additional licensing conditions. UDPipe is versioned using Semantic Versioning.", 
      "description":  "UDPipe is an trainable pipeline for tokenization, tagging, lemmatization and dependency parsing of CoNLL-U files. UDPipe is language-agnostic and can be trained given only annotated data in CoNLL-U format. Trained models are provided for nearly all UD treebanks.",
      "langEncoding": "639-1",
      "languages": ["grc", "ara", "bel", "bul", "cat", "cop", "hrv", "ces", "dan", "nld", "eng", "eus", "est", "fin", "fra", "glg", "deu", "got", "ell", "heb", "hin", "hun", "ind", "gle", "ita", "jpn", "kaz", "kor", "lat", "lav", "lit", "nor", "nno", "nob", "chu", "fas", "pol", "por", "ron", "rus", "san", "slk", "slv", "spa", "swe", "tam", "tur", "ukr", "urd", "uig", "vie", "zho"],
      "mimetypes": ["text/plain"],
      "output": "application/json",		      
      "url": "https://lindat.mff.cuni.cz/services/udpipe/api/process?tokenizer&tagger&parser",
      "parameters": {
	  "input"   : "self.linkToResource", 
	  "lang"    : "self.linkToResourceLanguage"
      },		  
      "mapping": {
	  "input"   : "data",
	  "lang"    : "model"
      },
    },

    {
	"task": "Named Entity Recognition",
	"name": "Annie - GATE Cloud (web service)",
	"softwareType": "webService",
	"requestType": "post",
	"logo": "gateCloud.png",		  
	"homepage": "https://cloud.gate.ac.uk/shopfront/sampleServices",
	"location": "Sheffield, UK",
	"creators": "GATE developers",
	"contact": {
	    "person": "The GATE Cloud developers",
	    "email": "Plase fill out the web form at https://cloud.gate.ac.uk/contact/email",
	},
	"version": "unknown",
	"authentication": "no",		  
	"licence": "Please go to the GATE Cloud web page", 
	"description":  "A named entity recognition pipeline that identifies basic entity types, such as Person, Location, nd Organization expressions. It works on documents in the German language. This is the Annie NER engine from the GATE Cloud. THIS IS AN EXPERIMENTAL INTEGRATION. Note that the service is also available at https://cloud.gate.ac.uk/shopfront/sampleServices, offering a nice visualization of the JSON.",
	"langEncoding": "639-1",
	"languages": ["deu"],
	"mimetypes": ["text/plain"],
	"output": "application/json",		
	"url": "https://cloud-api.gate.ac.uk/process-document/german-named-entity-recognizer",
	"parameters": {
	    "input"   : "self.linkToResource"
	},		  
	"mapping": {
	    "input"   : "data"
	},
    },

{
	"task": "Named Entity Recognition",
	"name": "NER from GATE Cloud (web service)",
	"softwareType": "webService",
	"requestType": "post",
	"logo": "gateCloud.png",		  
	"homepage": "https://cloud.gate.ac.uk/shopfront/sampleServices",
	"location": "Sheffield, UK",
	"creators": "GATE developers",
	"contact": {
	    "person": "The GATE Cloud developers",
	    "email": "Plase fill out the web form at https://cloud.gate.ac.uk/contact/email",
	},
	"version": "unknown",
	"authentication": "no",		  
	"licence": "Please go to the GATE Cloud web page", 
	"description":  "A named entity recognition pipeline that identifies basic entity types, such as Person, Location, and Organization expressions. It works on documents in the French language. This is a web service from the GATE Cloud. THIS IS AN EXPERIMENTAL INTEGRATION. Note that the service is also available at https://cloud.gate.ac.uk/shopfront/sampleServices, offering a nice visualization of the JSON.",
	"langEncoding": "639-1",
	"languages": ["fra"],
	"mimetypes": ["text/plain"],
	"output": "application/json",	
	"url": "https://cloud-api.gate.ac.uk/process-document/french-named-entity-recognizer",
	"parameters": {
	    "input"   : "self.linkToResource"
	},		  
	"mapping": {
	    "input"   : "data"
	},
    },
        
    {
	"task": "Named Entity Recognition",
	"name": "Annie - GATE Cloud (web service)",
	"softwareType": "webService",
	"requestType": "post",
	"logo": "gateCloud.png",		  
	"homepage": "https://cloud.gate.ac.uk/shopfront/sampleServices",
	"location": "Sheffield, UK",
	"creators": "GATE developers",
	"contact": {
	    "person": "The GATE Cloud developers",
	    "email": "Plase fill out the web form at https://cloud.gate.ac.uk/contact/email",
	},
	"version": "unknown",
	"authentication": "no",		  
	"licence": "Please go to the GATE Cloud web page", 
	"description":  "This is the Annie NER engine from the GATE Cloud. THIS IS AN EXPERIMENTAL INTEGRATION. Note that the service is also available at https://cloud.gate.ac.uk/shopfront/sampleServices, offering a nice visualization of the JSON.",
	"langEncoding": "639-1",
	"languages": ["eng"],
	"mimetypes": ["text/plain"],
	"output": "application/json",	
	"url": "https://cloud-api.gate.ac.uk/process-document/annie-named-entity-recognizer?annotations=:Person&annotations=:Location&annotations=:Organization&annotations=:Date&annotations=:Money",
	"parameters": {
	    "input"   : "self.linkToResource"
	},		  
	"mapping": {
	    "input"   : "data"
	},
    },

    {
	"task": "Named Entity Recognition",
	"name": "OpenNLP English Pipeline - GATE Cloud (web service)",
	"softwareType": "webService",
	"requestType": "post",
	"logo": "gateCloud.png",		  
	"homepage": "https://cloud.gate.ac.uk/shopfront/sampleServices",
	"location": "Sheffield, UK",
	"creators": "GATE developers",
	"contact": {
	    "person": "The GATE Cloud developers",
	    "email": "Plase fill out the web form at https://cloud.gate.ac.uk/contact/email",
	},
	"version": "unknown",
	"authentication": "no",		  
	"licence": "Please go to the GATE Cloud web page", 
	"description":  "The English tokeniser, sentence splitter, POS tagger, phrase chunker and named-entity recogniser from Apache OpenNLP. The components are based on the maxent machine learning algorithm, and produce Token and Sentence annotations in a form compatible with other standard GATE tools. THIS IS AN EXPERIMENTAL INTEGRATION. Note that the service is also available at https://cloud.gate.ac.uk/shopfront/sampleServices, offering a nice visualization of the JSON.",
	"langEncoding": "639-1",
	"languages": ["eng"],
	"mimetypes": ["text/plain"],
	"output": "application/json",	
	"url": "https://cloud-api.gate.ac.uk/process-document/opennlp-english-pipeline",
	"parameters": {
	    "input"   : "self.linkToResource"
	},		  
	"mapping": {
	    "input"   : "data"
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
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "TermoPL is a tool for automated extraction of terminology from Polish texts.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/json"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
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
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    
	"description": "Inkluz - detects foreign language inclusions in Polish texts.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/octet-stream"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
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
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    
	"description": "Keywords extraction for Polish by ReSpa based on the representation of text documents as word graphs.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "respa"
	}
    },

    { "task": "Keyword Extractor",
      "name": "KER (web service)",
      "softwareType": "webService",
      "requestType": "form-data (input key must have file contents)",
      "logo": "lindat.jpg",
      "homepage": "http://lindat.mff.cuni.cz/services/ker/",
      "location": "Charles University, Prague, Czech Republic",            
      "creators": "Jindřich Libovický",
      "contact": {
	  "person": "Jindřich Libovický",
	  "email": "libovicky@ufal.mff.cuni.cz",
      },
      "version": "unknown",
      "authentication": "no",		  
      "licence": "unknown", 
      "description":  "KER is a keyword extractor that was designed for scanned texts in Czech and English. It is based on the stadard tf-idf algorithm with the idf tables trained on texts from Wikipedia. To deal with the data sparsity, texts are preprocessed by Morphodita: morphological dictionary and tagger.",
      "langEncoding": "639-1",
      "languages": ["ces", "eng"],
      "mimetypes": ["text/plain"],
      "output": "application/json",      
      "url": "http://lindat.mff.cuni.cz/services/ker", 
      "parameters": {
	  "input"        : "self.linkToResource", 
	  "lang"         : "self.linkToResourceLanguage",
	  "threshold"    : "0.2",
	  "maximum-words": "15"
      },
      "mapping":   {
	  "input"         : "data",
	  "lang"          : "language"
      }		  
    },
    
    { "task": "Lemmatization",	
      "name": "CLARIN-DK Tool Chain for Lemmatization (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs lemmatization in running text. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-lemmas-notags"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Lemmatization",	
      "name": "CLARIN-DK Tool Chain for Lemmatization (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs lemmatization in running text. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-lemmas-notags"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Lemmatization",	
      "name": "CLARIN-DK Tool Chain for Lemmatization, including POS tags (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs lemmatization in running text, including POS tags. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-lemmas-wtags"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Lemmatization",	
      "name": "CLARIN-DK Tool Chain for Lemmatization, including POS tags (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs lemmatization in running text, including POS tags. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow ": "en-lemmas-wtags"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Lemmatization",	
      "name": "CLARIN-DK Tool Chain for Lemmatization, presented as freqency list (web service).",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",               
      "authentication": "no",
      "description": "Performs lemmatization in running text, presented as freqency list. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-frek-lemmas"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Lemmatization",
      "name": "WebLicht-Lemmas-DE",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Lemmatization (German). The pipeline makes use of WebLicht's TCF converter, the IMS tokenizer, and the IMS TreeTagger. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["deu"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",,
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "de",			      
	  "analysis":   "lemma"
      }
    },

    { "task": "Lemmatization",
      "name": "WebLicht-Lemmas-EN",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Lemmatization (English). The pipeline makes use of WebLicht's TCF converter, the Stanford tokenizer, the Jitar POS Tagger, and the lemmatizer service from MorphAdorner. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["eng"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],      
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "en",			      
	  "analysis":   "lemma"
      }
    },		

    {
	"task": "Lemmatization",	
	"name": "CSTLemma (hosted by D4Science)",
	"logo": "d4science.png",		  	    
	"homepage": "https://www.d4science.org",
	"location": "Pisa, Italy",		  		  		  
	"creators": "Bart Jongejan (tool), D4Science staff (WAR upload)",
	"contact": {
	    "person": "D4Science Support",
	    "email": "claus.zinn@sfs.uni-tuebingen.de, bartj@hum.ku.dk"
	},	    
	"version": "v1.0",
	"authentication": "no",		  
	"licence": "public",
	"description": "This is an experimental integration of a D4Science NLP processing service (CSTLemma). The CSTLemma Lemmatizer for English reduces all words in a text to their base form, the lemma.",
	"languages": ["eng"],
	"langEncoding": "639-1",		  
	"mimetypes": ["text/plain"],
	"output": ["text/csv"],
	"url": "https://next.d4science.org/nlp-hub-cstlemma/",		  
	"parameters": {
	    "input" :     "self.linkToResource",
	    "token":      "27061e4d-3567-482d-9f12-3a1af5e42ab9-843339462"
	}
    },
    
    { "task": "Lemmatization",	
      "name": "CLARIN-DK Tool Chain for Lemmatization, presented as freqency list (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs lemmatization in running text, presented as freqency list. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-frek-lemmas"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },
    
    {
	"task": "Morphological Analysis",
	"name": "Morfeusz 2",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    
	"description": "Morphological analysis of Polish texts by Morfeusz 2 (based on the SGJP dictionary)",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
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
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "Morpho-syntactic tagger for Polish - WCRFT2",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "tagger"
	}
    },

    {
	"task": "Named Entity Recognition",
	"name": "WebLicht-NamedEntities-SL",
	"logo": "weblicht.jpg",		  	    
	"homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
	"location": "Tuebingen, Germany",		  		  		  
	"creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
	"contact": {
	    "person": "CLARIN WebLicht Support",
	    "email": "wlsupport@sfs.uni-tuebingen.de"
	},	    
	"version": "v1.0",
	"authentication": "no",		  
	"licence": "public",
	"description": "WebLicht Easy Chain for Named Entity Recognition (Slovenian). The easy-chain makes use of the ReLDI tag, NER JSI software, which performs NER without a parse.",
	"languages": ["slv"],
	"langEncoding": "639-1",		  
	"mimetypes": ["text/plain",
		      "application/rtf",			     
		      "application/pdf",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
	"output": ["application/tcf+xml"],                        
	"url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
	"parameters": {
	    "input" :     "self.linkToResource",
	    "lang":       "sl",			      
	    "analysis":   "ne"
	}
    },

    {
	"task": "Named Entity Recognition",
	"name": "D4Science NER (GATE's Annie)",
	"logo": "d4science.png",		  	    
	"homepage": "https://www.d4science.org",
	"location": "Pisa, Italy",		  		  		  
	"creators": "D4Science staff",
	"contact": {
	    "person": "D4Science Support",
	    "email": "claus.zinn@sfs.uni-tuebingen.de"
	},	    
	"version": "v1.0",
	"authentication": "no",		  
	"licence": "public",
	"description": "This is an experimental integration of a D4Science NLP processing service (based on GATE's ANNIE). This service identifies names of persons, locations, organizations, as well as money amounts, time and date expressions in English texts automatically.",
	"languages": ["eng"],
	"langEncoding": "639-1",		  
	"mimetypes": ["text/plain"],
	"output": ["application/xml"],
	"url": "https://next.d4science.org/nlp-hub/",		  
	"parameters": {
	    "input" :     "self.linkToResource",
	    "token":       "a92dc66c-bf09-48cb-9a96-8e765f11e7b1-843339462"			      
	}
    },

    {
	"task": "Named Entity Recognition",
	"name": "NLP-HUB (multiple NER tools)",
	"logo": "d4science.png",		  	    
	"homepage": "https://www.d4science.org",
	"location": "Pisa, Italy",		  		  		  
	"creators": "D4Science staff",
	"contact": {
	    "person": "D4Science Support",
	    "email": "claus.zinn@sfs.uni-tuebingen.de"
	},	    
	"version": "v1.0",
	"authentication": "no",		  
	"licence": "public",
	"description": "This is an experimental integration of a D4Science NLP processing service hub. This service runs a number of NER tools in parallel, and merges their results. It identifies names of persons, locations, organizations, as well as money amounts, time and date expressions -- and other expressions -- in English, French, Italian, Spanish and German texts automatically.",
	"languages": ["eng", "fra", "ita", "spa", "ger"],
	"langEncoding": "639-1",		  
	"mimetypes": ["text/plain"],
	"output": ["application/xml"],
	"url": "https://nlp.d4science.org/hub",		  
	"parameters": {
	    "input" :     "self.linkToResource",
	    "token":       "a92dc66c-bf09-48cb-9a96-8e765f11e7b1-843339462"			      	    
	}
    },
    
    {
	"task": "Named Entity Recognition",
	"name": "Liner2 (hosted by D4Science)",
	"logo": "d4science.png",		  	    
	"homepage": "https://www.d4science.org",
	"location": "Pisa, Italy",		  		  		  
	"creators": "D4Science staff",
	"contact": {
	    "person": "D4Science Support",
	    "email": "claus.zinn@sfs.uni-tuebingen.de"
	},	    
	"version": "v1.0",
	"authentication": "no",		  
	"licence": "public",
	"description": "This is an experimental integration of a D4Science NLP processing service (NER Liner 2). This service identifies names of persons, locations, organizations, as well as money amounts, time and date expressions in Polish texts automatically.",
	"languages": ["pol"],
	"langEncoding": "639-1",		  
	"mimetypes": ["text/plain"],
	"output": ["application/xml"],
	"url": "https://next.d4science.org/nlp-hub-liner2/",		  
	"parameters": {
	    "input" :     "self.linkToResource",
	    "token":      "27061e4d-3567-482d-9f12-3a1af5e42ab9-843339462"
	}
    },

   
    {
	"task": "Named Entity Recognition",
	"name": "Liner2",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    
	"description": "Name Entity and Temporal Expression recognition",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "ner"
	}
    },

    { "task": "Machine Translation",
      "name": "Oersetter (NLD-FRY)",
      "logo": "oersetter.jpg",		  
      "homepage": "http://oersetter.nl/",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public",
      "description": "Oersetter is a statistical machine translation (SMT) system for Frisian to Dutch and Dutch to Frisian. A parallel training corpus has been established, which has subsequently been used to automatically learn a phrase-based SMT model. The translation system is built around the open-source SMT software Moses.",
      "languages": ["nld"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/plain"], 
      "output": ["text/plain"], 
      "url": "https://webservices-lst.science.ru.nl/oersetter/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "input-nl_url" 
      }
    },

    { "task": "Machine Translation",
      "name": "Oersetter (FRY-NLD)",
      "logo": "oersetter.jpg",		  
      "homepage": "http://oersetter.nl/",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "Oersetter is a Frisian-Dutch Machine Translation system.",
      "languages": ["fry"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/plain"], 
      "output": ["text/plain"], 
      "url": "https://webservices-lst.science.ru.nl/oersetter/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "input-fy_url" 
      }
    },		
    
    
    // curl -d @germanet.dc.xml -o output.marc.xml https://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc/rest

    // { "task": "Metadata Format Conversion",
    //   "name": "NaLiDa2Marc21 (web service)",
    //   "softwareType": "webService",
    //   "requestType": "data",
    //   "logo": "YourLogoComesHere.png",		  
    //   "homepage": "http://shannon.sfs.uni-tuebingen.de/NaLiDa2Marc21",
    //   "location": "Tuebingen, Germany",		  		  
    //   "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
    //   "contact": {
    //       "person": "NaLiDa Support",
    //       "email": "nalida@sfs.uni-tuebingen.de"
    //   },	    
    //   "version": "v1.0",
    //   "authentication": "no",		  
    //   "licence": "public",
    //   "description": "Webservice converting NaLiDa-based CMDI profiles to Marc21",
    //   "languages": ["generic"], 
    //   "mimetypes": ["application/xml"],
    //   "output": ["application/xml"],
    //   "url": "http://shannon.sfs.uni-tuebingen.de:8080/NaLiDa2Marc-1.0",
    //   "parameters": { input : "self.linkToResource" // for demo upload site, to be instantiated
    // 	     }
    
    //   // URL to get called:
    //   // http://tuebingen.weblicht.sfs.uni-tuebingen.de:8080/weblicht?input=http://hdl.handle.net/10932/00-017B-E3BC-2D57-CC01-6&lang=de&analysis=ne
    // },		
    
    { "task": "Metadata Format Conversion",
      "name": "CMDI2DC (web service)",
      "softwareType": "webService",
      "requestType": "data",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/converter/Cmdi2DC",
      "location": "Tuebingen, Germany",		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "NaLiDa Support",
	  "email": "nalida@sfs.uni-tuebingen.de"
      },	    
      "version": "v0.9",
      "authentication": "no",		  
      "licence": "public",
      "description": "Webservice converting CMDI metadata to XML-based Dublin Core metadata.",
      "languages": ["generic"], 
      "mimetypes": ["application/xml", "application/octet-stream"],
      "output": ["application/xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/converter/Cmdi2DC/rest",
      "parameters": {
	  "input" : "self.linkToResource" // for demo upload site, to be instantiated
      }
    },

    
    { "task": "Metadata Format Conversion",
      "name": "DC2MARC21 (web service)",
      "softwareType": "webService",
      "requestType": "data",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc",
      "location": "Tuebingen, Germany",		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "NaLiDa Support",
	  "email": "nalida@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Webservice converting XML-based Dublin Core metadata to XML-based MARC 21 metadata.",
      "languages": ["generic"], 
      "mimetypes": ["application/xml", "application/octet-stream"],
      "output": ["application/xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/converter/DC2Marc/rest",
      "parameters": {
	  "input" : "self.linkToResource" // for demo upload site, to be instantiated
      }
    },
    
    { "task": "Metadata Format Conversion",
      "name": "MARC2EAD (web service)",
      "softwareType": "webService",
      "requestType": "data",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/converter/Marc2EAD",
      "location": "Tuebingen, Germany",		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "NaLiDa Support",
	  "email": "nalida@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Webservice converting XML-based MARC 21 metadata to XML-based EAD metadata.",
      "languages": ["generic"], 
      "mimetypes": ["application/xml", "application/octet-stream"],
      "output": ["application/xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/converter/Marc2EAD/rest",
      "parameters": {
	  "input" : "self.linkToResource" // for demo upload site, to be instantiated
      }
    },

    { "task": "Metadata Format Conversion",
      "name": "Marc2MODS (web service)",
      "softwareType": "webService",
      "requestType": "data",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/converter/Marc2MODS",
      "location": "Tuebingen, Germany",		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "NaLiDa Support",
	  "email": "nalida@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Webservice converting XML-based MARC 21 metadata to XML-based MODS metadata.",
      "languages": ["generic"], 
      "mimetypes": ["application/xml", "application/octet-stream"],
      "output": ["application/xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/converter/Marc2MODS/rest",
      "parameters": {
	  "input" : "self.linkToResource" // for demo upload site, to be instantiated
      }
    },
    
    { "task": "Metadata Format Conversion",
      "name": "Marc2RDFDC (web service)",
      "softwareType": "webService",
      "requestType": "data",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/converter/Marc2RDFDC",
      "location": "Tuebingen, Germany",		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "NaLiDa Support",
	  "email": "nalida@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Webservice converting XML-based MARC 21 metadata to XML-based RDF-DC metadata.",
      "languages": ["generic"], 
      "mimetypes": ["application/xml", "application/octet-stream"],
      "output": ["application/xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/converter/Marc2RDFDC/rest",
      "parameters": {
	  "input" : "self.linkToResource" // for demo upload site, to be instantiated
      }
    },				

    { "task": "Metadata Format Conversion",
      "name": "MODS2RDF (web service)",
      "softwareType": "webService",
      "requestType": "data",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/converter/MODS2RDF",
      "location": "Tuebingen, Germany",		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "NaLiDa Support",
	  "email": "nalida@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Webservice converting XML-based MODS metadata to XML-based RDF metadata.",
      "languages": ["generic"], 
      "mimetypes": ["application/xml", "application/octet-stream"],
      "output": ["application/xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/converter/MODSRDF/rest",
      "parameters": {
	  "input" : "self.linkToResource" // for demo upload site, to be instantiated
      }
    },

    { "task": "Morphology Analysis",
      "name": "WebLicht-Morphology-DE",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",
      "licence": "public",
      "description": "WebLicht Easy Chain for Morphology Analysis (German). The pipeline makes use of WebLicht's TCF converter, the IMS tokenizer, and the IMS tool on German morphology. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["deu"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],            
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "de",			      
	  "analysis":   "morphology"
      }
    },
    
    { "task": "Morphology Analysis",
      "name": "WebLicht-Morphology-EN",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Morphology Analysis (English). The pipeline makes use of WebLicht's TCF converter, the Stanford tokenizer, and the morphology analysis service from MorphAdorner. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["eng"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],            
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "en",			      
	  "analysis":   "morphology"
      }
    },

    { "task": "Named Entity Recognition",	
      "name": "CLARIN-DK Tool Chain for NER (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs Named Entity Recognition. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-navne"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Named Entity Recognition",	
      "name": "CLARIN-DK Tool Chain for NER including segmentation (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs Named Entity Recognition, including segmentation. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-navne-segments"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Named Entity Recognition",	
      "name": "CLARIN-DK Tool Chain for NER including POS tags (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Performs Named Entity Recognition, including POS tags. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-navne-POS"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Named Entity Recognition",
      "name": "Concraft -> Nerf",
      "logo": "zil.png",		  		  		  
      "homepage": "http://zil.ipipan.waw.pl/Nerf",
      "location": "Warsaw, Poland",		  		  		  
      "creators": "Institute of Computer Science, Polish Academy of Sciences, Poland",
      "contact": {
	  "person": "MultiService",
	  "email": "rjawor@amu.edu.pl"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "authentication": "no",	  
      "description": "Statistical named entity recognition tool based on linear-chain conditional random fields. Part of: Multiservice, a robust linguistic Web service for Polish.",
      "languages": ["pol"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "text/html"],
      "output": ["application/json", "CoNLL format", "Visualization"],		                  
      "url": "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "analysis":   "2"
      }
    },
    { "task": "Named Entity Recognition",
      "name": "WebLicht-NamedEntities-DE",
      "logo": "weblicht.jpg",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for German Named Entity Recognition (German). The pipeline makes use of WebLicht's TCF converter, the IMS tokenizer, the IMS TreeTagger, and a German Named Entity Recognizer that has been trained based on a maximum entropy approach using the OpenNLP maxent library. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["eng"],
      "languages": ["deu"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		        
      "parameters": {
	  "input"   :  "self.linkToResource", 
	  "lang"    : "de",                   
	  "analysis": "ne"                    
      }
    },

    { "task": "Named Entity Recognition",
      "name": "WebLicht-NamedEntities-EN",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for Named Entity Recognition (English). The pipeline makes use of WebLicht's TCF converter, the Stanford tokenizer, and the Illinois Named Entity Recognizer. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["eng"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		        
      "parameters": {
	  "input"   : "self.linkToResource", 
	  "lang"    : "en",                   
	  "analysis": "ne"                    
      }
    },				

    { "task": "Named Entity Recognition",
      "name": "NameTag (web service)",
      "softwareType": "webService",
      "requestType": "form-data (input key must have file contents)",
      "logo": "lindat.jpg",
      "homepage": "http://lindat.mff.cuni.cz/services/nametag/",
      "location": "Charles University, Prague, Czech Republic",            
      "creators": "Milan Straka, Jana Straková",
      "contact": {
	  "person": "Milan Straka",
	  "email": "straka@ufal.mff.cuni.cz",
      },
      "version": "unknown",
      "authentication": "no",		  
      "licence": "NameTag is a free software under LGPL licence and the linguistic models are free for non-commercial use and distributed under CC BY-NC-SA licence, although for some models the original data used to create the model may impose additional licensing conditions.", 
      "description":  "NameTag is an open-source tool for named entity recognition (NER). NameTag identifies proper names in text and classifies them into predefined categories, such as names of persons, locations, organizations, etc. NameTag is distributed as a standalone tool or a library, along with trained linguistic models. In the Czech language, NameTag achieves state-of-the-art performance (Straková et al. 2013).",
      "langEncoding": "639-1",
      "languages": ["ces", "eng"],
      "mimetypes": ["text/plain"],
      "output": "application/json",		            
      "url": "http://lindat.mff.cuni.cz/services/nametag/api/recognize",
      "parameters": {
	  "input"   : "self.linkToResource", 
	  "lang"    : "self.linkToResourceLanguage"
      },		  
      "mapping": {
	  "input"   : "data",
	  "lang"    : "language"
      },
    },
    
    {
	"task": "Named Entity Recognition",
	"name": "NER NLTK",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    
	"description": "Name Entity Recogniser for English by NLTK.",
	"languages": ["eng"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "en",
	    "analysis": "nerNLTK"
	}
    },

    
    { "task": "N-Gramming",
      "name": "FoLiA-stats",
      "logo": "foliastats.jpg",		  		  
      "homepage": "https://github.com/LanguageMachines/foliautils",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Ko van der Sloot (TiCC, Tilburg University)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "0.2",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "N-gram frequency list generation on FoLiA input.",
      "languages": ["nld", "generic"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/folia+xml"],		  
      "output": ["wordfreqlist", "lemmafreqlist", "lemmaposfreqlist"], 		  		  
      "url": "https://webservices-lst.science.ru.nl/foliastats/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "foliainput_url"
      }
    },		
    
    { "task": "N-Gramming",
      "name": "CLARIN-DK Tool Chain: Computes alphabetic list of words and their frequencies (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  	  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Alphabetic list of words with frequencies (uses a lemmatiser, but does not output the lemmas). The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-frek-ord"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "N-Gramming",
      "name": "CLARIN-DK Tool Chain: Computes bigrams, lemmas, sorted by frequency (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  	  	  	  	  	  	  	  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes bigrams, lemmas, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-frek-bigram-lemmas"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "N-Gramming",
      "name": "CLARIN-DK Tool Chain: Computes bigrams, lemmas, sorted by frequency (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes bigrams, lemmas, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-frek-bigram-lemmas"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "N-Gramming",
      "name": "CLARIN-DK Tool Chain: Computes bigrams, words, sorted by frequency (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes bigrams, words, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-frek-bigram-ord"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "N-Gramming",
      "name": "CLARIN-DK Tool Chain: Computes bigrams, words, sorted by frequency (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes bigrams, words, sorted by frequency. The web service returns a zip file containing original input and the results of all analyses.",	  
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-frek-bigram-ord"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "N-Gramming",
      "name": "Colibri Core (plain text)",
      "logo": "colibriCore.jpg",		  		  
      "homepage": "https://github.com/proycon/colibri-core",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "Colibri core is an NLP tool as well as a C++ and Python library for working with basic linguistic constructions such as n-grams and skipgrams (i.e patterns with one or more gaps, either of fixed or dynamic size) in a quick and memory-efficient way.",
      "languages": ["nld", "eng", "deu", "fra", "spa", "por", "fry"],  // "generic"
      "langEncoding": "639-1",
      "mimetypes": ["text/plain"],
      "output": ["Tadpole Columned Output Format",
		 "text/folia+xml"], 		  
      "url": "https://webservices-lst.science.ru.nl/colibricore/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource",
	  "lang"         : "self.linkToResourceLanguage",                 			       
	  "sentenceperline_input" : "false",
	  "sentenceperline_output" : "false"
      },
      "mapping":   {
	  "input"        : "textinput_untok_url",
	  "lang"         : "textinput_untok_language"
      }
    },

    { "task": "N-Gramming",
      "name": "Colibri Core (folia+xml)",
      "logo": "colibriCore.jpg",		  
      "homepage": "https://github.com/proycon/colibri-core",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "Colibri core is an NLP tool as well as a C++ and Python library for working with basic linguistic constructions such as n-grams and skipgrams (i.e patte rns with one or more gaps, either of fixed or dynamic size) in a quick and memory-efficient way.",
      "languages": ["nld", "eng", "deu", "fra", "spa", "por", "fry"],  // "generic"
      "langEncoding": "639-1",
      "mimetypes": ["text/folia+xml"],
      "output": ["Tadpole Columned Output Format",
		 "text/folia+xml"], 		  		  
      "url": "https://webservices-lst.science.ru.nl/colibricore/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource",
	  "lang"         : "self.linkToResourceLanguage",                 			       
	  "sentenceperline_input" : "false",
	  "sentenceperline_output" : "false"
      },
      "mapping":   {
	  "input"        : "foliainput_url",
	  "lang"         : "textinput_untok_language"	  
      }
    },				
    
    { "task": "NLP suite for Dutch",
      "name": "Frog (plain text)",
      "logo": "frog.jpg",		  
      "homepage": "https://languagemachines.github.io/frog/",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "Frog's current version will tokenize, tag, lemmatize, and morphologically segment word tokens in Dutch text files, will assign a dependency graph to each sentence, will identify the base phrase chunks in the sentence, and will attempt to find and label all named entities.",
      "languages": ["nld"],
      "langEncoding": "639-1",
      "mimetypes": ["text/plain"],
      "output": ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  
      "url": "https://webservices-lst.science.ru.nl/frog/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "maininput_url"
      }
    },		

    { "task": "NLP suite for Dutch",
      "name": "Frog (folia+xml)",
      "logo": "frog.jpg",		  
      "homepage": "https://languagemachines.github.io/frog/",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "Frog's current version will tokenize, tag, lemmatize, and morphologically segment word tokens in Dutch text files, will assign a dependency graph to each sentence, will identify the base phrase chunks in the sentence, and will attempt to find and label all named entities.",
      "languages": ["nld"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/folia+xml"],
      "output": ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  
      "url": "https://webservices-lst.science.ru.nl/frog/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "foliainput_url"
      }
    },
    
    { "task": "Part-Of-Speech Tagging",
      "name": "WebLicht-POSTags-Lemmas-DE",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for POS Tagging and Lemmatization (German). The pipeline makes use of WebLicht's TCF converter, the IMS tokenizer, and the IMS TreeTagger. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["deu"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "de",			      
	  "analysis":   "pos"
      }
    },

    { "task": "Part-Of-Speech Tagging",
      "name": "WebLicht-POSTags-Lemmas-FR",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for POS Tagging and Lemmatization (French). The pipeline makes use of WebLicht's TCF converter, the IMS tokenizer, and the IMS TreeTagger. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["fra"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "fr",			      
	  "analysis":   "pos"
      }
    },		

    { "task": "Part-Of-Speech Tagging",
      "name": "WebLicht-POSTags-Lemmas-IT",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for POS Tagging and Lemmatization (Italian). The pipeline makes use of WebLicht's TCF converter, the IMS tokenizer, and the POS Tagger from the OpenNLP project. The model for Italian is trained on a relatively small training corpus (MIDT) and should therefore be considered experimental. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["ita"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],      
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "it",			      
	  "analysis":   "pos"
      }
    },				

    { "task": "Part-Of-Speech Tagging",
      "name": "WebLicht-POSTags-Lemmas-EN",
      "logo": "weblicht.jpg",		  		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for POS Tagging and Lemmatization (English). The pipeline makes use of WebLicht's TCF converter, the Stanford tokenizer, the Jitar POS Tagger, and the lemmatizer service from MorphAdorner. WebLicht's Tundra can be used to visualize the result.",
      "languages": ["eng"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      "output": ["application/tcf+xml"],      
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "lang":       "en",			      
	  "analysis":   "pos"
      }
    },
    
    { "task": "Part-Of-Speech Tagging",
      "name": "Concraft",
      "logo": "zil.png",		  		  		  
      "homepage": "http://zil.ipipan.waw.pl/Concraft",
      "location": "Warsaw, Poland",		  		  		  
      "creators": "Institute of Computer Science, Polish Academy of Sciences, Poland",
      "contact": {
	  "person": "MultiService",
	  "email": "rjawor@amu.edu.pl"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Morphosyntactic tagger for Polish based on constrained conditional random fields. Part of: Multiservice, a robust  linguistic Web service for Polish.",
      "languages": ["pol"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "text/html"],
      "output": ["application/json", "CoNLL format", "Visualization"],		                  
      "url": "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "analysis":   "0"
      }
    },		
    

    { "task": "Phonetic Transcription",
      "name": "runASR (web service)",
      "logo": "YourLogoComesHere.png",		  		  
      "softwareType": "webService",
      "requestType": "form-data (input key must have file value)",      
      "homepage": "http://www.phonetik.uni-muenchen.de/forschung/Bas/BasWebserviceseng.html",
      "location": "BAS, Muenchen",
      "creators": "Florian Schiel, Andreas Kipp, Thomas Kisler (BAS)",
      "contact": {
	  "person": "Florian Schiel, Andreas Kipp, Thomas Kisler (BAS)",
	  "email": "schiel@phonetik.uni-muenchen.de",
      },
      "version": "x.y.z",
      "licence": "public",
      "authentication": "no",		  
      "description":  "Automatic transcription of speech signal using ASR techniques (experimental).",
      "langEncoding": "639-3",
      "languages": ["ara", "deu", "eng", "spa", "per", "fra", "ita", "nld", "pol", "ron", "rus", "cmn"],
      "mimetypes": ["audio/vnd.wave", "audio/x-nist", "audio/x-wav", "video/mp4", "video/mpeg"],
      "url": "https://clarin.phonetik.uni-muenchen.de/BASWebServices/services/runASR",
      "output": "application/xml",
      "parameters": {
	  "input"       : "self.linkToResource",
	  "ASRType"     : "callHavenOnDemandASR", 
	  "OUTFORMAT"   : "json", //bpf, xml, emuDB, json, csv]
	  "diarization" : "false",
	  "lang"        : "self.linkToResourceLanguage"	  
      },

      "mapping":   {
	  "input"        : "SIGNAL",
	  "lang"         : "LANGUAGE"
      }		  
    },

    { "task": "Phonetic Transcription",
      "name": "runMINNI (web service)",
      "logo": "YourLogoComesHere.png",		  		  
      "softwareType": "webService",
      "requestType": "form-data (input key must have file value)",
      "homepage": "http://www.phonetik.uni-muenchen.de/forschung/Bas/BasWebserviceseng.html",
      "location": "BAS, Muenchen",
      "creators": "Florian Schiel, Andreas Kipp, Thomas Kisler (BAS)",
      "contact": {
	  "person": "Florian Schiel, Andreas Kipp, Thomas Kisler (BAS)",
	  "email": "schiel@phonetik.uni-muenchen.de",
      },
      "version": "x.y.z",
      "licence": "public",
      "authentication": "no",
      "description":  "Segments and labels a speech audio file into SAM-PA (or IPA) phonetic segments without any text/phonological input; results are stored either in praat compatible TextGrid file (configuration parameter OUTFORMAT=TextGrid) or a CSV table (the BPF MAU tier, configuration parameter OUTFORMAT=csv).",	  
      "langEncoding": "639-3",
      "languages": ["deu", "aus", "cat", "eng", "ekk", "fra", "hun","ita", "pol", "nld", "rus", "spa"],
      "mimetypes": ["audio/wav", "audio/vnd.wave", "audio/x-wav"],
      "url": "https://clarin.phonetik.uni-muenchen.de/BASWebServices/services/runMINNI",
      "output": "application/xml",      
      "parameters": {
	  "input"      : "self.linkToResource", 
	  "OUTIPA"     : "false", 
	  "OUTFORMAT"  : "emuDB", // csv, mau, TextGrid, bpf, par, mau-append, emuDB
	  "lang"       : "self.linkToResourceLanguage",
	  "WEIGHT"     : "default",
	  "MAUSSHIFT"  : "default", 
	  "OUTSYMBOL"  : "sampa", 
	  "MINPAUSLEN" : "5",
	  "USETRN"     : "force",
	  "INSPROB"    : "0.0"
      },

      "mapping":   {
	  "input" : "SIGNAL",
	  "lang"  : "LANGUAGE"
      }		  
    },		

    {
	"task": "Relation between name entities detection",
	"name": "Serel",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "Detection of semantic relations between Named Entities in Polish texts by Serel.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "serel"
	}
    },
    
    // the tools for CLARIN-DK have little parametrization, everything's hardcoded in the workflow parameter
    { "task": "Segmentation",
      "name": "CLARIN-DK Tool Chain: Computes segmentation without tokenization (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes segmentation without tokenization. The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-segment"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Segmentation",
      "name": "CLARIN-DK Tool Chain: Computes segmentation without tokenization (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes segmentation without tokenization. The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-segment"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Segmentation",
      "name": "CLARIN-DK Tool Chain: Computes segmentation with tokenization (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes segmentation with tokenization. The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-tokensegment"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Segmentation",
      "name": "CLARIN-DK Tool Chain: Computes segmentation with tokenization (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes segmentation with tokenization. The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-tokensegment"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Segmentation",
      "name": "CLARIN-DK Tool Chain: Computes segmentation with tokenization and BRILL POS-Tagging (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes segmentation with tokenization and BRILL POS-Tagging . The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["dan"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip",
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "da-tokensegmentPOS"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },

    { "task": "Segmentation",
      "name": "CLARIN-DK Tool Chain: Computes segmentation with tokenization and BRILL POS-Tagging (web service)",
      "softwareType": "webService",
      "requestType": "get",	  
      "logo": "clarindk.jpg",		  
      "homepage": "https://clarin.dk/clarindk/toolchains-wizard.jsp",
      "location": "Copenhagen, Denmark",		  	  	  
      "creators": "Bart Jongejan",
      "contact": {
	  "person": "Bart Jongejan",
	  "email": "bartj@hum.ku.dk",
      },
      "version": "unknown",
      "licence": "public",                
      "authentication": "no",
      "description": "Computes segmentation with tokenization and BRILL POS-Tagging . The web service returns a zip file containing original input and the results of all analyses.",
      "languages": ["eng"],
      "langEncoding": "639-1",
      "mimetypes": [
	  "text/plain"
	  , "application/rtf"		      
	  , "application/pdf"
      ],
      "output": "application/zip", 		  		  		  
      "url": "https://clarin.dk/toolchains/run",
      "parameters": { 
	  "input"    : "self.linkToResource",
	  "type"     : "let rtnValue = 'flat'; switch(mimetype) { case 'text/plain' : rtnValue = 'flat'; break; case 'application/pdf' : rtnValue = 'pdf'; break; case 'application/rtf' : rtnValue = 'doc'; break; default: rtnValue = 'flat'; } return rtnValue;",
	  "workflow" : "en-tokensegmentPOS"
      },
      "mapping": {
	  "input"    : "URL",
	  "type"     : "Iformat",
      }
    },


    { "task": "Sentiment Analysis",
      "name": "Concraft -> Sentipejd",
      "logo": "zil.png",		  		  		  
      "homepage": "http://iis.ipipan.waw.pl/2008/proceedings/iis08-20.pdf",
      "location": "Warsaw, Poland",		  		  		  
      "creators": "Institute of Computer Science, Polish Academy of Sciences, Poland",
      "contact": {
	  "person": "MultiService",
	  "email": "rjawor@amu.edu.pl"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": " A morphosyntactic tagger extended with a semantic category, expressing properties of positive or negative  sentiment. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
      "languages": ["pol"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "text/html"],
      "output": ["application/json", "CoNLL format", "Visualization"],
      "url": "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "analysis":   "3"
      }
    },
    
    { "task": "Shallow Parsing",
      "name": "Concraft->Spejd",
      "logo": "zil.png",		  		  		  
      "homepage": "http://zil.ipipan.waw.pl/Spejd",
      "location": "Warsaw, Poland",		  		  		  
      "creators": "Institute of Computer Science, Polish Academy of Sciences, Poland",
      "contact": {
	  "person": "MultiService",
	  "email": "rjawor@amu.edu.pl"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Tool for partial parsing and rule-based morphosyntactic disambiguation. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
      "languages": ["pol"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "text/html"],
      "output": ["application/json", "CoNLL format", "Visualization"],      
      "url": "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "analysis":   "1"
      }
    },		
    
    {
	"task": "Shallow Parsing",
	"name": "Spejd",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "Spejd - a partial, shallow parser for Polish with rule-based morphosyntactic disambiguation.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
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
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    
	"description": "Recognition of spatial expressions in Polish texts.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/json"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "spatial"
	}
    },


    { "task": "Spelling correction",
      "name": "Valkuil (plain text)",
      "logo": "valkuil.jpg",		  
      "homepage": "http://valkuil.net",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public", 
      "description": "Valkuil is a Dutch spelling correction system.",
      "languages": ["nld"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/plain"], 
      "output": ["text/folia+xml"], 		  
      "url": "https://webservices-lst.science.ru.nl/valkuil/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "textinput_url"
      }
    },
    
    { "task": "Spelling correction",
      "name": "Valkuil (folia+xml)",
      "logo": "valkuil.jpg",		  		  
      "homepage": "https://languagemachines.github.io/Valkuil/",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public",       
      "description": "Valkuil is a Dutch spelling correction system.",
      "languages": ["nld"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/folia+xml"],
      "output": ["text/folia+xml"], 
      "url": "https://webservices-lst.science.ru.nl/valkuil/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "foliainput_url"
      }
    },
    
    { "task": "Spelling correction",
      "name": "Fowlt (plain text)",
      "logo": "fowlt.jpg",		  
      "homepage": "http://fowlt.net",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public",
      "description": "Fowlt is an online, free-to-use context-sensitive English spelling checker. It follows the setup of the Dutch spelling checker Valkuil.net. Both Valkuil and Fowlt are unlike the typical spelling checkers: whereas the latter mostly try to find errors by comparing all words to a built-in dictionary and flag the word as an error if they can't find a match, Fowlt is context sensitive, taking into account the words around every word. Fowlt makes use of language models. These models are created by giving lots of texts to machine learning software (TiMBL and WOPR).",
      "languages": ["eng"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/plain"],
      "output": ["text/folia+xml"], 
      "url": "https://webservices-lst.science.ru.nl/fowlt/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "textinput_url"
      }
    },

    { "task": "Spelling correction",
      "name": "Fowlt (xml+folia)",
      "logo": "fowlt.jpg",		  
      "homepage": "http://fowlt.net",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public",
      "description": "Fowlt is an online, free-to-use context-sensitive English spelling checker. It follows the setup of the Dutch spelling checker Valkuil.net. Both Valkuil and Fowlt are unlike the typical spelling checkers: whereas the latter mostly try to find errors by comparing all words to a built-in dictionary and flag the word as an error if they can't find a match, Fowlt is context sensitive, taking into account the words around every word. Fowlt makes use of language models. These models are created by giving lots of texts to machine learning software (TiMBL and WOPR).",
      "languages": ["eng"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/folia+xml"],
      "output": ["text/folia+xml"], 
      "url": "https://webservices-lst.science.ru.nl/fowlt/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "foliainput_url"
      }
    },
    
    {
	"task": "Morpho-syntactic tagger",
	"name": "morphoDiTa",
	"logo": "clarin-pl.png",	
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": ["Clarin-PL"],
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"authentication": "no",
	"licence": "public",
	"description": "Morphological dictionary and tagger for the analysis of natural language texts in Polish.",
	"languages": ["pol"],
	"lang_encoding": "639-1",
	"mimetypes": ["text/plain",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		      "application/vnd.oasis.opendocument.text",
		      "application/pdf",
		      "text/html",
		      "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"pid": "",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "morphoDiTa"
	}
    },
    
    {
	"task": "Tagger",
	"name": "Tagger NLTK",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "Morpho-syntactic tagger for English texts.",
	"languages": ["eng"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain",
		      "application/msword",
		      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
		      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		      "application/vnd.oasis.opendocument.text",
		      "application/pdf",
		      "text/html",
		      "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "en",
	    "analysis": "tagerNLTK"
	}
    },
    
    { "task": "Text Analytics",
      "name": "Voyant Tools",
      "logo": "voyant-tools.jpg",		  
      "homepage": "http://voyant-tools.org",
      "location": "Canada (Quebec)",		  
      "creators": "Stéfan Sinclair (McGill Alberta) and Geoffrey Rockwell (U Alberta)",
      "contact": {
	  "person": "Unknown Person",
	  "email": "Unknown email",
      },
      "version": "v2.1",
      "authentication": "no",		  
      "licence": "public", //but webservice is protected with (free) registration
      "description": "Use it to learn how computers-assisted analysis works. Check out our examples that show you how to do real academic tasks with Voyant. Use it to study texts that you find on the web or texts that you have carefully edited and have on your computer. Use it to add functionality to your online collections, journals, blogs or web sites so others can see through your texts with analytical tools. Use it to add interactive evidence to your essays that you publish online. Add interactive panels right into your research essays (if they can be published online) so your readers can recapitulate your results. Use it to develop your own tools using our functionality and code.",
      // virtually any language
      "languages": ["eng", "deu", "spa", "nld", "fra", "generic"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
		    "text/tei+xml;format-variant=tei-dta"
		   ], 
      "output": ["none"], 
      "url": "http://voyant-tools.org/",
      "parameters": { 
	  "input"        : "self.linkToResource"
      }
    },

    // TO BE INTEGRATED (Tomasz)
    {   "task": "Text Analytics",
	"name": "WebSty",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "Similarity and clustering of texts in Polish. The tools used include: Morfeusz 2 with SGJP dictionary (for morphological analysis), wcrft2 (for tagging), Liner2 (for named entities recognition), Fextor (for extraction of feaures from texts); Cluto (for clustering), result visualisation: D3.js, D3-tip.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["application/zip"],
	"output": ["application/octet-stream"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "websty",
	    "batch": "true"
	}
    },

    {
	"task": "Text Summarization",
	"name": "SUMMA Text Summarization - GATE Cloud (web service)",
	"softwareType": "webService",
	"requestType": "post",
	"logo": "gateCloud.png",		  
	"homepage": "https://cloud.gate.ac.uk/shopfront/sampleServices",
	"location": "Sheffield, UK",
	"creators": "GATE developers",
	"contact": {
	    "person": "The GATE Cloud developers",
	    "email": "Plase fill out the web form at https://cloud.gate.ac.uk/contact/email",
	},
	"version": "unknown",
	"authentication": "no",		  
	"licence": "Please go to the GATE Cloud web page", 
	"description":  "The SUMMA Text Summarization (EN) uses the SUMMA toolkit developed by Horacio Saggion to provide a generic English document summarizer. This specific pipeline uses Part-of-Speech and TF.IDF scoring to produce the summary. THIS IS AN EXPERIMENTAL INTEGRATION. Note that the service is also available at https://cloud.gate.ac.uk/shopfront/sampleServices, offering a nice visualization of the processing.",
	"langEncoding": "639-1",
	"languages": ["eng"],
	"mimetypes": ["text/plain"],
	"url": "https://cloud-api.gate.ac.uk/process-document/summa-EN-summarization-pipeline",
	"parameters": {
	    "input"   : "self.linkToResource"
	},		  
	"mapping": {
	    "input"   : "data"
	},
    },
    
    {
	"task": "Text Summarization",
	"name": "Summarize",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "Automated word graph based summarisation of Polish texts.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/octet-stream"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
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
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    	    
	"description": "TF, IDF, TF-IDF calculation.",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["text/csv"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
	    "input": "self.linkToResource",
	    "lang": "pl",
	    "analysis": "tfidf"
	}
    },
    { "task": "Tokenisation",
      "name": "Ucto",
      "logo": "YourLogoComesHere.png",		  
      "homepage": "https://languagemachines.github.io/ucto/",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "0.8.3",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public",      
      "description": "Ucto is a unicode-compliant tokeniser. It takes input in the form of one or more untokenised texts, and subsequently tokenises them. Several languages are supported, but the software is extensible to other languages.",
      "languages": ["swe", "rus", "spa", "por", "nld", "eng", "deu", "fra", "ita"],
      "langEncoding": "639-3",
      "mimetypes": [
	  "text/plain"
	  // , "application/xml",		      
	  // , "application/pdf",
	  // , "application/msword"
      ],
      "output": ["Tadpole Columned Output Format", "text/folia+xml"], 		  		  		  
      "url": "https://webservices-lst.science.ru.nl/ucto/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource",
	  "lang"         : "self.linkToResourceLanguage",
      },
      "mapping":   {
	  "input"        : "untokinput_url",
	  "lang"         : "untokinput_language"
      }
    },

    { "task": "Tokenisation",
      "name": "ILC Tokenizer (web service)",
      "softwareType": "webService",
      //"softwareType": "browserBased",
      "requestType": "get",	  
      "logo": "YourLogoComesHere.png", // Fix this
      "homepage": "http://ilc4clarin.ilc.cnr.it/services/ltfw/readme",
      "location": "Pisa, Italiy",
      "creators": "Ricardo del Gratta",
      "contact": {
	  "person": "Riccardo Del Gratta",
	  "email": "riccardo.delgratta@gmail.com",
      },
      "version": "unknown",
      "authentication": "no",		  
      "licence": "unknown.", 
      "description": "This is the ILC tokenizer (web service) for Italian, French, German, English, Spanish und Dutch.",
      "langEncoding": "639-3",
      "languages": ["ita", "fra", "deu", "eng", "spa", "nld"],
      "mimetypes": ["text/plain"],
      "url": "http://ilc4clarin.ilc.cnr.it/services/ltfw/wl/tokenizer/lrs",
      "parameters": {
	  "input"   : "self.linkToResource", 
	  "lang"    : "self.linkToResourceLanguage",
      },		  
      "mapping": {
	  "input"   : "url",
	  "lang"    : "lang" // fix this!
      },
    },
    
    { "task": "Tokenisation",
      "name": "WebLicht-Tokenization-TUR",
      "logo": "weblicht.jpg",		  
      "homepage": "https://weblicht.sfs.uni-tuebingen.de/weblichtwiki/index.php/Main_Page",
      "location": "Tuebingen, Germany",		  		  		  
      "creators": "CLARIN-D Centre at the University of Tuebingen, Germany",
      "contact": {
	  "person": "CLARIN WebLicht Support",
	  "email": "wlsupport@sfs.uni-tuebingen.de"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "WebLicht Easy Chain for tokenization of Turkish texts. The pipeline makes use of WebLicht's TCF converter, and the tokenizer from the OpenNLP project. The 'newlineBounds' parameter treats newlines as a hard break (a sentence boundary). WebLicht's built-in viewer for annotations can be used to visualize the processing result.",
      "languages": ["tur"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "application/rtf",			     
		    "application/pdf",
		    "application/msword",
		    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
		   ],
      "output": ["application/tcf+xml"],
      "url": "https://weblicht.sfs.uni-tuebingen.de/weblicht-switchboard/",		        
      "parameters": {
	  "input"   :  "self.linkToResource", 
	  "lang"    : "tr",                   
	  "analysis": "token"                    
      }
    },

    
    // { "task": "Voice Synthesis",
    //   "name": "CLARIN-DK Tool Box (espeak)",
    //   "logo": "clarindk.jpg",		  
    //   "homepage": "https://clarin.dk/clarindk/forside.jsp",
    //   "location": "Copenhagen, Denmark (CLAM Webservices)",
    //   "creators": "Bart Jongejan et al.",
    //   "contact": {
    //       "person": "Bart Jongejan",
    //       "email": "bartj@hum.ku.dk",
    //   },
    //   "version": "0.8.3",
    //   "licence": "public",
    //   "authentication": "no",		  
    //   "description":  "Text to speech software. History. Originally known as speak and originally written for Acorn/RISC_OS computers starting in 1995. This version is an enhancement and re-write, including a relaxation of the original memory and processing power constraints, and with support for additional languages.",
    //   "langEncoding": "639-1",
    //   "languages": ["afr", "bul", "bos", "cat", "ces", "cym", "dan", "ell", "eng", "epo", "spa", "est", "fin", "fas", "fra", 
    // 	      "hin", "hrv", "hun", "hye", "ind", "isl", "ita", "kat", "kan", "kur", "lat", "lav", "mkd", "mlg", "nld",
    // 	      "pol", "por", "ron", "rus", "slk", "sqi", "srp", "swe", "swa", "tam", "tur", "ukr", "vie", "zho"],
    //   "mimetypes": [  "text/plain",
    // 		"application/pdf" // may add other mimetypes
    // 	     ],
    //   "url": ["http://cst.dk:8080/tools/createByGoalChoice"], 
    //   "parameters": {  input   : "self.linkToResource", 
    // 		lang    : "self.linkToResourceLanguage",                 
    // 		"analysis": "voiceSynthesis",
    // 		UIlanguage: "en"				
    // 	     },

    //   "mapping":   { input        : "URL",
    // 	       lang         : "language"
    // 	     }		  
    // },



    // { "task": "OCR Engine",
    //   "name": "CLARIN-DK Tool Box (Tesseract | CuneiForm)",
    //   "logo": "clarindk.jpg",		  		  
    //   "homepage": "https://clarin.dk/clarindk/forside.jsp",		  		  
    //   "location": "Copenhagen, Denmark (CLAM Webservices)",
    //   "creators": "Bart Jongejan et al.",
    //   "contact": {
    //       "person": "Bart Jongejan",
    //       "email": "bartj@hum.ku.dk",
    //   },
    //   "version": "0.8.3",
    //   "licence": "public",
    //   "authentication": "no",		  
    //   "description":  "CLARIN-DK Tool Box (Tesseract | CuneiForm). Tesseract is probably the most accurate open source OCR engine available. Combined with the Leptonica Image Processing Library it can read a wide variety of image formats and convert them to text in over 60 languages. It was one of the top 3 engines in the 1995 UNLV Accuracy test. Between 1995 and 2006 it had little work done on it, but since then it has been improved extensively by Google. It is released under the Apache Licence 2.0. Note that the CLARIN-DL Tool Box GUI gives you also access to the Russian CuneiForm system.",
    //   "langEncoding": "639-1",		  "languages": ["dan","eng","generic"],
    //   "mimetypes": [
    //       "image/gif", 
    //       "image/jpeg", 
    //       "image/png", 
    //       "image/tiff", 
    //   ],
    //   "url": ["http://cst.dk:8080/tools/createByGoalChoice"], 
    //   "parameters": {  input   : "self.linkToResource", 
    // 		lang    : "self.linkToResourceLanguage",                 
    // 		"analysis": "txt",
    // 		UIlanguage: "en"				
    // 	     },
    //   "mapping":   { input        : "URL",
    // 	       lang         : "language"
    // 	     }		  
    // },		


    { "task": "Text Analytics",
      "name": "T-scan",
      "logo": "tscan.jpg",		  
      "homepage": "https://github.com/proycon/tscan",
      "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
      "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
      "contact": {
	  "person": "Maarten van Gompel",
	  "email": "proycon@anaproy.nl",
      },
      "version": "x.y.z",
      "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
      "licence": "public",
      "description": "T-Scan is a new tool for analyzing Dutch text. It aims at extracting text features that are theoretically interesting, in that they relate to genre and text complexity, as well as practically interesting, in that they enable users and text producers to make text-specific diagnoses. T-Scan derives it features from tools such as Frog and Alpino, and resources such as SoNaR, SUBTLEX-NL and Referentie Bestand Nederlands.",
      "languages": ["nld"], 
      "langEncoding": "639-1",
      "mimetypes": ["text/plain"],
      // todo: just say csv
      "output": ["text/folia+xml", "xsl", "text/csv"
		 // "word-csv", "sen-csv", "par-csv", "doc-csv",
		 // "total-word-csv", "total-sen-csv", "total-par-csv", "total-doc-csv"
		],
      "url": "https://webservices-lst.science.ru.nl/tscan/",
      "parameters": {
	  "project"      : "new",
	  "input"        : "self.linkToResource"
      },
      "mapping":   {
	  "input"        : "textinput_url" 
      }
    },

    // NEEDS MOR TESTING BEFORE INCLUSION
    
    // { "task": "OCR Engine",
    //   "name": "PICCL",
    //   "logo": "tscan.jpg",		  
    //   "homepage": "https://webservices-lst.science.ru.nl/piccl/info/",
    //   "location": "Nijmegen, The Netherlands (CLAM Webservices)",		  
    //   "creators": "Maarten van Gompel, Ko van der Sloot (CLST, Radboud University Nijmegen)",
    //   "contact": {
    // 	  "person": "Maarten van Gompel",
    // 	  "email": "proycon@anaproy.nl",
    //   },
    //   "version": "Early version",
    //   "authentication": "Yes. Before tool use, please register at https://webservices-lst.science.ru.nl/register.",
    //   "licence": "public",
    //   "description": "An OCR (Tesseract) and OCR post-correction pipeline (TICCL).",
    //   "languages": ["nld"], 
    //   "langEncoding": "639-1",
    //   "mimetypes": ["application/pdf"],
    //   // todo: just say csv
    //   "output": ["text/folia+xml"],
    //   "url": "https://webservices-lst.science.ru.nl/piccl/",
    //   "parameters": {
    // 	  "project"      : "new",
    // 	  "input"        : "self.linkToResource"
    //   },
    //   "mapping":   {
    // 	  "input"        : "pdftext_url" 
    //   }
    // },    

    {
	"task": "Text Enhancement",
	"name": "Apache Stanbol Enhancer",
	"logo": "acdh.png",		  		
	"homepage": "https://stanbol.apache.org",
	"homepage": "http://www.oeaw.ac.at/acdh",
	"location": "Vienna, Austria",		    
	"creators": "Apache Foundation (software), Austrian Center of Digital Humanities (enhancement chains and configuration)",
	"contact": {
	    "person": "Matej Durco",
	    "email": "acdh-tech@oeaw.ac.at <mailto:acdh-tech@oeaw.ac.at>"
	},
	"version": "v1.0",
	"authentification": "no",		
	"licence": "public",
	"description": "This is a stateless interface to allow clients to submit content to analyze by the EnhancementEngines and get the resulting RDF enhancements at once without storing anything on the server-side.",
	"languages": ["eng"],
	"langEncoding": "639-1",		
	"mimetypes": ["text/plain"],
	"output": ["application/json"],
	"url": "https://enrich-lrs.acdh.oeaw.ac.at/StanbolWrapper",		
	"parameters": {
	    "input"     : "self.linkToResource",
	    "outFormat" : "application%2Fjson"
	},
	"mapping":   {
	    "input"     : "resourceUri" 
	}
    },

    { "task": "Text Summarization",
      "name": "Concraft -> Bartek -> NicolasSummarizer",
      "logo": "zil.png",		  		  		  
      "homepage": "http://zil.ipipan.waw.pl/Nicolas",
      "location": "Warsaw, Poland",		  		  		  
      "creators": "Institute of Computer Science, Polish Academy of Sciences, Poland",
      "contact": {
	  "person": "MultiService",
	  "email": "rjawor@amu.edu.pl"
      },	    
      "version": "v1.0",
      "authentication": "no",		  
      "licence": "public",
      "description": "Java coreference-based summarization tool; its creation was cofunded by the European Union from resources of the European Social Fund -- Project PO KL 'Information technologies: Research and their interdisciplinary applications'. Part of: Multiservice, a robust  linguistic  Web service for Polish.",
      "languages": ["pol"],
      "langEncoding": "639-1",		  
      "mimetypes": ["text/plain",
		    "text/html"],
      "output": ["application/json", "CoNLL format", "Visualization"],      
      "url": "http://multiservice.nlp.ipipan.waw.pl/en/clrs",		  
      "parameters": {
	  "input" :     "self.linkToResource",
	  "analysis":   "6"
      }
    },
    
    // seems like BAS only offers German voice(s) of Mary. @ Jul 25, website mary.dfki.de not working.
    {
	"task": "Voice Synthesis",
	"name": "Mary TTS (web service)",
	"logo": "mary.jpg",
	"softwareType": "webService",
	"requestType": "form-data (input key must have file value)",		  	
	"homepage": "http://mary.dfki.de",
	"location": "BAS, Muenchen",
	"creators": "Marc Schröder et al.",
	"contact": {
	    "person": "Marc Schroeder",
	    "email": "",
	},
	"version": "> 5.1",
	"licence": "public",
	"authentication": "no",		  
	"description":  "MaryTTS is an open-source, multilingual Text-to-Speech Synthesis platform written in Java. It was originally developed as a collaborative project of DFKI’s Language Technology Lab and the Institute of Phonetics at Saarland University. It is now maintained by the Multimodal Speech Processing Group in the Cluster of Excellence MMCI and DFKI.",
	"langEncoding": "639-1",
	"languages": ["deu"],
	"mimetypes": [
	    "text/plain"
	],
	"url": "https://clarin.phonetik.uni-muenchen.de/BASWebServices/services/runTTSFile", 
	"parameters": {
	    "input"   : "self.linkToResource", 
	    "AUDIO"   : "WAVE_FILE",
	    "INPUT_TYPE" : "TEXT",
	    "VOICE" : "bits1unitselautolabel",
	    "OUTPUT_TYPE" : "AUDIO"
	},
	
	"mapping":   {
	    "input" : "INPUT_TEXT",
	}		  
    },
    

    {
	"task": "Word sense disambiguation",
	"name": "WoSeDon",
	"logo": "clarin-pl.png",
	"homepage": "http://ws.clarin-pl.eu",
	"location": "Wrocław, Poland",
	"creators": "Clarin-PL",
	"contact": {
	    "person": "Tomasz Walkowiak",
	    "email": "tomasz.walkowiak@pwr.edu.pl"
	},
	"version": "1.0",
	"licence": "public",
	"authentication": "no",	    
	"description": "Word Sense Disambiguation for Polish texts based on plWordNet - the Polish wordnet (weakly supervised, for all words).",
	"languages": ["pol"],
	"langEncoding": "639-1",
	"mimetypes": ["text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.oasis.opendocument.text", "application/pdf", "text/html", "application/rtf"],
	"output": ["application/xml"],
	"url": "http://ws.clarin-pl.eu/weblicht.html",
	"parameters": {
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
