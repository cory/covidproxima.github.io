// (c) Cory Ondrejka 2020
'use strict'

import * as Data from './data/data.js?cachebust=11042';
import Animate from './lib/animate.js?cachebust=11042';
import * as DomQuery from './lib/domquery.js?cachebust=11042';
import Archive from './lib/render/archive.js?cachebust=11042';
import States from './lib/render/states.js?cachebust=11042';
import RawData from './lib/render/rawdata.js?cachebust=11042';
import * as SVG from './lib/svg.js?cachebust=11042';
import * as Colors from './lib/util/colors.js?cachebust=11042';
import Fetcher from './lib/util/fetcher.js?cachebust=11042';
import Navigate from './lib/util/navigate.js?cachebust=11042';
import * as Router from './lib/util/router.js?cachebust=11042';
import * as ProcData from './data/procdata.js?cachebust=11042';

let gData;

Colors.init();
Router.hook();
SVG.init(Animate);

let BackgroundSVG;

function loadingComplete() {
  let el = document.getElementById('preload');
  el.parentElement.removeChild(el);
  let els = document.getElementsByClassName('title');
  els[0].style.opacity = '1';
  els = document.getElementsByClassName('content');
  els[0].style.opacity = '1';
}

function updateStateProgress(txt) {
  progress.textContent = 'Reading ' + txt + ' bytes from state COVID data';
}

function updateCountyProgress(txt) {
  progress.textContent = 'Reading ' + txt + ' bytes from county COVID data from the New York Times on GitHub';
}

function updateCachedDataProgress() {
  progress.textContent = 'NY Times data no longer being updated, processing local file';
}

function updateNavLinks(showlinks) {
  let child = document.getElementById('sidearchive');
  if (child) {
    child.parentElement.removeChild(child);
  }
  if (showlinks) {
    let nav = document.getElementById('navbar');
    child = document.createElement('div');
    child.innerHTML = Archive('side');
    child.id = 'sidearchive';
    nav.appendChild(child);
  }
}

function onceFetched(thedata) {
  progress.textContent = 'Building query database';
  let div = document.getElementById('contentroot');
  BackgroundSVG = SVG.addViaID('background-map', 51117, null, null, () => {
    SVG.queryToColorsAndViewPort(BackgroundSVG, { f: 8, text: '' }, null, thedata);
    loadingComplete();
    updateNavLinks(true);
    let home = (path) => {
      Navigate(path, div, () => {
        updateNavLinks(true);
        DomQuery.init(Data, thedata);
      }, 0);
    };
    let dash = () => {
      Navigate(['data', 'dashboard'], div, () => {
        updateNavLinks(false);
        DomQuery.init(Data, thedata);
      }, 0);
    };
    let howmany = () => {
      Navigate(['data', 'howmany'], div, () => {
        updateNavLinks(false);
        DomQuery.init(Data, thedata);
      }, 0);
    };
    let explore = () => {
      Navigate(['data', 'explore'], div, () => {
        updateNavLinks(false);
        DomQuery.init(Data, thedata);
      }, 0);
    };
    let archive = () => {
      updateNavLinks(false);
      div.innerHTML = Archive('story');
    };
    let states = (path) => {
      updateNavLinks(false);
      div.innerHTML = States(path);
      DomQuery.init(Data, thedata);
    };
    let posts = (path) => {
      Navigate(path, div, () => {
        updateNavLinks(false);
        DomQuery.init(Data, thedata);
      }, 0);
    };
    let about = () => {
      Navigate(['about'], div, () => {
        updateNavLinks(false);
        DomQuery.init(Data, thedata);
      }, 0);
    };
    let rawdata = () => {
      updateNavLinks(false);
      div.innerHTML = RawData(thedata);
    };
    Router.addRoute('', home);
    Router.addRoute('home', home);
    Router.addRoute('dash', dash);
    Router.addRoute('howmany', howmany);
    Router.addRoute('dashboard', dash);
    Router.addRoute('explore', explore);
    Router.addRoute('archive', archive);
    Router.addRoute('states', states);
    Router.addRoute('posts', posts);
    Router.addRoute('about', about);
    Router.addRoute('rawdata', rawdata);
    Router.go();
  });
}

if (true && (ProcData.data !== undefined)) {
  progress.textContent = 'Processing COVID-19 data';
  setTimeout(() => {
    gData = ProcData.data;
    Data.setPlaces(gData);
    updateCachedDataProgress();
    onceFetched(gData);
  }, 100);
} else {
  Fetcher('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv',
    updateCountyProgress,
    (data) => {
      Fetcher('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-states.csv',
        updateStateProgress,
        (stateData) => {
          progress.textContent = 'Processing COVID-19 data';
          setTimeout(() => {
            gData = Data.BuildData(data, stateData);
            onceFetched(gData);
          });
        });
    });
}