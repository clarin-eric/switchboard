import requests                      
from cgi import parse_qs, escape                             
                                                                     
def application(environ, start_response):                         
    parameters = parse_qs(environ.get('QUERY_STRING', ''))           
    if 'input' in parameters:                                        
        input = escape(parameters['input'][0])                                                
    else:                                                            
        input = 'http://www.spiegel.de'                                                   
                                                                              
    res = requests.get(input)                                                 
                                                                              
    start_response('200 OK', [('Content-Type', res.headers['content-type'])])
    return [str.encode(res.text, 'utf-8')]
