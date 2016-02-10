import React from 'react';
import Dropzone from 'react-dropzone';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';
import LaneStore from '../stores/LaneStore';        // storing lanes (state)
import Request from 'superagent';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.addLane = this.addLane.bind(this);
	this.addNote = this.addNote.bind(this);
	this.addMimetype = this.addMimetype.bind(this);
	this.addLanguageCode = this.addLanguageCode.bind(this);	
	this.showFiles = this.showFiles.bind(this);
	this.onDrop = this.onDrop.bind(this);
	
	this.state = {
	    files: []
	};

	console.log('binding showFiles', this.showFiles, this.onDrop, this.addNote, this.addLane);
    }

    addLane( resourceName ) {
	var lane = LaneActions.create({name: resourceName});
	console.log('adding new lane', lane);
	return lane.id;
    }
    
    addNote( laneId, description ) {
	const note = NoteActions.create({task: description});
	console.log('DropArea/addNote has created a new note', note); 	
	LaneActions.attachToLane({
	    noteId: note.id,
	    laneId
	});

	console.log('DropArea/addNote', laneId, description, 'with resulting note', note);
    }

    addMimetype( laneId, mimetype ) {
	LaneActions.addMimetype({
	    mimetype: mimetype,
	    laneId
	});
	console.log('DropArea/addMimetype', laneId, mimetype);
    }

    addLanguageCode( laneId, languageCode ) {
	LaneActions.addLanguageCode({
	    languageCode: languageCode,
	    laneId
	});
	console.log('DropArea/addLanguageCode', laneId, languageCode);
    }

    showFiles() {

        var files = this.state.files;
	console.log('showFiles', files);
	
        if (files.length <= 0) {
            return '';
        }

        return React.createElement(
            'div',
            null,
            React.createElement(
                'h3',
                null,
                'Dropped files: '
            ),
            React.createElement(
                'ul',
                null,
                [].map.call(files, function (f, i) {
                    return React.createElement(
			'li',
			{
                            key: i 
			},
			React.createElement('img', {
                            src: f.preview,
                            width: 100 
			}),
			React.createElement(
			    'div',
			    null,
			    f.name + ' : ' + f.size + ' bytes.'
			)
                    );
                })
            )
        );
    };
    
    onDrop(files) {

	// var req = Request
	//     .post('http://shannon.sfs.uni-tuebingen.de:8011/api/uploadLR')
	//     .set('Content-Type', 'text/plain');

	// files.forEach((file)=> {
	//     console.log('attaching', file.name, file);
        //     req.attach(file.name, file);
        // });

	// var formData = new FormData();
	// formData.append("username", "Groucho");
	// formData.append("accountnum", 123456); // number 123456 is immediately converted to a string "123456"
	// formData.append("langResource", files[0]);
	
	// files.forEach((file) => {
	//     console.log('formdata before adding ', file, formData);
	//     formData.append( "file" , file );
	//     console.log('formdata after adding', file, formData);
	// });

	var req = Request
//	    .post('http://shannon.sfs.uni-tuebingen.de:8011/api/uploadLR')
//	    .post('http://localhost:8011/api/uploadLR')
	    .post('http://localhost:8011/api/uploadLR')	
//	    .set('Content-Type', 'text/plain')
//	    .type('application/x-www-form-urlencoded') // form
//	    .type('form')
	    .attach("langResource", files[0], files[0].name)
//	    .send(files[0])
//	    .send(formData)	
	    .end((err, res) => {
		if (err) {
		    console.log('error in uploading', err);
		} else {
		    console.log('success in uploading', res);
		}
	    });

	console.log('req after', req, files[0], files[0].name);	

	// console.log('Received files: ', files);
	this.setState({
	    files: files
	});

	if (files.length > 0) {
	    LaneActions.reset();
	    NoteActions.reset();
	    ToolActions.reset();
	}

	// for each file, create a lane (resource) and attach to each lane some notes (resource descriptors)
	for (var i=0; i<files.length; i++) {
	    var laneId = this.addLane(files[i].name);
	    this.addMimetype(laneId, files[i].type);
	    
	    this.addNote(laneId, "name:   ".concat(files[i].name));
	    this.addNote(laneId, "type:   ".concat(files[i].type));
	    this.addNote(laneId, "size:   ".concat(files[i].size));	
	    this.addNote(laneId, "preview:".concat(files[i].preview));
	    
	    // adding special Note for language information (create pulldown-menu)
	    this.addNote(laneId, "language: click here");
	}
    }

    render() {
	
        var style = {
            borderWidth: 2,
            borderColor: 'black',
            borderStyle: 'dashed',
            borderRadius: 4,
            margin: 30,
            padding: 30,
            width: 200,
            transition: 'all 0.5s'
        };

        var activeStyle = {
            borderStyle: 'solid',
            backgroundColor: '#eee',
            borderRadius: 8
        };

	return React.createElement(
            'div',
            null,
            React.createElement(
		Dropzone,
		{
		    onDrop: this.onDrop,
		    style: style,
		    activeStyle: activeStyle 
		},
		'Drop your files here, or click to select files to upload.'
            ),
	    this.showFiles()
        );
    }
}
