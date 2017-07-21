import React from 'react';
// import ReactTooltip from 'react-tooltip';
import Accordion from '../helperComponents/Accordion';         
import AccordionItem from '../helperComponents/AccordionItem';

import { map639_1_to_639_3, map639_3_to_639_1 } from '../back-end/util';
import {constructToolURL, invokeWebService, invokeBrowserBasedTool} from '../back-end/ToolInvoker';


export default class Tool extends React.Component {
    constructor(props) {
	super(props);
	this.invokeTool = this.invokeTool.bind(this);
    }

    invokeTool( URL ) {
	if (URL.toolType == "webService") {
	    _paq.push(["trackEvent", 'ToolInvocation', URL.url]);	    // inform Piwik
	    invokeWebService(URL);
	} else {
	    _paq.push(["trackEvent", 'WebServiceInvocation', URL.url]); // inform Piwik
	    invokeBrowserBasedTool( URL );
	}
    }
    
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
	    const fullURL = constructToolURL(props, resource);

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
		    <button onClick={this.invokeTool.bind(this,summary)} > Click to start tool </button>		    
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


}
