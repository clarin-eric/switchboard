import uuid from 'node-uuid';
import assign from 'object-assign';
import alt from '../libs/alt';
import ResourceActions from '../actions/ResourceActions';

class ResourceStore {
    constructor() {
	this.bindActions(ResourceActions);
	
	this.resources = [];

	this.exportPublicMethods({
	    get: this.get.bind(this),
	    getResource: this.getResource.bind(this)
	});	
    }

    reset () {
	this.setState({
	    resources: []
	});
    }
	
    create(resource) {
	const resources = this.resources;
	
	resource.id = uuid.v4();
	resource.notes            = resource.notes || [];
	resource.file             = resource.file || null;
	resource.filename         = resource.filename || null;
	resource.filenameWithDate = resource.filenameWithDate || null;
	resource.upload           = resource.upload   || null;
	resource.mimetype         = resource.mimetype || null;	
	resource.size             = resource.size || null;
	resource.language         = resource.language || null;
	
	this.setState({
	    resources: resources.concat(resource)
	});
	
	return resource;
    }
    
    update(updatedResource) {
	const resources = this.resources.map((resource) => {
	    if(resource.id === updatedResource.id) {
		return assign({}, resource, updatedResource);
	    }
	    
	    return resource;
	});
	
	this.setState({resources});
    }
    
    delete(id) {
	this.setState({
	    resources: this.resources.filter((resource) => resource.id !== id)
	});
    }

    addMimetype({resourceId, mimetype}) {
	const resources = this.resources.map((resource) => {
	    if(resource.id === resourceId) {
		resource.mimetype = mimetype;
	    }
	    
	    return resource;
	});

	this.setState({resources});
    }

    addLanguage({resourceId, language}) {

	const resources = this.resources.map((resource) => {
	    if(resource.id === resourceId) {
		resource.language = language;
	    }
	    
	    return resource;
	});

	this.setState({resources});
	console.log('addLanguage', resourceId, language);
    }
    
    attachToResource({resourceId, noteId}) {
	const resources = this.resources.map((resource) => {
	    if(resource.id === resourceId) {
		if(resource.notes.indexOf(noteId) === -1) {
		    resource.notes.push(noteId);
		}
		else {
		    console.warn('Already attached note to resource', resources);
		}
	    }
	    
	    return resource;
	});

	// console.log('ResourceStore/attachToResource having attached ', noteId, ' to ', resourceId);
	
	this.setState({resources});
    }
    
    detachFromResource({resourceId, noteId}) {
	const resources = this.resources.map((resource) => {
	    if(resource.id === resourceId) {
		resource.notes = resource.notes.filter((note) => note !== noteId);
	    }
	    
	    return resource;
	});
	
	this.setState({resources});
    }

    getResource(resourceId) {
	const resource = this.resources.filter((resource) => resource.id == resourceId);
	return { resource: resource[0] };
    }

    get(ids) {
	return (ids || []).map(
	    (id) => this.resources.filter((resource) => resource.id === id)
	).filter((a) => a.length).map((a) => a[0]);
    }    
}

export default alt.createStore(ResourceStore, 'ResourceStore');
