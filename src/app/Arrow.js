import React from 'react';
const { Component, PropTypes } = React;

module.exports = class Arrow extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const url = '/?week=' + this.props.week;
    const arrow = (this.props.directionLeft) ? '<' : '>';

    return (
      <div className="arrow">
        <a href={url}>{arrow}</a>
      </div>
    );
  }
};