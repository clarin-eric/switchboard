# Changelog

## [2.4.6] - 2025-10-31
    Security maintenance release:
      - Upgraded backend dependencies:
        - dropwizard to 5.0.0
        - commons-compress to 1.28.0
        - commons-io to 2.20.0
        - tika-core to 3.2.3
        - tika-parsers-standard-package to 3.2.3
        - bcprov-jdk18on to 1.82
        - logback-core to 1.5.19

      - Added WebUI runtime dependencies:
        - regenerator-runtime 0.14.1
      - Upgraded WebUI runtime dependencies: 
        - @reduxjs/toolkit to 2.8.2
        - axios to 1.12.0
        - core-js to 3.45.1
        - react-select to 5.10.2

      - Upgraded WebUI development dependencies:
        - Replace react-router-dom by react-router 7.9.2

      - CI, building and testing:
        - Upgraded SauceConnect to 5.3.0
        - Upgraded build Java docker base image: docker-alpine-supervisor-java-base to [openjdk21_jre-1.1.0](https://gitlab.com/CLARIN-ERIC/docker-alpine-supervisor-java-base/-/releases/openjdk21_jre-1.1.0)
        - Upgraded npm to 11.5.2
        - Upgraded maven to 3.9.9

    See full Changelog: https://github.com/clarin-eric/switchboard/compare/2.4.5...2.4.6

## [2.4.5] - 2025-04-25
    UX improvements:
      - Always allow files from media supertypes: `text/`, `image/`, `audio/`, `video/`. Only reply with 415 for `application/` types without a registered tool supporting them.
      - Improve user interface message when no matches are found.
      - Improve user interface file name display for files provided via 3rd party caller applications, without filename indication.
    Added javascript 'no strict' version of the Switchboard popup
    Security and maintenance:
      - Upgraded backend dependencies:
        - dropwizard to 4.0.13
        - commons-compress to 1.27.1
        - tika-core to 3.1.0 (override profiler dependency)
        - tika-parsers-standard-package to 3.1.0 (override profiler dependency)
        - bcprov-jdk18on to 1.80 (override profiler dependency)
        - commons-io to 2.19.0 (override profiler dependency)
        - junit-jupiter-api to 5.12.2
      - Upgraded Maven plugins:
        - maven-release-plugin to 3.1.1
        - maven-compiler-plugin to 3.14.0
      - Upgraded WebUI runtime dependencies: 
        - @reduxjs/toolkit to 2.6.1
        - axios to 1.8.4
        - core-js to 3.41.0
        - react-markdown to 10.1.0
        - react-modal to 3.16.3
        - react-redux to 9.2.0
        - react-router-dom to 7.5.2
        - react-select to 5.10.1
        - remark-gfm to 4.0.1
      - Moved react and react-dom to development dependencies section
      - Upgraded WebUI development dependencies:
        - @babel/core to 7.26.10
        - @babel/cli to 7.27.0
        - @babel/plugin-transform-class-properties to 7.25.9
        - @babel/preset-env to 7.26.9
        - @babel/preset-react to 7.26.3
        - @babel/register to 7.25.9
        - babel-loader to 10.0.0
        - browserslist to 4.24.4
        - cypress to 14.1.0
        - eslint to 9.24.0
        - sass to 1.86.3
        - sass-loader to 16.0.5
        - stylelint to 16.18.0
        - stylelint-config-sass-guidelines to 12.1.0
        - stylelint-config-standard to 38.0.0
        - terser-webpack-plugin to 5.3.14
        - webpack to 5.99.5
        - webpack-cli to 6.0.1
        - webpack-dev-server to 5.2.1
        - webpack-merge to 6.0.1
    CI, building and testing:
      - Upgraded to SauceConnect 5 (5.2.3) by @andmor- in https://github.com/clarin-eric/switchboard/pull/424
      - Upgrade CLARIN node build image (registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env) to [2.6.0](https://gitlab.com/CLARIN-ERIC/docker-alpine-clrs-build_env/-/releases/2.6.0) 
      - Upgraded build Java docker base image: docker-alpine-supervisor-java-base to [openjdk21_jre-1.0.10](https://gitlab.com/CLARIN-ERIC/docker-alpine-supervisor-java-base/-/releases/openjdk21_jre-1.0.10)
      - Upgraded npm to 11.3.0
      
    See full changelog: https://github.com/clarin-eric/switchboard/compare/2.4.4...2.4.5

## [2.4.4] - 2024-07-08
    - Make UI tool list entries expand on click in the entire row
    - Upgraded JRE to 21.0.3
    - Upgraded Java unit tests to JUnit Jupiter API 5.x specification
    - Upgrade WebUI to @reduxjs/toolkit
    - Upgraded backend dependencies:
      - dropwizard to 4.0.7
      - commons-compress to 1.26.2
      - tika-core to 2.9.2 (override profiler dependency)
      - tika-parsers-standard-package to 2.9.2 (override profiler dependency)
      - bcprov-jdk18on to 1.78.1 (override profiler dependency)
      - net.sf.trove4j.trove4j 3.0.3 to net.sf.trove4j.core 3.1.0  (override profiler dependency)
      - junit.junit 4.13.2 to org.junit.jupiter.junit-jupiter-api 5.11.0-M2
    - Upgraded WebUI runtime dependencies: 
      - axios to 1.7.2
      - prop-types to 15.8.1
      - core-js to 3.37.1
      - react to 18.3.1
      - react-dom to 18.3.1
      - react-markdown to 9.0.1
      - react-redux to 9.1.2
      - react-router-dom to 6.23.1
      - react-select to 5.8.0
    - Added WebUI development dependencies:
      - @reduxjs/toolkit 2.2.5
    - Removed WebUI development dependencies:
      - redux (replaced by @reduxjs/toolkit)
      - redux-thunk (replaced by @reduxjs/toolkit)
    - Development project changes:
       - Upgraded WebUI development dependencies: 
         - @babel/core to 7.24.7
         - @babel/preset-env to 7.24.7
         - @babel/preset-react to 7.24.7
         - @babel/cli to 7.24.7
         - @babel/register to 7.24.6
         - browserslist to 4.23.1
         - css-loader to 7.1.2
         - cypress to 13.11.0
         - eslint to 9.5.0
         - sass-loader to 14.2.1
         - style-loader to 4.0.0
         - stylelint to 16.6.1
         - stylelint-config-sass-guidelines to 11.1.0
         - stylelint-config-standard to 36.0.0
         - terser-webpack-plugin to 5.3.10
         - webpack to 5.92.0
         - webpack-bundle-analyzer to 4.10.2
         - webpack-dev-server to 5.0.4
       - Added WebUI development dependencies:
         - @babel/plugin-transform-class-properties 7.24.7
         - sass 1.77.5
       - Removed WebUI development dependencies:
         - @babel/plugin-proposal-class-properties (replaced by @babel/plugin-transform-class-properties)
         - cypress-file-upload (now part opf cypress core)
         - node-sass (replaced by sass)
       - Upgraded Maven plugins:
         - maven-release-plugin to 3.1.0 (with it dependent "maven-scm-provider-gitexe" upgraded to 2.1.0)
         - maven-compiler-plugin to 3.13.0
         - appassembler-maven-plugin to 2.1.0
         - git-commit-id-plugin to 4.9.10
       - CI, GitHub Actions and SauceLabs:
         - Upgrade to Cypress 13.10.0
         - Upgrade to Sauceconnect 4.9.2
         - Update Microsoft Edge test version to 119
         - Removed cypress-file-upload module. File upload is now handled by Cypress native "selectFile()"
       - Upgrade CLARIN node build image (registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env) to [2.5.0](https://gitlab.com/CLARIN-ERIC/docker-alpine-clrs-build_env/-/releases/2.5.0) 
       - Upgraded build Java docker base image: docker-alpine-supervisor-java-base to [openjdk21_jre-1.0.1](https://gitlab.com/CLARIN-ERIC/docker-alpine-supervisor-java-base/-/releases/openjdk21_jre-1.0.1)
       - Upgraded build UI test base image: cypress/browsers to [node-20.14.0-chrome-125.0.6422.141-1-ff-126.0.1-edge-125.0.2535.85-1](https://hub.docker.com/layers/cypress/browsers/node-20.14.0-chrome-125.0.6422.141-1-ff-126.0.1-edge-125.0.2535.85-1/images/sha256-ff28576b934d19b7da254d7c1f0da3d9272097bf7465c942ad52dd2573c6484e?context=explore)
       - Fix all warnings in GitHub actions
    SECURITY FIXES:
        - https://security.snyk.io/vuln/SNYK-JAVA-COMMONSCODEC-561518
        - https://security.snyk.io/vuln/SNYK-JAVA-ORGAPACHECOMMONS-6254297 (CVE-2024-26308)
        - https://security.snyk.io/vuln/SNYK-JS-AXIOS-6124857
        - https://security.snyk.io/vuln/SNYK-JAVA-ORGAPACHEJAMES-6282851 (CVE-2024-21742)
        - https://security.snyk.io/vuln/SNYK-JAVA-CHQOSLOGBACK-6094942 (CVE-2023-6378)
        - https://security.snyk.io/vuln/SNYK-JAVA-CHQOSLOGBACK-6094943 (CVE-2023-6378)
        - https://security.snyk.io/vuln/SNYK-JAVA-CHQOSLOGBACK-6097492 (CVE-2023-6481)
        - https://security.snyk.io/vuln/SNYK-JAVA-CHQOSLOGBACK-6097493 (CVE-2023-6481)
        - https://security.snyk.io/vuln/SNYK-JS-AXIOS-6144788
        - https://security.snyk.io/vuln/SNYK-JAVA-ORGBOUNCYCASTLE-6612984 (CVE-2024-30172)
        - https://security.snyk.io/vuln/SNYK-JAVA-ORGAPACHECOMMONS-6254296 (CVE-2024-25710)
 

## [2.4.3] - 2023-11-01
    - Fix contact link on About page
    - Upgraded from JDK to JRE 17.0.9
    - Upgraded backend dependencies:
      - CLARIN profiler to 1.0.14
      - dropwizard to 4.0.2
      - commons-compress to 1.24.0
    - Upgraded WebUI runtime dependencies:
       - axios to 1.6.0
       - core-js to 3.33.1
       - react-markdown to 9.0.0
       - react-redux to 8.1.3
       - react-router-dom to 6.17.0
       - react-select to 5.7.7
       - redux to 4.2.1
       - remark-gfm to 4.0.0
    -  Development project changes:
       - Add UI testing in CI via SauceLabs
       - Upgrade CLARIN node build image (registry.gitlab.com/clarin-eric/docker-alpine-clrs-build_env) to [2.4.3](https://gitlab.com/CLARIN-ERIC/docker-alpine-clrs-build_env/-/releases/2.4.3) 
       - Upgraded build Java docker base image: docker-alpine-supervisor-java-base to [openjdk17_jre-1.3.10](https://gitlab.com/CLARIN-ERIC/docker-alpine-supervisor-java-base/-/releases/openjdk17_jre-1.3.10)
       - Upgraded build UI test base image: cypress/browsers to [node-20.9.0-chrome-118.0.5993.88-1-ff-118.0.2-edge-118.0.2088.46-1](https://hub.docker.com/layers/cypress/browsers/node-20.9.0-chrome-118.0.5993.88-1-ff-118.0.2-edge-118.0.2088.46-1/images/sha256-c2f9b80afa112a99157b3f4bec793c7651bb9bdc292eb2a792e1ed4512763304?context=explore)
       - Fix warnings in github actions
       - Upgraded npm to 10.2.3
       - Upgraded WebUI development dependencies: 
         - babel/core to 7.23.2
         - babel/preset-env to 7.23.2
         - babel/preset-react to 7.22.15
         - babel-loader to 9.1.3
         - browserslist to 4.22.1
         - css-loader to 6.8.1
         - cypress to 13.3.2
         - eslint to 8.52.0
         - node-sass to 9.0.0
         - sass-loader to 13.2.2
         - style-loader to 3.3.3
         - stylelint to 15.11.0
         - stylelint-config-sass-guidelines to 10.0.0
         - stylelint-config-standard to 34.0.0
         - terser-webpack-plugin to 5.3.9
         - webpack to 5.89.0
         - webpack-bundle-analyzer to 4.9.1
         - webpack-cli to 5.1.4
         - webpack-dev-server to 4.15.1
         - webpack-merge to 5.10.0

## [2.4.2] - 2023-01-27
    - Added support for pre-flight API
	- Updated contributors and license information on About page
	- Upgraded to openJDK 17
	- Upgraded backend dependencies:
	   - dropwizard to 2.1.4
	   - commons-compress to 1.22.2
	   - httpclient-cache to 4.5.14
	   - junit to 4.13.2
	- Added backend dependencies:
	   - dropwizard-forms 2.1.4
	- Removed direct backend dependency declarations:
	  - slf4j-api (pulled as Dropwizard dependency)
	  - logback-core (pulled as Dropwizard dependency)
	  - logback-classic (pulled as Dropwizard dependency)
	  - httpclient (pulled as Tika profiler dependency)
	  - jersey-media-multipart (replaced by dropwizard-forms)
	  - validation-api
	- Upgraded WebUI runtime dependencies:
	   - axios to 1.2.1
	   - core-js to 3.26.1
	   - prop-types to 15.8.1
	   - history to 5.3.0
	   - react to 18.2.0
	   - react-dom to 18.2.0
	   - react-markdown to 8.0.4
	   - react-modal to 3.16.1
	   - react-redux to 8.0.5
	   - react-router-dom to 6.5.0
	   - react-router-hash-link to 2.4.3
	   - react-select to 5.7.0
	   - redux to 4.2.0
	   - redux-thunk to 2.4.2
	-  Development project changes:
	   - Increased Java tests connection timeout to 120000ms
	   - Upgraded build Java docker base image: docker-alpine-supervisor-java-base to `openjdk17-1.1.1` (was `openjdk11-2.1.0`)
	   - Upgraded build UI test base image: cypress/browsers to `node18.12.0-chrome106-ff106`
	   - Upgraded github actions run OS to ubuntu-22.04
	   - Upgraded github actions to v3
	   - Upgraded npm to 9.1.1
	   - Upgraded WebUI development dependencies: 
	     - babel/core to 7.20.5
	     - babel/plugin-proposal-class-properties to 7.18.6
	     - babel/preset-env to 7.20.2
	     - babel/preset-react to 7.18.6
	     - babel-loader to 9.1.0
	     - browserslist to 4.21.4
	     - css-loader to 6.7.3
	     - cypress to 12.2.0
	     - eslint to 8.27.0
	     - glob-parent to 6.0.2
	     - node-sass to 8.0.0
	     - sass-loader to 13.2.0
	     - stylelint to 14.16.0
	     - stylelint-config-standard to 29.0.0
	     - terser-webpack-plugin to 5.3.6
	     - webpack to 5.75.0
	     - webpack-bundle-analyzer to 4.7.0
	     - webpack-cli to 5.0.1
	     - webpack-dev-server to 4.11.1


## [2.4.1] - 2022-03-31
    - Added support for ranged requests e6f5c01adb8ccb655f9e65d5c9012a117778723b
    - Added "more text" button in content #244
    - Added support for multiple files sent by calling repositories
    - Added special content negotiation case for the CLARIN VCR (CMDI format)
    - Fixed resource leak when backend http requests return 40x (#278)
    - Improved Switchboard pop-up UI #247 
    - Improved "open" and "error" buttons d3acecb6ca43bc5517c0538e130dc8b62315a882
    - Upgraded backend dependencies:
      - dropwizard to 2.0.28
      - logback-classic to 1.2.10
      - logback-core to 1.2.10
      - slf4j-api to 1.7.36
    - Upgraded WebUI runtime dependencies:
      - axios to 0.24.0
      - core-js to 3.19.1
      - follow-redirects to 1.14.8
      - history to 5.1.0
      - nanoid to 3.2.0
      - react to 17.0.2
      - react-dom to 17.0.2
      - react-markdown to 7.1.0
      - react-modal to 3.14.4
      - react-redux to 7.2.6
      - react-select to 5.2.1
      - redux to 4.1.2
      - redux-thunk to 2.4.0
      - remark-gfm to 3.0.1
    - Development project changes:
      - Added UI tests #246.  UI tests are automatically run by github CI on each push #249 
      - Switch style language to SCSS
      - Added SCSS and Javascript linting
      - Updated docker images used in build to support multi-architecture
      - Upgrade npm to 8.3.2
      - Upgraded WebUI development dependencies: 
        - babel/core to 7.16.0
        - babel/plugin-proposal-class-properties to 7.16.0
        - babel/preset-env to 7.16.4
        - babel/preset-react to 7.16.0
        - babel-loader to 8.2.3
        - browserslist to 4.18.1
        - css-loader to 6.5.1
        - glob-parent to 5.1.2
        - style-loader to 3.3.1
        - webpack to 5.35.0
        - webpack-bundle-analyzer to 4.5.0
        - webpack-cli to 4.9.1
        - webpack-dev-server to 4.5.0
        - webpack-merge to 5.8.0
        - terser-webpack-plugin to 5.2.5
      - Added WebUI development dependencies:
        - cypress 9.1.0
        - cypress-file-upload 5.0.8
        - node-sass 7.0.0
        - sass-loader 2.3.0

## [2.4.0] - 2021-10-28
    - Support unique service ids
    - Improve resources UI
    - Add extract text option
    - Remove profiler submodule from source and install it as artifact from Maven Central
    - Support variadic inputs (optional and multiple resources per input)
    - Upgraded backend dependencies:
      - dropwizard to 2.0.25
      - logback-classic to 1.2.6
      - logback-core to 1.2.6
      - slf4j-api to 1.7.32
      - commons-compress to 1.21
    - Upgraded WebUI dependencies:
      - caniuse-lite to 1.0.30001251

## [2.3.3] - 2021-07-13
    - Allow repositories to customize Switchboard popup title

## [2.3.2] - 2021-06-29
    - Backwards compatibility for legacy repository calls

## [2.3.1] - 2021-06-24
    - Added dictionary mode when selecting short text, with editable selection
    - Show data outline for text based formats
    - Show contents of archive files
    - Show unsafe badge and description (on mouse hover) for tools not offering SSL transport
    - Multiple improvements to Switchboard popup
    - Added support for matching online tools which are not integrated with the Switchboard
    - Improved support for input of multiple files
    - Added configurable funding badge
    - Upgraded backend dependencies:
       - dropwizard to 2.0.22
    - Upgraded WebUI dependencies:
       - lodash to 4.17.21
       - browserslist to 4.16.5
     - Set content-encoding when serving text utf8 files
     - Allow repos to specialize resource profile (mediatype only)
     - Add maxFiles configuration entry

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
	- deleted superfluous methods (App.jsx: showFiles, handleChange)
	- deleted superfluous state information
	- deleted superfluous constants in util wrt. web services support
	- move code to clear Dropzones to DropArea component
	- new UI behaviour when invoked from VLO/D4Science/B2DROP
	- added cross-references to switchboard back-end repository in README.md

## [1.4.0] - 2018-11-30
### Removed
	- removed support for web services
	- (clrs-rest backend (registry) has not been updated yet)

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
