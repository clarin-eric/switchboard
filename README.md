# LRSwitchboard
Code Repository for the Language Resources Switchboard of CLARIN.

The implementation is based upon reactjs and related packages. It contains a demo upload site,
where users can drag&drop their language resource(s). Each resource can be associated with a
mimetype (detected during file drop) or edited by the user thereafter, and a language code (iso
639-3). The demo upload site depicts each language resource with all relevant information, the user
can then ask the switchboard to display all tools capable of processing the resource in question.
Clicking on a tool icon opens the tool in a new tab. All relevant information (link to the
resource, language code, mimetype etc.) is encoded in the URL used to invoke the tool.

A poor man's webserver has been implemented to temporarily store all uploaded resources, and to
make them available for download by the invoked tools.

For more information, please contact claus.zinn@uni-tuebingen.de





# Note
The software is currently being developed. There is no stable version yet.