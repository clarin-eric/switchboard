import React from 'react';
import { Link } from 'react-router-dom';
import { image } from '../actions/utils'
import {clientPath} from '../constants';

export class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.gotoUpload = this.gotoUpload.bind(this);
        this.closeNav = this.closeNav.bind(this);
        this.toggleNav = this.toggleNav.bind(this);
        this.state = {
            showCollapsedNavbar: false
        };
    }

    gotoUpload(e) {
        this.closeNav(e);
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
        if (this.props.mode === 'popup') {
            return false;
        }

        const navCollapseClass = this.state.showCollapsedNavbar ?
            "collapse navbar-collapse text-right show" :
            "collapse navbar-collapse";
        const navItemClass = (url) => {
            const currentUrl = window.location.href;
            return "nav-item" + (currentUrl.endsWith(url) ? " active" : "");
        }
        return (
            <nav className="navbar navbar-static-top navbar-default">
                <div className="container">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" aria-expanded="false" onClick={this.toggleNav}>
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <a className="navbar-brand nav-link" href={clientPath.root}
                           target="_self" onClick={this.closeNav} >
                            <span style={{fontSize:14, marginRight:2}} className="glyphicon glyphicon-cog" aria-hidden="true"/>
                            <span style={{fontSize:18}}>Language Resource Switchboard</span>
                        </a>
                    </div>

                    <div className={navCollapseClass}>
                        <ul className="nav navbar-nav">
                            <li className={navItemClass(clientPath.input)} onClick={this.closeNav}>
                                <Link className="nav-link input" to={clientPath.input} onClick={this.gotoUpload}>Upload</Link>
                            </li>
                            <li className={navItemClass(clientPath.tools)} onClick={this.closeNav}>
                                <Link className="nav-link all-tools" to={clientPath.tools} onClick={this.closeNav}>Tool Inventory</Link>
                            </li>
                            <li className={navItemClass(clientPath.help)} onClick={this.closeNav}>
                                <Link className="nav-link" to={clientPath.help} onClick={this.closeNav}>Help</Link>
                            </li>
                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                            <a href="http://www.clarin.eu/" onClick={this.closeNav}
                                style={{padding:0, marginLeft:20}}>
                                <img src={image('clarin-logo-wide.png')} width="119px" height="46px" />
                            </a>
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}
