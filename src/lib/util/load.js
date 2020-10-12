// (c) Cory Ondrejka 2020
'use strict'

import Fetcher from './fetcher.js?cachebust=80556';

let PATH = '../../../posts/';

function areWeDone(fetching, i, text, cb) {
  fetching[i].done = true;
  fetching[i].result = text;

  for (let i = 0; i < fetching.length; i++) {
    if (!fetching[i].done) {
      return;
    }
  }
  cb(fetching);
}

export default function doit(stories, cb) {
  if (!Array.isArray(stories)) {
    stories = [stories];
  }
  let fetching = [];
  for (let i = 0; i < stories.length; i++) {
    fetching.push({ done: false, result: '', title: stories[i].title, date: stories[i].date, file: stories[i].file });
    Fetcher(PATH + stories[i].file + '.cmd', undefined, (text) => areWeDone(fetching, i, text, cb));
  }
}

