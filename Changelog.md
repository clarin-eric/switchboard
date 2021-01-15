# Changelog

## [2.3.0] - 2021-01-15
    - Added API v2 (support for POST calls #119)
    - Added Switchboard popup
    - Improved design of WebGUI match/list tools section
    - Improved file format detection (support for 'ply' '3d' and 'cmdi' formats)
    - Improved filename extraction from input URLs
    - Improved tool wrapping for popup and phone sizes
    - Cache tool logos
    - Cache uploaded resources
    - Added support for multiple files input (experimental - disabled by default)
   
## [2.2.3] - 2020-11-30
    - Fixed missing languages #150
    - Fixed markdown highlighting bug introduced with #149
    - Upgraded backend dependencies:
        - dropwizard to 2.0.15
    - Upgraded WebUI dependencies:
        - react-markdown to 5.0.3

## [2.2.2] - 2020-11-23
    - Added SSHOC funding information
    - Fixed a bug where some tools were not showing up in the "All Tools" list #141
    - Updated backend dependencies:
       - jersey-media-multipart to 2.32
       - dropwizard to 2.0.14
    - Updated WebUI dependencies:
       - react-markdown to 5.0.0
       - lodash to 4.17.20
       - react-router-dom to 5.2.0

## [2.2.1] - 2020-04-11
    - Added support temporary redirects (HTTP 307) when resolving handles
    - Updated WebUI dependencies: axios, core-js, react, react-dom, react-modal, react-redux, react-select, redux
    - updated dependencies: profiler, validation-api, dropwizard
<sub> 
   Fixes:

   - [CVE-2019-10219](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-10219)
   
   - [CVE-2020-11002](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2020-11002)
</sub>

## [2.2.0] - 2020-03-30
    - added new profiler module with support for tei, tcf, conllu and other formats
    - added support for markdown (GitHub flavor) in tools description, auth info and licence
    - improved help section (link to tool registry) and about section (funding info)
    - updated dependencies: acorn, gson, jaxb, slf4j, logback, jersey, guava, dropwizard 

## [2.1.2] - 2020-02-19
    - fixed file system watcher bug (increase timer) 
    - updated dependencies: logback, tika 

## [2.1.1] - 2019-11-13
    - fixed compatibility with IE 11
    - rewrote UI help section to conform to version 2.x.x 
	- fix footer hiding content in Safari
	- track tool match calls and tool invocation calls in Matomo
	- update documentation
	- add configuration option for hiding development tools
    - allow configuration in `config.yaml` to be set via system environment variables
	- multiple security fixes

## [2.1.0] - 2019-10-07
	- fully rewritten and redesigned UI as single page app (React+Redux & react-router)
	- updated Switchboard API to allow it being called from any repository (any origin)

## [2.0.0] - 2019-06-26
	- rewritten backend with support for temporary storing user data: simplified installation procedure, removed dependence on nextcloud and other external containers
	- externalized tool definitions to github.com/clarin-eric/switchboard-tool-registry
	- minor UI updates

## [1.4.3] - 2018-01-14
	- updated to latest version of babel
	- removed reference to CLARIN help desk in HELP pop-ups
	- updated help desk

## [1.4.2] - 2018-12-20
### Updated
	- tackled https://github.com/clarin-eric/LRSwitchboard/issues/40

## [1.4.1] - 2018-12-20
### Updated
	- github instructions
	- code cleaning:
	* deleted superfluous methods (App.jsx: showFiles, handleChange)
	* deleted superfluous state information
	* deleted superfluous constants in util wrt. web services support
	* move code to clear Dropzones to DropArea component
	- new UI behaviour when invoked from VLO/D4Science/B2DROP
	- added cross-references to switchboard back-end repository in README.md

## [1.4.0] - 2018-11-30
### Removed
	- removed support for web services
	* (clrs-rest backend (registry) has not been updated yet)

## [1.3.4] - 2018-11-20
### Changed
	- changed nginx configuration for D4Science integration
	- reduced URL name display to 40 characters.

## [1.3.3] - 2018-11-14
### Changed
	- changed handling of handle-based urls
	- fixed bug where there are only web-based tools applicable, but no segmented controls being shown
	- replaced all JS alerts by reactjs ones.

## [1.3.2] - 2018-11-08
### Changed
	- ameliorated the Help Menu; FAQ section outsourced with extra link in footer.
	- updated AboutHelp.
	- shortened text in the drop areas
	- Tool View now also sorts task groups alphabetically

## [1.3.1] - 2018-10-16
### Added
	- calls to clrs-rest back-end now passes-on URL parameter 'includeBetaSoftware' with 'yes'/'no' value

## [1.3.0] - 2018-10-08
### Changed
	- modified look & feel of the resource panel
	- added sorting options to the "task oriented view"; design changes, removed switch for showing WSs
	- icon no longer spinning
	- improved design of boxes for URL and text drop, including submit buttons
	- fixed bug where help menus did not display the closing X
	- moved About and For Developer Help to footer, changed Contact&Support
	- fixed CLARIN logo (visibility and right alignment)
	- making now use of CLRS-REST service (outsourcing Matcher & Registry)

## [1.1.7] - 2018-06-30
### Changed
	- integrated UrlArea with DropArea (code refactoring)
	- removed references to B2DROP as upload storage for the switchboard
	- all files transferred to the switchboard are now uploaded to switchboard’s storage server
	(including those stemmi	ng from VLO/VCR/B2DROP invocations)
	- mime type and language information from the VLO is now ignored (no cross-checking, for time being)
	- added comment headers to all js/jsx files

## [1.1.6] - 2018-06-25

### Changed
	- part bug-fixing, part enhancement: a resource pasted as shared link into the middle box of the LRS
	is now uploaded/copied to the switchboard's file storage server. Tools connected to the switchboard
	will fetch it from there. This also addresses CORS-related issues as it extends shared link from
	stemming from dropbox's or eudat's cloud storage to arbitrary locations. The also addresses
	issue https://github.com/clarin-eric/LRSwitchboard/issues/28.
	- main.py has been relocated, see https://github.com/clarin-eric/LRSwitchboard/issues/27.
	- main.py has been extended to cope with non-textual files.
	- application context path has been introduced; nginx configuration has been simplified.
	- update to latest stable version of node (v8.11.3); and webpack 4, and updated relevant packages

## [1.1.5] - 2018-06-07
### Added
	- Added NLP-HUB/D4Science for multiple languages (NER)

### Changed
	- fixed bug, where shared link from NC had http rather than https (needs further work)


## [1.1.4] - 2018-03-27
### Added
	- Added first FAQ to FAQs
	- added registration details for LST webservices to metadata
	- switchboard now shows the output format.
	- output formats has been curated
	- Added CSTLemma (hosted by D4Science
	- Changed path to WebLicht from http to https

## [1.1.3] - 2018-03-13
### Added
	- Page reload trigger clearance of DropZone
	- added switch to only show tools that do not require authentication
	- added MorphoDiTa
        - updated About with developer contribution
	- Fixed Colibri metadata entry

## [1.1.2] - 2018-02-28
### Added
	- Added AlertURLUploadError to show that file upload failed
	- activated text input as new input method
	- activated paste URL/PID as new input method

## [1.1.1] - 2018-02-27
### Added
	- Activated Nextcloud-based storage rather than MPG storage server. Here, can send Access-Control-Allow-Origin header.
	- better support for handles
	- to avoid CORS-related issues, some resources are now downloaded via Python script. That is, support to make uwsgi calls to Python, see app/ directory in distribution, and modified nginx.conf file.

## [1.1.0] - 2017-12-22
### Added
	- added more languages for UDPIPE
	- integrated D4Science tool from switchboard

## [1.0.9] - 2017-12-15
### Added
	- extra DropArea where users can enter (plain) text (development version only)
	- task-oriented view is now cleared whenever new data arrives

## [1.0.8] - 2017-12-8
### Changed
	- improved information on all the WebLicht easy chains (i.e., the components of the pipeline)

## [1.0.4-1.0.7]
### Changed
        - Minor improvements, minor code cleaning

## [1.0.3] - 2017-09-13
### Fixed
	- Added reverse proxy directives in nginx config to properly handle redirects from switchboard.clarin.eu

## [1.0.2] - 2017-09-07
### Added
	- Support for the RELDI software (Croatian, Slovenian, Serbian)
	- Changelog.MD

### Fixed
	- Fix typos in Registry entries

## [1.0.1] - 2017-09-06
### Added
	- VTO path to show a list of all tools

### Changed
	- Changed contact address to switchboard@clarin.eu

## [1.0.0] - 2017-08-11
First official release.
