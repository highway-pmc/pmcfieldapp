import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { RFIs_TYPE} from "../../constants/constants"

import CustomSelectDropdown from '../Common/CustomSelectDropdown';
import appConfig from '../../common/app.config';
import CalendarPicker from '../../components/UI/CalenderPicker';
import TimePicker from '../../components/UI/TimePicker';
import { getDbDateFromDDMMYYYY } from '../../utils/Utils';
import { useSnackbar } from '../../context/SnackbarContext';

const RFIsGenerateMyQuality = ({ route, navigation }: { route: any, navigation: any }) => {
  const { rfiType, testType, projectId } = route?.params || {};
  const { height } = Dimensions.get('window');
  const calculatedHeight = height * 0.75;
  const { showSnackbar } = useSnackbar();

  interface MaterialData {
    materialTypeData?: any[];
    testTypeData?: any[];
    subTestTypes?: any[];
    _id?: any,
    testCategory?: string
  }
    const [labTestDropdownData, setLabTestDropdownData] = useState([]);
    const [selectedValues, setSelectedValues] = useState<MaterialData>({});
    const [selectedMaterialTypeData, setSelectedMaterialTypeData] = useState<MaterialData>({});
    const [selectedTestTypeData, setSelectedTestTypeData] = useState<MaterialData>({});
    const [selectedSubTestTypeData, setSelectedSubTestTypeData] = useState<MaterialData>({});
    const [rfiDate, setRFIDate] = useState('');
    const [rfiTime, setRFITime] = useState('');
    
    useEffect(() => {
      const testTypeData = async () => {
        setSelectedValues({});
        setSelectedMaterialTypeData({});
        setSelectedTestTypeData({});
        await fetch(`${appConfig.API_URL}/v1/auth/qualityMasterData?type=${testType}`, {
                  method: 'get',
                  headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: appConfig.getToken(),
                  },
                }).then((response) => response.json()).then((res) => {
                  if (res.code === 200) {
                    setLabTestDropdownData(res?.data?.testWorkCategoryData);
                  } else {
  
                  }
                });
      }
      testTypeData();
      setRFIDate('');
      setRFITime('');
    }, [testType]);
  
    const handleCategorySelect = (selectedOption: any) => {
      setSelectedValues(selectedOption);
      setSelectedMaterialTypeData({});
      setSelectedTestTypeData({});
      setSelectedSubTestTypeData({});
    };
  
    const handleMaterialTypeSelect = (selectedOption: any) => {
      setSelectedMaterialTypeData(selectedOption);
      setSelectedTestTypeData({});
      setSelectedSubTestTypeData({});
    };
  
    const handleTestTypeSelect = (selectedOption: any) => {
      setSelectedTestTypeData(selectedOption);
      setSelectedSubTestTypeData({});
    };

    const handleSubTestTypeSelect = (selectedOption: any) => {
      setSelectedSubTestTypeData(selectedOption);
    };


    const onGenerateRFI = async () => {
      const payload: any = {
        sampleData: {
          testWorkCategoryId: selectedValues?._id,
          testMaterialId: selectedMaterialTypeData?._id,
          testTypeId: selectedTestTypeData?._id,
          testCategory: selectedSubTestTypeData?.testCategory,
          rfiDateTime: `${getDbDateFromDDMMYYYY(rfiDate)} ${rfiTime}:00`,
        }
      } 
      try {
        const responseOfFileUpload = await fetch(`${appConfig.API_URL}/v1/auth/projects/${projectId}/${testType}/rfis-manual`, {
          method: 'POST',
          headers: {
            'Content-Type': 'multipart/formSoil-data',
            Authorization: appConfig.getToken(),
          },
          body: payload,
        });
        if (responseOfFileUpload.status == 200) {
          let responseInJs = await responseOfFileUpload.json();
          showSnackbar('RFI`s Generate  Succesfull');
          setSelectedMaterialTypeData({});
          setSelectedTestTypeData({});
          setSelectedSubTestTypeData({});
        } else {
          showSnackbar('RFI`s Generate Failed');
        }
      } catch (err) {
        showSnackbar('RFI`s Generate Failed');
        console.log(err, 'error in RFI`s Generate');
      }
    }

    const onReset = () => {
        setRFIDate('');
        setRFITime('');
        setSelectedMaterialTypeData({});
        setSelectedTestTypeData({});
        setSelectedSubTestTypeData({});
    }


  return (
    <View style={styles.recentWorkContainer}>
      <Text style={styles.headerText}>{testType === 'field-lab-test' ? 'Lab Test' : 'Third Party Test'}</Text>
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false} style={[
            rfiType === RFIs_TYPE.GENERATE
              ? styles.recentWorkContent
              : styles.recentWorkContentHeight100,
            {height: calculatedHeight},
          ]}>
            <View style={styles.innerScrollView}>
              <CustomSelectDropdown label='Category'
              data={labTestDropdownData}
              selectedValue={selectedValues}
              onSelect={(selectedOption: any) => handleCategorySelect(selectedOption)} />

              {selectedValues.materialTypeData?.length && 
                <CustomSelectDropdown label='Material Type'
                data={selectedValues?.materialTypeData}
                selectedValue={selectedMaterialTypeData}
                onSelect={(selectedOption: any) => handleMaterialTypeSelect(selectedOption)} /> 
              }

              {selectedMaterialTypeData.testTypeData?.length && 
                <CustomSelectDropdown label='Test Type'
                data={selectedMaterialTypeData?.testTypeData}
                selectedValue={selectedTestTypeData}
                onSelect={(selectedOption: any) => handleTestTypeSelect(selectedOption)} />
              }

              {selectedTestTypeData.subTestTypes?.length &&
                <CustomSelectDropdown label='Sub Test Type'
                data={selectedTestTypeData?.subTestTypes}
                selectedValue={selectedSubTestTypeData}
                onSelect={(selectedOption: any) => handleSubTestTypeSelect(selectedOption)} /> 
              }

              <CalendarPicker label="Date of RFI's" value={rfiDate} onChange={(date) => setRFIDate(date)} />

              <TimePicker label="Time" value={rfiTime} onChange={(time) => setRFITime(time)} />
            </View>
        </ScrollView> 
        <View style={styles.footerButton}>
            <TouchableOpacity
              style={styles.btnCtaOutline}
              onPress={onReset}>
              <Text style={styles.btnCtaTextOutline}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnCta}
              onPress={onGenerateRFI}>
              <Text style={styles.btnCtaText}>Generate</Text>
            </TouchableOpacity>
        </View>
      </View>
  )
}

const styles = StyleSheet.create({
  recentWorkContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 20
  },
  recentWorkContent: {
    paddingHorizontal: 20,
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 10,
  },
  recentWorkContentHeight100: {
    padding: 20,
  },
  innerScrollView: {
    paddingBottom: 10,
    paddingTop: 15,
  },
  footerButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    marginTop: 15,
    marginHorizontal: -20,
    height: 78,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  btnCta: {
    borderRadius: 30,
    backgroundColor: '#1C58C0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130
  },
  btnCtaOutline: {
    borderRadius: 30,
    borderWidth: 1,
    borderStyle: 'solid', 
    borderColor: '#1C58C0',
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 130
  },
  btnCtaTextOutline: {
    color: '#1C58C0',
    fontSize: 14,
    fontWeight: '500',
  },
  btnCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default RFIsGenerateMyQuality