import React from 'react';
import PropTypes from 'prop-types';

export class Dropdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
        };
        this.handleToggle = this.handleToggle.bind(this);
    }
    static propTypes = {
        options: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired,
        type: PropTypes.string,
        className : PropTypes.string,
        disabled: PropTypes.bool,
    };

    handleToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        this.setState({open: !this.state.open});
    }

    handleClick(e, index) {
        e.preventDefault();
        e.stopPropagation();
        this.props.onClick(e, this.props.options[index], index);
    }

    render() {
        const opts = this.props.options;
        return (
            <div className={"btn-group" + this.state.open ? " open":""} style={{position:'relative'}}>
                <button type={this.props.type || "button"} className={"btn "+this.props.className}
                        disabled={this.props.disabled} onClick={e => this.handleClick(e, 0)}
                        style={opts[0].mstyle||{}}>
                            {opts[0].label}
                </button>
                <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                        disabled={this.props.disabled} aria-haspopup="true" aria-expanded="false"
                        onClick={this.handleToggle}>
                    <span className="caret"></span>
                    <span className="sr-only">Toggle Dropdown</span>
                </button>
                {!this.state.open ? false :
                <ul className="dropdown-menu dropdown-menu-right">
                    {opts.slice(1).map((child, index) =>
                        <li key={child.value} style={child.mstyle||{}}>
                            <a onClick={e => this.handleClick(e, 1+index)}>{child.label}</a>
                        </li>
                    )}
                </ul>
                }
            </div>
        );
    }
}