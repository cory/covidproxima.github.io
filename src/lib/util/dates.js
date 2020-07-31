// (c) Cory Ondrejka 2020
'use strict'


let months = [
  { name: 'January', days: 31 },
  { name: 'February', days: 28 },
  { name: 'March', days: 31 },
  { name: 'April', days: 30 },
  { name: 'May', days: 31 },
  { name: 'June', days: 30 },
  { name: 'July', days: 31 },
  { name: 'August', days: 31 },
  { name: 'September', days: 30 },
  { name: 'October', days: 31 },
  { name: 'November', days: 30 },
  { name: 'December', days: 31 }
];

export function getDaysIn(month, year) {
  month--;
  if (month !== 2) {
    return months[month].days;
  } else {
    let ynum = year;
    if (ynum % 4 !== 0) {
      return months[month].days;
    } else if (ynum % 100 !== 0) {
      return months[month].days + 1;
    } else if (ynum % 400 === 0) {
      return months[month].days + 1;
    } else {
      return months[month].days;
    }
  }
}

export function prettyPrint(date, small) {
  let numbers = date.split('-');
  if (small) {
    return numbers[1] + '/' + numbers[2] + '/' + numbers[0];
  } else {
    return numbers[2] + ' ' + months[parseInt(numbers[1]) - 1].name + ' ' + numbers[0];
  }
}
