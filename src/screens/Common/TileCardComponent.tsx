import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
const imageMap: any = {
  structure: require('./../../images/structure-work.png'),
  highway: require('./../../images/highway-work.png'),
  other: require('./../../images/other-work.png'),
};
const {width} = Dimensions.get('window');
const itemWidth = (width - 50) / 2;
const TileCardComponent = (props: any) => {
  console.log('TileCardComponent', props);
  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: props.bgColor}]}
      onPress={props.onPress}>
      <View style={[styles.iconsStyle, {backgroundColor: props.imageBg}]}>
        {props.image && (
          <Image source={props.image} style={[styles.image,, {backgroundColor: props.imageBg}]} />
        )}
      </View>

      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.content}>{props.content}</Text>
    </TouchableOpacity>
  );
};

TileCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string,
  imageBg: PropTypes.string,
  bgColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    width: itemWidth,
    height: 180,
    borderRadius: 10,
    padding: 20,
    marginBottom: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  subTextContainer: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 5,
    color: '#fff',
  },
  content: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '400',
  },
  iconsStyle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  rightStyle: {
    width: 50,
  },
  CloseIcon: {
    width: 45,
    height: 45,
    tintColor: '#fff',
  },
});

export default TileCardComponent;
