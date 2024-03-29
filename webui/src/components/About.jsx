import React from 'react';
import PropTypes from 'prop-types';
import {image} from '../actions/utils'

export default class About extends React.Component {
    render() {
        return (
            <React.Fragment>
                { this.props.showFundingBadge ?
                    <div style={{float:'right'}}>
                        <img src={image('fundingbadge.png')} height="128px" />
                    </div> : false
                }
                <h2>About</h2>
                <p>
                    The Language Resource Switchboard has been developed
                    within the <a href="http://www.clarin.eu/">CLARIN-PLUS</a> project. It helps
                    users to find and start tools that can process their research data.
                </p>

                <h3>Publications</h3>
                <ul>
                    <li>Claus Zinn, The Language Resource Switchboard. Computational Linguistics 44(4), pages 631-639, December 2018.</li>
                    <li>Claus Zinn. <a href="http://www.ep.liu.se/ecp/147/004/ecp17147004.pdf">A Bridge
                    from EUDAT's B2DROP cloud service to CLARIN's Language Resource
                    Switchboard </a>Selected papers from the CLARIN Annual Conference 2017, Budapest,
                    18-20 September 2017, Linköping University Electronic Press vol. 147, pages 36-45,
                    2018.</li>
                    <li>Claus
                    Zinn. <a href="https://www.clarin.eu/sites/default/files/zinn-CLARIN2016_paper_26.pdf">
                    The CLARIN Language Resource Switchboard.</a> CLARIN 2016 Annual Conference,
                    Aix-en-Provence, France, 2016.</li>
                    <li>Claus Zinn, Marie Hinrichs, Emanuel Dima, Dieter van
                    Uytvanck. <a href="https://office.clarin.eu/v/CE-2015-0684-LR_switchboard_spec.pdf">The
                            Switchboard specification </a>(Milestone 2.2 of the CLARIN-PLUS project).</li>
                    <li>Claus
                    Zinn. <a href="https://office.clarin.eu/v/CE-2016-0881-CLARINPLUS-D2_5.pdf">D2.5 LR
                    Switchboard (software)</a> Deliverable in the CLARIN-PLUS project.</li>
                </ul>

                <h3>Credits</h3>
                <p>
                    The following people have contributed to the Switchboard:
                </p>
                <ul>
                    <li>André Moreira (current codebase maintainer. Use Cases, Dockerization and continuous integration)</li>
                    <li>Twan Goosen (current codebase maintainer. Switchboard integration in the <a href="https://vlo.clarin.eu">VLO</a>, use Cases) </li>
                    <li>Alexander König (switchboard tools management) </li>
                    <li>Emanuel Dima (former developer and maintainer, original developer of the current implementation [Switchboard 2])</li>
                    <li>Claus Zinn (former developer and maintainer, original developer of proof of concept implementation [Switchboard 1])</li>
                    <li>Marie Hinrichs, Wei Qui (integration of WebLicht)</li>
                    <li>Maarten van Gompel (integration of the CLAM Webservices)</li>
                    <li>Bart Jongejan (integration of the CLARIN-DK Tool Box)</li>
                    <li>Wojtek Rauk (integration of MorphoDoTa, WebSty, Morfeusz, Liner2 etc.)</li>
                    <li>Rafael Jaworski (integration of Concraft, Nerf, Spejd etc.)</li>
                    <li>Josef Misutka and Pavel Stranak (UDPipe)</li>
                    <li>Willem Elbers (Switchboard integration in the <a href="https://collections.clarin.eu">VCR</a>) </li>
                    <li>Dieter Van Uytvanck (feedback on specification and usability, Use Cases)</li>
                    <li><em>Your Name Here</em> <a href="https://github.com/clarin-eric/switchboard-tool-registry#how-to-add-a-tool-to-the-switchboard">(integration of <em>your</em> tool)</a></li>
                </ul>

                <h3>Source Code</h3>
                <p>
                    The <a href="https://github.com/clarin-eric/switchboard">Switchboard GitHub repository</a> provides the source code.
                </p>

                <p>
                    The Switchboard is open source software, and all of its code is released under a GNU General Public License Version 3 (GPLv3) licence.
                    The <a href="https://github.com/clarin-eric/switchboard/blob/-/LICENCE">full licence</a> can be found in the source code repository and in the packaged sources and binaries.
                </p>

                <h3 id="funding">Funding</h3>
                <p>Development of the Language Resource Switchboard has been made possible in part through funding received from the European Union’s Horizon 2020 research and innovation programme through:
                </p>
                <ul>
                    <li><a href="https://www.clarin.eu/content/clarin-stronger-ever-clarin-plus-project-outcomes">CLARIN-PLUS</a> under grant agreement No 676529</li>
                    <li><a href="https://www.eosc-hub.eu/">EOSC-hub</a> under grant agreement No 777536</li>
                    <li><a href="https://www.sshopencloud.eu/">SSHOC</a> under grant agreement No 823782</li>
                </ul>

                <hr />
                <p> We value your feedback! For any questions or suggestions, please <a href={'mailto:'+this.props.contact}>contact the Switchboard Team</a>. </p>
            </React.Fragment>
        );
    }
}
