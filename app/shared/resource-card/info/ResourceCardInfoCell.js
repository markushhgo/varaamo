import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import PropTypes from 'prop-types';
import classNames from 'classnames';

function ResourceCardInfoCell({
  className, alt, icon, onClick, children, titleText
}) {
  return (
    <Button
      className={classNames('app-ResourceCard__info-cell', className)}
      onClick={onClick}
      title={titleText}
    >
      <img
        alt={alt}
        className="app-ResourceCard__info-cell__icon"
        src={icon}
      />
      {children}
    </Button>
  );
}

ResourceCardInfoCell.propTypes = {
  className: PropTypes.string,
  alt: PropTypes.string,
  children: PropTypes.element,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  titleText: PropTypes.string,
};

export default ResourceCardInfoCell;
