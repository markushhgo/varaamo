import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import { Link } from 'react-router-dom';

import { cleanseNamedLinks } from 'utils/textUtils';
import { getResourcePageUrlComponents } from 'utils/resourceUtils';
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


function FavoriteItem(resource, t, key, date, click) {
  const { pathname, query } = getResourcePageUrlComponents(resource, date);
  const linkTo = {
    pathname,
    search: query ? `?${query}` : undefined,
    state: { fromSearchResults: false },
  };
  const imgObj = getMainImage(resource.images);
  return (
    <Col className="favoritte" key={key} lg={3} md={4} sm={6} xs={12}>
      <Col className="favorite-container" xs={12}>
        <Row>
          <Col className="favorite-image-container" xs={12}>
            <Link onClick={click} to={linkTo}>
              <img alt={imgObj.caption} className="favorite-image" src={imgObj.url} />
            </Link>
          </Col>
        </Row>
        <Row>
          <Col className="favorite-content" xs={12}>
            <Row>
              <Col className="favorite-title" xs={12}>
                <Link onClick={click} to={linkTo}>
                  <h3>
                    {resource.name}
                  </h3>
                </Link>
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
    </Col>
  );
}

export {
  FavoriteItem
};
