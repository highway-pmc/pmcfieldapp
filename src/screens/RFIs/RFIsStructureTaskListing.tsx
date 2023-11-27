import { View, Text, Button, NativeEventEmitter, Alert, StyleSheet, ScrollView, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, RFI_STATUS, RFIs_TYPE, SEGMENT_TYPES_DISPLAY, USER_CATEGORY_DISPLAY, WORK_ASSIGNMENT_LEVEL, WORK_TYPE } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearRFITasksEvent, getRFITaskUsers, getRFITasks, actionGenerateRFI } from './actions';
import { groupBy } from '../../utils/Utils';
import LoadingAnimation from '../Common/LoadingAnimation';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import DropDownPicker from 'react-native-dropdown-picker';

const RFIsStructureTaskListing = (props: any) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const userCategory = PROJECT_TYPE.STRUCTURE_WORK;
  // const rfiType = props.rfiType;

  const { rfisTasks, taskUsers, rfiGenerated, loading, error } = useSelector((state: any) => state.RFIs);
  const [rfisTasksData, setRFIsTasksData] = useState([]);
  const [taskUsersData, setTaskUsersData] = useState([]);
  const [selectedProjectModuleId, setSelectedProjectModuleId] = useState('');
  const [selectedTaskData, setSelectedTaskData] = useState({});
  const [currentSegmentsData, setCurrentSegmentsData] = useState([]);
  const [currentSubSegmentsData, setCurrentSubSegmentsData] = useState([]);
  const [currentTasksData, setCurrentTasksData] = useState([]);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [segmentsByGroupOnType, setSegmentsByGroupOnType] = useState(null);
  const [searchText, setSearchText] = useState('');

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

  const dispatch = useDispatch()
  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      setCurrentLevel(1);
      setRFIsTasksData([]);
      setTaskUsersData([]);
      setCurrentSegmentsData([]);
      setCurrentSubSegmentsData([]);
      setCurrentTasksData([]);
      setBreadcrumbData([]);
      getRFITasksData();
      setSearchText('');
    }
  }, [focus]);

  const getRFITasksData = () => {
    dispatch(getRFITasks({
      projectId: loggedInUser.projectId,
      userCategory: userCategory,
      level: 4 // Tasks
    }));
  }

  useEffect(() => {
    if (rfisTasks) {
      setRFIsTasksData(rfisTasks);
    }
    if (taskUsers) {
      setTaskUsersData(taskUsers);
    }
  }, [rfisTasks, taskUsers, error]);

  // unmount
  useEffect(() => () => {
    dispatch(clearRFITasksEvent());
    setCurrentLevel(1);
    setRFIsTasksData([]);
    setTaskUsersData([]);
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
        //==
        setCurrentLevel(5);
        const projectModule = rfisTasksData[projectModuleIndex];
        setSelectedProjectModuleId(projectModule.id);
        const gbSegmentTypes = groupBy(projectModule.segmentsData, "type");
        setSegmentsByGroupOnType(gbSegmentTypes);
        setBreadcrumbData([
          {
            name: rfisTasksData[projectModuleIndex].name,
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
            name: rfisTasksData[projectModuleIndex].name,
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
        const segmentsData = rfisTasksData[projectModuleIndex].segmentsData.filter((seg: any) => seg.type == segmentType);
        setCurrentSegmentsData(segmentsData)
        setBreadcrumbData([
          {
            name: rfisTasksData[projectModuleIndex].name,
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
      const segmentData = rfisTasksData[projectModuleIndex].segmentsData[segIndex];
      setCurrentSubSegmentsData(segmentData.subSegmentsData)
      setBreadcrumbData([
        {
          name: rfisTasksData[projectModuleIndex].name,
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
      const segmentData = rfisTasksData[projectModuleIndex].segmentsData[segIndex];
      const subSegmentData: any = segmentData.subSegmentsData[subSegIndex];
      const taskData: any = [subSegmentData.tasksData[taskIndex]];

      setCurrentTasksData(taskData)

      setBreadcrumbData([
        {
          name: rfisTasksData[projectModuleIndex].name,
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
      const segmentData = rfisTasksData[projectModuleIndex].segmentsData[segIndex];
      const subSegmentData: any = segmentData.subSegmentsData[subSegIndex];

      const tasksData = JSON.parse(JSON.stringify(subSegmentData.tasksData));

      tasksData.forEach((task: any) => {
        task.isExpanded = false
      });

      setCurrentTasksData(subSegmentData.tasksData)

      setBreadcrumbData([
        {
          name: rfisTasksData[projectModuleIndex].name,
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
      let uniqueTasksData: any = [];

      data.tasksData.forEach((item: any) => {
        const taskItem = uniqueTasksData.find((tsk: any) => tsk.name == item.name);
        if (!taskItem) {
          const itemJson = JSON.parse(JSON.stringify(item))
          itemJson.workAssignmentIds = [item.workAssignmentId];
          uniqueTasksData.push(itemJson);
        } else {
          taskItem.workAssignmentIds.push(item.workAssignmentId);
        }
      });

      setCurrentTasksData(uniqueTasksData)
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

  // accordian

  const updateLayout = (index: any) => {
    const array = [...currentTasksData];
    //For multiple state open
    //LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    //array[index]['isExpanded'] = !array[index]['isExpanded'];
    // array.map((value, placeindex) => placeindex === index 
    // ? array[placeindex]['isExpanded'] = !array[placeindex]['isExpanded'] 
    // : (array[placeindex]['isExpanded']) = false
    // );
    array.forEach((arrayItem: any, arrayIndex) => {
      if (arrayIndex === index) {
        arrayItem.isExpanded = !arrayItem.isExpanded;
        if (arrayItem.isExpanded) {
          // call API to get users to be notified
          setSelectedTaskData(arrayItem);
          getUsersToNotify(arrayItem._id);
        }
      } else {
        arrayItem.isExpanded = false;
      }
    })
    setCurrentTasksData(array);
  }

  const getUsersToNotify = (taskId: any) => {
    dispatch(getRFITaskUsers({
      projectId: loggedInUser.projectId,
      projectModuleId: selectedProjectModuleId,
      userCategory: userCategory,
      taskId: taskId
    }));
  }

  const onGenerateRFI = () => {
    if (selectedTaskData.rfiData && selectedTaskData.rfiData._id) {
      Alert.alert('Info', 'RFI generated already.');
      return;
    }
    const reqData = {
      taskId: selectedTaskData._id,
      workAssignmentIds: selectedTaskData.workAssignmentIds,
      rfiDateTime: selectedTaskData.formRFIDate + ' ' + selectedTaskData.formRFITime + ":00",
      rfiStatus: RFI_STATUS.GENERATED,
      comments: "",
      receiverIds: taskUsersData.map((item: any) => {
        return {
          _id: item.user._id,
          assignmentLevel: item.assignmentLevel
        }
      })
    }

    dispatch(actionGenerateRFI({
      projectId: loggedInUser.projectId,
      projectModuleId: selectedProjectModuleId,
      userCategory: userCategory,
      body: reqData
    }));
  }

  useEffect(() => {
    if (rfiGenerated) {
      Alert.alert('Success', 'RFI generated');
      selectedTaskData.rfiData = rfiGenerated;
      delete selectedTaskData.formRFIDate
      delete selectedTaskData.formRFITime
    }
  }, [rfiGenerated]);

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
          rfisTasksData.map((projModuleItem: any, projModuleIndex) => (
            <TouchableOpacity style={[styles.StartWorkCard, styles.StartBorder]} onPress={() => onClick(2, 1, projModuleIndex)}>
              <View style={styles.leftContainer}>
                <Text style={styles.HeadText}>{projModuleItem.name}</Text>
              </View>
            </TouchableOpacity>
            /*
            // projModuleItem.assignmentLevel === 1 ?
              // <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, 1, projModuleIndex)}>
              //   <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
              //   <View style={styles.TaskDetails}>
              //     <Text style={styles.SubHeadingText}>Assigned:</Text>
              //     <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.name}</Text>
              //   </View>
              // </TouchableOpacity>
              // :
              // (projModuleItem.segmentsData?.map((segItem: any, segIndex: any) => (
              //   (segItem.assignmentLevel === 2 && segIndex == 0) ? (
              //     projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2).length === 1 ? (
              //       <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(3, segItem.assignmentLevel, projModuleIndex, projModuleItem.segmentsData?.findIndex((segItem: any) => segItem.assignmentLevel == 2))}>
              //         <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
              //         <View style={styles.TaskDetails}>
              //           <Text style={styles.SubHeadingText}>Assigned:</Text>
              //           <View style={{ flexDirection: 'row' }}>
              //             <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
              //             <Text style={[styles.SubHeadingText, styles.SubActive]}>{projModuleItem.segmentsData?.filter((segItem: any) => segItem.assignmentLevel == 2)[0].name}</Text>
              //           </View>
              //         </View>
              //       </TouchableOpacity>
              //     )
              //       :
              //       (
              //         Object.keys(groupBy(projModuleItem.segmentsData, "type")).map((segType: any) => (
              //           <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(2, segItem.assignmentLevel, projModuleIndex, -1, -1, -1, segType)}>
              //             <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
              //             <View style={styles.TaskDetails}>
              //               <Text style={styles.SubHeadingText}>Assigned:</Text>
              //               <Text style={[styles.SubHeadingText, styles.SubActive]}>{SEGMENT_TYPES_DISPLAY[segType]} {projModuleItem.segmentsData?.filter((segItem: any) => segItem.type == segType && segItem.assignmentLevel == 2).length}</Text>
              //             </View>
              //           </TouchableOpacity>
              //         ))
              //       )
              //   )
              //     :
              //     segItem.subSegmentsData?.map((subSegItem: any, subSegIndex: number) => (
              //       subSegItem.assignmentLevel === 3 ?
              //         (
              //           <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(4, subSegItem.assignmentLevel, projModuleIndex, segIndex, subSegIndex)}>
              //             <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
              //             <View style={styles.TaskDetails}>
              //               <Text style={styles.SubHeadingText}>Assigned:</Text>
              //               <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
              //               <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
              //               <Text style={[styles.SubHeadingText, styles.SubActive]}>{subSegItem.name}</Text>
              //             </View>
              //           </TouchableOpacity>

              //         )
              //         :
              //         subSegItem.tasksData?.map((taskItem: any, taskIndex: number) => (
              //           taskItem.assignmentLevel === 4 &&
              //           <TouchableOpacity style={styles.MyWorkCard} onPress={() => onClick(4, taskItem.assignmentLevel, projModuleIndex, segIndex, subSegIndex, taskIndex)}>
              //             <Text style={styles.HeadingText}>{projModuleItem.name}</Text>
              //             <View style={styles.TaskDetails}>
              //               <Text style={styles.SubHeadingText}>Assigned:</Text>
              //               <Text style={styles.SubHeadingText}>{SEGMENT_TYPES_DISPLAY[segItem.type]} /</Text>
              //               <Text style={styles.SubHeadingText}>{segItem.name} /</Text>
              //               <Text style={styles.SubHeadingText}>{subSegItem.name} /</Text>
              //               <Text style={[styles.SubHeadingText, styles.SubActive]}>{taskItem.displayName}</Text>
              //             </View>
              //           </TouchableOpacity>

              //         ))

              //     ))


              // )))*/

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
            <TouchableOpacity style={[styles.StartWorkCard, styles.StartBorder]} onPress={() => onClickNested(3, item)}>
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
            <TouchableOpacity style={[styles.StartWorkCard, styles.StartBorder]} onPress={() => onClickNested(4, item)}>
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
            // <View style={[styles.StartWorkCard, styles.StartBorder]}>
            //   <View style={styles.leftContainer}>
            //     <Text style={styles.HeadText}>{item.displayName}</Text>
            //   </View>
            //   <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]}>
            //     <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Start</Text>
            //   </TouchableOpacity>
            // </View>
            <ExpanbableComponent
              key={item.displayName}
              item={item}
              onClickFunction={() => {
                updateLayout(index)
              }}
              onGenerateRFI={() => onGenerateRFI()}
            />
          ))
        }
        {/* No Data Found */}
        {(!loading && !rfisTasksData.length) &&
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

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const ExpanbableComponent = ({ item, onClickFunction, onGenerateRFI }: { item: any, onClickFunction: any, onGenerateRFI: any }) => {
  const [layoutHeight, setLayoutHeight] = useState(0);
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
  const { width, height } = Dimensions.get('window');
  const DEFAULT_COMPONENT_HEIGHT = 230;
  const DEFAULT_CALENDAR_HEIGHT = 270;

  useEffect(() => {
    getHours();
    getMins();
    getTimeFormats();
  }, [])

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    } else {
      setLayoutHeight(0)
    }
  }, [item.isExpanded])

  const openCloseCalendar = () => {
    setOpenCalendar(!openCalendar);
    if (!openCalendar) {
      setLayoutHeight(DEFAULT_COMPONENT_HEIGHT + DEFAULT_CALENDAR_HEIGHT)
    } else {
      setLayoutHeight(DEFAULT_COMPONENT_HEIGHT)
    }
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

  const onGenerate = () => {
    if (!rfiDate) {
      Alert.alert('Error', 'RFI Date is required.');
      return false;
    }
    item.formRFIDate = rfiDate;

    let rfiTime = '';
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
    item.formRFITime = rfiTime;
    onGenerateRFI();
  }

  return (
    <View>
      <TouchableOpacity style={[styles.item, item.isExpanded ? styles.openItem : null]} onPress={onClickFunction}>
        <View>
          <Text style={styles.itemText}>
            {item.displayName}
          </Text>
        </View>
        {item.isExpanded
          ? <Image style={styles.WorkIconTask} source={require('../../images/minus-icon.png')} />
          : <Image style={styles.WorkIconTask} source={require('../../images/plus-icon.png')} />
        }

      </TouchableOpacity>
      {/* <ScrollView style={styles.Height100}> */}
      <View style={[{ height: layoutHeight, zIndex: 1 }, styles.content]}>
        <View style={{ flexDirection: 'column' }}>
          <Text style={styles.GenerateRFIFieldLabel}>Date of RFI's</Text>

          <View style={styles.CalendarField}>
            <TextInput
              style={[styles.paddingHorizon]}
              placeholder="DD-MM-YYYY"
              autoCapitalize="none"
              keyboardType="email-address"
              returnKeyType="next"
              underlineColorAndroid="#f000"
              blurOnSubmit={false}
              value={rfiDate ? moment(new Date(rfiDate)).format('DD-MM-YYYY') : ''}
              editable={false}
            />
            <TouchableOpacity onPress={() => openCloseCalendar()} style={styles.CalendarImage}>
              <Image style={styles.WorkIconTask} source={require('../../images/date-icon.png')} />
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
              previousComponent = {<Image style={styles.previousIcon} source={require('../../images/right-arrow.png')} />}
              nextComponent = {<Image style={styles.WorkIconTask} source={require('../../images/right-arrow.png')} />}
            />
          </View>
        )}

        <View style={{ flexDirection: 'column', height: 80, paddingTop: 15, zIndex: 5 }}>
          <Text style={styles.GenerateRFIFieldLabel}>Time of RFI's</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ width: 80, height: 90 }}>
              <DropDownPicker onPress={() => {
                setOpenMinutes(false);
                setOpenTimeFormats(false);
              }}
                listMode='MODAL'
                modalAnimationType={'slide'}
                modalTitle={'Select Hours'}
                customItemLabelStyle={{borderWidth: 1,
                  borderColor: '#eee',}}
                modalContentContainerStyle={{
                  borderWidth: 1,
                  maxHeight: 240,
                  borderColor: '#eee',
                  borderRadius: 6,
                  backgroundColor: 'white', // Set your desired background color
                  position: 'absolute',
                  bottom: 0,
                  width: '100%',
                }}
                autoScroll={true}
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
        </View>
        <View style={{ flexDirection: 'row', gap: 40, paddingTop: 20, zIndex: 3, alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={styles.btnReset}>
            <Text style={styles.btnResetText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGenerate} onPress={() => onGenerate()
          }>
            <Text style={styles.btnGenerateText}>Generate</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </ScrollView> */}
    </View>
  )
}

const styles = StyleSheet.create({
  CalendarField: {
    flexDirection: 'row', 
    position: 'relative'
  },
  CalendarImage: {
    width: 30, position: 'absolute', top: 11, right: 5
  },
  previousIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: '180deg' }]
  },
  paddingHorizon: {
    flex: 1,
    color: '#2c2c2c',
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: '#808089',
    backgroundColor: '#fff',
    fontWeight: '600',
    paddingVertical: 5,
    height: 45,
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
    paddingLeft: 40,
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
    marginBottom: 15
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
    borderColor: '#A1A1A1'
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
  // Accordian
  item: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 15,
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'space-between'
  },
  openItem: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  itemText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  content: {
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12
  },
  text: {
    fontSize: 16,
    padding: 10,
  },
  plusIconArea: {
    width: 24,
    height: 24,
    borderRadius: 24,
    backgroundColor: '#1C58C0',
    opacity: .7,
    alignItems: 'center',
    justifyContent: 'center'
  },
  WorkIconTask: {
    width: 24,
    height: 24
  },
  // generate RFI form
  btnGenerate: {
    borderRadius: 30,
    backgroundColor: '#1C58C0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnGenerateText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  btnReset: {
    borderRadius: 30,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#1C58C0',
    borderBlockColor: '#000',
    borderWidth: 1,
  },
  btnResetText: {
    color: '#1C58C0',
    fontSize: 14,
    fontWeight: '500'
  },
  GenerateRFIFieldLabel: {
    fontSize: 16,
    color: '#150A33',
    fontWeight: '500'
  },
  GenerateRFIFieldTextInput: {
    width: 295,
    height: 40,
    fontSize: 12,
    color: "#666666",
    backgroundColor: "#99ABC6"
  },
  assignTagButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
  },
});

export default RFIsStructureTaskListing