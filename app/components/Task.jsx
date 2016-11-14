import React from 'react';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
// import ReactTooltip from 'react-tooltip';
import Accordion from '../helperComponents/Accordion';         
import AccordionItem from '../helperComponents/AccordionItem';

import Request from 'superagent';

export default class Task extends React.Component {
    constructor(props) {
	super(props);
	this.invokeSoftware = this.invokeSoftware.bind(this);
	this.invokeWebService = this.invokeWebService.bind(this);	
	this.gotoHome = this.gotoHome.bind(this);	
	this.constructToolURL = this.constructToolURL.bind(this);
    }

    render() {
	const {items, lane, ...props} = this.props;

	const styles = {
	    cardHeader: {
		display: 'flex',
		height: '100px',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '10px 20px',
		color: '#000',
	    },
	    headerName: {
		margin: 0,
		fontWeight: 500,
		fontSize: '12px',
		textAlign: 'right'
	    },
	    headerTitle: {
		margin: '2px 0 0',
		fontWeight: 500,
		fontSize: '12px',
   	        opacity: 0.8,
		color: '#000',	    
		textAlign: 'right'
	    }
	};

	const ProfilePicture = ({ imgSrc, borderColor }) => (
	<img
		style={{
			width: '60px',
			height: '60px',
			borderRadius: '100%',
			border: `3px solid ${borderColor}`
		}}
		src={imgSrc}
	/>
	);

	const ToolCard = (props) => {
	    const fullURL = this.constructToolURL(props, lane);

	    if (fullURL) 
	    return(
             <div style={{ position: 'relative', top: 0 }}>
		  <header style={styles.cardHeader} className='card-header-details'>
			<ProfilePicture imgSrc={props.imgSrc} borderColor={props.imgBorderColor} />
		</header>

		<div style={{color: '#000'}}>
			<DetailsRow
	                    icon='icon ion-ios-paper-outline'
			    title="Description"
       	                    summary={props.role}	    
                        />
    
			<DetailsRow
			    icon='ion-ios-home-outline'
	                    title="Home"
       	                    summary={props.homepage}
                        />

			<DetailsRow
			    icon='ion-ios-locked-outline'
	                    title="Authentification"
       	                    summary={props.authentification}
                        />		

			<DetailsRow
			    icon='ion-ios-paperplane-outline'
	                    title="URL"
       	                    summary={fullURL}
                        />
		
                        <DetailsRow
				icon='ion-ios-location-outline'
	                        title="Location"
	                        summary={props.location}
	                />
    
                        <DetailsRow
				icon='ion-ios-email-outline'
				title="e-mail"
				summary={props.email}	    
			/>

		</div>
		</div>
	    )

	    return (
		             <div style={{ position: 'relative', top: 0 }}>
		  <header style={styles.cardHeader} className='card-header-details'>
			<ProfilePicture imgSrc={props.imgSrc} borderColor={props.imgBorderColor} />
		</header>

		<div style={{color: '#000'}}>
			<DetailsRow
	                    icon='icon ion-ios-paper-outline'
			    title="Description"
       	                    summary={props.role}	    
                        />
    
			<DetailsRow
			    icon='ion-ios-home-outline'
	                    title="Home"
       	                    summary={props.homepage}
                        />

			<DetailsRow
			    icon='ion-ios-locked-outline'
	                    title="Authentification"
       	                    summary={props.authentification}
                        />		

                        <DetailsRow
				icon='ion-ios-location-outline'
	                        title="Location"
	                        summary={props.location}
	                />
    
                        <DetailsRow
				icon='ion-ios-email-outline'
				title="e-mail"
				summary={props.email}	    
			/>

		</div>
		</div>
	    )
	};

	const DetailsRow = ({ icon, title, summary }) => {
	    const styles = {
		row: {
			width: '100%',
			padding: '20 20px',
			display: 'flex',
			alignItems: 'center',
			margin: '-10px 0'
		},
		icon: {
			display: 'block',
			width: '30px',
			height: '30px',
			margin: '0px 20px 0 0',
			textAlign: 'center',
			fontSize: '24px'
		},
		title: {
			fontWeight: 500,
			fontSize: '12px',
			margin: 0,
			fontStyle: 'italic'
		}
	    };
	    
	    const renderSummary = () => {
		if ((title == "URL") && ( summary.url )) return (
		    <p style={{ fontWeight: 100, fontSize: '16px', lineHeight: 1.5 }}>
		    <button onClick={this.invokeSoftware.bind(this,summary)} > Click to start tool </button>		    
		    </p>
		);

		if ((title == "Home") && (summary) ) return (
		    <p style={{ fontWeight: 100, fontSize: '16px', lineHeight: 1.5 }}>
			<a href={summary} target="_blank"> {summary }</a> 
		    </p>
		);
		
		if(summary) return (
			<p style={{ fontWeight: 100, fontSize: '16px', lineHeight: 1.4 }} >
				{summary}
			</p>
		);
		return null;
	    };

	    return (
		<div style={styles.row}>
		<span className={`icon ${icon}`}
			style={Object.assign({}, styles.icon, {alignSelf: 'flex-start'})}></span>
			<div style={{ width: '100%' }}>
				{renderSummary()}
			</div>
		</div>
	    );
	};

	console.log('Task.jsx/items', items, 'lane:', lane);
	return (
	    <Accordion allowMultiple={true}>
	    { items.map( (element) => 
		<AccordionItem title={element.name} key={element.id} >
		  <ToolCard key={element.name}
			 imgSrc={element.logo}
			 imgBorderColor='#6A067A'
			 name={element.name}
			 title={element.name}
			 softwareType={element.softwareType}
			 postSubmit={element.postSubmit}
			 location={element.location}
			 authentification={element.authentification}
			 homepage={element.homepage}
                         url={element.url}
		         parameter={element.parameter}
		         mapping={element.mapping}
		         lang_encoding={element.lang_encoding}		
			 email={element.email}
			 role={element.longDescription}
			/>			
		</AccordionItem>
	    )}
	    </Accordion> 	    
	)}

    constructToolURL( item, lane ) {

	// todo  outsource to external module
	const langEncodingMap = {
	    "generic" : "generic",
	    
	    "af" : "afr",
	    "sq" : "sqi",
	    "hy" : "hye",
	    "bs" : "bos",
	    "bg" : "bul",
	    "ca" : "cat",
	    "cs" : "ces",
	    "zh" : "zho",
	    "hr" : "hrv",
	    "eo" : "epo",
	    "et" : "est",
	    "ka" : "kat",
	    "hi" : "hin",
	    "hu" : "hun",
	    "is" : "isl",
	    "id" : "ind",
	    "ja" : "jpn",
	    "kn" : "kan",
	    "ku" : "kur",
	    "lv" : "lav",
	    "mk" : "mkd",
	    "ml" : "mlg",
	    "pl" : "pol",
	    "fa" : "fas",
	    "ro" : "ron",
	    "sk" : "slk",
	    "sl" : "slv",
	    "sr" : "srp",
	    "sw" : "swa",
	    "ta" : "tam",
	    "vi" : "vie",
	    "cy" : "cym",
	    "uk" : "ukr",
	    "de" : "deu",
	    "en" : "eng",
	    "da" : "dan",
	    "nl" : "nld",
	    "fr" : "fra",
	    "it" : "ita",
	    "es" : "spa",
	    "pt" : "por",
	    "tk" : "tur",
	    "ru" : "rus",
	    "sv" : "swe",
	    "fy" : "fry"
	}
	
	const map639_1_to_639_3 = function( key ) {
	    return langEncodingMap[key];
	}

	const map639_3_to_639_1 = function( value ) {
	    for (var key in langEncodingMap) {
		if (langEncodingMap[key] == value) {
		    return key;
		}
	    }
	
	    return null;
	}
	    
	// the location for the server holding temporarily the resources
	// var fileServerURL = "http://shannon.sfs.uni-tuebingen.de:8011/";
	// var fileServerURL = "http://localhost:8011/";
	
	var fileServerURL = "http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/";	
        var rtnValue = { };	

	// if there is no resource in the spotlight, we return an empty URL object.
	if (lane == undefined) {
	    console.log('Task.jsx: there is no lane defined.', item);
	    return false;
	}

	console.log('Task.jsx/constructToolURL item:', item, 'lane:', lane);
	
	// central service to retrieve language resource, may need to chech cross-site scripting issue
	var filename =  lane.name;
	var filenameWithDate =  lane.filenameWithDate;	
	var file     =  lane.file;
	var language =  lane.language;
	var upload   =  lane.upload;
	var lang_encoding = item.lang_encoding;
	var softwareType = item.softwareType;
	var postSubmit = item.postSubmit;


	if (upload == "dnd") {
	    // console.log('the file has been dropped in the demo upload site');
	} else if (upload == "vlo") {
	    console.log('the LRS has been called from the VLO');
	    // no use of temp. server for resource
	    fileServerURL = "";
	} else {
	    console.log("ERROR in upload info (Task.jsx)", upload);
	}

	if (softwareType == "webService") {
	    // console.log('we have a webService', item);
	} else {
	    // console.log('we have a browserBased software', item);	    
	}
	
	if (lang_encoding == "639-1") {
	    language = map639_3_to_639_1(language);
	} else {
	    language = map639_1_to_639_3(language);
	}
    
	var inputFilename = fileServerURL + filename;
	if (upload == "dnd") {
	    inputFilename = fileServerURL + filenameWithDate;
	}

	var parameterString = "";
	var parameters = item.parameter;
	var formParameter = "data";
	
	if ( (item.hasOwnProperty('mapping') && (! (item['mapping'] === undefined )))) {
	    for (var parameter in parameters) {
		if (parameters.hasOwnProperty(parameter)) {
		    if (item.hasOwnProperty('mapping')) {
			var mapping = item['mapping'];
			if (mapping.hasOwnProperty(parameter)) {
			    switch (parameter) {
			    case "input":
				if (softwareType == "webService") {
				    formParameter = mapping[parameter];
				} else {
				    parameterString = parameterString.concat( mapping[parameter]).concat("=").concat( inputFilename );
				}
				break;
			    case "lang":
				parameterString = parameterString.concat( mapping[parameter]).concat("=").concat( language );
				break;
			    default:
				parameterString = parameterString.concat( mapping[parameter]).concat("=").concat(parameters[parameter]);
			    }
			} else {
			    parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
			}
		    } else
			parameterString = parameterString.concat( parameter ).concat("=").concat(parameters[parameter]);
		}
		parameterString = parameterString.concat("&");
	    }
	} else {
	    // use the givens without mapping
	     for (var parameter in parameters) {
		if (parameters.hasOwnProperty(parameter)) {
		    switch (parameter) {
		    case "input":
			if (softwareType == "webService") {
			    formParameter = parameter;
			} else {
			    parameterString = parameterString.concat(parameter).concat("=").concat( inputFilename );
			}
			break;
		    case "lang":
			parameterString = parameterString.concat(parameter).concat("=").concat( language );
			break;
		    default:
			parameterString = parameterString.concat(parameter).concat("=").concat(parameters[parameter]);			
		    }
		    
		    parameterString = parameterString.concat("&");		    
		}
	     }
	}

	// var parameterString = "?input=" + inputFilename + "&lang=" + item.parameter.lang + "&analysis=" + item.parameter.analysis;
	var urlWithParameters = "";
	if (softwareType == "webService") {
	    urlWithParameters = item.url;
	} else {
	    urlWithParameters = item.url + "?" + parameterString;
	}

	//console.log('Task.jsx URL:', urlWithParameters);

	if (softwareType == "webService") {
	    rtnValue =
		{
		    toolType   : "webService",
		    url        : urlWithParameters,
		    formPar    : formParameter,
		    formVal    : file,
		    postSubmit : postSubmit
		};
	} else	{
	    rtnValue = 
	    {
		toolType : "browserBased",
		url      : urlWithParameters
	    };
	}
	
	return rtnValue;
    }

    gotoHome( URL ) {
	console.log('goto Home', URL);
	var win = window.open(URL, '_blank');
	win.focus();
    }
    
    invokeSoftware( URL ) {

	console.log('invokeSoftware', URL);
	if (URL.toolType == "webService") {
	    this.invokeWebService(URL);
	} else {
	    var win = window.open(URL.url, '_blank');
	    win.focus();
	}
    }

    invokeWebService( URL ) {

	let file = URL.formVal;
	
	if (URL.postSubmit == "data") {
	    Request
		.post(URL.url)
		.send(file)
		.end((err, res) => {
		    if (err) {
			console.log('Task.jsx/invokeWebService: error in calling webservice', err, file.name, URL);
			alert('Result of calling web service: ' + err);
		    } else {
			var something = window.open("data:text/json," + encodeURIComponent(res.text), "_blank");
			// something.focus();
			console.log('onDrop: success in calling webservice', res, file.name, data, URL);
		    }
		});
	} else {
	    let data = new FormData();
	    //data.set( URL.formPar, file, file.name);
	    data.append( URL.formPar, file, file.name);
	    Request
		.post(URL.url)
		.send(data)
		.end((err, res) => {
		    if (err) {
			console.log('Task.jsx/invokeWebService: error in calling webservice', err, file.name, data, URL);
			alert('Result of calling web service: ' + err);
		    } else {
			var something = window.open("data:text/json," + encodeURIComponent(res.text), "_blank");
			// something.focus();
			console.log('onDrop: success in calling webservice', res, file.name, data, URL);
		    }
		});
	}
    }
}
