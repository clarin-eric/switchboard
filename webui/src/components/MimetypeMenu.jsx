// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
// 
// File: MimetypeMenu.jsx
// Time-stamp: <2018-06-29 20:23:42 (zinn)>
// -------------------------------------------

import React from 'react';
import ReactSelectize from 'react-selectize';

// var MultiSelect = ReactSelectize.MultiSelect;
var SimpleSelect = ReactSelectize.SimpleSelect;

export default class MimetypeMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {defaultValue, ...props} = this.props;
        var options = ["application/json",
                       "application/mediatagger",
                       "application/msword",
                       "application/mxf",
                       "application/octet-stream",
                       "application/ogg",
                       "application/pdf",
                       "application/rtf",                      
                       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                       "application/vnd.sun.wadl+xml",
                       "application/vnd.ms-powerpoint",
                       "application/vnd.openxmlformats-officedocument.presentationml.presentation",
                       "application/vnd.ms-excel",
                       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                       "application/x-gzip",
                       "application/x-matlab-data",
                       "application/xml",
                       "application/zip",
                       "audio/mp3",
                       "audio/mp4",
                       "audio/mpeg",
                       "audio/mpeg3",
                       "audio/raw",
                       "audio/vnd.wave",
                       "audio/wav",
                       "audio/x-aiff",
                       "audio/x-mpeg",
                       "audio/x-nist",
                       "audio/x-ssff",
                       "audio/x-wav",
                       "image/jpeg",
                       "image/jpg",
                       "image/png",                    
                       "image/tiff",
                       "image/pdf",
                       
                       "text/tei+xml;format-variant=tei-iso-spoken",
                       "text/tei+xml;format-variant=tei-dta",

                       // see https://tools.ietf.org/html/rfc6129

                       "application/tei+xml",
                       
                       "application/tcf+xml",                  

                       "text/folia+xml",
                       
                       "text/cmdi+xml",
                       "text/dc+xml",
                       "text/marc21+xml",
                       "text/mods+xml",

                       // see https://tools.ietf.org/html/rfc6207
                       "application/mods+xml",
                       "application/mads+xml",
                       "application/mets+xml",
                       "application/marcxml+xml",
                       "application/sru+xml",
                       
                       
                       "text/csv",
                       "text/exb+xml",
                       "text/exs+xml",
                       "text/html",
                       "text/plain",
                       "text/plain-bas",
                       "text/praat-textgrid",
                       "text/rtf",
                       "text/x-cgn-bpt+xml",
                       "text/x-cgn-pri+xml",
                       "text/x-cgn-prx+xml",
                       "text/x-cgn-skp+xml",
                       "text/x-cgn-tag+xml",
                       "text/x-cgn-tig+xml",
                       "text/x-chat",
                       "text/x-eaf+xml",
                       "text/x-esf",
                       "text/x-matlab",
                       "text/x-pfsx+xml",
                       "text/x-presentation-log",
                       "text/x-shoebox-text",
                       "text/x-toolbox-text",
                       "text/x-trs",
                       "text/xml",
                       
                       "text/xml;format-variant=exmaralda-exb",
                       "text/xml;format-variant=folker-fln",
                       "text/xml;format-variant=transcriber-trs",
                       "text/xml;format-variant=weblicht-tcf",

                       "unknown type",
                       "video/avi",
                       "video/mp4",
                       "video/mpeg",
                       "video/quicktime",
                       "video/x-mpeg1",
                       "video/x-mpeg2"].map(function(mimetype){
 
               return {label: mimetype, value: mimetype}
        });

        return <SimpleSelect options = {options}
        defaultValue  = {defaultValue}
                             value  = {defaultValue}    
                             placeholder = "Select mimetype"
                             renderValue = {function(item){
                                 // check if the mimetype is available (optional)
                                 var exists = options.map(function(option){
                                     return option.value
                                 }).indexOf(item.value) != -1
                                 
                                 return <div 
                                 className="simple-value"
                                 style={{
                                     color: exists ? "black" : "red"
                                 }}
                                     >{item.label}</div>
                                     
                             }}
                             onValueChange = {this.props.onMimetypeSelection}
            >
               </SimpleSelect>
    }
}
