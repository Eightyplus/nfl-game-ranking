import React from 'react';
import ReactTestUtils from 'react-addons-test-utils' // ES6

import { mount, shallow } from 'enzyme';
import { expect } from 'chai';
import Arrow from '../Arrow';

describe('Arrow', function () {
  it('renders without problems', function () {
    let arrow = ReactTestUtils.renderIntoDocument(<Arrow/>);
    expect(arrow).to.exits;
    expect(arrow).to.be.a('Object');
  });

  it('props', function () {
    let arrow = shallow(<Arrow week={8}/>);
    expect(arrow.props().directionLeft).to.be.undefined;
    expect(arrow.props().week).to.be.defined;
  });

  it('renders without problems', function () {
    let arrow = mount(<Arrow week={8}/>);
    expect(arrow).to.exits;
    expect(arrow).to.be.a('Object');
    expect(arrow.find('a').text()).to.be.equal('>');
  });

  it('renders without problems', function () {
    let arrow = mount(<Arrow directionLeft={true}/>);
    expect(arrow).to.exits;
    expect(arrow).to.be.a('Object');
    expect(arrow.find('a').text()).to.be.equal('<');
  });

  it('renders without problems', function () {
    let arrow = mount(<Arrow week={8} directionLeft={false}/>);
    expect(arrow).to.exits;
    expect(arrow).to.be.a('Object');
    expect(arrow.find('a').text()).to.be.equal('>');
    expect(arrow.find('a').html()).to.be.equal('<a href="/?week=8">&gt;</a>');
  });

  it('renders without problems', function () {
    let arrow = mount(<Arrow week={7} directionLeft={true}/>);
    expect(arrow).to.exits;
    expect(arrow).to.be.a('Object');
    expect(arrow.find('a').text()).to.be.equal('<');
    expect(arrow.find('a').html()).to.be.equal('<a href="/?week=7">&lt;</a>');
  });
});
