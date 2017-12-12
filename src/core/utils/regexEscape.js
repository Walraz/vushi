export default string => {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
}
