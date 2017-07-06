export function invokeBrowserBasedTool( URL ) {
    var win = window.open(URL.url, '_blank');
    win.focus();	
}

export function invokeWebService( URL ) {
    let file = URL.formVal;
    if (URL.postSubmit == "data") {
	Request
	    .post(URL.url)
	    .send(file)
	    .end((err, res) => {
		if (err) {
		    console.log('Tool.jsx/invokeWebService: error in calling webservice', err, file.name, URL);
		    alert('Result of calling web service: ' + err);
		} else {
		    var something = window.open("data:text/json," + encodeURIComponent(res.text), "_blank");
		    console.log('onDrop: success in calling webservice', res, file.name, data, URL);
		}
	    });
    } else {
	let data = new FormData();
	//data.set( URL.formPar, file, file.name);
	data.append( URL.formPar, file, file.name);
	Request
	    .post(URL.url)
	    .send(data)
	//		.set('Content-Type', 'text/plain')	    
	    .end((err, res) => {
		if (err) {
		    console.log('Tool.jsx/invokeWebService: error in calling webservice', err, file.name, data, URL);
		    alert('Result of calling web service: ' + err);
		} else {
		    var something = window.open("data:text/json," + encodeURIComponent(res.text), "_blank");
		    // something.focus();
		    console.log('onDrop: success in calling webservice', res, file.name, data, URL);
		}
	    });
    }
}