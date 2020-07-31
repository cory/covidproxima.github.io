// (c) Cory Ondrejka 2020
'use strict'

let Colors = {};

function getColorVariables() {
  let cssRules = document.styleSheets[0].cssRules;

  for (let c = 0; c < cssRules.length; c++) {
    if (cssRules[c].selectorText === 'html') {
      let styles = cssRules[c].style;
      let h = document.getElementsByTagName('html')[0];
      for (let i = 0; i < styles.length; i++) {
        try {
          if (styles[i] && styles[i].match('--') && !Colors[styles[i]]) {
            Colors[styles[i]] = window.getComputedStyle(h).getPropertyValue(styles[i]);
          }
        } catch (e) { }
      }
      return;
    }
  }
}

export let SVGColors = [];
export let SVGUpGoodColors = [];
export let SVGDivColors = [];
export let SVGUpGoodDivColors = [];

function setSVGColors() {
  for (let i = 0; i < 5; i++) {
    SVGColors.push(Colors['--graph-color' + i]);
    SVGUpGoodColors.push(Colors['--graph-color-up' + i]);
  }
  for (let i = 0; i < 7; i++) {
    SVGDivColors.push(Colors['--graph-color-divergent' + i]);
    SVGUpGoodDivColors.unshift(Colors['--graph-color-divergent' + i]);
  }
}

export let LineColors = {}

function setLineColors() {
  for (let i in { background: true, shelter: true, zero: true, level: true, guide: true, bad: true, base: true, box: true }) {
    LineColors[i] = Colors['--graph-' + i];
  }
  for (let i = 0; i < 6; i++) {
    LineColors['line' + i] = Colors['--graph-line' + i];
  }
}

export function init() {
  getColorVariables();
  setSVGColors();
  setLineColors();
};