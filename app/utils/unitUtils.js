function getServiceMapUrl(unit, currentLanguage) {
  if (!unit || !unit.mapServiceId) {
    return '';
  }
  // if current language is swedish, return swedish url. In all other cases return finnish url
  if (currentLanguage === 'sv') {
    return `https://servicekarta.turku.fi/unit/${unit.mapServiceId}#!route-details`;
  }

  return `https://palvelukartta.turku.fi/unit/${unit.mapServiceId}#!route-details`;
}

export {
  getServiceMapUrl,
};
