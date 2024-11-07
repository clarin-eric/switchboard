[![Build+Test+Release pipeline](https://github.com/clarin-eric/switchboard/actions/workflows/main.yml/badge.svg?branch=master)](https://github.com/clarin-eric/switchboard/actions/workflows/main.yml)
[![Sauce Test Status](https://saucelabs.com/buildstatus/switchboard)](https://app.saucelabs.com/u/switchboard)

[![Build Status](https://app.saucelabs.com/browser-matrix/switchboard.svg)](https://saucelabs.com/u/switchboard)

# switchboard
Code Repository for the Language Resource Switchboard.

The implementation is based upon reactjs and related packages. It contains a standalone upload site,
where users can drag&drop their language resource(s). Each resource can be associated with a
mimetype (detected during file drop) or edited by the user thereafter, and a language code (iso
639-3). The demo upload site depicts each language resource with all relevant information, the user
can then ask the switchboard to display all tools capable of processing the resource in question.
Clicking on a tool icon opens the tool in a new tab. All relevant information (link to the
resource, language code, mimetype etc.) is encoded in the URL used to invoke the tool.

# Website

 * production version: https://switchboard.clarin.eu
 * beta version: https://beta-switchboard.clarin.eu/
 * alpha/development version: https://switchboard.clarin-dev.eu/switchboard-test/

# Status
The software is currently being developed and actively maintained.

# Documentation

For more technical details, see the Switchboard specification in the Publications section. For a
general overview with the latest published update, see the Computational Linguistics paper in the
Publications section (last entry).

There is also a <a href="https://github.com/clarin-eric/switchboard-doc">github repository</a> holding documentation.

# Tool registry

The information about the tools that are connected to the Switchboard is maintained in a <a href="https://github.com/clarin-eric/switchboard-tool-registry">separate github repository</a>. Suggestions about new tools or about improved descriptions can be filed as a <a href="https://github.com/clarin-eric/switchboard-tool-registry/issues">tool registry issue</a>.

# Publications

- The Switchboard specification (Milestone 2.2 of the CLARIN-PLUS project), see https://office.clarin.eu/v/CE-2015-0684-LR_switchboard_spec.pdf

- Claus Zinn. The CLARIN Language Resource Switchboard. CLARIN 2016 Annual Conference, Aix-en-Provence, France, 2016.
See https://www.clarin.eu/sites/default/files/zinn-CLARIN2016_paper_26.pdf

- Claus Zinn: A Bridge from EUDAT's B2DROP Cloud Service to CLARIN's Language Resource Switchboard, Proceedings of the CLARIN Annual Conference, Budapest, Hungary, 2017. See below for an extended version.

- Claus Zinn. <a href="http://www.ep.liu.se/ecp/147/004/ecp17147004.pdf"> A Bridge from EUDAT's B2DROP cloud service to CLARIN's Language Resource Switchboard.</a> Selected papers from the CLARIN Annual Conference 2017, Budapest, 18-20 September 2017, Linköping University Electronic Press, vol. 147, pages 36-45, 2018.

- Claus Zinn, <a href="https://www.mitpressjournals.org/doi/pdf/10.1162/coli_a_00329"> The Language Resource Switchboard. </a> Computational Linguistics 44(4), pages 631-639, December 2018.

# Contact

For questions and remarks, please contact switchboard@clarin.eu


### Acknowledgment

Automated cross-browser testing platform provided by [Sauce Labs][homepage] with ❤️ for open source 

[homepage]: https://saucelabs.com
