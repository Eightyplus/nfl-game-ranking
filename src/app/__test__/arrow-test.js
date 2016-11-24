//const React = require('react');
//const ReactTestUtils = require('react-addons-test-utils') // ES5 with npm
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils' // ES6

const expect = require('expect');
import Arrow from '../Arrow';

describe('Arrow', function () {
  it('renders without problems', function () {
    let root = ReactTestUtils.renderIntoDocument(<Arrow/>);
    expect(root).toExist();
  });
});
