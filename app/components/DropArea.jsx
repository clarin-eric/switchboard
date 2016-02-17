import React from 'react';
import Dropzone from 'react-dropzone';
import NoteActions from '../actions/NoteActions';
import LaneActions from '../actions/LaneActions';
import ToolActions from '../actions/ToolActions';
import Request from 'superagent';

export default class DropArea extends React.Component {
    constructor(props) {
	super(props);

	this.addLane     = this.addLane.bind(this);
	this.addNote     = this.addNote.bind(this);
	this.addFilename = this.addFilename.bind(this);
	this.addMimetype = this.addMimetype.bind(this);	
	this.addLanguage = this.addLanguage.bind(this);	
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

    // a note get a task description as "knows" the lane it belongs to
    addNote( laneId, description ) {
	const note = NoteActions.create({
	    task: description,
	    belongsTo: laneId});
	
	LaneActions.attachToLane({
	    noteId: note.id,
	    laneId
	});

	console.log('DropArea/addNote', laneId, description, 'with resulting note', note);
    }

    addFilename( laneId, filename ) {
	LaneActions.addFilename({
	    filename: filename,
	    laneId
	});
	
	console.log('DropArea/addFilename', laneId, filename);
    }

    addMimetype( laneId, mimetype ) {
	LaneActions.addMimetype({
	    mimetype: mimetype,
	    laneId
	});
	
	console.log('DropArea/addMimetype', laneId, mimetype);
    }
    
    addLanguage( laneId, language ) {
	console.log('DropArea/addLanguage', laneId, language);
	LaneActions.addLanguage({
	    language: language,
	    laneId
	});
	
	console.log('DropArea/addLanguage', laneId, language);
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

	var req = Request
//	    .post('http://shannon.sfs.uni-tuebingen.de:8011/api/uploadLR')
	    .post('http://localhost:8011/api/uploadLR')	
	    .attach("langResource", files[0], files[0].name)
	    .end((err, res) => {
		if (err) {
		    console.log('error in uploading', err);
		} else {
		    console.log('success in uploading', res);
		}
	    });

	this.setState({
	    files: files
	});

	// once new file has been dropped, delete history of prior file drops
	if (files.length > 0) {
	    LaneActions.reset();
	    NoteActions.reset();
	    ToolActions.reset();
	}

	// for each file, create a lane (resource) and attach to each lane some notes (resource descriptors)
	for (var i=0; i<files.length; i++) {
	    var laneId = this.addLane(files[i].name);
	    this.addFilename(laneId, files[i].name);

	    // will be editable (see LanguageMenu)
	    this.addMimetype(laneId, files[i].type);
	    
	    this.addNote(laneId, "name:   ".concat(files[i].name));
	    this.addNote(laneId, "type:   ".concat(files[i].type));
	    this.addNote(laneId, "size:   ".concat(files[i].size));	
	    // this.addNote(laneId, "preview:".concat(files[i].preview));
	    
	    // will be editable (see MimetypeMenu)
	    this.addNote(laneId, "language:");
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
		'Drop your files here, or click here to select files to upload.'
            ),
	    this.showFiles()
        );
    }
}
