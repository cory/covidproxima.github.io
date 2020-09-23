// (c) Cory Ondrejka 2020
'use strict'

import * as Posts from '../posts/posts.js?cachebust=64291';
import Cmdown from '../render/cmdown.js?cachebust=64291';
import Load from './load.js?cachebust=64291';

export default function go(path, rootEl, cb) {
  let stories = Posts.path2stories(path);
  Load(stories, (arr) => {
    rootEl.innerHTML = '';
    let footnote = 0;
    for (let i = 0; i < arr.length; i++) {
      let fg = document.createElement('div');
      fg.className = 'block';
      rootEl.appendChild(fg);
      let data = Cmdown(arr[i].result, 'story', 'footnote', (path && path[0] ? path[0] : ''), footnote, arr[i].file, arr[i].date);
      let div = document.createElement('div');
      fg.appendChild(div);
      div.outerHTML = data.html;
      footnote = data.footnote;
    }
    cb();
  });
}