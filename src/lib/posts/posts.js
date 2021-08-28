// (c) Cory Ondrejka 2020
'use strict'

const POSTS = {
  pinned: [
    { file: 'welcome', title: 'covid proxima' },
  ],
  posts: [
    { file: 'battleground', title: 'battleground states', date: '2020-07-22' },
    { file: 'thenandnow', title: 'comparing death totals', date: '2020-07-28' },
    { file: 'deathtrends', title: 'where US deaths are happening', date: '2020-07-24' },
    { file: 'howmany', title: 'how many people are infected near me?', date: '2020-07-22' },
    { file: 'race', title: 'race and covid impact', date: '2020-08-01' },
    { file: 'poverty', title: 'how does poverty change the impact of covid?', date: '2020-07-25' },
    { file: 'activecases', title: 'how many infectious people are there?', date: '2020-07-21' },
    { file: 'masks', title: 'together and maskless?', date: '2020-08-02' },
    { file: 'race2', title: 'hispanics in california', date: '2020-08-03' },
    { file: 'groups', title: 'how dangerous is it to be in a group?', date: '2020-07-26' },
    { file: 'cfrvspfr', title: 'case vs population fatality rates', date: '2020-08-05' },
    { file: 'sir', title: 'how far along are we?', date: '2020-08-07' },
    { file: 'antibody', title: 'nyc antibody testing', date: '2020-08-22' },
    { file: 'fall', title: 'the fall surge begins', date: '2020-08-25' },
    { file: 'rollercoaster', title: 'more fall cases', date: '2020-09-02' },
    { file: 'ruralfall', title: 'rural cases', date: '2020-09-23' },
    { file: 'deadlyflorida', title: 'the florida gamble', date: '2020-09-26' },
    { file: 'scarystates', title: 'scary states', date: '2020-10-11' },
    { file: 'electionday', title: 'election day', date: '2020-11-02' },
    { file: 'fatalityrates', title: 'fatality rates', date: '2020-12-02' },
    { file: 'texasgamble', title: 'the texas gamble', date: '2021-03-05' },
    { file: 'ohflorida', title: 'florida has lost its mind', date: '2021-08-04' },
    { file: 'allaboutheweeks', title: 'and now just weekly data', date: '2021-08-23' },
    { file: 'statelevel', title: 'state level', date: '2021-08-26' },
  ],
  data: [
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
  let posts = getPosts();
  posts.sort((a, b) => { return b.date.localeCompare(a.date); });
  return POSTS.pinned.concat(posts.slice(0, 10));
}
