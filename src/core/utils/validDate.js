export default function isValidDate(dateString) {
  var isValid = false
  var date

  date = new Date(dateString)

  if (Object.prototype.toString.call(date) === '[object Date]') {
    if (isNaN(date.getTime())) {
      // Date is unreal.
    } else {
      // Date is real if month and day match each other in date and string (otherwise may be shifted):
      isValid =
        date.getUTCMonth() + 1 === dateString.split('-')[1] * 1 &&
        date.getUTCDate() === dateString.split('-')[2] * 1
    }
  } else {
    // It's not a date.
  }

  return isValid
}
