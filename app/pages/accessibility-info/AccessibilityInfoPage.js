
import PropTypes from 'prop-types';
import React from 'react';

import { injectT } from 'i18n';
import PageWrapper from 'pages/PageWrapper';

class AccessibilityInfoPage extends React.Component {
  static propTypes = {
    t: PropTypes.func,
    currentLanguage: PropTypes.string,
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  renderText(t) {
    const main = `${t('AccessibilityInfo.title')} - TEST`;
    return (
      <article>
        <h1>{main}</h1>
        <p>
          TEST pyrkii takaamaan digitaalisen saavutettavuuden toimintarajotteisille henkilöille.
          Parannamme käyttäjäkokemusta jatkuvasti ja
          sovellamme asianmukaisia saavutettavuusstandardeja.
        </p>

        <h2>Toimet saavutettavuuden tukemiseksi</h2>
        <p>TEST varmistaa saavutettavuuden seuraavilla toimenpiteillä:</p>
        <ul>
          <li>Saavutettavuus kuuluu toiminta-ajatukseemme.</li>
          <li>Saavutettavuus kuuluu sisäisiin käytäntöihimme.</li>
          <li>Otamme käyttäjätestaukseen mukaan ihmisiä, joilla on vammoja tai rajoitteita.</li>
        </ul>


        <h2>Ohjeidenmukaisuustilanne</h2>
        <h3>Sivuston nykyinen saavutettavuusstandardi:</h3>
        <p>WCAG 2.0</p>
        <h3>Nykyinen sisällön ohjeidenmukaisuustilanne</h3>
        <p>
          Täysin ohjeidenmukainen: sisältö on täysin
          saavutettavuusstandardin mukainen ilman poikkeuksia.
        </p>


        <h2>Yhteensopivuus selainten ja avustavien tekniikoiden kanssa</h2>
        <p>Sivusto on suunniteltu yhteensopivaksi seuraavien selainten kanssa:</p>
        <ul>
          <li>Google Chrome</li>
          <li>Mozilla Firefox</li>
          <li>Edge</li>
          <li>Safari</li>
        </ul>
        <p>Sivusto on suunniteltu yhteensopivaksi seuraavien avustavien tekniikoiden kanssa:</p>
        <ul>
          <li>NVDA</li>
        </ul>
        <h3>Tekniikat</h3>
        <p>Tämän sivuston saavutettavuus riippuu seuraavien tekniikoiden toimivuudesta:</p>
        <ul>
          <li>HTML</li>
          <li>WAI-ARIA</li>
          <li>CSS</li>
          <li>JavaScript</li>
        </ul>
        <h3>Arviointimenetelmät</h3>
        <p>TEST arvioi tämän sivuston saavutettavuuden seuraavilla menetelmillä:</p>
        <ul>
          <li>Itsearviointi: yritys tai organisaatio ovar arvioineet sivuston sisäisesti.</li>
        </ul>

        <h2>Palauteprosessi</h2>
        <p>
          Otamme mielellämme vastaan palautetta tämän sivuston saavutettavuudesta,
          Voit ottaa yhteyttä seuraavilla tavoilla:
        </p>
        <ul>
          <li>Puhelin: 1337</li>
          <li>Sähköposti: pl@cehold.er</li>
          <li>Postiosoite: TEST 1, 1337, TESTCITY</li>
        </ul>
      </article>
    );
  }

  render() {
    const { t, currentLanguage } = this.props;
    return (
      <PageWrapper className="accessibility-info-page" title={t('AccessibilityInfo.title')}>
        {true && (
          this.renderText(t)
        )}
      </PageWrapper>
    );
  }
}

export default injectT(AccessibilityInfoPage);
