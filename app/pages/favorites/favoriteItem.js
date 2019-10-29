import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { cleanseNamedLinks } from 'utils/textUtils';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { getMainImage } from 'utils/imageUtils';
import ResourceAvailability from 'shared/resource-card/label';

function createTextSnippet(text, maxCharacters) {
  if (text === null) {
    return '';
  }
  const cleansedText = cleanseNamedLinks(text);

  if (cleansedText.length <= maxCharacters) {
    return cleansedText;
  }

  return `${cleansedText.substring(0, maxCharacters)}...`;
}

function FavoriteItem(resource, t, key, date) {
  const link = getResourcePageUrl(resource);
  const imgObj = getMainImage(resource.images);
  return (
    <Col className="favorite" key={key} md={3} sm={3} xs={12}>
      <Row>
        <Col className="favorite-image-container" xs={12}>
          <img alt={imgObj.caption} className="favorite-image" src={imgObj.url} />
        </Col>
      </Row>
      <Row>
        <Col className="favorite-name-container" xs={12}>
          <Row>
            <Col xs={12}>
              <a href={link}>{resource.name}</a>
            </Col>
          </Row>
          <Row>
            <Col className="favorite-availability" xs={12}>
              <ResourceAvailability date={date} resource={resource} />
            </Col>
          </Row>
          <Row>
            <Col className="favorite-description" xs={12}>
              {createTextSnippet(resource.description, 348)}
            </Col>
          </Row>
        </Col>
      </Row>

    </Col>
  );
}

export default FavoriteItem;
