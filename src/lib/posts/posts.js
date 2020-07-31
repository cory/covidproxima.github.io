// (c) Cory Ondrejka 2020
'use strict'

const POSTS = {
  pinned: [
    { file: 'welcome', title: 'covid proxima', date: '2020-06-20' },
  ],
  posts: [
    { file: 'battleground', title: 'battleground states', date: '2020-07-30' },
    { file: 'thenandnow', title: 'comparing death totals', date: '2020-07-28' },
    { file: 'deathtrends', title: 'where US deaths are happening', date: '2020-07-24' },
    { file: 'race', title: 'race and covid impact', date: '2020-07-22' },
    { file: 'poverty', title: 'how does poverty change the impact of covid?', date: '2020-07-21' },
    { file: 'groups', title: 'how dangerous is it to be in a group?', date: '2020-07-21' },
    { file: 'howmany', title: 'how many people are infected near me?', date: '2020-07-21' },
    { file: 'activecases', title: 'how many infectuous people are there?', date: '2020-07-20' },
  ],
  data: [
    { file: 'howmany', title: 'how many people are infected near me?', date: '2020-07-21' },
    { file: 'dashboard', title: 'dashboard', date: '2020-07-03' },
    { file: 'explore', title: 'explore', date: '2020-07-20' },
  ],
  about: [
    { file: 'about', title: 'about', date: '2020-06-20' },
  ],
};

export function getPosts() {
  return POSTS.posts;
}

export function getStories(title) {
  if (title) {
    if (POSTS[title]) {
      return POSTS[title];
    } else {
      for (let i = 0; i < POSTS.posts.length; i++) {
        if (POSTS.posts[i].file === title) {
          return POSTS.posts[i];
        }
      }
    }
  }
  return getHome();
}

export function path2stories(path) {
  if (path && path[0]) {
    if (POSTS[path[0]]) {
      if (path[1]) {
        for (let i = 0; i < POSTS[path[0]].length; i++) {
          if (POSTS[path[0]][i].file === path[1]) {
            return POSTS[path[0]][i];
          }
        }
      } else {
        return POSTS[path[0]];
      }
    }
  }
  return getHome();
}

export function getHome() {
  return POSTS.pinned.concat(POSTS.posts.slice(0, 10));
}