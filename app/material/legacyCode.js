    // Take the mimetype detection from the 'browser' when downloading the resource from provider (res.type)
    // Todo: use of Apache TIKA for language detection
    // CZ: may go to Download.js (see Upload.js)
    fetchAndProcessURL_inactive( caller, fileURL ) { // CZ remove
	var that = this;
	var req = Request
	    .get(fileURL)	
	    .end(function(err, res){
		
		// done with loading, discontinue spinner
		that.setState( { isLoaded: true });

		if (err) {
   		    // show fetch alert
		    that.setState({showAlertURLFetchError: true} );
		} else {
		    // record file in state
		    that.setState( { resource : res } );
		    console.log('UrlArea/fetchAndProcessURL: ', res, res.header['content-type'], res.header['content-length']);

		    // check whether we've fetched the Shibboleth login
		    if ( (res.text.indexOf('Shibboleth') != -1))  {
			that.setState({showAlertShibboleth: true});
		    } else {
		    

			// create resource
			var resource = ResourceActions.create( { name: fileURL,
							 filename: fileURL,
							 upload: caller,
							 mimetype: res.type
						       } );
			var resourceId = resource.id;
			that.addNote(resourceId, "name:   ".concat( fileURL ));
			that.addNote(resourceId, "type:   ".concat( res.type ));
			that.addNote(resourceId, "size:   not determined");	 // CZ: check since we have downloaded the resource...

			var languageHarmonization = "identify language!";
			var protocol = window.location.protocol;
			console.log('UrlArea/fetchAndProcessURL: calling TIKA for language detection', protocol);
			Request
			    .put(protocol.concat('//weblicht.sfs.uni-tuebingen.de/clrs/language/string'))
			    .send(res.text)	
			    .set('Content-Type', res.type)	
			    .end((err, langDetectResult) => {
				if (err) {
				    console.log('error: language identification', err);
				} else {
				    console.log('success: language identification', langDetectResult.text);
				    languageHarmonization = processLanguage(langDetectResult.text);
				    
				    that.addNote(resourceId, "language:".concat( languageHarmonization.languageCombo ));
				    ResourceActions.addLanguage( { resourceId: resourceId,
							       language: languageHarmonization.threeLetterCode})
				}})
		    }
		}
	    });
	return true;
    }

owncloud_upload( newFileName, currentFile ) {

	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange=function(){
	    if(xhr.readyState==4 && xhr.status==200){
		consolelog(xhr.responseText);
	    }
	}
	xhr.open('PUT', this.cloudURL.concat('/owncloud/remote.php/webdav/').concat(newFileName), true); //, "switchboard", "clarin-plus");	
	//xhr.open('PUT', this.cloudURL.concat('/remote.php/webdav/').concat(newFileName), true); //, "switchboard", "clarin-plus");
	xhr.setRequestHeader("Authorization", "Basic " + btoa("claus.zinn@uni-tuebingen.de" + ":" + "sPL-Fh2-7SS-hCJ"));
	xhr.setRequestHeader('Content-Type', currentFile.type);
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
//        xhr.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type');
        xhr.setRequestHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
	xhr.withCredentials = true; // for CORS
//	  xhr.setRequestHeader("Authorization", "Basic " + btoa("switchboard" + ":" + "clarin-plus"));
//	  xhr.setRequestHeader('Cache-Control', 'no-cache,no-store,must-revalidate'); // ,max-age=-1
	
	xhr.onload = function() {
	    if (xhr.status >= 200 && xhr.status < 300) {
		console.log('XMLHttpRequest: Success in uploading document', xhr.response, xhr.status);
		that.owncloud_share( newFileName, currentFile );
	    } else {
		console.log('XMLHttpRequest: Error in uploading document!', xhr.response, xhr.status);
	    }
	};
	xhr.send(currentFile);
    }

    owncloud_share( newFileName, currentFile ) {
	var that = this;
	var xhr = new XMLHttpRequest();
//	xhr.withCredentials = true; // for CORS
	xhr.open('POST', that.cloudURL.concat('/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); //, "switchboard", "clarin-plus");
//	xhr.open('POST', that.cloudURL.concat('/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); //, "switchboard", "clarin-plus");	
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader("Authorization", "Basic " + btoa("claus.zinn@uni-tuebingen.de" + ":" + "sPL-Fh2-7SS-hCJ"));	
//	xhr.setRequestHeader("Authorization", "Basic " + btoa("switchboard" + ":" + "clarin-plus"));	
//	xhr.setRequestHeader('Accept', 'application/xml');
	// xhr.setRequestHeader('Cache-Control', 'no-cache,no-store,must-revalidate'); // ,max-age=-1'
	
	// not working:
	
	// xhr.setDisableHeaderCheck(true);
	// xhr.setRequestHeader('Cookie', "cookie_test=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud/ocs/v1.php/apps/files_sharing/api/v1");
	// xhr.setRequestHeader('Cookie', "cookie_test=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud/remote.php/webdav");
	// xhr.setRequestHeader('Cookie', "oc_sessionPassphrase=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud");
	// xhr.setRequestHeader('Cookie', "ocfxjl76f0c3=deleted; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/owncloud");			

	xhr.onload = function() {
	    if (xhr.status >= 200 && xhr.status < 300) {
		console.log('XMLHttpRequest: successfully shared file', xhr.response, xhr.status);
		that.owncloud_shares( newFileName );
	    } else {
		console.log('XMLHttpRequest: Error in sharing the document document!', xhr.response, xhr.status);
	    }
	};	

	xhr.send(JSON.stringify({path:newFileName, shareType:"3"}));
    }

    
    owncloud_shares( fileName ) {
	var that = this;
	var xhr = new XMLHttpRequest();
	xhr.open('GET', that.cloudURL.concat('/owncloud/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); // , "switchboard", "clarin-plus");
//	xhr.open('GET', that.cloudURL.concat('/ocs/v1.php/apps/files_sharing/api/v1/shares'), true); // , "switchboard", "clarin-plus");	
//	xhr.setRequestHeader("Authorization", "Basic " + btoa("switchboard" + ":" + "clarin-plus"));
	xhr.setRequestHeader("Authorization", "Basic " + btoa("claus.zinn@uni-tuebingen.de" + ":" + "sPL-Fh2-7SS-hCJ"));		
	xhr.setRequestHeader('Content-Type', 'application/json');
	xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
	xhr.setRequestHeader('Accept', 'application/xml');
	// xhr.setRequestHeader('Cache-Control', 'no-cache,no-store,must-revalidate'); // ,max-age=-1'

	xhr.onload = function() {
	    if (xhr.status >= 200 && xhr.status < 300) {
		console.log('XMLHttpRequest: successfully requested shares for ', fileName, xhr.response, xhr.status);
	    } else {
		console.log('XMLHttpRequest: Error in requesting shares for!', fileName, xhr.response, xhr.status);
	    }
	};	

	xhr.send(JSON.stringify({path:fileName}));
    }
