// (c) Cory Ondrejka 2020
'use strict'


let Paths = {
};

export function getPath() {
  return location.hash.slice(1).split('.');
}

export function addRoute(path, cb) {
  Paths[path] = cb;
}

let lastHash;

export function go() {
  if (!lastHash) {
    lastHash = getPath();
  }
  let path = lastHash;
  if (Paths[path[0]]) {
    Paths[path[0]](path);
  }
}

function footnoteChange() {
  let newHash = getPath();
  if (lastHash.length) {
    for (let i = 0; i < lastHash.length; i++) {
      if (newHash[i] !== lastHash[i]) {
        if (i === lastHash.length - 1 && lastHash[i].indexOf('fn') !== -1 && newHash[i].indexOf('fn') !== -1) {
          lastHash = newHash;
          return false;
        } else {
          lastHash = newHash;
          return true;
        }
      }
    }
    if (newHash.length === lastHash.length + 1 && newHash[newHash.length - 1].indexOf('fn') !== -1) {
      lastHash = newHash;
      return false;
    }
    if (newHash.length !== lastHash.length) {
      lastHash = newHash;
      return true;
    }
  } else {
    lastHash = newHash;
    return true;
  }
}

export function hook() {
  window.addEventListener('hashchange', () => {
    if (footnoteChange()) {
      window.scrollTo(0, 0);
      go();
    }
  });
}