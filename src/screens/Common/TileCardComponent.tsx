import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
const imageMap: any = {
  structure: require('./../../images/structure-work.png'),
  highway: require('./../../images/highway-work.png'),
  other: require('./../../images/other-work.png'),
};
const TileCardComponent = (props: any) => {
  return (
    <TouchableOpacity
      style={[styles.card, {backgroundColor: props.bgColor}]}
      onPress={props.onPress}>
      <View style={styles.subTextContainer}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.content}>{props.content}</Text>
      </View>
      <View style={styles.iconsStyle}>
        {props.image && (
          <Image source={imageMap[props.image]} style={styles.image} />
        )}
      </View>
      <View style={styles.rightStyle}>
        <Image
          style={styles.CloseIcon}
          source={require('./../../images/right-arrow.png')}
        />
      </View>
    </TouchableOpacity>
  );
};

TileCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  image: PropTypes.string,
  bgColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
    margin: 10,
    overflow: 'hidden',
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 110,
    paddingRight: 5,
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 96,
  },
  subTextContainer: {
    width: '80%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  image: {
    width: 50,
    height: 50,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0,
    color: '#fff',
  },
  content: {
    fontSize: 12,
    color: '#fff',
  },
  iconsStyle: {
    backgroundColor: '#fff',
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
    opacity: 0.7,
    height: 97,
    position: 'absolute',
    left: 0,
    top: 0,
    width: 90,
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    padding: 20,
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
