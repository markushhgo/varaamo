function getServiceMapUrl(unit) {
  if (!unit || !unit.mapServiceId) {
    return '';
  }
  return `https://palvelukartta.turku.fi/unit/${unit.mapServiceId}#!route-details`;
}

export {
  getServiceMapUrl,
};
