import PropTypes from 'prop-types';
import moment from 'moment';
import React, { Component } from 'react';
import Loader from 'react-loader';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Well from 'react-bootstrap/lib/Well';
import Panel from 'react-bootstrap/lib/Panel';

import { fetchFavoritedResources } from 'actions/resourceActions';
import { getResourcePageUrl } from 'utils/resourceUtils';
import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';
import favoritesPageSelector from './favoritesPageSelector';
import FavoriteItem from './favoriteItem';

class UnconnectedFavoritesPage extends Component {
  constructor(props) {
    super(props);
    this.fetchResources = this.fetchResources.bind(this);
  }

  componentDidMount() {
    this.fetchResources();
  }

  fetchResources(date = this.props.date) {
    this.props.actions.fetchFavoritedResources(moment(date), 'favoritesPage');
  }


  renderFavorite(resource, t) {
    const link = getResourcePageUrl(resource);
    const len = this.props.resources.length % 2;
    const x = len === 1 ? '3' : '2';

    return (
      <div className="favorite col-md-3 col-sm-6 col-xs-12">
        <div className="favorite-name col-xs-12">
          {t('SortBy.name.label')}
          {resource.name}
        </div>
        <div className="favorite-link col-xs-12">
          <a href={link}>Link</a>
        </div>
      </div>
    );
  }

  render() {
    const {
      isLoggedin, isFetchingResources, contrast, t, resources, favorites, date
    } = this.props;
    return (
      <PageWrapper className="favorites" title="favorite">
        <Loader loaded={Boolean(!isFetchingResources || resources.length)}>
          {true && (
            <div className="container-fluid">
              <div className="favorite-row">
                {resources.map((resource, key) => FavoriteItem(resource, t, key, date))}
              </div>
            </div>
          )}
        </Loader>
      </PageWrapper>
    );
  }
}

UnconnectedFavoritesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  contrast: PropTypes.string,
  date: PropTypes.string,
  favorites: PropTypes.array,
  t: PropTypes.func.isRequired,
  isLoggedin: PropTypes.bool,
  isFetchingResources: PropTypes.bool.isRequired,
  resources: PropTypes.array.isRequired,
};

UnconnectedFavoritesPage = injectT(UnconnectedFavoritesPage); // eslint-disable-line

function mapDispatchToProps(dispatch) {
  const actionCreators = {
    fetchFavoritedResources,
  };

  return { actions: bindActionCreators(actionCreators, dispatch) };
}

export { UnconnectedFavoritesPage };

export default (
  connect(favoritesPageSelector, mapDispatchToProps)(injectT(UnconnectedFavoritesPage))
);
