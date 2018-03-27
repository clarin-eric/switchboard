# Changelog
All notable changes to this project will be documented in this file.

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
