// (c) Cory Ondrejka 2020
'use strict'

import * as Dates from '../util/dates.js?cachebust=75763';



/*

World's simplest markdown

Start of line marker
// comment, ignore this line
# Header 1
## Header 2 (etc)
> Blockquote
<4 spaces> Fixed width code block
* Bullet
Use markdown's "use a blank line to split paragraphs"-rule

Inline markers (need to be adjacent to text on both sides, no inline)
*adjacent* to text is strong
[Github](http://github.com) is a link

Footnotes
Not at start of line [number] - turn this into a footnote -- just needs to be unique,
will be turned into a sequential footnote per article
[number] at start of line creates the footnote

Macros
[text|map|table|line|scatter|entry#] to show where replacement is going.
[# entry|result args] creates the root info

 */

function breakIntoLines(src) {
  return src.split(/\r?\n/);
}

function merge(arr) {
  return arr.join('\n');
}

function escape(str) {
  str = str.replace(/\&/g, '&amp;');
  str = str.replace(/\"/g, '&quot;');
  str = str.replace(/\>/g, '&gt;');
  str = str.replace(/\</g, '&lt;');
  return str;
}

const FN_TEXT = 'fn';
const BACK_FROM_FN_TEXT = 'bfn';

function inlineMarkers(str, title, footnote) {
  str = str.replace(/(\*)(\S+?|\S.+?\S)(\*)/g, '<strong>$2</strong>');
  str = str.replace(/\[([^[]+?)\]\((\#.+?)\)/g, '<a href="$2">$1</a>');
  str = str.replace(/\[([^[]+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  str = str.replace(/\[(text)\s?(\d+)\]/g, '<span class="result r$2"></span>');
  str = str.replace(/\[(people)\s?(\d+)\]/g, '<div class="r$2"></div>');
  str = str.replace(/\[(map)\s?(\d+)\]/g, '<span class="r$2"></span>');
  str = str.replace(/\[(line)\s?(\d+)\]/g, '<div class="graphic r$2"></div>');
  str = str.replace(/\[(scatter)\s?(\d+)\]/g, '<div class="graphic r$2"></div>');
  str = str.replace(/\[(table)\s?(\d+)\s?(.*)\]/g, '<div class="graphic r$2"><h4>$3</h4></div>');
  str = str.replace(/\[(entry)\s?(\d+)\]/g, '<span class="entry e$2"></span>');
  str = str.replace(/(\s?)\[(\d+)\]/g, (full, a, b) => {
    let fn = Number(b) + footnote;
    return '<sup><a id="' + title + BACK_FROM_FN_TEXT + fn +
      '" href="#' + title + FN_TEXT + fn + '">' + fn + '</a></sup>';
  });
  return str;
}

function firstChar(arr, wrap, footnote, link_title, fn) {
  fn = fn ? fn : 0;
  if (link_title) {
    link_title += '.';
  }
  let retArr = [];
  let fnArr = [];
  let currP = [];
  let currFN = [];
  let macroArr = [];
  let makePara = arr.length > 1;
  let state;
  let pwrap = 'p';

  function rap() {
    if (currFN.length) {
      if (!currFN[0]) {
        currFN = currFN.slice(1);
      }
      fnArr.push(inlineMarkers(currFN.join(' '), link_title, fn));
      currFN = [];
    } else if (currP.length) {
      let val = state !== 'code' ? inlineMarkers(currP.join(' '), link_title, fn) : currP.join(' ');
      retArr.push(makePara ? '<' + pwrap + '>' + val + '</' + pwrap + '>' : val);
      currP = [];
    }
  }

  for (let i = 0; i < arr.length; i++) {
    let handled = false;
    let match;
    switch (arr[i][0]) {
      case '/':
        if (arr[i][1] === '/') {
          handled = true;
          rap();
          if (state) {
            retArr.push('</' + state + '>');
            state = '';
            pwrap = 'p';
          }
        }
        break;
      case '#':
        let j;
        let str = arr[i];
        for (j = 1; j < Math.min(6, str.length); j++) {
          if (str[j] !== '#') {
            break;
          }
        }
        if (str[j] === ' ') {
          handled = true;
          rap();
          if (state) {
            retArr.push('</' + state + '>');
            state = '';
            pwrap = 'p';
          }
          retArr.push('<h' + j + '>' + inlineMarkers(str.slice(j + 1), link_title, fn) + '</h' + j + '>');
        }
        break;
      case '[':
        match = arr[i].match(/^\[\d+\]\s?/);
        if (match) {
          handled = true;
          rap();
          if (state) {
            retArr.push('</' + state + '>');
            state = '';
            pwrap = 'p';
          }
          currFN.push(arr[i].slice(match[0].length));
        } else {
          match = arr[i].match(/\[(\d+)\s(entry|result)\s(.*)\]/);
          if (match) {
            handled = true;
            rap();
            if (state) {
              retArr.push('</' + state + '>');
              state = '';
              pwrap = 'p';
            }
            macroArr.push({ id: (match[2] === 'entry' ? 'e' : 'r') + match[1], args: match[3] });
          }
        }
        break;
      case '*':
        if (arr[i][1] === ' ') {
          handled = true;
          rap();
          if (state !== 'ul') {
            if (state) {
              retArr.push('</' + state + '>');
              state = '';
              pwrap = 'p'
            }
            state = 'ul';
            pwrap = 'li';
            retArr.push('<' + state + '>');
          }
          currP.push(arr[i].slice(2));
        }
        break;
      case '&':
        match = arr[i].match(/^\&gt\;\s?/);
        if (match) {
          handled = true;
          rap();
          if (state !== 'blockquote') {
            if (state) {
              retArr.push('</' + state + '>');
              state = '';
              pwrap = 'p'
            }
            state = 'blockquote';
            retArr.push('<' + state + '>');
          }
          let val = arr[i].slice(match[0].length);
          if (val) {
            currP.push(val);
          }
        }
        break;
      case ' ':
        if (arr[i].slice(0, 4) === '    ') {
          handled = true;
          rap();
          if (state !== 'code') {
            if (state) {
              retArr.push('</' + state + '>');
              state = '';
              pwrap = 'p'
            }
            state = 'code';
            retArr.push('<' + state + '>');
          }
          currP.push(arr[i].slice(4));
        }
        break;
      default:
        break;
    }
    if (!handled) {
      if (!arr[i].match(/^\s*$/) && arr[i]) {
        if (currFN.length) {
          currFN.push(arr[i]);
        } else {
          currP.push(arr[i]);
        }
      } else {
        rap();
        if (state) {
          retArr.push('</' + state + '>');
          state = '';
          pwrap = 'p';
        }
      }
    }
  }
  rap();
  if (state) {
    retArr.push('</' + state + '>');
    state = '';
    pwrap = 'p';
  }
  if (wrap || macroArr.length) {
    let div = '<div class="' + (wrap ? wrap : '');
    div += macroArr.length && wrap ? ' ' : '';
    div += macroArr.length ? 'query' : '';
    div += '"';
    for (let i = 0; i < macroArr.length; i++) {
      div += ' data-' + macroArr[i].id + '="' + macroArr[i].args + '"';
    }
    div += '>';
    retArr.unshift(div);
    retArr.push('</div>');
  }
  if (footnote) {
    retArr.push('<div class="' + footnote + '">');
  }
  if (fnArr.length) {
    retArr.push('<ol start="' + (fn + 1) + '">');
    for (let i = 0; i < fnArr.length; i++) {
      retArr.push('<li id="' + link_title + FN_TEXT + (i + 1 + fn) + '">' +
        fnArr[i] + '<a href="#' + link_title + BACK_FROM_FN_TEXT + (i + 1 + fn) + '">&#x21A9;</a></li>');
    }
    retArr.push('</ol>');
  }
  if (footnote) {
    retArr.push('</div>');
  }
  return { arr: retArr, footnote: fnArr.length + fn };
}

export default function render(src, wrap, footnote, path, fn, fname, date) {
  src = src ? src : '';
  src = escape(src);
  let arr = breakIntoLines(src);
  path = path ? path.replace(/\s/g, '-') : '';
  let title = 'posts.' + fname;
  let link = date ? '<a class="datelink" href="#' + title + '">' + Dates.prettyPrint(date) + '</a>\n' : '';
  let retval = firstChar(arr, wrap, footnote, path, fn);
  retval.arr.splice(wrap ? 1 : 0, 0, link);
  return { html: merge(retval.arr), footnote: retval.footnote };
}