import { Guid } from "guid-typescript";
import { comments, concreteData, dumpingData, rfiDate, segmentsByGroupOnType, setConcreteData, setDumpingData, setRFIDate, setTorquingData, torquingData } from "./Variables";
import { RFI_STATUS } from "../../../../../constants/constants";
import { Alert } from "react-native";
import { getDbDateFromDDMMYYYY } from "../../../../../utils/Utils";
import { onFillChecklistData } from "./FillChecklist";
import { fillRFIsChecklist } from "../../../actions";

export const onAddMoreConcrete = () => {
    setConcreteData([
        ...concreteData,
        {
            vehicleNo: '',
            timeOfArrival: '',
            gradeOfConcrete: '',
            concreteTemp: 0,
            slumpValue: 0,
            concretePoured: 0,
            concreteStartTime: '',
            concreteFinishTime: '',
            key: Guid.create(),
        },
    ]);
};
export const onAddMoreTorquing = () => {
    setTorquingData([
        ...torquingData,
        {
            date: '',
            time: '',
            component: '',
            detailsOfJoints: '',
            nosOfBolt: 0,
            diaOfBoltInMm: 0,
            sizeInMm: 0,
            slNoOfInvoiceMTCFile: '',
            slNoOfTorqueWrench: '',
            torqueApplied: 0,
            refusalsGauage3nos: 'Y',
            refusalsGauage4nos: 'Y',
            refusalsGauage5nos: 'Y',
            refusalsGauage6nos: 'Y',
            key: Guid.create(),
        },
    ]);
};
export const onAddMoreDumping = () => {
    setDumpingData([
        ...dumpingData,
        {
            vehicleNo: '',
            source: 'Y',
            qtyDumped: 0,
            approvedSource: '',
            bouldersPresent: 'Y',
            key: Guid.create(),
        },
    ]);
};

export  const getStyle = (item: any, styles: any) => {
    if (item.rfiStatus) {
      if (
        item.rfiStatus === RFI_STATUS.GENERATED ||
        item.rfiStatus === RFI_STATUS.RE_GENERATED
      ) {
        return [styles.StartWorkCard, styles.StartBorder];
      } else if (
        item.rfiStatus === RFI_STATUS.REJECTED ||
        item.rfiStatus === RFI_STATUS.CANCELLED
      ) {
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
  };

  const onClick = (
    level: number,
    assignmentLevel: number,
    projectModuleIndex: number,
    segIndex: number = -1,
    componentIndex: number = -1,
    subComponentIndex: number = -1,
    taskIndex: number = -1,
    segmentType = null,
  ) => {
    setSearchText('');
    setCurrentLevel(level);
    setBreadcrumbData([]);
    setCurrentTasksData([]);
    if (level === 2) {
      if (assignmentLevel === 1) {
        setCurrentLevel(7);
        const gbSegmentTypes = groupBy(
          myWorksData[projectModuleIndex].segmentsData,
          'type',
        );
        setSegmentsByGroupOnType(gbSegmentTypes);
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true,
          },
          {
            name: 'Segment Types',
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false,
          },
        ]);
      } else if (assignmentLevel == -1) {
        setCurrentSegmentsData(segmentsByGroupOnType[segmentType]);
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true,
          },
          {
            name: SEGMENT_TYPES_DISPLAY[segmentType],
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false,
          },
        ]);
      } else {
        const segmentsData = myWorksData[
          projectModuleIndex
        ].segmentsData.filter((seg: any) => seg.type == segmentType);
        setCurrentSegmentsData(segmentsData);
        setBreadcrumbData([
          {
            name: myWorksData[projectModuleIndex].name,
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 2,
            assignmentLevel: assignmentLevel,
            active: true,
          },
          {
            //name: "Foundation", // todo - dynamic
            name: SEGMENT_TYPES_DISPLAY[segmentsData[0].type] || 'Foundation', // todo - dynamic
            projectModuleIndex: projectModuleIndex,
            segIndex: segIndex,
            componentIndex: componentIndex,
            subComponentIndex: subComponentIndex,
            taskIndex: taskIndex,
            level: 0,
            assignmentLevel: assignmentLevel,
            active: false,
          },
        ]);
      }
    } else if (level === 3 && segIndex != -1) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      if (segmentData.componentsData && segmentData.componentsData.length) {
        setCurrentTasksData([]);
        setCurrentComponentsData(segmentData.componentsData);
      } else {
        setCurrentLevel(6);
        setCurrentComponentsData([]);
        setCurrentTasksData(segmentData.tasksData);
      }
      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true,
        },
        {
          name:
            SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false,
        },
      ]);
    } else if (level === 4 && segIndex != -1 && componentIndex != -1) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      const componentData = segmentData.componentsData[componentIndex];
      if (
        componentData.subComponentsData &&
        componentData.subComponentsData.length
      ) {
        setCurrentTasksData([]);
        setCurrentLevel(4);
        setCurrentSubComponentsData(componentData.subComponentsData);
      } else {
        setCurrentSubComponentsData([]);
        setCurrentLevel(6);
        setCurrentTasksData(componentData.tasksData);
      }
      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true,
        },
        {
          name: SEGMENT_TYPES_DISPLAY[segmentData.type] + '' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: false,
        },
        {
          name: componentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true,
        },
      ]);
    } else if (
      level === 5 &&
      segIndex != -1 &&
      componentIndex != -1 &&
      subComponentIndex != -1
    ) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      const componentData: any = segmentData.componentsData[componentIndex];
      const subComponentData: any =
        componentData.subComponentsData[subComponentIndex];
      setProjectModuleId(segmentData.projectModuleId);
      setCurrentTasksData(subComponentData.tasksData);

      setBreadcrumbData([
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true,
        },
        {
          name:
            SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: true,
        },
        {
          name: componentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true,
        },
        {
          name: subComponentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 4,
          assignmentLevel: assignmentLevel,
          active: true,
        },
      ]);
    } else if (level === 6 && taskIndex != -1) {
      const segmentData =
        myWorksData[projectModuleIndex].segmentsData[segIndex];
      const breadcrumbItems = [
        {
          name: myWorksData[projectModuleIndex].name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 2,
          assignmentLevel: assignmentLevel,
          active: true,
        },
        {
          name:
            SEGMENT_TYPES_DISPLAY[segmentData.type] + ' ' + segmentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 0,
          assignmentLevel: assignmentLevel,
          active: true,
        },
      ];
      if (componentIndex != -1 && subComponentIndex != -1) {
        const componentData: any = segmentData.componentsData[componentIndex];
        const subComponentData =
          componentData.subComponentsData[subComponentIndex];
        const taskData: any = [subComponentData.tasksData[taskIndex]];
        setProjectModuleId(segmentData.projectModuleId);
        setCurrentTasksData(taskData);
        breadcrumbItems.push(
          ...[
            {
              name: componentData.name,
              projectModuleIndex: projectModuleIndex,
              segIndex: segIndex,
              componentIndex: componentIndex,
              subComponentIndex: subComponentIndex,
              taskIndex: taskIndex,
              level: 3,
              assignmentLevel: assignmentLevel,
              active: true,
            },
            {
              name: subComponentData.name,
              projectModuleIndex: projectModuleIndex,
              segIndex: segIndex,
              componentIndex: componentIndex,
              subComponentIndex: subComponentIndex,
              taskIndex: taskIndex,
              level: 4,
              assignmentLevel: assignmentLevel,
              active: true,
            },
          ],
        );
      } else if (componentIndex != -1) {
        const componentData: any = segmentData.componentsData[componentIndex];
        const taskData: any = [componentData.tasksData[taskIndex]];
        setProjectModuleId(segmentData.projectModuleId);
        setCurrentTasksData(taskData);
        breadcrumbItems.push({
          name: componentData.name,
          projectModuleIndex: projectModuleIndex,
          segIndex: segIndex,
          componentIndex: componentIndex,
          subComponentIndex: subComponentIndex,
          taskIndex: taskIndex,
          level: 3,
          assignmentLevel: assignmentLevel,
          active: true,
        });
      } else if (segIndex != -1) {
        setProjectModuleId(segmentData.projectModuleId);
        const taskData: any = [segmentData.tasksData[taskIndex]];
        setCurrentTasksData(taskData);
      }

      breadcrumbItems.push({
        name: 'Tasks',
        projectModuleIndex: projectModuleIndex,
        segIndex: segIndex,
        componentIndex: componentIndex,
        subComponentIndex: subComponentIndex,
        taskIndex: taskIndex,
        level: 0,
        assignmentLevel: assignmentLevel,
        active: false,
      });
      setBreadcrumbData(breadcrumbItems);
    }
  };

  const onClickNested = (level: number, data: any) => {
    setSearchText('');
    if (data.projectModuleId) {
      setProjectModuleId(data.projectModuleId);
    }
    setCurrentLevel(level);
    if (level === 3) {
      setCurrentComponentsData(data.componentsData);
      const beadcrumb = breadcrumbData[1];
      beadcrumb.name = SEGMENT_TYPES_DISPLAY[data.type] + ' ' + data.name;
    } else if (level === 4) {
      setProjectModuleId(data.projectModuleId);
      const bcrubm = {
        name: data.name,
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false,
      };
      breadcrumbData.push(bcrubm);
      if (data.subComponentsData && data.subComponentsData.length) {
        setCurrentSubComponentsData(data.subComponentsData);
      } else {
        setCurrentTasksData(data.tasksData);
        breadcrumbData.push({
          name: 'Tasks',
          projectModuleIndex: breadcrumbData[0].projectModuleIndex,
          segIndex: breadcrumbData[1].segIndex,
          componentIndex: breadcrumbData[2]?.componentIndex || -1,
          subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
          taskIndex: 0,
          level: 0,
          assignmentLevel: 0,
          active: false,
        });
      }
    } else if (level === 5) {
      setCurrentTasksData(data.tasksData);
      const bcrubm = {
        name: data.name,
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false,
      };
      breadcrumbData.push(bcrubm);
      breadcrumbData.push({
        name: 'Tasks',
        projectModuleIndex: breadcrumbData[0].projectModuleIndex,
        segIndex: breadcrumbData[1].segIndex,
        componentIndex: breadcrumbData[2]?.componentIndex || -1,
        subComponentIndex: breadcrumbData[3]?.subComponentIndex || -1,
        taskIndex: 0,
        level: 0,
        assignmentLevel: 0,
        active: false,
      });
    }
  };


  
  export const onFillChecklist = (rfiStatus: string) => {
    if (!rfiDate) {
      Alert.alert('Error', 'Date is required.');
      return false;
    }

    if (!comments) {
      Alert.alert('Error', 'Recommendations is required.');
      return false;
    }
    //return;
    let rfiSubmitDateTime = `${getDbDateFromDDMMYYYY(rfiDate)} ${rfiTime}:00`;
    let checkList = {};

    onFillChecklistData(checkList);
    
    dispatch(
      fillRFIsChecklist({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        rfiId: rfiId,
        status: rfiStatus,
        body: {
          checkList: checkList,
          additionalData: {
            comments: comments,
            rfiSubmitDateTime: rfiSubmitDateTime,
          },
        },
      }),
    );
  };

  const onSegmentTypeClick = (type: any) => {
    if (segmentsByGroupOnType) {
      onClick(
        2,
        -1,
        breadcrumbData[0].projectModuleIndex,
        -1,
        -1,
        -1,
        -1,
        type,
      );
    }
  };

  const getRFIDataByWorkAssignmentId = (task: any) => {
    setRFIDate('');
    setComments('');
    setImageObject(imageObjectEmpty);
    setSelectedTask(task);
    dispatch(
      getRFIByWaId({
        projectId: loggedInUser.projectId,
        projectModuleId: projectModuleId,
        waId: task.workAssignmentId,
      }),
    );
  };