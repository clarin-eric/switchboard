import React from 'react';
import LaneActions from '../actions/LaneActions';
import LaneStore from '../stores/LaneStore';
import ReactTooltip from 'react-tooltip';
import Accordion from '../helperComponents/Accordion';         
import AccordionItem from '../helperComponents/AccordionItem';

export default class Task extends React.Component {
    constructor(props) {
	super(props);
	this.invokeTaskTool = this.invokeTaskTool.bind(this);
	this.constructToolURL = this.constructToolURL.bind(this);
    }
    
    render() {
	const {items, ...props} = this.props;

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
	    const fullURL = this.constructToolURL(props);
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
	};

	const DetailsRow = ({ icon, title, summary }) => {
	    const styles = {
		row: {
			width: '100%',
			padding: '0 20px',
			display: 'flex',
			alignItems: 'center',
			margin: '10px 0'
		},
		icon: {
			display: 'block',
			width: '30px',
			height: '30px',
			margin: '10px 20px 0 0',
			textAlign: 'center',
			fontSize: '32px'
		},
		title: {
			fontWeight: 500,
			fontSize: '16px',
			margin: 0,
			fontStyle: 'italic'
		}
	    };
	    
	    const renderSummary = () => {
		if ((title == "URL") && (summary) ) return (
		    <p style={{ fontWeight: 100, lineHeight: 1.0 }}>
		    <button onClick={this.invokeTaskTool.bind(this,summary)} > Click to start tool </button>		    
		    </p>
		);
		
		if(summary) return (
			<p style={{ fontWeight: 100, lineHeight: 1.0 }}>
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
				imgSrc='http://localhost:8011/weblicht.jpg'
				imgBorderColor='#6A067A'
				name={element.name}
				title={element.name}
				location={element.location}
                                url={element.url}
		                parameter={element.parameter}
				email={element.email}
				role={element.longDescription}
			/>			
		</AccordionItem>
	    )}
	    </Accordion> 	    
	)}

    constructToolURL( item ) {
	// the location for the server holding temporarily the resources
	var nodeServerURL = "http://shannon.sfs.uni-tuebingen.de:8011/";
	// var nodeServerURL = "http://localhost:8011/";	

	var entireState = LaneStore.getState();
	var filename =  entireState.selectedLane[0].name;
	var inputFile = nodeServerURL + filename;
	var parameterString = "?input=" + inputFile + "&lang=" + item.parameter.lang + "&analysis=" + item.parameter.analysis;
	var urlWithParameters = item.url + parameterString;
	return urlWithParameters;
    }
	
    invokeTaskTool( fullURL ) {
	var win = window.open(fullURL, '_blank');
	win.focus();
    }
}