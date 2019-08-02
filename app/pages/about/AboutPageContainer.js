import { connect } from 'react-redux';

import AboutPage from './AboutPage';

export const mapStateToProps = state => ({
  currentLanguage: state.intl.locale,
});

export default connect(mapStateToProps, null)(AboutPage);
