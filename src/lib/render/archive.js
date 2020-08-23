// (c) Cory Ondrejka 2020
'use strict'
import * as Posts from '../posts/posts.js?cachebust=98130';
import * as Dates from '../util/dates.js?cachebust=98130';
import * as Text from '../util/text.js?cachebust=98130';

export default function archive(cname) {
  let posts = Posts.getPosts();
  posts.sort((a, b) => { return b.date.localeCompare(a.date); });
  let retval = ['<div class="' + cname + '">'];
  for (let i = 0; i < posts.length; i++) {
    retval.push(
      '<a class="datelink" href="#posts.' + posts[i].file + '">' + Dates.prettyPrint(posts[i].date) + '</a><h4>' + Text.firstCaps(posts[i].title) + '</h4><br />'
    );
  }
  retval.push('</div>');
  return retval.join('\n');
}