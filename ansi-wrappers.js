const boldAnsiWrapper = (text) => {
  return `\x1b[1m${text}\x1b[22m`
}

const italicAnsiWrapper = (text) => {
  return `\x1b[3m${text}\x1b[23m`
}

const commonAnsiWrapper = (text) => {
  return `\x1b[7m${text}\x1b[27m`
}


module.exports = {
  boldAnsiWrapper,
  italicAnsiWrapper,
  commonAnsiWrapper,
}