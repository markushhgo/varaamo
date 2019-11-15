import React from 'react';
import CookieConsent from 'react-cookie-consent';

function CookieBar() {
  const userLang = navigator.language || navigator.userLanguage;
  // console.log(userLang); use this line for logging diffrent language codes for porting purposes.

  let buttonText;
  let declineButtonText;
  let cookieDescription;
  const cookiePolicy = {};

  if (userLang === 'sv') {
    buttonText = 'Godkänn';
    declineButtonText = 'Avvisa';
    cookieDescription = 'Vi använder cookies för att kunna ge dig en bättre upplevelse. Genom att du fortsätter att använda Varaamo så accepterar du användingen av cookies.';
    cookiePolicy.href = 'https://varaamo.turku.fi:8007/cookieInformation-sv.html';
    cookiePolicy.text = 'Länk till Cookie Policy';
  } else {
    buttonText = 'Hyväksyn';
    declineButtonText = 'Hylkää';
    cookieDescription = 'Käytämme evästeitä parantaaksemme käyttökokemustasi. Jatkamalla Varaamon käyttöä hyväksyt evästeiden käytön.';
    cookiePolicy.href = 'https://varaamo.turku.fi:8007/cookieInformation-fi.html';
    cookiePolicy.text = 'Linkki Evästekäytäntöön';
  }

  return (
    <CookieConsent
      buttonClasses="cookie-accept-button"
      buttonId="cookie-accept-button"
      buttonText={buttonText}
      contentStyle={{ flex: 'auto' }}
      declineButtonClasses="cookie-decline-button"
      declineButtonId="cookie-decline-button"
      declineButtonText={declineButtonText}
      disableButtonStyles
      enableDeclineButton
      expires={90}
      onDecline={() => { window.location.replace('http://www.turku.fi'); }}
      setDeclineCookie={false}
    >
      {cookieDescription}
      <div className="cookiePolicy">
        <a href={cookiePolicy.href} style={{ color: 'white' }}>{cookiePolicy.text}</a>
      </div>
    </CookieConsent>
  );
}

export default CookieBar;
