import React from 'react';
import { Link } from 'react-router-dom';
import { image } from '../actions/utils'
import {clientPath} from '../constants';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.closeNav = this.closeNav.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
        this.state = {
            showCollapsedNavbar: false
        };
    }

    closeNav(e) {
        this.setState({
            showCollapsedNavbar: false
        });
    }

    toggleNav(e) {
        this.setState((prevState) => ({
            showCollapsedNavbar: !prevState.showCollapsedNavbar
        }));
    }

    render() {
        const navCollapseClass = this.state.showCollapsedNavbar ? "collapse navbar-collapse text-right show" : "collapse navbar-collapse";
        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" aria-expanded="false" onClick={this.toggleNav}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand nav-link" href={clientPath.root} onClick={this.closeNav}>
                            <span style={{fontSize:16, marginRight:2}} className="glyphicon glyphicon-cog" aria-hidden="true"/>
                            <span style={{fontSize:20}}>Language Resource Switchboard</span>
                        </a>
                    </div>

                    <div className={navCollapseClass}>
                        <ul className="nav navbar-nav">
                            <li className="nav-item" onClick={this.closeNav}>
                                <Link className="nav-link all-tools" to={clientPath.tools} onClick={this.closeNav}>Tool Inventory</Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <li className="nav-item" onClick={this.closeNav}>
                                <Link className="nav-link" to={clientPath.help} onClick={this.closeNav}>Help</Link>
                            </li>
                            <li className="nav-item" onClick={this.closeNav}>
                                <Link className="nav-link" to={clientPath.faq} onClick={this.closeNav}>FAQ</Link>
                            </li>
                            <li className="nav-item" onClick={this.closeNav}>
                                <Link className="nav-link" to={clientPath.developers} onClick={this.closeNav}>For Developers</Link>
                            </li>
                            <li className="nav-item" onClick={this.closeNav}>
                                <a href="http://www.clarin.eu/" style={{padding:0, marginLeft:20}}>
                                    <img src={image('clarin-logo-wide.png')} width="119px" height="46px" />
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
