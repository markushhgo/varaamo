import PropTypes from 'prop-types';
import React from 'react';

import ResourceCard from 'shared/resource-card';

function ResourceList({
  date, emptyMessage, location, resourceIds, history, label
}) {
  function renderResourceListItem(resourceId) {
    return (
      <ResourceCard
        date={date}
        history={history}
        key={resourceId}
        location={location}
        resourceId={resourceId}
      />
    );
  }
  if (!resourceIds.length) {
    return emptyMessage ? <p>{emptyMessage}</p> : <div />;
  }

  return (
    <div
      aria-label={label}
      className="resource-list"
      role="list"
    >
      {resourceIds.map(renderResourceListItem)}

    </div>
  );
}

ResourceList.propTypes = {
  date: PropTypes.string.isRequired,
  history: PropTypes.object.isRequired,
  emptyMessage: PropTypes.string,
  location: PropTypes.object.isRequired,
  resourceIds: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
};

export default ResourceList;
