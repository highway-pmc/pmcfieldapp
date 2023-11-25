import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, Modal, StatusBar, SafeAreaView, Dimensions, Alert } from 'react-native'
import React, { Fragment, useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, RFI_STATUS, SEGMENT_TYPES_DISPLAY } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearMyWorksEvent, fillRFIsChecklist, getMyWorks, getRFIByWaId } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import { groupBy } from '../../utils/Utils';
import * as ImagePicker from 'react-native-image-picker';
import DropDownPicker from 'react-native-dropdown-picker';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';

const MyWork = ({ route, navigation }: { route: any, navigation: any }) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { projectType } = route.params;

  const { myWorks, rfiData, rfiChecklistSaved, loading, error } = useSelector((state: any) => state.MyWorks);
  const [myWorksData, setMyWorksData] = useState([]);
  const [currentSegmentsData, setCurrentSegmentsData] = useState([]);
  const [currentSubSegmentsData, setCurrentSubSegmentsData] = useState([]);
  const [currentTasksData, setCurrentTasksData] = useState([]);
  const [projectModuleId, setProjectModuleId] = useState('');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [segmentsByGroupOnType, setSegmentsByGroupOnType] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [rfiId, setRfiId] = useState('');
  const [breadcrumbData, setBreadcrumbData] = useState([{
    name: '',
    projectModuleIndex: 0,
    segIndex: 0,
    subSegIndex: 0,
    taskIndex: 0,
    level: 0,
    assignmentLevel: 0,
    active: false
  }]);

  const imageObjectEmpty = {
    filepath: {
      data: '',
      uri: ''
    },
    fileData: '',
    fileUri: ''
  };

  const [openPopup, setOpenPopup] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [imageObject, setImageObject] = useState(imageObjectEmpty);

  const [rfiDate, setRFIDate] = useState('');
  const [hours, setHours] = useState([]);
  const [minutes, setMinutes] = useState([]);
  const [timeFormats, setTimeFormats] = useState([]);

  const [hour, setHour] = useState('12');
  const [minute, setMinute] = useState('00');
  const [timeFormat, setTimeFormat] = useState('AM');

  const [openHours, setOpenHours] = useState(false);
  const [openMinutes, setOpenMinutes] = useState(false);
  const [openTimeFormats, setOpenTimeFormats] = useState(false);

  const [openCalendar, setOpenCalendar] = useState(false);

  const [comments, setComments] = useState('');
  const { width, height } = Dimensions.get('window');
  
  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      const eventEmitter = new NativeEventEmitter();
      eventEmitter.emit('headerEvent', HeaderItems.myWork);
      setCurrentLevel(1);
      setMyWorksData([]);
      setCurrentSegmentsData([]);
      setCurrentSubSegmentsData([]);
      setCurrentTasksData([]);
      setBreadcrumbData([]);
      getMyWorksData();
      setSearchText('');
      setOpenPopup(false)
      getHours();
      getMins();
      getTimeFormats();
    }
  }, [focus]);

  const getMyWorksData = () => {
    dispatch(getMyWorks({
      projectId: loggedInUser.projectId,
      projectType: projectType
    }));
  }

  useEffect(() => {
    if (myWorks) {
      setMyWorksData(myWorks);
    }

    if (rfiData) {
      setRfiId(rfiData._id);
      if (rfiData.metaData && rfiData.metaData.base64Image) {
        setImageObject({
          filePath: '',
          fileData: rfiData.metaData.base64Image,
          fileUri: ''
        });
      }
      if (rfiData.rfiSubmitDateTime) {
        
        setRFIDate(moment(new Date(rfiData.rfiSubmitDateTime)).format('YYYY-MM-DD'));

        const time = moment(new Date(rfiData.rfiSubmitDateTime)).format('hh:mm A')
        const hourMin = time.split(' ')[0];
        setHour(hourMin.split(':')[0])
        setMinute(hourMin.split(':')[1])

        setTimeFormat(time.split(' ')[1])
      }

      if (rfiData.comments) {
        setComments(rfiData.comments);
      }
      setOpenPopup(true)
    }

    if (rfiChecklistSaved) {
      setOpenPopup(false)
      Alert.alert('RFIs checklist saved.')
      setCurrentLevel(1);
      setImageObject(imageObjectEmpty)
      dispatch(clearMyWorksEvent());
      getMyWorksData();
    }
  }, [myWorks, rfiData, rfiChecklistSaved, error]);

  // unmount
  useEffect(() => () => {
    dispatch(clearMyWorksEvent());
    setCurrentLevel(1);
    setMyWorksData([]);
    setCurrentSegmentsData([]);
    setCurrentSubSegmentsData([]);
    setCurrentTasksData([]);
    setBreadcrumbData([]);
    setSearchText('');
  }, []);

  const onClick = (level: number, assignmentLevel: number, projectModuleIndex: number, segIndex: number = -1, subSegIndex: number = -1, taskIndex: number = -1, segmentType = null) => {
    setSearchText('');
    setCurrentLevel(level)
    setBreadcrumbData([]);
    if (level === 2) {
      if (assignmentLevel === 1) {
        setCurrentLevel(5);
        const gbSegmentTypes = groupBy(myWorksData[projectModuleIndex].segmentsData, "type");
        setSegmentsByGroupOnType(gbSegmentTypes);
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            subSegIndex: subSegIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true
          },
          {
            name: "Segment Types",
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            subSegIndex: subSegIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false
          }
        ])
      } else if (assignmentLevel == -1) {
        setCurrentSegmentsData(segmentsByGroupOnType[segmentType]);
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            subSegIndex: subSegIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true
          },
          {
            name: SEGMENT_TYPES_DISPLAY[segmentType],
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            subSegIndex: subSegIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false
          }
        ])
      } else {
        const segmentsData = myWorksData[projectModuleIndex].segmentsData.filter((seg: any) => seg.type == segmentType);
        setCurrentSegmentsData(segmentsData)
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            subSegIndex: subSegIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true
          },
          {
            //name: "Foundation", // todo - dynamic
            name: SEGMENT_TYPES_DISPLAY[segmentsData[0].type] || "Foundation", // todo - dynamic
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            subSegIndex: subSegIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false
          }
        ])
      }

    } else if (level === 3 && segIndex != -1) {
      const segmentData = myWorksData[projectModuleIndex].segmentsData[segIndex];
      setCurrentSubSegmentsData(segmentData.subSegmentsData)
      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false
        }
      ])

    } else if (level === 4 && subSegIndex != -1 && taskIndex != -1) {
      const segmentData = myWorksData[projectModuleIndex].segmentsData[segIndex];
      const subSegmentData: any = segmentData.subSegmentsData[subSegIndex];
      const taskData: any = [subSegmentData.tasksData[taskIndex]];
      setProjectModuleId(subSegmentData.projectModuleId);
      setCurrentTasksData(taskData)

      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: subSegmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: taskData[0].displayName,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false
        }
      ])

    } else if (level === 4 && subSegIndex != -1) {
      const segmentData = myWorksData[projectModuleIndex].segmentsData[segIndex];
      const subSegmentData: any = segmentData.subSegmentsData[subSegIndex];
      setProjectModuleId(subSegmentData.projectModuleId);
      setCurrentTasksData(subSegmentData.tasksData)

      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: subSegmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true
        },
        {
          name: 'Tasks',
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          subSegIndex: subSegIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false
        }
      ])
    }
  }

  const onClickNested = (level: number, data: any) => {
    setSearchText('');
    setCurrentLevel(level);
    if (level === 3) {
      setCurrentSubSegmentsData(data.subSegmentsData)
      const beadcrumb = breadcrumbData[1];
      beadcrumb.name = SEGMENT_TYPES_DISPLAY[data.type] + ' ' + data.name;
    } else if (level === 4) {
      setProjectModuleId(data.projectModuleId);
      setCurrentTasksData(data.tasksData)
      const bcrubm = {
        name: data.name,
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        subSegIndex: 0,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      }
      breadcrumbData.push(bcrubm)
      breadcrumbData.push({
        name: 'Tasks',
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        subSegIndex: 0,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false
      })
    }
  }

  const onSegmentTypeClick = (type: any) => {
    if (segmentsByGroupOnType) {
      onClick(2, -1, breadcrumbData[0].projectModuleIndex, -1, -1, -1, type);
    }
  }

  const getStyle = (item: any) => {
    if (item.rfiStatus) {
      if (item.rfiStatus === RFI_STATUS.GENERATED ||  item.rfiStatus === RFI_STATUS.RE_GENERATED) {
        return [styles.StartWorkCard, styles.StartBorder];
      } else if (item.rfiStatus === RFI_STATUS.REJECTED || item.rfiStatus === RFI_STATUS.CANCELLED) {
        return [styles.StartWorkCard, styles.StartRejectBorder];
      } else if (item.rfiStatus === RFI_STATUS.IN_PROGRESS) {
        return [styles.StartWorkCard, styles.StartInProgressBorder];
      } else if (item.rfiStatus === RFI_STATUS.IN_REVIEW) {
        return [styles.StartWorkCard, styles.StartReviewBorder];
      } else if (item.rfiStatus === RFI_STATUS.APPROVED) {
        return [styles.StartWorkCard, styles.StartCompleteBorder];
      }
    }
    return [styles.StartWorkCardDisabled, styles.DisabledBorder];
  }


  // const chooseImage = () => {
  //   let options = {
  //     title: 'Select Image',
  //     customButtons: [
  //       { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
  //     ],
  //     storageOptions: {
  //       skipBackup: true,
  //       path: 'images',
  //     },
  //   };
  //   ImagePicker.showImagePicker(options, (response) => {
  //     console.log('Response = ', response);

  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.error) {
  //       console.log('ImagePicker Error: ', response.error);
  //     } else if (response.customButton) {
  //       console.log('User tapped custom button: ', response.customButton);
  //       alert(response.customButton);
  //     } else {
  //       const source = { uri: response.uri };

  //       // You can also display the image using data:
  //       // const source = { uri: 'data:image/jpeg;base64,' + response.data };
  //       // alert(JSON.stringify(response));s
  //       console.log('response', JSON.stringify(response));
  //       this.setState({
  //         filePath: response,
  //         fileData: response.data,
  //         fileUri: response.uri
  //       });
  //     }
  //   });
  // }
  const getRFIDataByWorkAssignmentId = (task: any) => {
    setRFIDate('');
    setComments('');
    setImageObject(imageObjectEmpty);
    setSelectedTask(task);
    dispatch(getRFIByWaId({
      projectId: loggedInUser.projectId,
      projectModuleId: projectModuleId,
      waId: task.workAssignmentId,
    }));
  }

  const onFillChecklist = (rfiStatus: string) => {
    if (!rfiDate) {
      Alert.alert('Error', 'Date is required.');
      return false;
    }

    if (!comments) {
      Alert.alert('Error', 'Recommendations is required.');
      return false;
    }
    
    let rfiSubmitDateTime = '';
    let rfiTime = '';
    if (rfiDate) {
      if (timeFormat === 'PM') {
        if (Number(hour) === 12) {
          rfiTime = hour + ':' + minute;
        } else {
          rfiTime = (Number(hour) + 12) + ':' + minute;
        }
      } else {
        if (Number(hour) === 12) {
          rfiTime = '00:' + minute;
        } else {
          rfiTime = hour + ':' + minute;
        }
      }

      rfiSubmitDateTime = rfiDate + ' ' + rfiTime + ":00"
    }

    dispatch(fillRFIsChecklist({
      projectId: loggedInUser.projectId,
      projectModuleId: projectModuleId,
      rfiId: rfiId,
      status: rfiStatus,
      body: {
        checkList: {
          taskName: selectedTask.name,
          base64Image: imageObject.fileData,
        },
        additionalData: {
          comments: comments,
          rfiSubmitDateTime: rfiSubmitDateTime
        }
      },
    }));
  }

  const launchCamera = () => {
    let options = {
      includeBase64: true,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (response: any) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {
        const responseImage = response.assets?.length ? response.assets[0] : response.assets ? response.assets : response;

        setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri
        });
      }
    });

  }

  const launchImageLibrary = () => {
    let options = {
      includeBase64: true,
      maxWidth: 1024,
      maxHeight: 768,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (response: any) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        Alert.alert(response.customButton);
      } else {

        const responseImage = response.assets?.length ? response.assets[0] : response.assets ? response.assets : response;

        setImageObject({
          filePath: responseImage,
          fileData: responseImage.base64,
          fileUri: responseImage.uri
        });
      }
    });

  }

  const renderFileData = () => {
    if (imageObject.fileData) {
      return <Image source={{ uri: 'data:image/jpeg;base64,' + imageObject.fileData }}
        style={styles.images}
      />
    } else {
      return <Image source={require('./../../images/dummy.png')} // ./assets/dummy.png
        style={styles.images}
      />
    }
  }

  const renderFileUri = () => {
    if (imageObject.fileUri) {
      return <Image
        source={{ uri: imageObject.fileUri }}
        style={styles.images}
      />
    } else {
      return <Image
        source={require('./../../images/galeryImages.jpg')} // ./assets/galeryImages.jpg
        style={styles.images}
      />
    }
  }

  const openCloseCalendar = () => {
    setOpenCalendar(!openCalendar);
    // if (!openCalendar) {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT + DEFAULT_CALENDAR_HEIGHT)
    // } else {
    //   setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    // }
  }

  const getHours = () => {
    let hours = [];
    for (let i = 1; i <= 12; i++) {
      hours.push({
        label: i < 10 ? '0' + i : '' + i,
        value: i < 10 ? '0' + i : '' + i
      });
    }
    setHours(hours);
  }

  const getMins = () => {
    let mins = [];
    for (let i = 0; i < 60; i = i + 10) {
      mins.push({
        label: i < 10 ? '0' + i : '' + i,
        value: i < 10 ? '0' + i : '' + i
      });
    }
    setMinutes(mins);
  }

  const getTimeFormats = () => {
    setTimeFormats([{
      label: 'AM',
      value: 'AM'
    }, {
      label: 'PM',
      value: 'PM'
    }]);
  }

  return (
    <View style={styles.Container}>
      <View style={styles.BreadcrumbContainer}>
        {
          breadcrumbData.map((item: any, index) => (
            <View style={{ flexDirection: 'row' }}>
              {
                index == 0 ? <Text style={styles.BreadcrumbPrevTextUnderline} onPress={() => index === 0 && (setCurrentLevel(1), setBreadcrumbData([]))}>{item.name}</Text>
                  : index === (breadcrumbData.length - 1) ? <Text style={styles.BreadcrumbCurrentText}>{item.name}</Text>
                    : <Text style={styles.BreadcrumbPrevText}>{item.name}</Text>
              }
              {
                index < (breadcrumbData.length - 1) && <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
              }
            </View>
          ))
        }
      </View>
      {
        (currentLevel !== 1 && currentLevel !== 5) && <View style={styles.SearchBox}>
          <Image
            source={require('./../../images/search-icon.png')}
            style={styles.ImageSearch}
          />
          <TextInput
            style={styles.inputStyle}
            placeholder="Search"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            underlineColorAndroid="#f000"
            blurOnSubmit={false}
            value={searchText}
            onChangeText={(text) => {
              setSearchText(text);
            }}
          />
        </View>
      }
      <ScrollView style={styles.Height100}>
        {
          currentLevel === 1 &&
          myWorksData.map((projModuleItem: any, projModuleIndex) => (
            projModuleItem.assignmentLevel === 1 ?
              <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, projModuleItem.assignmentLevel, projModuleIndex)}>
                <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                <View style={styles.TaskDetails}>
                  <Text style={styles.SubHeadingText}>Assigned:</Text>
                  <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.name}</Text>
                </View>
              </TouchableOpacity>
              :
              (projModuleItem.segmentsData?.map((segItem: any, segIndex: any) => (
                (segItem.assignmentLevel === 2 && segIndex == 0) ? (
                  projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2).length === 1 ? (
                    <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(3, segItem.assignmentLevel, projModuleIndex, projModuleItem.segmentsData?.findIndex((segItem: any) => segItem.assignmentLevel == 2))}>
                      <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                      <View style={styles.TaskDetails}>
                        <Text style={styles.SubHeadingText}>Assigned:</Text>
                        <View style={{ flexDirection: 'row' }}>
                          <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                          <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2)[0].name}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                    :
                    (
                      Object.keys(groupBy(projModuleItem.segmentsData, "type")).map((segType: any) => (
                        <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, segItem.assignmentLevel, projModuleIndex, -1, -1, -1, segType)}>
                          <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                          <View style={styles.TaskDetails}>
                            <Text style={styles.SubHeadingText}>Assigned:</Text>
                            <Text style={[styles.SubHeadingText, styles.SubActive]}>{SEGMENT_TYPES_DISPLAY[segType]} {projModuleItem.segmentsData?.filter((segItem: any) => segItem.type == segType && segItem.assignmentLevel == 2).length}</Text>
                          </View>
                        </TouchableOpacity>
                      ))
                    )
                )
                  :
                  segItem.subSegmentsData?.map((subSegItem: any, subSegIndex: number) => (
                    subSegItem.assignmentLevel === 3 ?
                      (
                        <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(4, subSegItem.assignmentLevel, projModuleIndex, segIndex, subSegIndex)}>
                          <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                          <View style={styles.TaskDetails}>
                            <Text style={styles.SubHeadingText}>Assigned:</Text>
                            <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                            <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                            <Text style={[styles.SubHeadingText, styles.SubActive]}>{subSegItem.name}</Text>
                          </View>
                        </TouchableOpacity>

                      )
                      :
                      subSegItem.tasksData?.map((taskItem: any, taskIndex: number) => (
                        taskItem.assignmentLevel === 4 &&
                        <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(4, taskItem.assignmentLevel, projModuleIndex, segIndex, subSegIndex, taskIndex)}>
                          <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
                          <View style={styles.TaskDetails}>
                            <Text style={styles.SubHeadingText}>Assigned:</Text>
                            <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
                            <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
                            <Text style={styles.SubHeadingText}>{subSegItem.name} /</Text>
                            <Text style={[styles.SubHeadingText, styles.SubActive]}>{taskItem.displayName}</Text>
                          </View>
                        </TouchableOpacity>

                      ))

                  ))


              )))

          ))
        }
        {
          currentLevel === 5 &&
          segmentsByGroupOnType && Object.keys(segmentsByGroupOnType).length && Object.keys(segmentsByGroupOnType).map((item) => (
            <TouchableOpacity style={[styles.StartWorkCard, styles.StartBorder]} onPress={() => onSegmentTypeClick(item)}>
              <View style={styles.leftContainer}>
                <Text style={styles.HeadText}>{segmentsByGroupOnType[item].length}</Text>
                <Text style={styles.MyWorkSubHead}>{SEGMENT_TYPES_DISPLAY[item]}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
        {
          currentLevel === 2 &&
          currentSegmentsData.filter((seg: any) => {
            if (searchText && seg.name) {
              return seg.name.toLowerCase().includes(searchText.toLowerCase())
            } else {
              return true;
            }
          }).map((item: any, index) => (
            <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(3, item)}>
              <View style={styles.leftContainer}>
                <Text style={styles.HeadText}>{item.name}</Text>
                {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
              </View>
            </TouchableOpacity>
          ))
        }
        {
          currentLevel === 3 &&
          currentSubSegmentsData.filter((subSeg: any) => {
            if (searchText && subSeg.name) {
              return subSeg.name.toLowerCase().includes(searchText.toLowerCase())
            } else {
              return true;
            }
          }).map((item: any, index) => (
            <TouchableOpacity style={getStyle(item)} onPress={() => onClickNested(4, item)}>
              <View style={styles.leftContainer}>
                <Text style={styles.HeadText}>{item.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        }
        {
          currentLevel === 4 &&
          currentTasksData.filter((task: any) => {
            if (searchText && task.displayName) {
              return task.displayName.toLowerCase().includes(searchText.toLowerCase())
            } else {
              return true;
            }
          }).map((item: any, index) => (
            <View style={getStyle(item)}>
              <View style={styles.leftContainer}>
                <Text style={styles.HeadText}>{item.displayName}</Text>
                {/* <Text style={styles.MyWorkSubHead}>Sub Text</Text> */}
              </View>
              {
                item.rfiStatus === RFI_STATUS.GENERATED &&
                <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]} onPress={() => {
                  getRFIDataByWorkAssignmentId(item)
                }}>
                  <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} />
                  <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Start</Text>
                </TouchableOpacity>
              }

              {
                item.rfiStatus === RFI_STATUS.RE_GENERATED &&
                <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]} onPress={() => {
                  getRFIDataByWorkAssignmentId(item)
                }}>
                  <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} />
                  <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Re-start</Text>
                </TouchableOpacity>
              }

              {
                (item.rfiStatus === RFI_STATUS.REJECTED || item.rfiStatus === RFI_STATUS.CANCELLED) &&
                <TouchableOpacity style={[styles.MyWorkCta, styles.StartRejectBorder]}>
                  {/* <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} /> */}
                  <Text style={[styles.CtaStartText, styles.CtaRejectTextColor]}>{item.rfiStatus === RFI_STATUS.CANCELLED ? 'Cancelled' : 'Rejected'}</Text>
                </TouchableOpacity>
              }

              {
                item.rfiStatus === RFI_STATUS.IN_PROGRESS &&
                <TouchableOpacity style={[styles.MyWorkCta, styles.StartInProgressBorder]} onPress={() => {
                  getRFIDataByWorkAssignmentId(item)
                }}>
                  <Image style={styles.WorkIcon} source={require('../../images/inprogress.png')} />
                  <Text style={[styles.CtaStartText, styles.CtaInProgressTextColor]}>In Progress</Text>
                </TouchableOpacity>
              }

              {
                item.rfiStatus === RFI_STATUS.IN_REVIEW &&
                <TouchableOpacity style={[styles.MyWorkCta, styles.StartReviewBorder]}>
                  <Image style={styles.WorkIcon} source={require('../../images/review-icon.png')} />
                  <Text style={[styles.CtaStartText, styles.CtaReviewTextColor]}>Under Review</Text>
                </TouchableOpacity>
              }

              {
                item.rfiStatus === RFI_STATUS.APPROVED &&
                <TouchableOpacity style={[styles.MyWorkCta, styles.StartCompleteBorder]}>
                  <Image style={styles.WorkIcon} source={require('../../images/complete-icon.png')} />
                  <Text style={[styles.CtaStartText, styles.CtaCompleteTextColor]}>Completed</Text>
                </TouchableOpacity>
              }
              
            </View>
          ))
        }
        {/* No Data Found */}
        {(!loading && !myWorksData.length) &&
          <View style={styles.NoDataContainer}>
            <Image
              style={styles.WthHeight}
              source={require('./../../images/no-data-found.png')}
            />
            <Text style={styles.NodataHeadText}>Sorry, no result found!</Text>
            {/* {(searchText && <Text style={styles.NodataSubText}>
              Please try to search another keywork...
            </Text>
            )} */}
          </View>
        }
      </ScrollView>

      <Modal
        animationType="fade"
        transparent={true}
        visible={openPopup}
        onRequestClose={() => {
          setOpenPopup(!openPopup);
        }}>
        <View style={styles.bodyPopup}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.ModalHeader}>
                <Text style={styles.modalText}>RFIs</Text>
                <TouchableOpacity
                  style={styles.buttonClose}
                  onPress={() => setOpenPopup(!openPopup)}>
                  <Image
                    style={styles.CloseIcon}
                    tintColor={'#333'}
                    source={require('./../../images/menu/close-icon.png')}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.ModalInnerContainer}>
                <View>
                  <Text style={styles.modalLabel}>Task: {selectedTask?.displayName}</Text>
                </View>
                <ScrollView style={{ paddingTop: 10, height: 500 }}>
                  <Fragment>
                    <StatusBar barStyle="dark-content" />
                    <SafeAreaView>
                      <View>
                        <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }} >Pick Image from Camera & Gallery</Text>
                        <View style={styles.ImageSections}>
                          <View>
                            {imageObject?.fileData && renderFileData()}
                            {/* <Text style={{ textAlign: 'center' }}>Base 64 String</Text> */}
                          </View>
                          {/* <View>
                            {imageObject?.fileUri && renderFileUri()}
                            <Text style={{ textAlign: 'center' }}>File Uri</Text>
                          </View> */}
                        </View>

                        <View style={[styles.btnParentSection, {flexDirection: 'row', gap: 20, justifyContent: 'center'}]}>
                          
                          <TouchableOpacity onPress={launchCamera} style={styles.btnSection}  >
                            <Text style={styles.btnText}>Camera</Text>
                          </TouchableOpacity>

                          <TouchableOpacity onPress={launchImageLibrary} style={styles.btnSection}  >
                            <Text style={styles.btnText}>Gallery</Text>
                          </TouchableOpacity>
                        </View>

                        <View>
                          <View style={{ flexDirection: 'column' }}>
                            <Text style={styles.GenerateRFIFieldLabel}>Date</Text>

                            <View style={{ flexDirection: 'row' }}>
                              <TextInput
                                style={styles.inputStyle}
                                placeholder=""
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                                value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
                                editable={false}
                              />
                              <TouchableOpacity onPress={() => openCloseCalendar()} style={{ width: 40, backgroundColor: "#ccc" }}>
                                <Text style={styles.assignTagButtonText}>Icon</Text>
                              </TouchableOpacity>
                            </View>
                          </View>

                          {openCalendar && (

                            <View style={{ flex: 1, backgroundColor: "#fff", zIndex: 10 }}>
                              <CalendarPicker width={width - 40}
                                initialDate={rfiDate ? new Date(rfiDate) : new Date()}
                                onDateChange={(date) => {
                                  setRFIDate(date.format("YYYY-MM-DD"));
                                  openCloseCalendar()
                                }}
                              />
                            </View>
                          )}

                          <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5, marginBottom: 140 }}>
                            <Text style={styles.GenerateRFIFieldLabel}>Time</Text>
                            <View style={{ flexDirection: 'row', gap: 20 }}>
                              <View style={{ width: 80, height: 90 }}>
                                <DropDownPicker onPress={() => {
                                  setOpenMinutes(false);
                                  setOpenTimeFormats(false);
                                }}
                                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                                  maxHeight={75}
                                  zIndex={1000}
                                  listMode='MODAL'
                                  open={openHours}
                                  value={hour}
                                  items={hours}
                                  setOpen={setOpenHours}
                                  setValue={setHour}
                                />
                              </View>

                              <View style={{ width: 80, height: 90 }}>
                                <DropDownPicker onPress={() => {
                                  setOpenHours(false);
                                  setOpenTimeFormats(false);
                                }}
                                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                                  maxHeight={75}
                                  zIndex={1000}
                                  listMode='MODAL'
                                  open={openMinutes}
                                  value={minute}
                                  items={minutes}
                                  setOpen={setOpenMinutes}
                                  setValue={setMinute}
                                />
                              </View>
                              <View style={{ width: 80, height: 90 }}>
                                <DropDownPicker onPress={() => {
                                  setOpenHours(false);
                                  setOpenMinutes(false);
                                }}
                                  dropDownContainerStyle={{ position: 'relative', top: 0, zIndex: 10000 }}
                                  maxHeight={75}
                                  zIndex={1000}
                                  listMode='SCROLLVIEW'
                                  open={openTimeFormats}
                                  value={timeFormat}
                                  items={timeFormats}
                                  setOpen={setOpenTimeFormats}
                                  setValue={setTimeFormat}
                                />
                              </View>
                            </View>

                            <View style={{ flexDirection: 'column', height: 65 }}>
                              <Text style={styles.GenerateRFIFieldLabel}>Recommendations</Text>
                              <TextInput
                                style={styles.inputStyle}
                                placeholder="Recommendations"
                                autoCapitalize="none"
                                keyboardType="email-address"
                                returnKeyType="next"
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                                value={comments}
                                onChangeText={(text) => {
                                  setComments(text);
                                }}
                              />
                            </View>
                          </View>
                        </View>

                      </View>
                    </SafeAreaView>
                  </Fragment>
                </ScrollView>
                
                <View style={[styles.btnParentSection, {flexDirection: 'row', justifyContent: 'center', gap: 20}]}>
                  <TouchableOpacity style={styles.submitButton} onPress={() => onFillChecklist(RFI_STATUS.IN_PROGRESS)}>
                    <Text style={styles.submitButtonText}>Save</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.submitButton} onPress={() => onFillChecklist(RFI_STATUS.IN_REVIEW)}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Modal>


      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const styles = StyleSheet.create({
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
  GenerateRFIFieldLabel: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500'
  },
  Container: {
    padding: 20,
  },
  Height100: {
    height: '100%',
  },
  SearchBox: {
    flexDirection: 'row',
    height: 40,
    marginBottom: 20,
    marginTop: 5,
    position: 'relative',
  },
  ImageSearch: {
    position: 'absolute',
    width: 24,
    height: 24,
    zIndex: 9,
    left: 10,
    top: '27%',
  },
  inputStyle: {
    flex: 1,
    color: '#2c2c2c',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 5,
    height: 45,
  },
  //Start Work
  StartWorkCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
  },
  StartWorkCardDisabled: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
    padding: 15,
    alignItems: 'center',
    marginBottom: 15,
    opacity: 0.5
  },
  leftContainer: {
    flexDirection: 'column',
  },
  HeadText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333'
  },
  MyWorkSubHead: {
    fontSize: 14,
    fontWeight: '400',
    color: '#666'
  },
  WorkIcon: {
    width: 12,
    height: 12
  },
  MyWorkCta: {
    borderRadius: 6,
    borderStyle: 'solid',
    borderWidth: 1,
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10
  },
  CtaStartText: {
    fontSize: 12,
    fontWeight: '400'
  },
  CtaStartTextColor: {
    color: '#A1A1A1',
  },
  StartBorder: {
    borderColor: '#A1A1A1',
  },
  DisabledBorder: {
    borderColor: '#EBEBE4'
  },
  CtaInProgressTextColor: {
    color: '#FCB700',
  },
  StartInProgressBorder: {
    borderColor: '#FCB700'
  },
  CtaReviewTextColor: {
    color: '#1C58C0',
  },
  StartReviewBorder: {
    borderColor: '#1C58C0'
  },
  CtaCompleteTextColor: {
    color: '#2BC267',
  },
  StartCompleteBorder: {
    borderColor: '#2BC267'
  },
  StartRejectBorder: {
    borderColor: '#FF0000'
  },
  CtaRejectTextColor: {
    color: '#FF0000',
  },
  //Breacrumb Start
  BreadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingBottom: 10,
    marginBottom: 10,
    gap: 5
  },
  BreadcrumbPrevText: {
    fontSize: 14,
    color: '#333'
  },
  BreadcrumbPrevTextUnderline: {
    fontSize: 14,
    textDecorationLine: 'underline',
    color: '#333'
  },
  BreadcrumbCurrentText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600'
  },
  ArrowIcon: {
    width: 18,
    height: 18
  },

  //MyWork Card
  MyWorkCard: {
    backgroundColor: '#CCD6E7',
    borderRadius: 12,
    justifyContent: 'flex-start',
    paddingVertical: 50,
    paddingHorizontal: 20,
    marginBottom: 15,
    position: 'relative'
  },
  CompleteWork: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#2BC267',
    backgroundColor: '#fff'
  },
  CompleteIcon: {
    position: 'absolute',
    right: 10,
    top: 10
  },
  HeadingText: {
    color: '#010101',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 5
  },
  TaskDetails: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  SubHeadingText: {
    color: '#000',
    fontSize: 12,
    fontWeight: '400',
    marginRight: 5,
  },
  SubActive: {
    color: '#1C58C0',
    fontWeight: '800'
  },
  NoDataContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '30%',
  },
  WthHeight: {
    width: 150,
    height: 150,
  },
  NodataHeadText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
  },
  NodataSubText: {
    fontSize: 16,
    color: '#27272A',
  },


  centeredView: {
    marginTop: 'auto',
    backgroundColor: '#fff',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderRadius: 12,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 60,
  },
  modalView: {
    minHeight: 150,
  },
  ModalHeader: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EBEBF0',
    borderStyle: 'solid',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#27272A',
    textAlign: 'center',
  },
  buttonClose: {
    position: 'absolute',
    right: 15,
  },
  CloseIcon: {
    width: 30,
    height: 30,
  },
  ModalInnerContainer: {
    paddingHorizontal: 15,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#27272A',
    marginLeft: 5,
  },
  submitButton: {
    backgroundColor: '#1C58C0',
    borderRadius: 10,
    color: '#fff',
    paddingHorizontal: 15,
    paddingTop: 12,
    paddingBottom: 12,
    marginBottom: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },


  bodyPopup: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    height: Dimensions.get('screen').height - 60,
    width: Dimensions.get('screen').width
  },
  ImageSections: {
    display: 'flex',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    justifyContent: 'center'
  },
  images: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    marginHorizontal: 3
  },
  btnParentSection: {
    // alignItems: 'center',
    marginTop:10
  },
  btnSection: {
    width: 150,
    height: 50,
    backgroundColor: '#1C58C0',
    // alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginBottom:10
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 14,
    fontWeight:'bold'
  }
});

export default MyWork