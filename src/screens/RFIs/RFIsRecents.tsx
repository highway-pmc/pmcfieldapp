import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native'
import { RFIs_TYPE } from '../../constants/constants'
import { useNavigation } from '@react-navigation/native';

const RFIsRecents = (props: any) => {
  const navigation = useNavigation();

  const getRFIType = () => {
    if (props.rfiType === RFIs_TYPE.GENERATE) {
      return 'Generated'
    } else if (props.rfiType === RFIs_TYPE.CLOSED) {
      return 'Closed'
    } else if (props.rfiType === RFIs_TYPE.APPROVE_REJECT) {
      return 'Approved/Rejected'
    } else if (props.rfiType === RFIs_TYPE.RE_GENERATE) {
      return 'Re-generated'
    } else if (props.rfiType === RFIs_TYPE.ASSIGN) {
      return 'Assigned'
    }

    return '';
  }
  return (
    <View>
      <Text style={styles.headerText}> Recent {getRFIType()} RFI's</Text>
      <View style={styles.recentWorkContainer}>
        <View style={styles.recentWorkHead}>
          <Text style={styles.headerText}>Recent RFI's (<Text style={styles.taskCount}>10</Text>)</Text>
        </View>
        <View style={props.rfiType === RFIs_TYPE.GENERATE ? styles.recentWorkContent : styles.recentWorkContentHeight100}>
          <ScrollView showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentWorkCard}>
              <View style={styles.taskCategory}>
                <Text style={styles.subHead}>Foundation-A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={styles.subHead}>Footing A1</Text>
                <Image style={styles.ArrowIcon} source={require('../../images/right-arrow-icon.png')} />
                <Text style={[styles.subHead, styles.taskCount]}>CNG & Setting</Text>
              </View>
              <Text style={styles.dateText}>Generated Date: 22/12/23</Text>
              <Text style={styles.dateText}>Generated Time: 12:00 PM</Text>
            </TouchableOpacity>

            <View style={styles.noDataContainer}>
              <Image style={styles.noDataImage} source={require('../../images/no-data-found.png')} />
              <Text style={styles.noDataHeadText}>No Pending RFI's</Text>
              <Text style={styles.noDataSubText}>There is no pending RFI's</Text>
            </View>
          </ScrollView>
        </View>
        {props.rfiType === RFIs_TYPE.GENERATE && <View style={styles.footerButton}>
          <TouchableOpacity style={styles.btnCta} onPress={() => navigation.navigate('RFIsTaskListing', {
            rfiType: props.rfiType
          })}>
            <Text style={styles.btnCtaText}>Generate RFI's</Text>
          </TouchableOpacity>
        </View>}
      </View>

    </View>
  )
}

const styles = StyleSheet.create({
  headerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500'
  },
  recentWorkContainer: {
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 15,
    height: '80%'
  },
  recentWorkHead: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#DEE1E7',
    padding: 20
  },
  taskCount: {
    color: '#1C58C0'
  },
  recentWorkContent: {
    padding: 20,
    height: '90%'
  },
  recentWorkContentHeight100: {
    padding: 20,
    height: '100%'
  },
  recentWorkCard: {
    backgroundColor: '#fff',
    borderRadius: 4,
    padding: 15,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderStyle: 'solid',
    marginBottom: 15
  },
  taskCategory: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 2,
    marginBottom: 5
  },
  subHead: {
    color: '#150B3D',
    fontSize: 14,
    fontWeight: '600'
  },
  ArrowIcon: {
    width: 18,
    height: 18
  },
  dateText: {
    color: '#150B3D',
    fontSize: 14,
    fontWeight: '300'
  },
  footerButton: {
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: -20,
  },
  btnCta: {
    borderRadius: 30,
    backgroundColor: '#1C58C0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnCtaText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500'
  },
  noDataContainer: {
    marginVertical: 30,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noDataHeadText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#34343F'
  },
  noDataSubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#464665',
    marginTop: 10
  },
  noDataImage: {
    width: 245,
    height: 184,
    marginBottom: 15
  }
});

export default RFIsRecents