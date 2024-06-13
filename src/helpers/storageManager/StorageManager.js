import {Globals} from '../../constants';
import {AppStorage} from './AppStorage';
export default class StorageManager {
  // email
  static saveUserEmail = async email => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.USER_EMAIL, email);
    } catch (e) {}
  };

  static getUserEmail = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.USER_EMAIL);
      return res;
    } catch (e) {}
  };

  static saveIsAuth = async info => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.IS_AUTH, info);
    } catch (e) {}
  };

  static getIsAuth = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.IS_AUTH);
      return res;
    } catch (e) {}
  };

  static saveToken = async info => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.TOKEN, info);
    } catch (e) {}
  };

  static getSavedToken = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.TOKEN);
      return res;
    } catch (e) {}
  };

  static saveUserDetails = async info => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.USER_DETAILS, info);
    } catch (e) {}
  };

  static getUserDetails = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.USER_DETAILS);
      return res;
    } catch (e) {}
  };
  /**
        *
        Purpose:clear data from Async storage
       * Created/Modified By: loshith
       * Created/Modified Date: 2 march 2023
       * Steps:
           1.Clear the data in the Async storage
        */
  static clearUserRelatedData = async () => {
    try {
      //Clearing from globals
      Globals.USER_DETAILS = {};
      Globals.IS_AUTHORIZED = false;
      Globals.TOKEN = '';
      Globals.PIN = '';
      Globals.USER_EMAIL = '';
      //Clearing from db
      let res = await AppStorage.clearAll();
      return res;
    } catch (e) {
      console.log('ClearUserRelatedData: ', e);
    }
  };
  /**
               *  Purpose:Get the value of token UUID
              * Created/Modified By: loshith
              * Created/Modified Date: 2 mar 2023
              * Steps:
                  1.Get the value from Async storage
                  2.return the value
               */
  static getTokenUUID = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.PUSH_TOKEN_UUID);
      console.log('Utils PUSH_TOKEN_UUID', res);
      return res;
    } catch (e) {}
  };
  /**
               *  Purpose:save notification count
              * Created/Modified By: loshith
              * Created/Modified Date: 28 mar 2023
              * Steps:
                  1.save the value from Async storage
                  2.return the value
               */
  static saveCount = async count => {
    try {
      await AppStorage.setItem(
        Globals.STORAGE_KEYS.UN_READ_NOTIFICATION_COUNT,
        count,
      );
    } catch (e) {}
  };
  /**
               *  Purpose:get notification count
              * Created/Modified By: loshith
              * Created/Modified Date: 28 mar 2023
              * Steps:
                  1.Get the value from Async storage
                  2.return the value
               */

  static getSavedCount = async () => {
    try {
      let res = await AppStorage.getItem(
        Globals.STORAGE_KEYS.UN_READ_NOTIFICATION_COUNT,
      );
      return res;
    } catch (e) {}
  };

  /**
               *  Purpose:Get the user detail for store in database
              * Created/Modified By: Monisha Sreejith
              * Created/Modified Date: 30 mar 2023
              * Steps:
                  1.Get the value from Async storage
                  2.return the value
               */

  static saveProfileData = async profileData => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.PROFILE_DATA, profileData);
    } catch (e) {}
  };

  static getProfileData = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.PROFILE_DATA);
      return res;
    } catch (e) {}
  };
  static saveStaredTask = async startTask => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.STARTED_TASK, startTask);
    } catch (e) {}
  };

  static getStartedTask = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.STARTED_TASK);
      return res;
    } catch (e) {}
  };

  static savePin = async pin => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.PIN, pin);
    } catch (e) {}
  };

  static getSavedPin = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.PIN);
      return res;
    } catch (e) {}
  };

  static saveLastSyncAt = async time => {
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.LAST_SYNC_AT, time);
    } catch (e) {}
  };

  static getSavedLastSyncAt = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.LAST_SYNC_AT);
      return res;
    } catch (e) {}
  };

  // persist data
  static storeAssets = async assets => {
    console.log('storeAssets  function called', assets);
    try {
      await AppStorage.setItem(Globals.STORAGE_KEYS.ASSETS_LIST, assets);
    } catch (e) {
      console.log('Error storing assets:', e.message);
    }
  };
  static getAssets = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.ASSETS_LIST);
      return res;
    } catch (e) {
      console.log('Error retrieving assets:', e.message);
    }
  };

  static storeAdmins = async adminList => {
    try {
      await AppStorage.setItem(
        Globals.STORAGE_KEYS.ADMIN_LIST,
        JSON.stringify(adminList),
      );
    } catch (e) {}
  };
  static getAdminList = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.ADMIN_LIST);
      return JSON.parse(res);
    } catch (e) {}
  };
  static storeProgramList = async programList => {
    try {
      await AppStorage.setItem(
        Globals.STORAGE_KEYS.PROGRAM_LIST,
        JSON.stringify(programList),
      );
    } catch (e) {}
  };
  static getProgramList = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.PROGRAM_LIST);
      return JSON.parse(res);
    } catch (e) {}
  };

  static storeDepartmentsList = async list => {
    try {
      await AppStorage.setItem(
        Globals.STORAGE_KEYS.DEPARTMENT_List,
        JSON.stringify(list),
      );
    } catch (e) {}
  };
  static getDepartmentsList = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.DEPARTMENT_List);
      return JSON.parse(res);
    } catch (e) {}
  };

  static storeIncidentsList = async list => {
    try {
      await AppStorage.setItem(
        Globals.STORAGE_KEYS.INCIDENTS_LIST,
        JSON.stringify(list),
      );
    } catch (e) {}
  };
  static getIncidentsList = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.INCIDENTS_LIST);
      return JSON.parse(res);
    } catch (e) {}
  };
  static storeScheduleList = async list => {
    try {
      await AppStorage.setItem(
        Globals.STORAGE_KEYS.SCHEDULE_LIST,
        JSON.stringify(list),
      );
    } catch (e) {}
  };
  static getSchedulesList = async () => {
    try {
      let res = await AppStorage.getItem(Globals.STORAGE_KEYS.SCHEDULE_LIST);
      return JSON.parse(res);
    } catch (e) {}
  };

  static storeAssetImageList = async list => {
    try {
      await AppStorage.setItem('assetsImageList', list);
    } catch (e) {}
  };
  static getAssetImageList = async () => {
    try {
      let res = await AppStorage.getItem('assetsImageList');
      return res;
    } catch (e) {}
  };

  static storeIncidentImageList = async list => {
    try {
      await AppStorage.setItem('incidentImageList', list);
    } catch (e) {}
  };
  static getIncidentImageList = async () => {
    try {
      let res = await AppStorage.getItem('incidentImageList');
      return res;
    } catch (e) {}
  };
}
