import uuid from 'node-uuid';
import assign from 'object-assign';
import alt from '../libs/alt';
import LaneActions from '../actions/LaneActions';
import NoteStore from './NoteStore';

class LaneStore {
    constructor() {
	this.bindActions(LaneActions);
	
	this.lanes = [];
	this.selectedLane = [];

	this.exportPublicMethods({
	    get: this.get.bind(this),
	    getLane: this.getLane.bind(this)
	});	
    }

    reset () {
	this.setState({
	    lanes: []
	});

	console.log('LaneStore/reset');
    }
	
    create(lane) {
	const lanes = this.lanes;
	
	lane.id = uuid.v4();
	lane.notes = lane.notes || [];
	lane.mimetype = lane.mimetype || null;
	lane.languageCode = lane.languageCode || null;
	
	this.setState({
	    lanes: lanes.concat(lane)
	});
	
	return lane;
    }
    
    update(updatedLane) {
	const lanes = this.lanes.map((lane) => {
	    if(lane.id === updatedLane.id) {
		return assign({}, lane, updatedLane);
	    }
	    
	    return lane;
	});
	
	this.setState({lanes});
    }
    
    delete(id) {
	this.setState({
	    lanes: this.lanes.filter((lane) => lane.id !== id)
	});
    }

    addMimetype({laneId, mimetype}) {
	const lanes = this.lanes.map((lane) => {
	    console.log('LaneStore/addMimetype map', lane.id, mimetype);
	    if(lane.id === laneId) {
		lane.mimetype = mimetype;
	    }
	    
	    return lane;
	});

	this.setState({lanes});
    }

    addLanguageCode({laneId, languageCode}) {
	const lanes = this.lanes.map((lane) => {
	    console.log('LaneStore/setLanguageCode map', lane, languageCode);
	    if(lane.id === laneId) {
		lane.languageCode = languageCode;
	    }
	    
	    return lane;
	});

	this.setState({lanes});
    }
    
    attachToLane({laneId, noteId}) {
	const lanes = this.lanes.map((lane) => {
	    if(lane.id === laneId) {
		if(lane.notes.indexOf(noteId) === -1) {
		    lane.notes.push(noteId);
		}
		else {
		    console.warn('Already attached note to lane', lanes);
		}
	    }
	    
	    return lane;
	});

	console.log('LaneStore/attachToLane having attached ', noteId, ' to ', laneId);
	
	this.setState({lanes});
    }
    
    detachFromLane({laneId, noteId}) {
	const lanes = this.lanes.map((lane) => {
	    if(lane.id === laneId) {
		lane.notes = lane.notes.filter((note) => note !== noteId);
	    }
	    
	    return lane;
	});
	
	this.setState({lanes});
    }

    getLane(laneId) {
	const lane = this.lanes.filter((lane) => lane.id == laneId);
	console.log('LaneStore/getLane with id: ', laneId, lane[0]);

	// modify state
	this.setState({
	    selectedLane: [].concat(lane)
	});

	return { lane: lane[0] };
    }

    get(ids) {
	return (ids || []).map(
	    (id) => this.lanes.filter((lane) => lane.id === id)
	).filter((a) => a.length).map((a) => a[0]);
    }    
}

export default alt.createStore(LaneStore, 'LaneStore');
