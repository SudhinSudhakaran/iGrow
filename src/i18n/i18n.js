/**
    * Purpose: Add Translations
    * Created/Modified By: Monisha Sreejith
    * Created/Modified Date: 17 Feb 2023
    */

import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import {I18nManager} from 'react-native';
import Translations from '../constants/Translations';
// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
        //Detail Screen
        [Translations.DETAIL]: 'Details',
        [Translations.DETECTED_AS_TREE]: 'Detected as Tree',
        [Translations.FARM]: 'Farm',
        [Translations.ABC_FARM]: 'ABC FARM',
        [Translations.TREE]: 'Tree',
        [Translations.ADD_NOTES]: 'Add Notes',
        [Translations.ADD_VITALS]: 'Add Vitals',
        [Translations.ADD_INCIDENTS]: 'Add Incidents',
        [Translations.NOTES]: 'Notes',
        [Translations.VITALS]: 'Vitals',
        [Translations.INCIDENTS]: 'Incidents',
        [Translations.NAME]: 'Name',
        //Scan qr screen
        [Translations.SCAN] : 'Scan',
        [Translations.SCAN_DESCRIPTION]:'Scan barcode to fetch details',
        [Translations.VIEW_ALL_INCIDENTS]:'View all incidents',
        //Login screen
        [Translations.LOGIN]:'Login',
        [Translations.FORGOT_PASSWORD]:'Forgot Password ?',
        //PinScreen
        [Translations.ENTER_PIN]:'Enter PIN',
        //HomePageScreen
        [Translations.SCAN_QR]:'Scan QR',
        [Translations.WORK_SCHEDULES]:'Work Schedule',
        [Translations.PROFILE]:'Profile',
        //Work Schedules
        [Translations.VIEW_ALL_WORK_SCHEDULES]:'View all work schedules',
        //Profile Screen
        [Translations.ABOUT_YOUR_PROFILE]:'About your profile',
        [Translations.LOGOUT]:"Logout",
        [Translations.SEARCH]:'Search',
    },
},
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    compatibilityJSON: 'v3',
    lng: 'en', // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
