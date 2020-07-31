// (c) Cory Ondrejka 2020
'use strict'

import * as Data from './data/data.js';
import Animate from './lib/animate.js';
import * as DomQuery from './lib/domquery.js';
import Archive from './lib/render/archive.js';
import States from './lib/render/states.js';
import * as SVG from './lib/svg.js';
import * as Colors from './lib/util/colors.js';
import Fetcher from './lib/util/fetcher.js';
import Navigate from './lib/util/navigate.js';
import * as Router from './lib/util/router.js';

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

Fetcher('https://raw.githubusercontent.com/nytimes/covid-19-data/master/us-counties.csv',
  updateProgress,
  (data) => {
    progress.textContent = 'Processing COVID-19 data';
    setTimeout(() => {
      gData = Data.BuildData(data);
      progress.textContent = 'Building query database';
      let div = document.getElementById('contentroot');
      BackgroundSVG = SVG.addViaID('background-map', 51117, null, null, () => {
        SVG.queryToColorsAndViewPort(BackgroundSVG, { f: 'cir', text: '' }, null, gData);
        loadingComplete();
      });
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
        div.innerHTML = Archive();
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
