import constants from 'constants/AppConstants';

/**
  * Finds named link syntax within given text and replaces found
  * strings with only the name of the link.
  * @param {string} text input text to be cleansed
  * @returns text where named links are replaced with their link names only.
  */
function cleanseNamedLinks(text) {
  const linkRegex = constants.REGEX.namedLink;
  const textSplits = text.split(linkRegex);
  const elements = textSplits.map((textSplit) => {
    // dont handle undefined splits
    if (textSplit === undefined) {
      return null;
    }

    if (textSplit.match(linkRegex)) {
      // find link name text between []
      let linkText = textSplit.match(/(\[[^[\]]*?\])/gm)[0];
      // remove []
      linkText = linkText.substring(1, linkText.length - 1);
      return linkText;
    }
    return textSplit;
  });

  return elements.join('');
}

export {
  cleanseNamedLinks,
};
