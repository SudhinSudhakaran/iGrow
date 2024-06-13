export default {

  ENV : 'DEV', // Environment should be PROD or DEV
  OPTION: 'TREE',
  TOKEN: '',
  USER_DETAILS: {},
  USER_EMAIL: '',
  DEVICE_ID: '',
  FCM_TOKEN: '',
  API_KEY: 'TYdAc3YOsed6YridIlGAMB97SrFOV2RpZvoDGALnzR3a12uQDDPJIzUxJ2wqdsXb',
  REFRESH_DETAILS: false,
  PIN: '',
  NEED_NAVIGATION_TO_OTHER_VITALS: false,
  NEED_NAVIGATION_TO_TREE_VITALS: false,
  SELECTED_SCHEDULE_ID: {
    id: '',
  },
  SELECTED_INCIDENT_ID: {
    id: '',
  },
  ASSETS_LIST :[],
  ASSETS_IMAGE_LIST : [],
  INCIDENT_IMAGE_LIST: [],
  SELECTED_IMAGE: [],
  NEED_SYNC: false,
  NEED_NAVIGATION_TO_HOME: false,
  IF_VITALS_BUTTON_SELECTED: true,
  //used for storage
  STORAGE_KEYS: {
    IS_AUTH: 'isAuthorized',
    USER_DETAILS: 'userDetails',
    TOKEN: 'token',
    USER_EMAIL: 'user_email',
    DB: 'localDataBase',
    PIN: 'pin',
    ASSETS_LIST: 'assetsList',
    SCHEDULE_LIST: 'scheduleList',
    ADMIN_LIST: 'adminList',
    PROJECT_LIST: 'projectList',
    PROGRAM_LIST: 'programList',
    DEPARTMENT_List: 'departmentList',
    LOCAL_DATA: 'localData',
    UN_READ_NOTIFICATION_COUNT: 'count',
    PROFILE_DATA: 'profileData',
    INCIDENT_LIST: 'incidentList',
    STARTED_TASK: 'startTask',
    LAST_SYNC_AT: 'lastSyncAt',
    ASSETS_IMAGES: 'assetsImages',
    TICKET_IMAGES: 'ticketsImage',
    // for persist data 
    ASSETS:'assets',
    INCIDENTS_LIST :'incidents_list',
   
  },
  SHARED_VALUES: {
    POPUP_ACTIVE_SOURCE_INDEX: -1,
    DELETE_ATTACHMENT_SELECTED_INDEX: -1,
  },
};
