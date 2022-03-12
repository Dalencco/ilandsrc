const dayjs = require('dayjs');
const customFormat = require('dayjs/plugin/customParseFormat');
const isToday = require('dayjs/plugin/isToday')
const isSameOrBefore = require('dayjs/plugin/isSameOrBefore');

dayjs.extend(isToday)
dayjs.extend(customFormat);
dayjs.extend(isSameOrBefore);

var now = dayjs()
var n = now.format("DD/MM/YYYY hh:mm:ss")

const parsedDate = dayjs(n, "DD/MM/YYYY");

const nextDay = parsedDate.add(1, "month");

const nextDayS = nextDay.format("DD/MM/YYYY hh:mm:ss");

// console.log(nextDay.isToday())

// console.log(dayjs('2022-01-06 01:29:00').isSameOrBefore(dayjs()))

// https://tailwindcomponents.com/component/profile-card-with-image-background