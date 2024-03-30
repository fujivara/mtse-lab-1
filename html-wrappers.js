const paragraphWrapper = (text) => {
  return `<p>${text}</p>`;
};

const boldWrapper = (text) => {
  return `<b>${text}</b>`;
};

const italicWrapper = (text) => {
  return `<i>${text}</i>`;
};

const monospaceWrapper = (text) => {
  return `<tt>${text}</tt>`;
};

const preformattedWrapper = (text) => {
  return `<pre>${text}</pre>`;
};

module.exports = {
  paragraphWrapper,
  boldWrapper,
  italicWrapper,
  monospaceWrapper,
  preformattedWrapper,
};
