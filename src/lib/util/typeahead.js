// (c) Cory Ondrejka 2020
'use strict'

import * as Text from '../util/text.js';

function bg(body, base) {
  base.className = 'pubg';
  body.appendChild(base);
  body.className = 'no-scroll';
  base.addEventListener('click', (e) => {
    closeBG(body, base);
    e.preventDefault();
    return false;
  });
}

function closeBG(body, base) {
  body.className = '';
  body.removeChild(base);
}

function resetOptions(desc) {
  desc.currentOptions = desc.options;
  for (let i = 0; i < desc.options.length; i++) {
    if (desc.options[i].value === desc.dp.inputs[desc.macro].value) {
      desc.selectedIdx = i;
      desc.initialText = Text.firstCaps(desc.options[i].text);
      return;
    }
  }
}

function popover(desc, body, base) {
  let target = desc.target;
  let rect = target.getBoundingClientRect();
  let bwidth = body.getBoundingClientRect().width / 2;

  let inputDiv = document.createElement('div');
  let input = document.createElement('input');
  inputDiv.appendChild(input);
  inputDiv.className = 'pu';
  inputDiv.style.top = rect.top + 'px';
  inputDiv.style.left = (rect.left < bwidth ? rect.left - 16 : bwidth - 16) + 'px';
  input.setAttribute('type', 'text');

  base.appendChild(inputDiv);

  let options = document.createElement('div');
  options.id = 'options';
  options.className = 'options';
  inputDiv.appendChild(options);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      if (desc.currentOptions.length) {
        desc.dp.inputs[desc.macro].value = desc.currentOptions[0].value;
        desc.update(desc.dp);
      }
      closeBG(body, base);
      e.preventDefault();
    } else if (e.keyCode === 27) {
      closeBG(body, base);
      e.preventDefault();
    }
  });

  input.addEventListener('input', (e) => {
    prioritizedMatches(desc, e.target.value);
    showOptions(desc, body, base);
  });

  input.addEventListener('click', (e) => {
    e.preventDefault();
    return false;
  });

  input.focus();
}

function prioritizedMatches(desc, text) {
  text = text.toLowerCase();
  desc.currentOptions = [];
  let found = {};
  for (let i = 0; i < desc.options.length; i++) {
    if (text === desc.options[i].text) {
      found[desc.options[i].text] = { text: desc.options[i].text, pos: -1, value: desc.options[i].value };
    } else {
      let matchPos = desc.options[i].text.toLowerCase().indexOf(text);
      if (matchPos !== -1) {
        found[desc.options[i].text] = { text: desc.options[i].text, pos: matchPos, value: desc.options[i].value };
      }
    }
    if (desc.extraTest) {
      let hash = desc.extraTest(text);
      for (let val in hash) {
        if (!found[hash[val].text]) {
          found[hash[val].text] = { text: hash[val].text, pos: 100, value: hash[val].value };
        }
      }
    }
  }
  let sortArray = [];
  for (let val in found) {
    sortArray.push(found[val]);
  }

  sortArray.sort((a, b) => {
    return a.pos - b.pos;
  });

  desc.currentOptions = sortArray;
}

function showOptions(desc, body, base) {
  let options = document.getElementById('options');
  options.innerHTML = '';

  for (let i = 0; i < desc.currentOptions.length; i++) {
    let option = document.createElement('div');
    option.textContent = Text.firstCaps(desc.currentOptions[i].text);
    option.addEventListener('click', (e) => {
      desc.dp.inputs[desc.macro].value = desc.currentOptions[i].value;
      desc.update(desc.dp);
      closeBG(body, base);
      e.stopPropagation();
      return false;
    });

    options.appendChild(option);
  }
}

export default function trigger(desc) {
  let body = document.getElementById('root');
  let base = document.createElement('div');
  bg(body, base);
  resetOptions(desc);
  popover(desc, body, base);
  showOptions(desc, body, base);
}
