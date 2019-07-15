// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
//
// File: Tool.jsx
// Time-stamp: <2019-01-16 10:53:55 (zinn)>
// -------------------------------------------

import React from 'react';
import { Accordion, AccordionItem, AccordionItemTitle, AccordionItemBody } from 'react-accessible-accordion';

import { map639_1_to_639_3, map639_3_to_639_1, image } from '../back-end/util';
import {gatherInvocationParameters, invokeBrowserBasedTool} from '../back-end/ToolInvoker';
import Request from 'superagent';

export default class Tool extends React.Component {
    constructor(props) {
        super(props);

        const {cb, items, resource, ...otherProps} = this.props;
        this.cb = cb;
        this.invokeTool = this.invokeTool.bind(this);
    }

    invokeTool( URL ) {
        _paq.push(["trackEvent", 'ToolInvocation', URL]);
        invokeBrowserBasedTool( URL );
    }

    render() {
        const {items, resource, ...props} = this.props;

        const styles = {
            cardHeader: {
                display: 'flex',
                height: '100px',
                alignItems: 'center',
                padding: '10px 20px',
                color: '#000',
            },
        };

        const ProfilePicture = ({ imgSrc, borderColor }) => (
        <img
                style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '100%',
                        border: `3px solid ${borderColor}`
                }}
                src={imgSrc}
        />
        );

        const ToolCard = (props) => {
            const fullURL = gatherInvocationParameters(props, resource);
            const authenticationNotRequired = (props.authentication == "no");
            const outputFormats = (props.output === undefined) || ((props.output instanceof Array) && props.output.join(', ')) || props.output;

            return (
              <div style={{ position: 'relative', top: 0 }}>
                <header style={styles.cardHeader} className='card-header-details'>
                  <ProfilePicture imgSrc={props.imgSrc} borderColor={props.imgBorderColor} />
                    {fullURL ?
                      <button className="btn-info btn-lg" style={{marginLeft:16}}
                        onClick={this.invokeTool.bind(this, fullURL)}>
                        Click to start tool
                      </button> : false
                    }
                </header>

                <div style={{color: '#000'}}>
                  <DetailsRow
                    title="Description"
                    summary={props.role}
                    />

                  <DetailsRow
                    title="Home"
                    summary={props.homepage}
                    />

                  { authenticationNotRequired
                    ? <DetailsRow
                        title="Authentication"
                        summary={props.authentication} />
                    : <DetailsRow
                        title="Authentication"
                        summary={props.authentication} />
                  }

                  <DetailsRow
                     title="Output Format"
                     summary={outputFormats}
                     />

                 <DetailsRow
                    title="Location"
                    summary={props.location}
                    />

                 <DetailsRow
                    title="e-mail"
                    summary={props.email}
                    />

               </div>
             </div>
            )
        };

        const DetailsRow = ({ title, summary }) => {
            if (!summary) {
              return null;
            }

            return (
                <div style={{alignSelf: 'flex-start'}}>
                  <div style={{ width: '100%' }}>
                    <dl className="dl-horizontal">
                      <dt>{title}</dt>
                      <dd>{title == "Home"
                            ? <a href={summary} target="_blank"> {summary }</a>
                            : summary
                          }
                      </dd>
                    </dl>
                  </div>
                </div>
            );
        };

        return (
                <Accordion accordion={false} >
                  { items.map( (element, index) =>
                    <AccordionItem key={index} >
                      <AccordionItemTitle>
                        <h4>{element.name}</h4>
                      </AccordionItemTitle>
                      <AccordionItemBody>
                        <ToolCard key={index}
                                  imgSrc={image(element.logo)}
                                  imgBorderColor='#6A067A'
                                  name={element.name}
                                  title={element.name}
                                  softwareType={element.softwareType}
                                  requestType={element.requestType}
                                  location={element.location}
                                  authentication={element.authentication}
                                  homepage={element.homepage}
                                  url={element.url}
                                  parameters={element.parameters}
                                  mapping={element.mapping}
                                  output={element.output}
                                  langEncoding={element.langEncoding}
                                  email={element.email}
                                  role={element.description}
                                  />
                      </AccordionItemBody>
                    </AccordionItem>
                  )}
            </Accordion>
        )}
}
