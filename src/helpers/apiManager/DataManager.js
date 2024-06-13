import NetworkUtils from '../utils/networkUtils/NetWorkUtils';
import StorageManager from '../storageManager/StorageManager';
import APIConnections from './APIConnections';
import {Globals, Translations} from '../../constants';
import {t} from 'i18next';
import {NetworkManager} from './NetworkManager';
import axios from 'axios';
import querystring from 'querystring';
export default class DataManager {
  /**
   * Purpose: perform email login
   * Created/Modified By: Loshith C H
   * Created/Modified Date: 28 feb 2023
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */

  static performEmailLogin = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);

      if (response.status === 1) {
        return [true, response.status_message, response];
      } else {
        return [false, response.status_message, null];
      }
    }
  };

  /**
* Purpose: perform pin login
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 16 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static performPinLogin = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);

      if (response.status === 1) {
        return [true, response.status_message, response];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
* Purpose: Get All Users Detail
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 2 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchUserDetails = async (fromBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const isConnected = await NetworkUtils.isNetworkAvailable();
    console.log('isConnected: ', isConnected);
    if (isConnected === false) {
      return [false, 'no-Internet', null];
    } else {
      const response = await NetworkManager.post(url, fromBody, headers);
      console.log('response========DM', response);
      if (response.status !== 0) {
        return [true, response?.status_message, response];
      } else {
        return [false, response?.status_message, null];
      }
    }
  };
  /**
   * Purpose: Get tree details
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 1 March 2023
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static getTree = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    var headers = new Headers();

    headers.append('Authorization', 'Bearer ' + Globals.TOKEN);
    headers.append('Content-Type', 'application/x-www-form-urlencoded');

    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No Internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);

      if (response.status === 1 || response.status !== undefined) {
        console.log('response', response);
        return [true, response.status_message, response.result];
      } else {
        console.log('response', response);
        return [false, response.status_message, null];
      }
    }
  };
  /**
   * Purpose: Get Report Incidents
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 2 March 2023
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static viewIncidents = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };

  /**
   * Purpose: Perform add Vitals
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 1 March 2023
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */
  // static performAddVitals = async body => {
  //   let url = APIConnections.BASE_URL;

  //   let headers = {
  //     'Content-Type': 'multipart/form-data',
  //     Authorization: 'Bearer ' + Globals.TOKEN,
  //   };
  //   //1
  //   const isConnected = await NetworkUtils.isNetworkAvailable();
  //   if (isConnected === false) {
  //     return [false, 'No internet available', null];
  //   } else {
  //     // const response = await NetworkManager.post(url, body, headers);
  //     // if (response.status === 1 || response.status !== undefined) {
  //     //   return [true, response.status_message, response.result];
  //     // } else {
  //     //   return [false, response.status_message, null];

  //     let config = {
  //       method: 'post',
  //       maxBodyLength: Infinity,
  //       url: url,
  //       headers: headers,
  //       data: body,
  //     };
  //     console.log('API req-------------------------', config);
  //     axios
  //       .request(config)
  //       .then(res => {
  //         console.log('res', res, JSON.stringify(res.data));
  //         const response = JSON.stringify(res.data);
  //         if (response.status === 1 || response.status !== undefined) {
  //           return [true, response.status_message, response?.result || []];
  //         } else {
  //           return [false, response.status_message, null];
  //         }
  //       })
  //       .catch(error => {
  //         console.log('error', error);
  //       });

  //     // }
  //   }
  // };

  static performAddVitals = async body => {
    let url = APIConnections.BASE_URL;

    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };

    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: body,
      };
      console.log('Api req', config);
      const res = await axios.request(config);
      const response = res.data;
      console.log('API response =>', response);
      console.log('API Statue =>', response?.status);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message];
      } else {
        return [false, response.status_message];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, null];
    }
  };

  /**
   * Purpose: Perform add Notes
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 3 March 2023
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static performAddNotes = async body => {
    let url = APIConnections.BASE_URL;
    const urlEncodedData = querystring.stringify(body);
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    // const isConnected = await NetworkUtils.isNetworkAvailable();
    // if (isConnected === false) {
    //   return [false, 'No internet available', null];
    // } else {
    //   const response = await NetworkManager.post(url, body, headers);
    //   if (response.status === 1 || response.status !== undefined) {
    //     return [true, response.status_message, response.result];
    //   } else {
    //     return [false, response.status_message, null];
    //   }

    // }

    try {
      const isConnected = await NetworkUtils.isNetworkAvailable();
      if (!isConnected) {
        throw new Error('No internet available');
      }

      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: url,
        headers: headers,
        data: body,
      };
      console.log('Api req performAddNotes ', config);
      const res = await axios.request(config);
      const response = res.data;
      console.log('API response =>', response);
      console.log('API Statue =>', response?.status);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message];
      } else {
        return [false, response.status_message];
      }
    } catch (error) {
      console.log('API error', error.message);
      return [false, error.message, null];
    }
  };
  /**
   * Purpose: Perform add Report incidents
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 1 March 2023
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static performAddReportIncident = async body => {
    let url = APIConnections.BASE_URL;
    let _body = JSON.stringify(body);
    let headers = {
      'Content-Type': 'multipart/form-data',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, body, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
     * Purpose: Perform logout
     * Created/Modified By:Loshith C H
     * Created/Modified Date: 2 march 2023
     * Steps:
         1 .Check network status
         2.Fetch the data
         3.Return data and other info
  */
  static performLogOut = async formBody => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === false) {
        return [false, response.message, null];
      } else {
        if (response.status === false) {
          return [false, response.message, response.result];
        } else {
          return [true, response.message, null];
        }
      }
    }
  };
  /**
* Purpose: Get All WorkSchedules
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 3 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchViewSchedulesDetails = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };

  /**
* Purpose: Get All WorkSchedulesDetail
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 20 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchSchedulesDetails = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
* Purpose: Status updation in workSchedule screen
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 21 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchStartButtonDetails = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
* Purpose: Status updation in workSchedule screen
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 21 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchEndButtonDetails = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
* Purpose: view notification in NotificationListScreen
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 27 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchViewNotificationDetails = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
* Purpose: Read notification in NotificationList screen
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 27 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchReadNotificationDetails = async (formBody = {}) => {
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [false, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
* Purpose:  notification count in Homepage screen
* Created/Modified By: LOSHITH C H
* Created/Modified Date: 27 MARCH 2023
* Steps:
1.Get the value from response
2.return the value
*/
  static fetchNotificationCountDetails = async (formBody = {}) => {
    console.log('Notification list api called');
    let url = APIConnections.BASE_URL;
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    //1
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No internet available', null];
    } else {
      const response = await NetworkManager.post(url, formBody, headers);
      if (response.status === 1 || response.status !== undefined) {
        return [true, response.status_message, response.result];
      } else {
        return [false, response.status_message, null];
      }
    }
  };
  /**
   * Purpose: Get tree details
   * Created/Modified By: Monisha Sreejith
   * Created/Modified Date: 1 March 2023
   * Steps:
       1 .Check network status
       2.Fetch the data
       3.Return data and other info
    */
  static fetchSyncData = async data => {
    let url = APIConnections.BASE_URL;
    // var headers = new Headers();

    // headers.append('Authorization', 'Bearer ' + Globals.TOKEN);
    // headers.append('Content-Type', 'application/x-www-form-urlencoded');
    // let headers = {
    //   'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //   Authorization: 'Bearer ' + Globals.TOKEN,
    // };
    //1
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      Authorization: 'Bearer ' + Globals.TOKEN,
    };
    const urlEncodedData = querystring.stringify(data);
    const isConnected = await NetworkUtils.isNetworkAvailable();
    if (isConnected === false) {
      return [true, 'No Internet available', null];
    } else {
      // const response = await NetworkManager.post(url, formBody, headers);

      // if (response.status === 1 || response.status !== undefined) {
      //   console.log('response', response);
      //   return [true, response.status_message, response.result];
      // } else {
      //   console.log('response', response);
      //   return [false, response.status_message, null];
      // }

      try {
        // const isConnected = await NetworkUtils.isNetworkAvailable();
        // if (!isConnected) {
        //   throw new Error('No internet available');
        // }

        const config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: url,
          headers: headers,
          data: urlEncodedData,
        };
        console.log('Api req====', config);
        const res = await axios.request(config);
        const response = res.data;
        console.log('API response =>', response);
        console.log('API Statue =>', response?.status);
        if (response.status === 1) {
          return [true, response.status_message, response.result];
        } else {
          return [false, response.status_message, null];
        }
      } catch (error) {
        console.log('API error', error.message);
        return [false, error.message, null];
      }
    }
  };
}
