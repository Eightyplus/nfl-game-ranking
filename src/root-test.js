//const React = require('react');
//const ReactTestUtils = require('react-addons-test-utils') // ES5 with npm
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils' // ES6

const expect = require('expect');
import Rankings from '../src/app/Rankings'; //my root-test lives in components/__tests__/, so this is how I require in my components.

describe('root', function () {
  it('renders without problems', function () {
    let root = ReactTestUtils.renderIntoDocument(<Rankings/>);
    expect(root).toExist();
  });
});
