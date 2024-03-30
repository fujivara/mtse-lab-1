const { promises: fs} = require("node:fs");
const {
  boldWrapper,
  italicWrapper,
  preformattedWrapper,
  monospaceWrapper,
  paragraphWrapper
} = require("./wrappers/html-wrappers");
const { boldAnsiWrapper, italicAnsiWrapper, commonAnsiWrapper } = require("./wrappers/ansi-wrappers");
const { getMatches, replacePreformatted } = require('./utils');
const { BOLD_REGEX, ITALIC_REGEX, MONOSPACE_REGEX, PREFORMATTED_REGEX } = require('./constants')

const mdProcessor = async (fileName, format = 'html') => {
  const data = await fs.readFile(fileName, 'utf-8');
  const paragraphs = data.split(/\n\s*\n/)
    .map((paragraph) => paragraph.replace(/\r\n/g, "\n").replace(/\r/g, ""));
  const parsedParagraphs = [];

  for (let paragraph of paragraphs) {
    let parsedParagraph = paragraph;
     const boldMatches = getMatches(parsedParagraph, BOLD_REGEX);
    boldMatches.forEach((match) => {
      if (
        getMatches(match.matchPart, ITALIC_REGEX).length === 0 &&
        getMatches(match.matchPart, MONOSPACE_REGEX).length === 0 &&
        getMatches(match.matchPart, PREFORMATTED_REGEX).length === 0
      ) {
        parsedParagraph = parsedParagraph.replace(match.fullMatchPart,
          format === 'html' ? boldWrapper(match.matchPart) : boldAnsiWrapper(match.matchPart)
        )
      } else {
        throw new Error('Nested formatting');
      }
    })
    const italicMatches = getMatches(parsedParagraph, ITALIC_REGEX);
    italicMatches.forEach((match) => {
      if (
        getMatches(match.matchPart, BOLD_REGEX).length === 0 &&
        getMatches(match.matchPart, MONOSPACE_REGEX).length === 0 &&
        getMatches(match.matchPart, PREFORMATTED_REGEX).length === 0
      ) {
        parsedParagraph = parsedParagraph.replace(match.fullMatchPart,
          format === 'html' ? italicWrapper(match.matchPart) : italicAnsiWrapper(match.matchPart)
        )
      } else {
        throw new Error('Nested formatting');
      }
    })
    const preformattedMatches = replacePreformatted(parsedParagraph);
    preformattedMatches.forEach((match) => {
      parsedParagraph = parsedParagraph
        .replace(match.fullMatchPart,
          format === 'html' ? preformattedWrapper(match.matchPart) : commonAnsiWrapper(match.matchPart)
        )
    })

    const monospaceMatches = getMatches(parsedParagraph, MONOSPACE_REGEX);
    monospaceMatches.forEach((match) => {
      if (
        getMatches(match.matchPart, BOLD_REGEX).length === 0 &&
        getMatches(match.matchPart, ITALIC_REGEX).length === 0 &&
        getMatches(match.matchPart, PREFORMATTED_REGEX).length === 0
      ) {
        parsedParagraph = parsedParagraph.replace(match.fullMatchPart,
          format === 'html' ? monospaceWrapper(match.matchPart) : commonAnsiWrapper(match.matchPart)
        )
      } else {
        throw new Error('Nested formatting');
      }
    })

    const newPreformattedMatches = replacePreformatted(paragraph);

    newPreformattedMatches.forEach((match, index) => {
      parsedParagraph = parsedParagraph
        .replace(preformattedWrapper(preformattedMatches[index].matchPart), preformattedWrapper(match.matchPart))
    })

    parsedParagraphs.push(format === 'html' ? paragraphWrapper(parsedParagraph) : parsedParagraph);
  }
  return parsedParagraphs;
}

module.exports = { mdProcessor }