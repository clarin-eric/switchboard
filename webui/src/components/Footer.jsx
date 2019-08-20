import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export const Footer = ({ version, contactEmail }) => (
    <footer id="footer">
        <div className="container">
            <div className="row">
                <div className="col-sm-2 col-xs-12  text-center">
                    <Link className="nav-link" to='/help/about'>About</Link>
                    <div className="version-info text-center-xs"> v{version} </div>
                </div>
                <div className="col-sm-8 col-xs-12">
                    <div className="text-center">
                        <span className="footer-fineprint"> Service provided by <a href="https://www.clarin.eu">CLARIN</a> </span>
                    </div>
                </div>
                <div className="col-sm-2 col-xs-12">
                    <div className="text-center"> <a href={'mailto:'+contactEmail}>Contact</a> </div>
                </div>
            </div>
        </div>
    </footer>
);


Footer.propTypes = {
    version: PropTypes.string,
};
