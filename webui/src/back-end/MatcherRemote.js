// -------------------------------------------
// The CLARIN Language Resource Switchboard
// 2016-18 Claus Zinn, University of Tuebingen
//
// File: MatcherRemote.js
// Time-stamp: <2019-03-15 16:25:23 (zinn)>
// -------------------------------------------

import Request from 'superagent';
import binaryParser from 'superagent-binary-parser';
import {matcherURL, deploymentStatus} from './util';

export default class MatcherRemote {

    constructor() {
        this.includeWebServices = true;
    }

    getAllTools() {
        const includeWS = (this.includeWebServices ? "yes" : "no");
        const deployment = ((deploymentStatus == "production") ? "production" : "development");
        const that = this;
        return new Promise(function(resolve, reject) {
            Request
                .get(window.APP_CONTEXT_PATH
                     + '/api/tools?includeWS='+includeWS
                     + '&deployment='+deployment
                     + '&sortBy=tools')
                .set('Accept', 'application/json')
                .end((err, res) => {
                if (err) {
                    console.error('MatcherRemote/getAllTools failed: ', err);
                    reject(err);
                } else {
                    resolve(res.body);
                }
                })});
    }

    getSupportedMimetypes() {
        const that = this;
        return new Promise(function(resolve, reject) {
            Request
                .get(window.APP_CONTEXT_PATH + '/api/mimetypes')
                .set('Accept', 'application/json')
                .end((err, res) => {
                if (err) {
                    console.error('MatcherRemote/getSupportedMimetypes failed: ', err);
                    reject(err);
                } else {
                    resolve(res.body);
                }
                })});
    }

    getSupportedLanguages() {
        const that = this;
        return new Promise(function(resolve, reject) {
            Request
                .get(window.APP_CONTEXT_PATH + '/api/languages')
                .set('Accept', 'application/json')
                .end((err, res) => {
                if (err) {
                    console.error('MatcherRemote/getSupportedLanguages failed: ', err);
                    reject(err);
                } else {
                    resolve(res.body);
                }
                })});
    }

    getApplicableTools(mimetype, language) {
        const includeWS = (this.includeWebServices ? "yes" : "no");
        const deployment = ((deploymentStatus == "production") ? "production" : "development");
        const that = this;
        return new Promise(function(resolve, reject) {
            Request
                .get(window.APP_CONTEXT_PATH
                     + '/api/tools?includeWS='+includeWS
                     + '&deployment='+deployment
                     + '&language=' + language
                     + '&mimetype=' + mimetype
                     + '&sortBy=tools')
                .set('Accept', 'application/json')
                .end((err, res) => {
                if (err) {
                    console.error('MatcherRemote/getApplicableTools failed: ', err);
                    reject(err);
                } else {
                    resolve(res.body);
                }
                })});
    }
}


