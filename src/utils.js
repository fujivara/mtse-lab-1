const { TEXT_REGEX, PREFORMATTED_REGEX } = require('./constants');

const getMatches = (paragraph, regex) => {
  const matches = [];
  let array;
  let prev, opened = 0, closed = 0;
  while ((array = regex.exec(paragraph)) !== null) {
    const { index } = array;
    const elementSize = array[0].length;
    if (!(paragraph[index + elementSize] === ' ' && paragraph[index - 1] === ' ')) {
      if (
        TEXT_REGEX.test(paragraph[index + elementSize]) &&
        (
          paragraph[index - 1] === ' ' ||
          paragraph[index - 1] === '' ||
          !paragraph[index - 1]
        )
      ) {
        opened++;
        prev = index;
      }
      if (
        (
          paragraph[index + elementSize] === ' ' ||
          paragraph[index + elementSize] === '' ||
          paragraph[index + elementSize] === '\n' ||
          !paragraph[index + elementSize]
        ) &&
        TEXT_REGEX.test(paragraph[index - 1])
      ) {
        closed++;
        const fullMatchPart = paragraph.slice(prev, index + elementSize);
        const matchPart = paragraph.slice(prev + elementSize, index);
        matches.push({fullMatchPart, matchPart});
        prev = index;
      }
    }
  }
  if (closed !== opened) {
    throw Error(`Not closed tags at:\n ${paragraph}`)
  }
  return matches
}

const replacePreformatted = (paragraph) => {
  const matches = [];
  let array;
  while ((array = PREFORMATTED_REGEX.exec(paragraph)) !== null) {
    const [fullMatchPart, matchPart] = array;
    matches.push({fullMatchPart, matchPart});
  }
  return matches;
}

module.exports = {
  getMatches,
  replacePreformatted,
}