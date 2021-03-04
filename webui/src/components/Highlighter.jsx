import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

const RE_ESCAPE_REGEX = /[-\/\\^$*+?.()|[\]{}]/g;


function escapeRegExp(string) {
    // $& means the whole matched string
    return string.replace(RE_ESCAPE_REGEX, '\\$&');
}

function spanRenderer({key, str, highlight}) {
    return (
        <span key={key} className={highlight ? "highlight" : ""}>
            { str }
        </span>
    );
}

function makeTextRenderer(terms) {
    let splitter = null;
    if (terms.length > 0) {
        const re_string = "("+terms.map(escapeRegExp).join("|")+")";
        splitter = new RegExp(re_string, 'gi');
    }
    return ({value}) => {
        const text = value || '';
        // Split on higlight term and include term into parts, ignore case
        const parts = splitter == null ? [text] : text.split(splitter);
        const spans = parts.map((part, i) => ({
            key: i,
            str: part,
            highlight: terms.some(term => term.toLowerCase() === part.toLowerCase()),
        }));
        return <span> { spans.map(spanRenderer) } </span> ;
    };
}

export function makeHighlighter(terms) {
    const textRenderer = makeTextRenderer(terms);
    return function({text, markdown, style}) {
        if (text && markdown) {
            console.warn("cannot render both text and markdown at the same time");
        }
        if (text) {
            return textRenderer({value:text});
        }
        return (
            <ReactMarkdown
                plugins={[gfm]}
                source={markdown}
                skipHtml={true}
                escapeHtml={true}
                renderers={{text: textRenderer}}
                linkTarget='_blank'
            />
        );
    };
};
