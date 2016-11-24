import React from 'react';
import ReactTestUtils from 'react-addons-test-utils'

const expect = require('expect');
import Rankings from '../Rankings';

describe('root', function () {
  it('renders without problems', function () {
    let root = ReactTestUtils.renderIntoDocument(<Rankings/>);
    expect(root).toExist();
  });
});
