import { View, Text, NativeEventEmitter, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native';
import { HeaderItems, PROJECT_TYPE, SEGMENT_TYPES_DISPLAY } from "../../constants/constants"
import { useDispatch, useSelector } from 'react-redux';
import { clearMyWorksEvent, getMyWorks } from './actions';
import LoadingAnimation from '../Common/LoadingAnimation';
import { groupBy } from '../../utils/Utils';

const MyWork = ({ route, navigation }: { route: any, navigation: any }) => {
  const loggedInUser = useSelector((state: any) => state.Auth.userInfo);
  const { projectType } = route.params;

  const { myWorks, loading, error } = useSelector((state: any) => state.MyWorks);
  const [myWorksData, setMyWorksData] = useState([]);
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
  }, [myWorks, error]);

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
    if (item.rfiStatus && item.rfiStatus != "pending") {
      return [styles.StartWorkCard, styles.StartBorder];
    }
    return [styles.StartWorkCardDisabled, styles.DisabledBorder];
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
              <TouchableOpacity style={[styles.MyWorkCta, styles.StartBorder]}>
                <Image style={styles.WorkIcon} source={require('../../images/play-icon.png')} />
                <Text style={[styles.CtaStartText, styles.CtaStartTextColor]}>Start</Text>
              </TouchableOpacity>
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

      <LoadingAnimation loading={loading}></LoadingAnimation>
    </View>
  )
}

const styles = StyleSheet.create({
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
});

export default MyWork