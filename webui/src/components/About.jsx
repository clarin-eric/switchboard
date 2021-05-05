import React from 'react';
import PropTypes from 'prop-types';
import {image} from '../actions/utils'

export default class About extends React.Component {
    render() {
        return (
            <React.Fragment>
                { this.props.fundingBadge && this.props.fundingBadge.sshoc ?
                    <div style={{float:'right'}}>
                        <img src={image('empoweredbysshoc.png')} height="128px" />
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
                    <li>Emanuel Dima (current developer and maintainer)</li>
                    <li>Claus Zinn (original developer, responsible for Switchboard design, back-end and front-end)</li>
                    <li>Marie Hinrichs, Wei Qui (integration of WebLicht)</li>
                    <li>Maarten van Gompel (integration of the CLAM Webservices)</li>
                    <li>Bart Jongejan (integration of the CLARIN-DK Tool Box)</li>
                    <li>Wojtek Rauk (integration of MorphoDoTa, WebSty, Morfeusz, Liner2 etc.)</li>
                    <li>Rafael Jaworski (integration of Concraft, Nerf, Spejd etc.)</li>
                    <li>Josef Misutka and Pavel Stranak (UDPipe)</li>
                    <li>Twan Goosen (switchboard integration in the VLO, Use Cases) </li>
                    <li>André Moreira (Use Cases, Dockerization)</li>
                    <li>Dieter Van Uytvanck (feedback on specification and usability, Use Cases)</li>
                    <li><em>Your Name Here</em> (integration of <em>your</em> tool)</li>
                </ul>


                <h3 id="licence">Licence</h3>
                <div className="licenceText">
                    <p>Copyright (C) 2017-2019 CLARIN ERIC</p>

                    <p>
                        This program is free software: you can redistribute it and/or modify it under the
                        terms of the GNU General Public License as published by the Free Software Foundation,
                        either version 3 of the License, or (at your option) any later version.
                    </p>

                    <p>
                        This program is distributed in the hope that it will be useful, but WITHOUT ANY
                        WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
                        PARTICULAR PURPOSE. See the GNU General Public License for more details.
                    </p>

                    <p>
                        You should have received a copy of the GNU General Public License along with this
                        program. If not, see <a href="http://www.gnu.org/licenses/">http://www.gnu.org/licenses/</a>.
                    </p>

                </div>

                <h3>Source Code</h3>
                <p>
                    The <a href="https://github.com/clarin-eric/switchboard">Switchboard GitHub repository</a> provides the source code.
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
                <p> We value your feedback! For any questions or suggestions, please <a href={ this.props.contact }>contact the Switchboard Team</a>. </p>
            </React.Fragment>
        );
    }
}
