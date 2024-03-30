const { argv } = require('node:process');
const fs = require('node:fs').promises;
const {
  boldWrapper,
  paragraphWrapper,
  italicWrapper,
  monospaceWrapper,
  preformattedWrapper,
} = require('./wrappers');

const BOLD_REGEX = /\*\*/g;
const ITALIC_REGEX = /_/g;
const MONOSPACE_REGEX = /`/g;
const PREFORMATTED_REGEX = /```\n([\s\S]*?)```/g;
const TEXT_REGEX = /.+/;

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

const mdProcessor = async (fileName) => {
  const data = await fs.readFile(fileName, 'utf-8');
  const paragraphs = data.split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\r\n/g, "\n").replace(/\r/g, ""));
  const parsedParagraphs = [];

  for (let paragraph of paragraphs) {
    let parsedParagraph = paragraph;
    const boldMatches = getMatches(parsedParagraph, BOLD_REGEX, boldWrapper);
    boldMatches.forEach((match) => {
      if (
        getMatches(match.matchPart, ITALIC_REGEX).length === 0 &&
        getMatches(match.matchPart, MONOSPACE_REGEX).length === 0 &&
        getMatches(match.matchPart, PREFORMATTED_REGEX).length === 0
      ) {
        parsedParagraph = parsedParagraph.replace(match.fullMatchPart, boldWrapper(match.matchPart))
      } else {
        throw new Error('Nested formatting');
      }
    })
    const italicMatches = getMatches(parsedParagraph, ITALIC_REGEX, italicWrapper);
    italicMatches.forEach((match) => {
      if (
        getMatches(match.matchPart, BOLD_REGEX).length === 0 &&
        getMatches(match.matchPart, MONOSPACE_REGEX).length === 0 &&
        getMatches(match.matchPart, PREFORMATTED_REGEX).length === 0
      ) {
        parsedParagraph = parsedParagraph.replace(match.fullMatchPart, italicWrapper(match.matchPart))
      } else {
        throw new Error('Nested formatting');
      }
    })
    const preformattedMatches = replacePreformatted(parsedParagraph);
    preformattedMatches.forEach((match) => {
      parsedParagraph = parsedParagraph
        .replace(match.fullMatchPart, preformattedWrapper(match.matchPart))
    })

    const monospaceMatches = getMatches(parsedParagraph, MONOSPACE_REGEX, monospaceWrapper);
    monospaceMatches.forEach((match) => {
      if (
        getMatches(match.matchPart, BOLD_REGEX).length === 0 &&
        getMatches(match.matchPart, ITALIC_REGEX).length === 0 &&
        getMatches(match.matchPart, PREFORMATTED_REGEX).length === 0
      ) {
        parsedParagraph = parsedParagraph.replace(match.fullMatchPart, monospaceWrapper(match.matchPart))
      } else {
        throw new Error('Nested formatting');
      }
    })

    const newPreformattedMatches = replacePreformatted(paragraph);

    newPreformattedMatches.forEach((match, index) => {
      parsedParagraph = parsedParagraph
        .replace(preformattedWrapper(preformattedMatches[index].matchPart), preformattedWrapper(match.matchPart))
    })

    parsedParagraphs.push(paragraphWrapper(parsedParagraph));
  }
  return parsedParagraphs;
}

module.exports = { mdProcessor }
