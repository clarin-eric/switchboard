# C. Zinn
# -------------------------------------------
# Time-stamp: <2018-02-27 10:21:22 (zinn)>
# -------------------------------------------
# Python script to download resources (or to resolve handles)

import requests                      
from cgi import parse_qs, escape                             

def resolveHandle( handleURL ):
    try:
        # if it is a handle, then this should return: <Response [303]>
        r = requests.get( handleURL, allow_redirects=False )
        return r.headers['Location']
    except requests.exceptions.MissingSchema:
        print("You forgot the protocol. http://, https://, ftp://")
    except requests.exceptions.ConnectionError:
        print("Sorry, but I couldn't connect. There was a connection problem.")
    except requests.exceptions.Timeout:
        print("Sorry, but I couldn't connect. I timed out.")
    except requests.exceptions.TooManyRedirects:
        print("There were too many redirects.  I can't count that high.")


# checks for ?input=<url>
def application(environ, start_response):                         
    parameters = parse_qs(environ.get('QUERY_STRING', ''))           
    if 'input' in parameters:                                        
        input = escape(parameters['input'][0])
        if "hdl.handle.net" in input:
            resolve = resolveHandle(input)
            start_response('200 OK', [('Content-Type', 'text/plain')])
            return [str.encode(resolve, 'utf-8')]            
        else:
            res = requests.get(input)                                                 
            start_response('200 OK', [('Content-Type', res.headers['content-type'])])
            return [str.encode(res.text, 'utf-8')]
    else:
        start_response('200 OK', [('Content-Type', 'text/plain')])
        return [str.encode('Switchboard says: improper URL passed' , 'utf-8')]
