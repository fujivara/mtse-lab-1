const BOLD_REGEX = /\*\*/g;
const ITALIC_REGEX = /_/g;
const MONOSPACE_REGEX = /`/g;
const PREFORMATTED_REGEX = /```\n([\s\S]*?)```/g;
const TEXT_REGEX = /.+/;

module.exports = {
  BOLD_REGEX,
  ITALIC_REGEX,
  MONOSPACE_REGEX,
  PREFORMATTED_REGEX,
  TEXT_REGEX,
}