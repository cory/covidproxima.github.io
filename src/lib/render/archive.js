// (c) Cory Ondrejka 2020
'use strict'
import * as Posts from '../posts/posts.js';
import * as Dates from '../util/dates.js';
import * as Text from '../util/text.js';

export default function archive() {
  let posts = Posts.getPosts();
  posts.sort((a, b) => { return b.date.localeCompare(a.date); });
  let retval = ['<div class="story">'];
  for (let i = 0; i < posts.length; i++) {
    retval.push(
      '<a href="#posts.' + posts[i].file + '"><b>' + Dates.prettyPrint(posts[i].date) + '</b><br /><h4>' + Text.firstCaps(posts[i].title) + '</h4></a><br a/>'
    );
  }
  retval.push('</div>');
  return retval.join('\n');
}