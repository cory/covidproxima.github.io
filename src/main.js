// (c) Cory Ondrejka 2020
'use strict'

import * as Data from './data/data.js?cachebust=44302';
import Animate from './lib/animate.js?cachebust=44302';
import * as DomQuery from './lib/domquery.js?cachebust=44302';
import Archive from './lib/render/archive.js?cachebust=44302';
import States from './lib/render/states.js?cachebust=44302';
import * as SVG from './lib/svg.js?cachebust=44302';
import * as Colors from './lib/util/colors.js?cachebust=44302';
import Fetcher from './lib/util/fetcher.js?cachebust=44302';
import Navigate from './lib/util/navigate.js?cachebust=44302';
import * as Router from './lib/util/router.js?cachebust=44302';

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

function updateProgress(txt) {
  progress.textContent = 'Reading ' + txt + ' bytes from the New York Times on GitHub';
}

function updateNavLinks() {
  let nav = document.getElementById('navbar');
  let child = document.createElement('div');
  child.innerHTML = Archive('side');
  nav.appendChild(child);
}

Fetcher('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv',
  updateProgress,
  (data) => {
    progress.textContent = 'Processing COVID-19 data';
    setTimeout(() => {
      gData = Data.BuildData(data);
      progress.textContent = 'Building query database';
      let div = document.getElementById('contentroot');
      BackgroundSVG = SVG.addViaID('background-map', 51117, null, null, () => {
        SVG.queryToColorsAndViewPort(BackgroundSVG, { f: 8, text: '' }, null, gData);
        loadingComplete();
      });
      updateNavLinks();
      let home = (path) => {
        Navigate(path, div, () => {
          DomQuery.init(Data, gData);
        }, 0);
      };
      let dash = () => {
        Navigate(['data', 'dashboard'], div, () => {
          DomQuery.init(Data, gData);
        }, 0);
      };
      let howmany = () => {
        Navigate(['data', 'howmany'], div, () => {
          DomQuery.init(Data, gData);
        }, 0);
      };
      let explore = () => {
        Navigate(['data', 'explore'], div, () => {
          DomQuery.init(Data, gData);
        }, 0);
      };
      let archive = () => {
        div.innerHTML = Archive('story');
      };
      let states = (path) => {
        div.innerHTML = States(path);
        DomQuery.init(Data, gData);
      };
      let posts = (path) => {
        Navigate(path, div, () => {
          DomQuery.init(Data, gData);
        }, 0);
      };
      let about = () => {
        Navigate(['about'], div, () => {
          DomQuery.init(Data, gData);
        }, 0);
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
      Router.go();
    });
  });
