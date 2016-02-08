import React from 'react';
import ReactSelectize from 'react-selectize';
var MultiSelect = ReactSelectize.MultiSelect;

export default class MimetypeMenu extends React.Component {
    constructor(props) {
	super(props);
	this.selectedMimetypes = [];
    }

    getState() {
	return this.selectedMimetypes;
    }

    render() {
	const {tags, ...props} = this.props;

	console.log("MimetypeMenu predefined tags", this.props);
	
        var options = ["application/json", "application/mediatagger", "application/msword", "application/mxf", "application/octet-stream", "application/ogg", "application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.sun.wadl+xml", "application/x-gzip", "application/x-matlab-data", "application/xml", "application/zip", "audio/mp3", "audio/mp4", "audio/mpeg", "audio/mpeg3", "audio/raw", "audio/vnd.wave", "audio/wav", "audio/x-aiff", "audio/x-mpeg", "audio/x-nist", "audio/x-ssff", "audio/x-wav", "image/jpeg", "image/jpg", "image/pdf", "image/tiff", "text/csv", "text/exb+xml", "text/exs+xml", "text/html", "text/plain", "text/plain-bas", "text/praat-textgrid", "text/rtf", "text/x-cgn-bpt+xml", "text/x-cgn-pri+xml", "text/x-cgn-prx+xml", "text/x-cgn-skp+xml", "text/x-cgn-tag+xml", "text/x-cgn-tig+xml", "text/x-chat", "text/x-eaf+xml", "text/x-esf", "text/x-matlab", "text/x-pfsx+xml", "text/x-presentation-log", "text/x-shoebox-text", "text/x-toolbox-text", "text/x-trs", "text/xml", "unknown type", "video/avi", "video/mp4", "video/mpeg", "video/quicktime", "video/x-mpeg1", "video/x-mpeg2"].map(function(mimetype){
 
               return {label: mimetype, value: mimetype}
        });
	
        return <MultiSelect options = {options}
    			    placeholder = "Select mimetype(s)"
 			    onValuesChange = { function(selectedMimetypes){
			      console.log("MimetypeMenu/onValuesChange", selectedMimetypes, this);
			      this.setState({selectedMimetypes: selectedMimetypes});
			    }.bind(this)}
		  
			    defaultValues = {[this.props.tags].map(function(str){
			      return {label: str, value: str};
			    }.bind(this))} >
               </MultiSelect>
    }
}
