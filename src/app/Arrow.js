import React from 'react';
const { Component, PropTypes } = React;

export default class Arrow extends Component {

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