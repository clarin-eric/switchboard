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
    with open("/tmp/x.pdf", 'wb') as fd:
        for chunk in res.iter_content(chunk_size=128):
            fd.write(chunk)
    return [str.encode(res.text, 'utf-8')]
    #res.raw.decode_content = True
    #return [res.content] # binary content
