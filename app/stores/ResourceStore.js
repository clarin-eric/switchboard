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
	resource.file             = resource.file || null;
	resource.remoteFilename   = resource.remoteFilename || null;
	resource.upload           = resource.upload   || null;
	resource.mimetype         = resource.mimetype || null;	
	resource.size             = resource.size || null;
	resource.language         = resource.language || null;
	
	this.setState({
	    resources: resources.concat(resource)
	});

	//console.log('ResourceStore/create', resource);
	return resource;
    }
    
    update(updatedResource) {
	const resources = this.resources.map((resource) => {
	    if(resource.id === updatedResource.id) {
		return assign({}, resource, updatedResource);
	    }
	    
	    return resource;
	});

	//console.log('ResourceStore/update', resources);
	this.setState({resources});
    }

    delete(id) {
	this.setState({
	    resources: this.resources.filter((resource) => resource.id !== id)
	});
    }

    getResource(resourceId) {
	let resource = this.resources.filter((resource) => resource.id == resourceId);
	//console.log('ResourceStore/getResource', { resource: resource[0] });
	return { resource: resource[0] };
    }

    get(ids) {
	return (ids || []).map(
	    (id) => this.resources.filter((resource) => resource.id === id)
	).filter((a) => a.length).map((a) => a[0]);
    }    
}

export default alt.createStore(ResourceStore, 'ResourceStore');
