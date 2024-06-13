/**
    * Purpose: Create HomePage Screen Component
    * Created/Modified By:Loshith C H
    * Created/Modified Date: 20 Feb 2023
    * Steps: 1. Create Screen
             2. navigation added
    */
             import {
              StyleSheet,
              Text,
              View,
              SafeAreaView,
              TouchableOpacity,
              Image,
              BackHandler,
              PermissionsAndroid,
            } from 'react-native';
            import {t} from 'i18next';
            import moment from 'moment';
            import Modal from 'react-native-modal';
            import {uniqBy} from 'lodash';
            import {useSelector} from 'react-redux';
            import {useDispatch} from 'react-redux';
            import RNFetchBlob from 'rn-fetch-blob';
            import Lottie from 'lottie-react-native';

            import React, {useState, useEffect} from 'react';
            import {AppLogo} from '../../components';
            import {useNavigation} from '@react-navigation/core';
            import NetInfo, { fetch } from '@react-native-community/netinfo';
            import Utilities from '../../helpers/utils/Utilities';
            import {useFocusEffect} from '@react-navigation/core';
            import {setProfileData} from '../../redux/slice/profileSlice';
            import {setLastSyncAt} from '../../redux/slice/lastSyncSlice';
            import DataManager from '../../helpers/apiManager/DataManager';
            import APIConnections from '../../helpers/apiManager/APIConnections';
            import {Colors, Fonts, Globals, Images, Translations} from '../../constants';
            import {setDetailsImageList, setimagesDetails} from '../../redux/slice/treeDetailSlice';
            import StorageManager from '../../helpers/storageManager/StorageManager';
            import {setNotificationCount} from '../../redux/slice/notificationCountSlice';
            import ItemSeparatorScreen from '../../components/itemSeparatorScreen/ItemSeparatorScreen';
            import {measureConnectionSpeed} from 'react-native-network-bandwith-speed';
            import {
              deleteIncident,
              deleteNote,
              deleteVital,
              setAssetList,
            } from '../../redux/slice/reduxPersistSlice';
            import {
              responsiveWidth,
              responsiveHeight,
              responsiveFontSize,
            } from 'react-native-responsive-dimensions';
            import {
              addAdmins,
              addDepartments,
              addIncidents,
              addProgrammes,
              addScheduleList,
            } from '../../redux/slice/offLineDBPersistSlice';
            // import SQLite from 'react-native-sqlite-storage';
            // var db = SQLite.openDatabase('igrowAssets.db');
            let ANIMATION = require('../../assets/animations/110850-sync-animation.json');

            import {Assets} from '../../database';
            import Vasern from 'vasern';
            import { openDatabase } from 'react-native-sqlite-storage';
            import DeviceInfo from 'react-native-device-info';
            import BackgroundService from 'react-native-background-actions';

            const db = openDatabase({
              name: 'AddTree',
            });
            const HomePageScreen = () => {
              const dispatch = useDispatch();
              const navigation = useNavigation();
              const [showModal, setShowModal] = useState(false);
              const [isConnected, setIsConnected] = useState(false);
              const [asset, setAsset] = useState([]);
              const [dbOpen, setDbOpen] = useState(false);
              const [noteOpen, setNoteOpen] = useState(false);
              const [vitalOpen, setVitalOpen] = useState(false);
              const [imageOpen, setImageOpen] = useState(false);

              //redux States

              const {lastSyncAt} = useSelector(state => state.lastSyncAt);
              const {userDetails} = useSelector(state => state.userDetails);

              const {notificationCount} = useSelector(state => state.notificationCount);
              // persist
              const [recordCount, setRecordCount] = useState(0);
              const [dbExist, setDbExist] = useState(false);
              const [updatingCount, setUpdatingCount] = useState(0);
              const [totalRecordCount, setTotalRecordCount] = useState(0);
              const {notePersist} = useSelector(state => state.notePersist);
              const {vitalPersist} = useSelector(state => state.vitalPersist);
              const {incidentPersist} = useSelector(state => state.incidentPersist);
              const {incidents, assetsImagesList, incidentsImagesList} = useSelector(
                state => state.offLineDBState,
              );
              const {assetList} = useSelector(state => state.assetList);

              var greeting = 'Good morning';
              greeting = Utilities.getGreeting();
useEffect(()=>{
  if (showModal === false){
    backgroundStop();
    console.log('background running stopped');
  }
});
const backgroundStop = async()=>{
  await BackgroundService.stop();
};
              // useEffect(() => {
              //   db.transaction(tx => {
              //     tx.executeSql(
              //       "SELECT name FROM sqlite_master WHERE type='table' AND name='Assets'",
              //       [],
              //       (tx, results) => {
              //         if (results.rows.length === 0) {
              //           // Assets table does not exist, create it
              //           db.transaction(tx => {
              //             tx.executeSql(
              //               'CREATE TABLE Assets (id INTEGER PRIMARY KEY AUTOINCREMENT, assets TEXT)',
              //               [],
              //               () => {
              //                 console.log('Assets table created successfully!');
              //               },
              //               error => {
              //                 console.log('Error creating Assets table:', error);
              //               },
              //             );
              //           });
              //         } else {
              //           console.log('Table already exist');
              //         }
              //       },
              //       error => {
              //         console.log('Error checking Assets table:', error);
              //       },
              //     );
              //   });
              // }, []);

              useEffect(() => {
                const handleBackButton = () => {
                  backButtonAction();
                  return true;
                };

                const backHandler = BackHandler.addEventListener(
                  'hardwareBackPress',
                  handleBackButton,
                );

                return () => {
                  // Clean up
                  backHandler.remove();
                };
              }, []);

              const backButtonAction = () => {
                BackHandler.exitApp();
              };

              useEffect(() => {
                console.log('3333',Globals.INCIDENT_IMAGE_LIST[0])
                const unsubscribe = NetInfo.addEventListener(state => {
                  setIsConnected(state.isConnected);
                });
                return () => {
                  // Clean up
                  unsubscribe();
                };
              }, [isConnected]);

              useFocusEffect(
                React.useCallback(() => {
                  if (Globals.NEED_NAVIGATION_TO_HOME === true) {
                    Globals.NEED_NAVIGATION_TO_HOME = false;
                  }

                  return undefined;
                }, []),
              );

              useEffect(() => {
                const calculateTotalRecordCount = () => {
                  setTotalRecordCount(
                    (notePersist?.length || 0) +
                      (vitalPersist?.length || 0) +
                      (incidentPersist?.length || 0),
                  );
                };

                calculateTotalRecordCount();
                // Assuming that notePersist, vitalPersist, and incidentPersist are dependencies
              }, [notePersist, vitalPersist, incidentPersist]);

              useEffect(() => {
if (Globals.NEED_SYNC === true){
  setShowModal(true);
  backgroundApp();
}
       }, []);
              useEffect(() => {
                getNotificationListCount();
                return () => {};
              }, []);

              useEffect(()=>{
            createAssetTable();
            createNotesTable();
            createVitalsTable();
            createimagesTable();
            createIncidentTable();
            createIncidentImagesTable();
              },[dbOpen]);
            //create table function for asset
            const createAssetTable = () => {
                db.executeSql('CREATE TABLE IF NOT EXISTS assets (assetid INTEGER,clientid INTEGER,name VARCHAR,qrvalue VARCHAR PRIMARY KEY,lat INTEGER,lng INTEGER,seqno INTEGER,reported INTEGER,created_by INTEGER,modified_by INTEGER,created_at VARCHAR,modified_at VARCHAR,txnid VARCHAR,blockassetid INTEGER,farm VARCHAR,category VARCHAR,status VARCHAR,Transplanted VARCHAR,assigneduser VARCHAR,dateofplanting DATE,seed VARCHAR,variety VARCHAR)', [], (result) => {
                    console.log('Table assets created successfully',db.executeSql);
                }, (error) => {
                    console.log('Create table assets error', error);
                });
            };
            const createAssetsCategory = (list) => {
              list?.map((item)=>{
                // console.log('item===',item)
              let sql = 'INSERT INTO assets (assetid,clientid,name,qrvalue,lat,lng,seqno,reported,created_by,modified_by,created_at,modified_at,txnid,blockassetid,farm,category,status,Transplanted,assigneduser,dateofplanting,seed,variety) VALUES (?, ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)';
              let params = [item.id,item.clientid,item.name,item.qrvalue,item.lat ,item.lng ,item.seqno ,item.reported ,item.created_by,item.modified_by ,item.created_at ,item.modified_at ,item.txnid,item.blockassetid,item.farm,item.category ,item.status,item.Transplanted,item.assigneduser,item.dateofplanting,item.seed ,item.variety]; //storing user data in an array
              db.executeSql(sql, params, (result) => {
                console.log('Table Assets retrieved successfully');
                setDbExist(true);
              }, (error) => {
                  console.log('Create Assets error', error);
              });
            });
            };

            //create table function for Notes
            const createNotesTable = (list) => {
              db.executeSql('CREATE TABLE IF NOT EXISTS Note (qrvalue VARCHAR,notes VARCHAR,note VARCHAR,recorded_data DATE,recorded_date DATE,FOREIGN KEY(qrvalue) REFERENCES assets(qrvalue))', [], (result) => {
                  console.log('Table notes created successfully');
              }, (error) => {
                  console.log('Create table notes error', error);
              });
            };
            const createNotesCategory = (list) => {
              list?.map((item)=>{
                item?.notes?.map((notes)=>{
                    let sql = 'INSERT INTO Note (qrvalue,notes,note,recorded_data,recorded_date) VALUES (?,?,?,?,?)';
            let params = [item.qrvalue,notes.notes,notes.note,notes.recorded_data,notes.recorded_date]; //storing user data in an array
            db.executeSql(sql, params, (result) => {
              console.log('notes retrieved successfully');
              // setNoteOpen(true);
            }, (error) => {
                console.log('Create notes category error', error);
                  });
                });
              });
            };

            //create table function for Vitals
            const createVitalsTable = (list) => {
              db.executeSql('CREATE TABLE IF NOT EXISTS Vitalss (qrvalue VARCHAR,diameter INTEGER,health VARCHAR,height INTEGER,radius INTEGER,recorded_date DATE,task VARCHAR,FOREIGN KEY(qrvalue) REFERENCES assets(qrvalue))', [], (result) => {
                  console.log('Table Vitals created successfully');
              }, (error) => {
                  console.log('Create table Vitals error', error);
              });
            };
            const createVitalsCategory = (list) => {
              list?.map((item,index)=>{
                item?.vitals?.map((vitals)=>{
            let sql = 'INSERT INTO Vitalss (qrvalue,diameter,health,height,radius,recorded_date,task) VALUES (?,?,?,?,?,?,?)';
            let params = [item.qrvalue,vitals.diameter,vitals.health,vitals.height,vitals.radius,vitals.recorded_date,vitals.task]; //storing user data in an array
            db.executeSql(sql, params, (result) => {
              console.log('Vitals retrieved successfully');
            }, (error) => {
                console.log('Create vitals category error', error);
            });
                });
              });
            };

            //create table function for images
            const createimagesTable = () => {
              db.executeSql('CREATE TABLE IF NOT EXISTS images (AssetId INTEGER,qrvalue VARCHAR,url URL,FOREIGN KEY(qrvalue) REFERENCES assets(qrvalue))', [], (result) => {
                  console.log('Table Images created successfully');
              }, (error) => {
                  console.log('Create table Images error', error);
              });
            };
            const createImagesCategory = (imageItem) => {
              imageItem?.images?.map((images)=>{
                let sql = 'INSERT INTO images (AssetId,qrvalue,url) VALUES (?, ?,?)';
            let params = [imageItem.AssetId,imageItem.qrvalue,images]; //storing user data in an array
            db.executeSql(sql, params, (result) => {
                console.log('Images retrieved successfully');
                // setTimeout(() => {
                //   setShowModal(false);
                // }, 90000);
            }, (error) => {
                console.log('Create Images category error', error);
            });
                });
            };


          const updateImagesById = (imageItem) => {
            imageItem?.images?.map((images)=>{
          db.transaction((tx) => {
            tx.executeSql(
              'UPDATE images  set AssetId=?, qrvalue=?, url=?',
              [imageItem.AssetId,imageItem.qrvalue,images],
              (tx, results) => {
                if (results.rowsAffected > 0) {
                  createImagesCategory(imageItem);
                  console.log(
                    'Images updated successfully'
                  );
                } else {console.log('Updation Failed');
                createImagesCategory(imageItem);
              }
              }
            );
          });
        });
        };
                  //create table function for incidentimages
                  const createIncidentImagesTable = () => {
                    db.executeSql('CREATE TABLE IF NOT EXISTS incidentimages (ticketId INTEGER,qrvalue VARCHAR,url URL)', [], (result) => {
                        console.log('Table Incident Images created successfully');
                    }, (error) => {
                        console.log('Create table Incident Images error', error);
                    });
                  };
                  const createIncidentImagesCategory = (item) => {
                    item?.images?.map((images)=>{
                      let sql = 'INSERT INTO incidentimages (ticketId,url) VALUES (?, ?)';
                  let params = [item.ticketIdDb,images]; //storing user data in an array
                  db.executeSql(sql, params, (result) => {
                      console.log('Incident Images retrieved successfully');
                      setTimeout(() => {
                        setShowModal(false);
                      }, 90000);
                  }, (error) => {
                      console.log('Create Incident Images category error', error);
                  });
                      });
                  };
      
      
                const updateIncidentImagesById = (item) => {
                  item?.images?.map((images)=>{
                db.transaction((tx) => {
                  tx.executeSql(
                    'UPDATE incidentimages  set ticketId=?,url=?',
                    [item.ticketIdDb,images],
                    (tx, results) => {
                      if (results.rowsAffected > 0) {
                        createIncidentImagesCategory(item);
                        console.log(
                          'Incident Images updated successfully'
                        );
                      } else {console.log('Incident Updation Failed');
                      createIncidentImagesCategory(item);
                    }
                    }
                  );
                });
              });
              };
              //create table function for incidents
            const createIncidentTable = () => {
              db.executeSql('CREATE TABLE IF NOT EXISTS incident (qrvalue VARCHAR,assignuser VARCHAR,id INTEGER,notes VARCHAR,status VARCHAR,subject VARCHAR,timestamp DATE,FOREIGN KEY(qrvalue) REFERENCES assets(qrvalue))', [], (result) => {
                  console.log('Table incident created successfully');
              }, (error) => {
                  console.log('Create table incident error', error);
              });
            };

          const createIncidentCategory =  (list) => {
            list?.map((item)=>{
            item?.incidents?.map((incident)=>{
                  let sql = 'INSERT INTO incident (qrvalue,assignuser,id,notes,status,subject,timestamp) VALUES (?,?,?,?,?,?,?)';
                  let params = [item.qrvalue,incident.assignuser,incident.id,incident.notes,incident.status,incident.subject,incident.timestamp]; //storing user data in an array
            db.executeSql(sql, params, (result) => {
              console.log('incident retrieved successfully');
                        }, (error) => {
                console.log('Create incident category error', error);
            });
            });
        });
            };

              async function getNetworkBandwidth() {
                try {
                  const networkSpeed = await measureConnectionSpeed();
                  console.log('networkSpeed-----', networkSpeed); // Network bandwidth speed
                } catch (err) {
                  console.log(err);
                }
              }
              const backgroundApp = async()=>{
                if (Globals.NEED_SYNC === true) {
                  setShowModal(true);
                  console.log('ifbackground running startted');
                  const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
                  const veryIntensiveTask = async (taskDataArguments) => {
                      const { delay } = taskDataArguments;
                      await new Promise( async (resolve) => {
                        console.log('delay==',delay);
                        fetchDataAndStoreLocalDB();
                        Globals.NEED_SYNC = false;
                      });
                  };
                  const options = {
                      taskName: 'iGrow',
                      taskTitle: 'iGrow',
                      taskDesc: 'Syncing data',
                      taskIcon: {
                          name: 'ic_launcher',
                          type: 'mipmap',
                      },
                      color: '#ff00ff',
                      linkingURI: 'yourSchemeHere://chat/jane', // Add this
                      parameters: {
                          delay:500,
                      },
                  };
                  await BackgroundService.start(veryIntensiveTask, options);
                  }
                  else {
                    if(isConnected===true){
                      console.log('else background running startted');
                      setShowModal(true);
                      const sleep = (time) => new Promise((resolve) => setTimeout(() => resolve(), time));
                      const veryIntensiveTask = async (taskDataArguments) => {
                          const { delay } = taskDataArguments;
                          await new Promise( async (resolve) => {
                            syncButtonAction();
                              console.log('delay==',delay);
                          });
                      };
                      const options = {
                          taskName: 'iGrow',
                          taskTitle: 'iGrow',
                          taskDesc: 'Syncing data',
                          taskIcon: {
                              name: 'ic_launcher',
                              type: 'mipmap',
                          },
                          color: '#ff00ff',
                          linkingURI: 'yourSchemeHere://chat/jane', // Add this
                          parameters: {
                            delay: 500,
                          },
                      };
                      await BackgroundService.start(veryIntensiveTask, options);
                        }
                    else{
                      setShowModal(false);
                      Utilities.showToast('Sorry!', 'No network available', 'error', 'bottom');
                    }
              }
              };
              const syncButtonAction = () => {
                if (isConnected === true) {
                  // fetchDataAndStoreLocalDB();
                  getNetworkBandwidth();
                  setShowModal(true);
                  checkLocalDB();
                } else {
                  Utilities.showToast('Sorry!', 'No network available', 'error', 'bottom');
                  setShowModal(false);
                }
              };
              // ******************************
              // local db section
              const checkLocalDB = async () => {
                setRecordCount(
                  notePersist.length + incidentPersist.length + vitalPersist.length,
                );

                // getNotes().then(_notes => {
                if (notePersist.length > 0) {
                  var promises = [];
                  notePersist.map((oldNote, oldNoteIndex) => {
                    console.log('noteitem///', oldNote);
                    var _body = {
                      [APIConnections.KEYS.KEY]: Globals.API_KEY,
                      [APIConnections.KEYS.METHOD]: 'add',
                      [APIConnections.KEYS.RESOURCE]: 'notes',
                      [APIConnections.KEYS.DATA_ASSETID]: oldNote.assetId,
                      [APIConnections.KEYS.DATA_ASSETTYPE]: oldNote.assetType,
                      [APIConnections.KEYS.DATA_RECORDED_DATE]: oldNote.recordedDate,
                      [APIConnections.KEYS.DATA_NOTE]: oldNote.note,
                    };

                    const formBody = Object.keys(_body)
                      .map(
                        key =>
                          encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
                      )
                      .join('&');

                    promises.push(
                      performAddNotes(formBody, false, oldNoteIndex, oldNote).then(() => {
                        deleteNoteById(oldNote);
                      }),
                    );
                  });

                  Promise.all(promises).then(() => {
                    checkVitalLocalDB();
                  });
                } else {
                  checkVitalLocalDB();
                }
                // });
              };

              const performAddNotes = async (formBody, needGoBack, index, oldNote) => {
                console.log('oldNote', oldNote.assetId);
                try {
                  const [isSuccess, message, responseData] =
                    await DataManager.performAddNotes(formBody);
                    NetInfo.fetch().then(state => {
                      if (state.isConnected) {
                  if (isSuccess) {
                    setUpdatingCount(prev => prev + 1);
                  } else {
                    // Utilities.showToast('FAILED', message, 'error', 'bottom');
                  }
                }
                else{
                  Utilities.showToast('Sorry!', 'No network available', 'error', 'bottom');
                setShowModal(false);
                }
              });
                } catch (error) {}
              };
              const deleteNoteById = async oldNote => {
                dispatch(deleteNote(oldNote.noteUniqId));
              };

              // add vitals section

              const checkVitalLocalDB = async () => {

                // getVitalsList().then(_vitals => {
                // const vitalsLength = _vitals.length;

                if (vitalPersist.length > 0) {
                  var promises = [];
                  vitalPersist.map((oldVital, oldVitalIndex) => {
                    console.log('oldvital',oldVital);
                    let formData = new FormData();

                    let imageArrayData = [];
                    if (oldVital.images !== '') {
                      imageArrayData = JSON.parse(oldVital.images);
                    }

                    // console.log('imageArrayData<><><>', imageArrayData);

                    formData.append(APIConnections.KEYS.KEY, Globals.API_KEY);
                    formData.append(APIConnections.KEYS.METHOD, 'add');
                    formData.append(APIConnections.KEYS.RESOURCE, 'vitals');
                    formData.append(APIConnections.KEYS.DATA_HEIGHT, oldVital.height);
                    formData.append(APIConnections.KEYS.DATA_DIAMETER, oldVital.diameter);
                    formData.append(APIConnections.KEYS.DATA_HEALTH, oldVital.health);
                    formData.append(APIConnections.KEYS.DATA_RADIUS, oldVital.radius);

                    formData.append(
                      APIConnections.KEYS.DATA_RECORDED_DATE,
                      oldVital.date || moment().format('DD-MM-YYYY'),
                    );
                    formData.append(APIConnections.KEYS.DATA_NOTE, oldVital.task);
                    formData.append(
                      APIConnections.KEYS.DATA_VITAL_ASSETID,
                      oldVital.vitalAsset_id,
                    );
                    formData.append(APIConnections.KEYS.DATA_TASKID, oldVital.task);
                    formData.append(APIConnections.KEYS.DATA_LNG, oldVital.long);
                    formData.append(APIConnections.KEYS.DATA_LAT, oldVital.lat);
                    if (imageArrayData.length > 0) {
                      for (let i = 0; i < imageArrayData.length; i++) {
                        // console.log('======imagearray', imageArrayData[i]);
                        formData.append('file[]', imageArrayData[i]);
                      }
                    }
                    //
                    // formData.append(APIConnections.KEYS.DATA_TASKID, oldVital.taskId);
                    formData.append(
                      APIConnections.KEYS.DATA_START_TIME,
                      oldVital.startTime,
                    );
                    formData.append(APIConnections.KEYS.DATA_END_TIME, oldVital.endTime);
                    formData.append(APIConnections.KEYS.DATA_TREE_VITAL, 1);
                    formData.append(APIConnections.KEYS.DATA_ASSETTYPE, oldVital.assetType);

                    promises.push(
                      performAddvitals(formData, oldVitalIndex, oldVital).then(() => {
                        deleteVitalsById(oldVital);
                      }),
                    );
                  });

                  Promise.all(promises).then(responses => {
                    checkIncidentsLocalDB();
                  });
                } else {
                  checkIncidentsLocalDB();
                }
                // });

                //  performAddvitals();
              };

              /**
               <---------------------------------------------------------------------------------------------->
               * Purpose:  Delete  updated vitals from vitals persister
               * Created/Modified By: Sudhin Sudhakaran
               * Created/Modified Date: 10-05-2023
               * Steps:
               * 1.   received the vital
               * 2.   pass oldVitalUniqId to delete function
               <---------------------------------------------------------------------------------------------->
               */
              const deleteVitalsById = async oldVital => {
                dispatch(deleteVital(oldVital.vitalUniqId));
              };
              /**
             <---------------------------------------------------------------------------------------------->
             * Purpose: performAddvitals
             * Created/Modified By: Sudhin Sudhakaran
             * Created/Modified Date: 10-05-2023
             * Steps:
             * 1.   receive data
             * 2.   send data to dataManager
             <---------------------------------------------------------------------------------------------->
             */
              const performAddvitals = async (data, index, oldVital) => {
                try {
                  const [isSuccess, message, responseData] =
                    await DataManager.performAddVitals(data);
                    NetInfo.fetch().then(state => {
                      if (state.isConnected) {
                  if (isSuccess) {
                    setUpdatingCount(prev => prev + 1);
                  } else {
                    // Utilities.showToast('FAILED', message, 'error', 'bottom');
                  }
                }
                else{
                  Utilities.showToast('Sorry!', 'No network available', 'error', 'bottom');
                  setShowModal(false);
                }
              });
                } catch (error) {}
   
              };

              // Incidents screen

              /**
               * Purpose: Perform add vitals
               * Created/Modified By: Sudhin Sudhakaran
               * Created/Modified Date: 1 March 2023
               * Steps:
                 1.fetch vital details from API and append to state variable
            */
              const performAddReportIncident = async (
                body,
                needGoBack,
                index,
                oldIncident,
              ) => {
                // setIsLoading(true);
                try {
                  const [isSuccess, message, responseData] =
                    await DataManager.performAddReportIncident(body);
                    NetInfo.fetch().then(state => {
                      if (state.isConnected) {
                  if (isSuccess) {
                    setUpdatingCount(prev => prev + 1);
                  } else {
                    // Utilities.showToast('FAILED', message, 'error', 'bottom');
                  }
                }
                else{
                  Utilities.showToast('Sorry!', 'No network available', 'error', 'bottom');
                  setShowModal(false);
                }
              });
                } catch (error) {}
              };
              /**
             <---------------------------------------------------------------------------------------------->
             * Purpose: Check data in incident array
             * Created/Modified By: Sudhin Sudhakaran
             * Created/Modified Date: 10-05-2023
             * Steps:
             * 1.   check any item found in incidenty array by length
             * 2.   map the  array
             * 3.   add each item to performAddReportIncident
             * 4.   push performAddReportIncident funbction a promises object
             <---------------------------------------------------------------------------------------------->
             */
              const checkIncidentsLocalDB = async () => {
                const _incidentListLength = incidentPersist.length;

                if (_incidentListLength > 0) {
                  var promises = []; //here will be kept all returned promises
                  incidentPersist.map((oldIncident, index) => {
                    console.log('oldIncident>', oldIncident);
                    const imageArrayData = JSON.parse(oldIncident.images);
                    let formData = new FormData();
                    formData.append(APIConnections.KEYS.KEY, Globals.API_KEY);
                    formData.append(APIConnections.KEYS.RESOURCE, 'tickets');
                    formData.append(APIConnections.KEYS.METHOD, 'add');

                    formData.append(
                      APIConnections.KEYS.DATA_DERPARTMENTID,
                      oldIncident.departmentId,
                    );
                    formData.append(
                      APIConnections.KEYS.DATA_CLIENTID,
                      oldIncident.clientId,
                    );
                    formData.append(APIConnections.KEYS.DATA_USERID, oldIncident.userId);
                    formData.append(APIConnections.KEYS.DATA_ADMIN_ID, oldIncident.userId);
                    formData.append(APIConnections.KEYS.DATA_ASSETID, oldIncident.assetId);
                    formData.append(
                      APIConnections.KEYS.DATA_PROJECTID,
                      oldIncident.projectId,
                    );
                    formData.append(APIConnections.KEYS.DATA_EMAIL, oldIncident.email);
                    formData.append(APIConnections.KEYS.DATA_SUBJECT, oldIncident.subject);
                    formData.append(APIConnections.KEYS.DATA_NOTES, oldIncident.notes);
                    formData.append(
                      APIConnections.KEYS.DATA_ASSETTYPE,
                      oldIncident.assetType,
                    );
                    if (imageArrayData.length > 0) {
                      for (let i = 0; i < imageArrayData.length; i++) {
                        // console.log('======imagearray', imageArrayData[i]);
                        formData.append('file[]', imageArrayData[i]);
                      }
                    }
                    promises.push(
                      performAddReportIncident(formData, false, index, oldIncident).then(
                        () => {
                          deleteIncidentById(oldIncident);
                        },
                      ),
                    );
                  });

                  Promise.all(promises).then(response => {
                    setTimeout(() => {
                      fetchDataAndStoreLocalDB();
                    }, 3000);
                  });
                } else {
                  setTimeout(() => {
                    fetchDataAndStoreLocalDB();
                  }, 3000);
                }
                // });
              };

              const deleteIncidentById = async oldIncident => {
                dispatch(deleteIncident(oldIncident.incidentUniqId));
              };

              const fetchDataAndStoreLocalDB = () => {
                console.log('fetchDataAndStoreLocalDB');
                setUpdatingCount(0);

                NetInfo.fetch().then(state => {
                  // console.log('Connection type', state);
                  // console.log('Is connected?', state.isConnected);
                  console.log('last sync at', lastSyncAt);
                  if (state.isConnected) {
                    setShowModal(true);
                    var _body = {
                      [APIConnections.KEYS.KEY]: Globals.API_KEY,
                      [APIConnections.KEYS.RESOURCE]: 'offline',
                      [APIConnections.KEYS.METHOD]: 'get',
                      [APIConnections.KEYS.LAST_SYNC_AT]: lastSyncAt,
                    };

                    DataManager.fetchSyncData(_body).then(
                      ([isSuccess, message, responseData]) => {
                        if (isSuccess === true) {
                          // console.log('responseData----------', responseData);
                          if (responseData !== undefined) {
                            dispatch(setLastSyncAt(moment().format('YYYY-MM-DD HH:mm:ss')));
                            StorageManager.saveLastSyncAt(
                              moment().format('YYYY-MM-DD HH:mm:ss'),
                            );
                            console.log('responsedata====',responseData);
                            configLocalData(responseData);
                          } else {
                            Utilities.showToast('Sorry!', message, 'error', 'bottom');
                              setShowModal(false);
                          }
                        } else {
                          Utilities.showToast('Sorry!', message, 'error', 'bottom');
                            setShowModal(false);
                        }
                      },
                    );
                  }
                  else{
                    Utilities.showToast('Sorry!', 'No network available', 'error', 'bottom');
                  setShowModal(false);
                  }
                });
              };
              /**
             <---------------------------------------------------------------------------------------------->
             * Purpose: configLocalData
             * Created/Modified By: Sudhin Sudhakaran
             * Created/Modified Date: 11-05-2023
             * Steps:
             * 1.   Add new assets to previous data list
             <---------------------------------------------------------------------------------------------->
             */
              const configLocalData = data => {
                dispatch(addScheduleList(data.schedules));
                StorageManager.storeScheduleList(data.schedules);
                dispatch(addAdmins(data.admins));
                StorageManager.storeAdmins(data.admins);
                dispatch(addProgrammes(data.programmes));
                StorageManager.storeProgramList(data.programmes);
                dispatch(addDepartments(data.departments));
                StorageManager.storeDepartmentsList(data.departments);
                configAssetsAndImage(data.assets, data.tickets);
              };

              /**
               <---------------------------------------------------------------------------------------------->
               * Purpose: Add assets to DB
               * Created/Modified By: Sudhin Sudhakaran
               * Created/Modified Date: 09-07-2023
               * Steps:
               * 1. Convert the array into string
               * 2. Delete the existing row in the assets table
               * 3. add the string
               <---------------------------------------------------------------------------------------------->
               */
              const addAssetsInSQLite = list => {
                // console.log('setassetlist====',list);
                setAsset(list);
              //step :1
                const assetDataString = JSON.stringify(list);
                  if (incidentPersist.length === 0 && notePersist.length === 0 && vitalPersist.length === 0)
                  {
                  createAssetsCategory(list);
                 createNotesCategory(list);
                 createVitalsCategory(list);
                 createIncidentCategory(list);

                  dispatch(setAssetList(list));
                  }
                  if (notePersist.length > 0 || vitalPersist.length > 0 || incidentPersist.length > 0){
                   createNotesCategory(list);
                   createVitalsCategory(list);
                   createIncidentCategory(list);
                  }
                // db.transaction(tx => {
                //   //step :2
                //   // Remove all rows from the Assets table
                //   tx.executeSql('DELETE FROM Assets', [], () => {
                //     //step :3
                //     // Add the new list as a single row
                //     tx.executeSql(
                //       'INSERT INTO Assets (assets) VALUES (?)',
                //       [assetDataString],
                //       (tx, results) => {
                //         console.log('Results', results.rowsAffected);
                //         if (results.rowsAffected > 0) {
                //           console.log('Successfully added');
                //         } else {
                //           console.log('Failed');
                //         }
                //       },
                //     );
                //   });
                // });

                // Assets.insert({
                //   assets: assetDataString,
                // });
                // var _Assets = Assets.data();
                // console.log('Assets stored', _Assets);
              };
              const configAssetsAndImage = (assetsList, tickets) => {
                let dbData = Assets.data();
                var oldData = [];
                if (dbData.length > 0) {
                  oldData = JSON.parse(dbData[0]?.assets) || [];
                }
                let newAssetArray = [];
                let newTicketsArray = [];

                if ((oldData?.length ?? 0) > 0) {
                  newAssetArray = uniqBy([...assetsList, ...oldData], 'id');

                  console.log('=========== if', newAssetArray);
                  Assets.data().map(item => {
                    var item1 = Assets.get({id: item.id});
                    Assets.remove(item1);
                  });
                  addAssetsInSQLite(newAssetArray);
                } else {
                  console.log('=========== else', assetsList);
                  Assets.data().map(item => {
                    var item1 = Assets.get({id: item.id});
                    Assets.remove(item1);
                  });
                  addAssetsInSQLite([...assetsList]);
                  // Globals.ASSETS_LIST = [...assetsList];
                }

                if ((incidents?.length ?? 0) > 0) {
                  newTicketsArray = uniqBy([...tickets, ...incidents], 'id');
                  dispatch(addIncidents(newTicketsArray));
                  // StorageManager.storeIncidentsList(newTicketsArray);
                } else {
                  dispatch(addIncidents(tickets));
                  StorageManager.storeIncidentsList(tickets);
                }
                downloadImage(assetsList, tickets);

                // console.log('Tickets array', incidentList);
              };
              // Assuming you are using the database instance from the previous step

              // API CALL

              // Download all images and store their paths in state
              const downloadImage = async (newAssets, uniqDiffTicketArray) => {
                console.log('download image function called', newAssets);
                try {
                  let deviceVersion = DeviceInfo.getSystemVersion();
                  if (deviceVersion >= 13)
                  {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    {
                      title: 'Storage Permission Required',
                      message: 'App needs access to your storage to download Photos',
                    },
                  );
                  if (granted === 'granted') {
                    // console.log('Storage Permission Granted.');
                    if (newAssets && newAssets.length > 0) {
                      const assetImages = await Promise.all(
                        newAssets.map(async item => {
                          // console.log('item------', item.id, item);
                          const obj = {
                            assetId: item.id,
                            qrvalue:item.qrvalue,
                            images: [],
                          };
                          if (item && item?.images && item?.images.length > 0) {
                            const imageDownloads = item?.images.map(async url => {
                              try {
                                const response = await RNFetchBlob.config({
                                  fileCache: true,
                                  appendExt: 'jpg',
                                }).fetch('GET', `http://${url || ''}`);
                                const imagePath = response.path();
                                // console.log('imagePath', url, imagePath);
                                obj.images.push(imagePath);
                              } catch (error) {
                                console.error(error);
                                Utilities.showToast(
                                  'Sorry!',
                                  `something went wrong ${error?.message || ''}`,
                                  'error',
                                  'bottom',
                                );
                                setShowModal(false);
                              }
                            });
                            // await Promise.all(imageDownloads);
                            // Add a delay of 1 second between each fetch request
                            for (let i = 0; i < imageDownloads.length; i++) {
                              await new Promise(resolve => setTimeout(resolve, 500));
                              await imageDownloads[i];
                            }
                          }
                          return obj;
                        }),
                      );
                      // let _assetImages = [
                      //   ...new Set([...assetsImagesList, ...assetImages]),
                      // ];
                      let _assetImages = uniqBy(
                        [...assetImages, ...assetsImagesList],
                        'assetId',
                      );

                      // dispatch(addAssetsImagesList(_assetImages));
                      Globals.ASSETS_IMAGE_LIST = [..._assetImages];
                      dispatch(setimagesDetails([..._assetImages]));
                      console.log('android13',_assetImages);
                      if (vitalPersist?.length<=0)
                      {
                        if(Globals.NEED_SYNC===true){
                          _assetImages?.map((imageItem)=>{
                          createImagesCategory(imageItem);
                        });
                        }
                        else {
                          _assetImages?.map((imageItem)=>{
                              updateImagesById(imageItem);
                        });
                    }
                    }
                      else {
                        _assetImages?.map((imageItem)=>{
                            updateImagesById(imageItem);
                      });
                  }
                      StorageManager.storeAssetImageList([..._assetImages]);

                      downloadIncidentsImages(newAssets,uniqDiffTicketArray);
                    } else {
                      downloadIncidentsImages(newAssets,uniqDiffTicketArray);
                    }
                  } else {
                    alert('Storage Permission Not Granted');
                  }
                }
                else
                {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                      title: 'Storage Permission Required',
                      message: 'App needs access to your storage to download Photos',
                    },
                  );
                  if (granted === 'granted') {
                    console.log('Storage Permission Granted.');
                    if (newAssets && newAssets.length > 0) {
                      const assetImages = await Promise.all(
                        newAssets.map(async item => {
                          // console.log('item------', item.id, item);
                          const obj = {
                            assetId: item.id,
                            qrvalue:item.qrvalue,
                            images: [],
                          };
                          if (item && item?.images && item?.images.length > 0) {
                            const imageDownloads = item?.images.map(async url => {
                              try {
                                const response = await RNFetchBlob.config({
                                  fileCache: true,
                                  appendExt: 'jpg',
                                }).fetch('GET', `http://${url || ''}`);
                                const imagePath = response.path();
                                // console.log('imagePath', url, imagePath);
                                obj.images.push(imagePath);
                              } catch (error) {
                                console.error(error);
                                Utilities.showToast(
                                  'Sorry!',
                                  `something went wrong ${error?.message || ''}`,
                                  'error',
                                  'bottom',
                                );
                                setShowModal(false);
                              }
                            });
                            // await Promise.all(imageDownloads);
                            // Add a delay of 1 second between each fetch request
                            for (let i = 0; i < imageDownloads.length; i++) {
                              await new Promise(resolve => setTimeout(resolve, 500));
                              await imageDownloads[i];
                            }
                          }
                          return obj;
                        }),
                      );
                      // let _assetImages = [
                      //   ...new Set([...assetsImagesList, ...assetImages]),
                      // ];
                      let _assetImages = uniqBy(
                        [...assetImages, ...assetsImagesList],
                        'assetId',
                      );

                      // dispatch(addAssetsImagesList(_assetImages));
                      Globals.ASSETS_IMAGE_LIST = [..._assetImages];
                      console.log('lessandroid13',_assetImages);
                      if (vitalPersist?.length<=0)
                      {
                        if(Globals.NEED_SYNC===true){
                          _assetImages?.map((imageItem)=>{
                          createImagesCategory(imageItem);
                        });
                        }
                        else {
                          _assetImages?.map((imageItem)=>{
                              updateImagesById(imageItem);
                        });
                    }
                    }
                      else {
                        _assetImages?.map((imageItem)=>{
                            updateImagesById(imageItem);
                      });
                  }
                      StorageManager.storeAssetImageList([..._assetImages]);

                      downloadIncidentsImages(newAssets,uniqDiffTicketArray);
                    } else {
                      downloadIncidentsImages(newAssets,uniqDiffTicketArray);
                    }
                  } else {
                    alert('Storage Permission Not Granted');
                  }
                }
            }catch (err) {
                  console.warn(err);
                  Utilities.showToast(
                    'Sorry!',
                    `something went wrong ${err?.message || ''}`,
                    'error',
                    'bottom',
                  );
                  setShowModal(false);
                }
              };

              const downloadIncidentsImages = async (newAssets,uniqDiffTicketArray) => {
                console.log('downloadIncidentsImages called', uniqDiffTicketArray[0]);
                let imagesIncludedArray = [];
                uniqDiffTicketArray.forEach((item, index) => {
                  if (item?.images && item.images.length > 0) {
                    imagesIncludedArray.push(item);
                  }
                });

                try {
                  let deviceVersion = DeviceInfo.getSystemVersion();
                  if (deviceVersion >= 13)
                  {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
                    {
                      title: 'Storage Permission Required',
                      message: 'App needs access to your storage to download Photos',
                    },
                  );
                  if (granted === 'granted') {
                    // console.log('Storage Permission Granted.');
                    if (imagesIncludedArray && imagesIncludedArray.length > 0) {
                      const ticketsImages = await Promise.all(
                        imagesIncludedArray.map(async item => {
                          // console.log('ticketimages=======', item);
                          let obj = {
                            ticketIdDb: item.id,
                            images: [],
                            ticketId: item.ticket,
                          };
                          if (
                            item !== undefined &&
                            item?.images !== undefined &&
                            item?.images.length > 0
                          ) {
                            const imageDownloads = item?.images.map(async url => {
                              // console.log('url', url);
                              try {
                                const response = await RNFetchBlob.config({
                                  fileCache: true,
                                  appendExt: 'jpg',
                                }).fetch('GET', `http://${url}`);
                                const imagePath = response.path();
                                if (obj !== undefined && imagePath !== undefined) {
                                  // console.log('ticket image path=>', imagePath);
                                  obj?.images?.push(imagePath);
                                }
                              } catch (error) {
                                console.error('error=>', error);
                                Utilities.showToast(
                                  'Sorry!',
                                  `something went wrong ${error?.message || ''}`,
                                  'error',
                                  'bottom',
                                );
                                setShowModal(false);
                              }
                            });
                            // await Promise.all(imageDownloads);
                            // Add a delay of 1 second between each fetch request
                            for (let i = 0; i < imageDownloads.length; i++) {
                              await new Promise(resolve => setTimeout(resolve, 500));
                              await imageDownloads[i];
                            }
                          }
                          return obj;
                      }),
                      );
                    const _ticketImages = uniqBy(
                      [...incidentsImagesList, ...ticketsImages],
                      'ticketId',
                    );
                    const _ticketImagesDb = uniqBy(
                      [...incidentsImagesList, ...ticketsImages],
                      'ticketIdDb',
                    );
                      if (incidentPersist?.length<=0)
                      {
                        if(Globals.NEED_SYNC===true){
                          _ticketImagesDb?.map((item)=>{
                          createIncidentImagesCategory(item);
                      });
                        }
                        else {
                          _ticketImagesDb?.map((item)=>{
                              updateIncidentImagesById(item);
                      });
                    }
                    }
                      else {
                        _ticketImagesDb?.map((item)=>{
                            updateIncidentImagesById(item);
                      });
                  }
                      // dispatch(addIncidentsImagesList(_ticketImages));
                      Globals.INCIDENT_IMAGE_LIST = [..._ticketImages];
                      // dispatch(setimagesDetails([..._ticketImages]))
                      StorageManager.storeIncidentImageList([..._ticketImages]);
                      getUserDetails();
                    } else {
                      getUserDetails();
                    }
                  } else {
                    alert('Storage Permission Not Granted');
                    getUserDetails();
                  }
                }
                else
                {
                  const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                      title: 'Storage Permission Required',
                      message: 'App needs access to your storage to download Photos',
                    },
                  );
                  if (granted === 'granted') {
                    // console.log('Storage Permission Granted===incident.',imagesIncludedArray);
                    if (imagesIncludedArray && imagesIncludedArray.length > 0) {
                      const ticketsImages = await Promise.all(
                        imagesIncludedArray.map(async item => {
                            // console.log('ticketimages=======', item);
                            let obj = {
                              ticketIdDb: item.id,
                              images: [],
                              ticketId: item.ticket,
                            };
                          if (
                            item !== undefined &&
                            item?.images !== undefined &&
                            item?.images.length > 0
                          ) {
                            const imageDownloads = item?.images.map(async url => {
                              // console.log('url', url);
                              try {
                                const response = await RNFetchBlob.config({
                                  fileCache: true,
                                  appendExt: 'jpg',
                                }).fetch('GET', `http://${url}`);
                                const imagePath = response.path();
                                if (obj !== undefined && imagePath !== undefined) {
                                  // console.log('ticket image path=>', imagePath);
                                  obj?.images?.push(imagePath);
                                }
                              } catch (error) {
                                console.error('error=>', error);
                                Utilities.showToast(
                                  'Sorry!',
                                  `something went wrong ${error?.message || ''}`,
                                  'error',
                                  'bottom',
                                );
                                setShowModal(false);
                              }
                            });
                            // await Promise.all(imageDownloads);
                            // Add a delay of 1 second between each fetch request
                            for (let i = 0; i < imageDownloads.length; i++) {
                              await new Promise(resolve => setTimeout(resolve, 500));
                              await imageDownloads[i];
                            }
                          }
                          return obj;
                        }),
                        );
                      const _ticketImages = uniqBy(
                        [...incidentsImagesList, ...ticketsImages],
                        'ticketId',
                      );
                      const _ticketImagesDb = uniqBy(
                        [...incidentsImagesList, ...ticketsImages],
                        'ticketIdDb',
                      );
                      if (incidentPersist?.length<=0)
                      {
                        if(Globals.NEED_SYNC===true){
                          _ticketImagesDb?.map((item)=>{
                          createIncidentImagesCategory(item);
                      });
                        }
                        else {
                          _ticketImagesDb?.map((item)=>{
                              updateIncidentImagesById(item);
                      });
                    }
                    }
                      else {
                        _ticketImagesDb?.map((item)=>{
                            updateIncidentImagesById(item);
                      });
                  }
                      // dispatch(addIncidentsImagesList(_ticketImages));
                      Globals.INCIDENT_IMAGE_LIST = [..._ticketImages];
                      console.log('incidentandroidless13',_ticketImages);

                      // dispatch(setimagesDetails([..._ticketImages]))
                      StorageManager.storeIncidentImageList([..._ticketImages]);
                      getUserDetails();
                    } else {
                      getUserDetails();
                    }
                  } else {
                    alert('Storage Permission Not Granted');
                    getUserDetails();
                  }
                }
                } catch (err) {
                  console.warn(err);
                  Utilities.showToast(
                    'Sorry!',
                    `something went wrong ${err?.message || ''}`,
                    'error',
                    'bottom',
                  );
                  setShowModal(false);
                }

                // setTimeout(() => {
                //   setShowModal(false);
                // }, 3000);
              };
              /**
               * Purpose: Get userDetail
               * Created/Modified By: Monisha Sreejith
               * Created/Modified Date: 30 March 2023
               * Steps:
                 1.fetch vital details from API and append to state variable
            */

              const getUserDetails = () => {
                console.log('Get user details function called', );
                // setShowModal(true);
                setDbOpen(true);
                var _body = {
                  [APIConnections.KEYS.KEY]: Globals.API_KEY,
                  [APIConnections.KEYS.RESOURCE]: 'users',
                  [APIConnections.KEYS.METHOD]: 'show',
                  [APIConnections.KEYS.FILTERS_EMAIL]: userDetails?.email,
                };
                const formBody = Object.keys(_body)
                  .map(
                    key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
                  )
                  .join('&');
                DataManager.fetchUserDetails(formBody).then(
                  ([isSuccess, message, response]) => {
                    // console.log('response========', isSuccess, response);
                    if (isSuccess === true) {
                      if (response !== undefined && response !== null) {
                        // console.log('response========', isSuccess, response);
                        dispatch(setProfileData(response));
                        StorageManager.saveProfileData(response);
                      // setTimeout(() => {
                      //   setShowModal(false);
                      // }, 3000);
                      } else {
                        setTimeout(() => {
                          setShowModal(false);
                        }, 3000);
                        Utilities.showToast('Sorry!', message, 'error', 'bottom');
                      }
                    } else {
                      setTimeout(() => {
                        setShowModal(false);
                      }, 3000);
                      Utilities.showToast('Sorry!', message, 'error', 'bottom');
                    }
                  },
                );
              };

              /**
               * Purpose: count notification item
               * Created/Modified By: Loshith C H
               * Created/Modified Date: 27 March 2023
               * Steps:
                 1.count notification id
            */

              const getNotificationListCount = () => {
                // setIsLoading(true);
                var _body = {
                  [APIConnections.KEYS.KEY]: Globals.API_KEY,
                  [APIConnections.KEYS.RESOURCE]: 'notifications',
                  [APIConnections.KEYS.METHOD]: 'show',
                };
                const formBody = Object.keys(_body)
                  .map(
                    key => encodeURIComponent(key) + '=' + encodeURIComponent(_body[key]),
                  )

                  .join('&');

                DataManager.fetchNotificationCountDetails(formBody).then(
                  ([isSuccess, message, responseData]) => {
                    if (isSuccess === true) {
                      // console.log('response data 2 ====>>>>', responseData);
                      dispatch(setNotificationCount(responseData));
                      //  StorageManager.getSavedCount(responseData);
                      StorageManager.saveCount(responseData);
                      // console.log('response data ====>>>>', detailSchedule);
                      // setTimeout(() => {
                      //   setIsLoading(false);
                      // }, 3000);
                    } else {
                      // setIsLoading(false);
                      Utilities.showToast(
                        t(Translations.FAILED),
                        message,
                        'error',
                        'bottom',
                      );
                    }
                  },
                );
              };
              // final return

              return (
                <SafeAreaView style={styles.container}>
                  <View style={{marginTop: responsiveHeight(5)}}>
                    <AppLogo />
                  </View>
                  {/* <LoadingIndicator visible={showLoader} /> */}
                  <View style={{marginTop: responsiveHeight(4)}}>
                    <Text
                      style={{
                        fontFamily: Fonts.UBUNTU_REGULAR,
                        color: Colors.ITEM_COLOR,
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: 20,
                        lineHeight: 22.98,
                        textAlign: 'center',
                        letterSpacing: 0.7,
                      }}>
                      Hi {userDetails?.name || ''}
                    </Text>
                    <Text
                      style={{
                        fontFamily: Fonts.UBUNTU_REGULAR,
                        color: Colors.ITEM_COLOR,
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: 20,
                        lineHeight: 23,
                        textAlign: 'center',
                        letterSpacing: 0.7,
                      }}>
                      {greeting}
                    </Text>
                  </View>
                  <ItemSeparatorScreen height={responsiveHeight(5)} />
                  <TouchableOpacity
                    style={styles.notificationBox}
                    onPress={() => navigation.navigate('NotificationListScreen')}>
                    {notificationCount > 0 ? <View style={styles.notificationDot} /> : null}

                    <View style={{}}>
                      <Text style={styles.boxText}>
                        You have {notificationCount} Notifications 🔔
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <ItemSeparatorScreen height={responsiveHeight(2)} />
                  <TouchableOpacity
                    onPress={() => backgroundApp()}
                    style={{marginTop: responsiveHeight(0)}}>
                    <View style={styles.notificationBox}>
                      <Text style={styles.boxText}>
                        You have {totalRecordCount} record to update
                      </Text>
                    </View>
                  </TouchableOpacity>
                  {/* Button section */}
                  <ItemSeparatorScreen height={responsiveHeight(2)} />
                  <View
                    style={{
                      height: responsiveHeight(30),
                      width: responsiveWidth(79),
                    }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={styles.firstMenu}
                        onPress={() => {
                          dispatch(setDetailsImageList([]));
                          Globals.NEED_NAVIGATION_TO_OTHER_VITALS = false;
                          navigation.navigate('ScanScreen', {isFromIncident: false,list:asset});
                        }}
                        activeOpacity={1}>
                        <Image
                          source={Images.BARCODE_SCANNER}
                          style={{height: 35, width: 35}}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                            color: Colors.LOGINTEXT_COLOR,
                            marginBottom: responsiveHeight(1.4),
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: 14,
                            lineHeight: 18,
                            textAlign: 'center',
                            letterSpacing: -0.3,
                          }}>
                          {t(Translations.SCAN_QR)}
                        </Text>
                      </TouchableOpacity>
                      <ItemSeparatorScreen width={responsiveWidth(3)} />
                      <TouchableOpacity
                        style={styles.firstMenu}
                        onPress={() => navigation.navigate('WorkSchedules')}
                        activeOpacity={1}>
                        <Image
                          source={Images.WORK_SCHEDULES}
                          style={{
                            marginBottom: responsiveHeight(0.8),
                            height: 23,
                            width: 23,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                            color: Colors.LOGINTEXT_COLOR,
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: 14,
                            lineHeight: 18,
                            textAlign: 'center',
                            letterSpacing: -0.3,
                            marginBottom: responsiveHeight(0.5),
                          }}>
                          {t(Translations.WORK_SCHEDULES)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <ItemSeparatorScreen height={responsiveHeight(3)} />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: 'row',
                      }}>
                      <TouchableOpacity
                        style={styles.firstMenu}
                        onPress={() => {
                          Globals.NEED_NAVIGATION_TO_OTHER_VITALS = false;
                          // navigation.navigate('ScanScreen', {
                          //   isFromIncident: true,
                          // });
                          navigation.navigate('IncidentList', {isFromIncident: true});
                        }}
                        activeOpacity={1}>
                        <Image
                          source={Images.INCIDENTS}
                          style={{
                            marginBottom: responsiveHeight(0.8),
                            height: 23,
                            width: 23,
                          }}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                            color: Colors.LOGINTEXT_COLOR,
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: 14,
                            lineHeight: 18,
                            textAlign: 'center',
                            letterSpacing: -0.3,
                            marginBottom: responsiveHeight(1.5),
                          }}>
                          {t(Translations.INCIDENTS)}
                        </Text>
                      </TouchableOpacity>
                      <ItemSeparatorScreen width={responsiveWidth(3)} />
                      <TouchableOpacity
                        style={styles.firstMenu}
                        onPress={() => navigation.navigate('UserProfile')}
                        activeOpacity={1}>
                        <Image
                          source={Images.PROFILE}
                          style={{marginBottom: responsiveHeight(0)}}
                        />
                        <Text
                          style={{
                            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                            color: Colors.LOGINTEXT_COLOR,
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: 14,
                            lineHeight: 18,
                            textAlign: 'center',
                            letterSpacing: -0.3,
                            marginBottom: responsiveHeight(2.6),
                          }}>
                          {t(Translations.PROFILE)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Modal isVisible={showModal}>
                    <View
                      style={{
                        backgroundColor: 'white',
                        width: responsiveWidth(80),
                        height: responsiveHeight(50),
                        alignSelf: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 5,
                      }}>
                      <Lottie
                        source={ANIMATION}
                        // progress={animationProgress.current
                        autoPlay
                        loop
                        style={{
                          width: responsiveWidth(40),
                        }}
                      />
                      {updatingCount === 0 ? (
                        <Text
                          style={{
                            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                            color: Colors.ITEM_COLOR,
                            fontSize: responsiveFontSize(2),
                          }}>
                          Syncing data to the server
                        </Text>
                      ) : (
                        <Text
                          style={{
                            fontFamily: Fonts.IBM_PLEX_SANS_REGULAR,
                            color: Colors.ITEM_COLOR,
                            fontSize: responsiveFontSize(2),
                          }}>
                          Uploading {updatingCount} of {recordCount}
                        </Text>
                      )}
                    </View>
                  </Modal>
                </SafeAreaView>
              );
            };

            export default HomePageScreen;

            const styles = StyleSheet.create({
              container: {
                flex: 1,
                backgroundColor: Colors.BACKGROUND_COLOR,
                alignItems: 'center',
              },
              notificationBox: {
                width: responsiveWidth(79),
                height: responsiveHeight(5.5),
                borderColor: Colors.GREEN_COLOR,
                borderWidth: 0.4,
                borderRadius: 6,

                backgroundColor: Colors.LIGHT_SKY_BLUE,
                alignItems: 'center',
                justifyContent: 'center',
              },
              boxText: {
                fontFamily: Fonts.UBUNTU_REGULAR,
                color: Colors.ITEM_COLOR,
                fontStyle: 'normal',
                fontWeight: '400',
                fontSize: 14,
                lineHeight: 16.09,
                textAlign: 'center',
                letterSpacing: 0.7,
              },
              firstMenu: {
                borderTopLeftRadius: responsiveHeight(2),
                borderTopRightRadius: responsiveHeight(2),
                borderBottomLeftRadius: responsiveHeight(2),
                borderBottomRightRadius: responsiveHeight(2),
                // width: responsiveWidth(38),
                height: responsiveHeight(15),
                borderWidth: 1,
                borderColor: Colors.GREEN_COLOR,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.LIGHT_SKY_BLUE,
              },
              menuImage: {
                height: 30,
                width: 30,
                marginTop: responsiveHeight(0.2),
              },
              notificationDot: {
                width: 15,
                height: 15,
                backgroundColor: Colors.NOTIFICATION_DOT_COLOR,
                borderRadius: 7,
                position: 'absolute',
                right: -4,
                top: -4,
              },
            });

