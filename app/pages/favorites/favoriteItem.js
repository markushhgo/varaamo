import React, { Component } from 'react';
import Grid from 'react-bootstrap/lib/Grid';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { getResourcePageUrl } from 'utils/resourceUtils';
import { getMainImage } from 'utils/imageUtils';


function FavoriteItem(resource, t, key) {
  const link = getResourcePageUrl(resource);
  const imgObj = getMainImage(resource.images);
  return (
    <Grid className="favorite" key={key}>
      <Row>
        <Col className="favorite-image-container" xs={2}>
          <img alt={imgObj.caption} className="favorite-image" src={imgObj.url} />
        </Col>
        <Col className="favorite-name-container" xs={10}>
          <Row>
            <Col xs={12}>
              {resource.name}
            </Col>
          </Row>
          <Row>
            <Col className="favorite-link" xs={12}>
              <a href={link}>Linkki</a>
            </Col>
          </Row>
        </Col>
      </Row>

    </Grid>
  );
}

export default FavoriteItem;
