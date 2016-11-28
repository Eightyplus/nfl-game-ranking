//const React = require('react');
//const ReactTestUtils = require('react-addons-test-utils') // ES5 with npm
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils' // ES6

import {assert, expect} from 'chai';
import Arrow from '../Arrow';

describe('Arrow', function () {
  it('renders without problems', function () {
    let root = ReactTestUtils.renderIntoDocument(<Arrow/>);
    expect(root).to.exits;
    expect(root).to.be.a('Object');
  });
});
