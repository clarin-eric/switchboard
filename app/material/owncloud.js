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
