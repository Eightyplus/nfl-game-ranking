import React from 'react';
import ReactTestUtils from 'react-addons-test-utils'
import sinon from 'sinon';

import { mount, shallow } from 'enzyme';
//import {expect} from 'chai';

const expect = require('expect');
import Rankings from '../Rankings';

const json = {"year":2016,"week":"4","rankings":[{"away_name":"Saints","home_name":"Chargers","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/NO.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/SD.png","ranking":58,"game_score":{"total":69,"qt_diff":21,"diff":1},"away_score":35,"home_score":34,"done":"FINAL"},{"away_name":"Panthers","home_name":"Falcons","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/CAR.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/ATL.png","ranking":53,"game_score":{"total":81,"qt_diff":41,"diff":15},"away_score":33,"home_score":48,"done":"FINAL"},{"away_name":"Raiders","home_name":"Ravens","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/OAK.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/BAL.png","ranking":47,"game_score":{"total":55,"qt_diff":15,"diff":1},"away_score":28,"home_score":27,"done":"FINAL"},{"away_name":"Colts","home_name":"Jaguars","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/IND.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/JAX.png","ranking":40,"game_score":{"total":57,"qt_diff":31,"diff":3},"away_score":27,"home_score":30,"done":"FINAL"},{"away_name":"Titans","home_name":"Texans","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/TEN.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/HOU.png","ranking":32,"game_score":{"total":47,"qt_diff":23,"diff":7},"away_score":20,"home_score":27,"done":"FINAL"},{"away_name":"Seahawks","home_name":"Jets","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/SEA.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/NYJ.png","ranking":31,"game_score":{"total":44,"qt_diff":16,"diff":10},"away_score":27,"home_score":17,"done":"FINAL"},{"away_name":"Cowboys","home_name":"49ers","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/DAL.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/SF.png","ranking":27,"game_score":{"total":41,"qt_diff":21,"diff":7},"away_score":24,"home_score":17,"done":"FINAL"},{"away_name":"Browns","home_name":"Redskins","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/CLE.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/WAS.png","ranking":23,"game_score":{"total":51,"qt_diff":45,"diff":11},"away_score":20,"home_score":31,"done":"FINAL"},{"away_name":"Chiefs","home_name":"Steelers","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/KC.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/PIT.png","ranking":21,"game_score":{"total":57,"qt_diff":43,"diff":29},"away_score":14,"home_score":43,"done":"FINAL"},{"away_name":"Giants","home_name":"Vikings","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/NYG.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/MIN.png","ranking":20,"game_score":{"total":34,"qt_diff":14,"diff":14},"away_score":10,"home_score":24,"done":"FINAL"},{"away_name":"Lions","home_name":"Bears","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/DET.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/CHI.png","ranking":20,"game_score":{"total":31,"qt_diff":19,"diff":3},"away_score":14,"home_score":17,"done":"FINAL"},{"away_name":"Rams","home_name":"Cardinals","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/LA.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/ARI.png","ranking":16,"game_score":{"total":30,"qt_diff":24,"diff":4},"away_score":17,"home_score":13,"done":"FINAL"},{"away_name":"Broncos","home_name":"Buccaneers","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/DEN.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/TB.png","ranking":14,"game_score":{"total":34,"qt_diff":20,"diff":20},"away_score":27,"home_score":7,"done":"FINAL"},{"away_name":"Dolphins","home_name":"Bengals","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/MIA.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/CIN.png","ranking":14,"game_score":{"total":29,"qt_diff":15,"diff":15},"away_score":7,"home_score":22,"done":"FINAL"},{"away_name":"Bills","home_name":"Patriots","away_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/BUF.png","home_logo":"http://i.nflcdn.com/static/site/7.4/img/logos/teams-matte-80x53/NE.png","ranking":0,"game_score":{"total":16,"qt_diff":16,"diff":16},"away_score":16,"home_score":0,"done":"FINAL"}],"unplayed":[]};


describe('root', function () {
  let sandbox;
  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  it('renders without problems, method stubbed', function (done) {

    sinon.stub(Rankings.prototype, 'getRanking').returns(
      new Promise(function(resolve, reject) {
        resolve(json);
    }));
    let ranking = ReactTestUtils.renderIntoDocument(<Rankings/>);

    expect(ranking).toExist();
    expect(ranking.state.rankings).toExist();

    if (ranking.state.rankings === []) {
      fail('The rankings was not update within 1 second.');
    }
    done();
  });

  it('renders without problems, endpoint uses karma proxy', function (done) {

    let ranking = ReactTestUtils.renderIntoDocument(<Rankings/>);

    expect(ranking).toExist();
    expect(ranking.state.rankings).toExist();

    if (ranking.state.rankings === []) {
      fail('The rankings was not update within 1 second.');
    }
    done();
  });
});

/*
describe('root', function () {
    var server;
   before( function(){
   server = sinon.fakeServer.create();
   server.autoRespond = true;
   const response = [200, { "Content-Type": "application/json" },
   //rawFile.responseText, //fs.readFileSync('http_localhost_8000_rankingweek4.json')
   //'[{ "id": 12, "comment": "Hey there" }]'
   JSON.stringify(json)
   ];

   const xhr = function (xhr) {  xhr.respond(200, { 'Content-Type': 'application/json' }, json); };

   //server.respondWith(response); //"GET", "/ranking\\?year=2016", xhr);
   //server.respondWith('GET', 'ranking\\?year=2016', );
   });

   after( function(){
   server.restore();
   });

  it('renders without problems', function (done) {

    //const ranking = shallow(<Rankings/>);

    sinon.stub(Rankings.prototype, 'getRanking').returns(
      new Promise(function(resolve, reject) {
        resolve(json);
      }));
    let ranking = ReactTestUtils.renderIntoDocument(<Rankings/>);

    //ranking.setState(json);
    //server.respond();

    expect(ranking).toExist();
    //expect(ranking.state.rankings).toExist();

    setTimeout(() => {
      // if we call expect here and it fails, we won't get the right error message, but instead an async timeout message
      if (ranking.state.rankings === []) {
        fail('The rankings was not update within 1 second.');
      }
      done(); // the done call ensures our test does not timeout, nor waste any extra time. It is called even if fail was called
    }, 1000);
  });
});
*/

/*

describe('client', function () {

  var server = null;

  beforeEach(function () {
    server = sinon.fakeServer.create();
  });

  afterEach(function () {
    server.restore();
  });

  describe('responding to a generic request', function () {

    beforeEach(function () {
      var okResponse = [
        200,
        { 'Content-type': 'application/json' },
        '{"hello":"world"}'
      ];

      server.respondWith('GET', '/hello', okResponse);
    });

    it('returns correct body', function (done) {
      fetch('/hello')
        .then( (response) => {
          console.log(response);
          return response.json()
        })
        .then( (json) => {
          console.log(json);
          expect(json.hello).toBe('world');
          done();
          return json;
        })
        .catch((error) => {
          console.log(error);
          done(error);
        });
      server.respond();
    });
  });
});*/