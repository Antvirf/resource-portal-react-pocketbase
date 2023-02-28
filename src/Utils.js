export function formatDate(date) {
    const year = date.getFullYear();
    const month = date.toLocaleString('default', {month: '2-digit'});
    const day = date.toLocaleString('default', {day: '2-digit'});
  
    return [year, month, day].join('-');
  }

export function formatUnixDate(timeStamp) {
var date =  new Date(timeStamp);
const year = date.getFullYear();
const month = date.toLocaleString('default', {month: '2-digit'});
const day = date.toLocaleString('default', {day: '2-digit'});

return [year, month, day].join('-');
}

export function computeNiceExpiryDate(months) {
    const today = new Date();
    var newDate = new Date(today.setMonth(today.getMonth()+months));
    return formatDate(newDate);
}

export function computeExpiryDate(months) {
    const today = new Date();
    var newDate = new Date(today.setMonth(today.getMonth()+months)).getTime();
    return newDate;
}

export function computeDayDiffFromStringDates(newer_date, older_date){
    return parseInt((parseFloat(Date.parse(newer_date)) - parseFloat(Date.parse(older_date)))/1000/(24*60*60))
}

