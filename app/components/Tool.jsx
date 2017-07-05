import React from 'react';
// import ReactTooltip from 'react-tooltip';
import Accordion from '../helperComponents/Accordion';         
import AccordionItem from '../helperComponents/AccordionItem';

import { map639_1_to_639_3, map639_3_to_639_1 } from '../libs/util';
import Request from 'superagent';

// import PiwikReactRouter from 'piwik-react-router';


export default class Tool extends React.Component {
    constructor(props) {
	super(props);
	this.invokeSoftware = this.invokeSoftware.bind(this);
	this.invokeWebService = this.invokeWebService.bind(this);	
	this.constructToolURL = this.constructToolURL.bind(this);
    }

    // componentDidMount() {
    // 	this.piwik = PiwikReactRouter({
    // 	    url	: 'https://stats.clarin.eu',
    // 	    siteId	: 21,
    // 	    enableLinkTracking: true
    //     });
    // }
    
    render() {
	const {items, resource, ...props} = this.props;

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
	    const fullURL = this.constructToolURL(props, resource);

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
	                    title="Authentication"
       	                    summary={props.authentication}
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
	                    title="Authentication"
       	                    summary={props.authentication}
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
			 authentication={element.authentication}
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

    constructToolURL( item, resource ) {

	    
	// the location for the server holding temporarily the resources
	// var fileServerURL = "http://shannon.sfs.uni-tuebingen.de:8011/";
	// var fileServerURL = "http://localhost:8011/";
	
	var fileServerURL = "http://ws1-clarind.esc.rzg.mpg.de/drop-off/storage/";	
        var rtnValue = { };	

	// if there is no resource in the spotlight, we return an empty URL object.
	if (resource == undefined) {
	    console.log('Tool.jsx: there is no resource defined.', item);
	    return false;
	}

	console.log('Tool.jsx/constructToolURL item:', item, 'resource:', resource);
	
	// central service to retrieve language resource, may need to chech cross-site scripting issue
	var filename =  resource.name;
	var filenameWithDate =  resource.filenameWithDate;	
	var file     =  resource.file;
	var language =  resource.language;
	var upload   =  resource.upload;
	var lang_encoding = item.lang_encoding;
	var softwareType = item.softwareType;
	var postSubmit = item.postSubmit;


	if (upload == "dnd") {
	} else if ( (upload == "VLO") || (upload == "VCR") || (upload == "FCS") || (upload == "B2DROP") ){
	    fileServerURL = "";
	} else {
	    console.log("ERROR in upload info (Tool.jsx)", upload);
	}

	if (softwareType == "webService") {
	    // console.log('we have a webService', item);
	} else {
	    // console.log('we have a browserBased software', item);	    
	}
	
	if (lang_encoding == "639-1") {
	    language = map639_3_to_639_1(language);
	} // else {
	//     language = map639_1_to_639_3(language);
	// }
    
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

    // book-keeping. Think of Piwik type information gathering
    invokeSoftware( URL ) {

	console.log('invokeSoftware', URL);
	if (URL.toolType == "webService") {
	    this.invokeWebService(URL);
	} else {
	    // inform Piwik
	    console.log('why does piwik reference _paq persist:', _paq);
	    _paq.push(["trackEvent", 'ToolInvocation', URL.url]);	    
	    var win = window.open(URL.url, '_blank');
	    win.focus();
	}
    }

    invokeWebService( URL ) {

	// inform Piwik
	_paq.push(["trackEvent", 'WebServiceInvocation', URL.url]);

	let file = URL.formVal;
	if (URL.postSubmit == "data") {
	    Request
		.post(URL.url)
//		.set('Content-Type', 'text/plain')
		.send(file)
		.end((err, res) => {
		    if (err) {
			console.log('Tool.jsx/invokeWebService: error in calling webservice', err, file.name, URL);
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
//		.set('Content-Type', 'text/plain')	    
		.end((err, res) => {
		    if (err) {
			console.log('Tool.jsx/invokeWebService: error in calling webservice', err, file.name, data, URL);
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
