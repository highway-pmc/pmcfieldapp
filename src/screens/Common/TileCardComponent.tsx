import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import LinearGradient from 'react-native-linear-gradient';

const imageMap: any = {
  structure: require('./../../images/myWork/structure.png'),
  highway: require('./../../images/myWork/highway.png'),
  other: require('./../../images/myWork/other.png'),
  initialSurvey: require('./../../images/myWork/survey.png'),
};

// Define the component props interface for better type checking
interface TileCardProps {
  title: string;
  workType: string;
  imageBg: string;
  bgColor: string;
  linearLight: string;
  linearDark: string;
  image: string;
  generatedTask: number;
  inProgressTask: number;
  closedTask: number;
  rejected: number;
  borderColor?: string;
  onPress: () => void;
}

const TileCardComponent = (props: TileCardProps) => {
  const {
    title,
    imageBg,
    bgColor,
    linearLight,
    linearDark,
    image,
    generatedTask,
    inProgressTask,
    closedTask,
    rejected,
    borderColor,
    onPress,
  } = props;

  const gradientColors = [linearLight || bgColor, linearDark || bgColor];

  return (
    <TouchableOpacity
      style={[
        styles.cardWrapper,
        borderColor ? {borderColor, borderWidth: 1} : null,
      ]}
      onPress={onPress}>
      <LinearGradient
        colors={gradientColors}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={styles.card}>
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{title}</Text>

            <View style={styles.tasksContainer}>
              <Text style={styles.taskLabel}>
                Generated Task:{' '}
                <Text style={styles.taskValue}>{generatedTask}</Text>
              </Text>
              <Text style={styles.taskLabel}>
                In progress Task:{' '}
                <Text style={styles.taskValue}>{inProgressTask}</Text>
              </Text>
              <Text style={styles.taskLabel}>
                Closed Task: <Text style={styles.taskValue}>{closedTask}</Text>
              </Text>
              <Text style={styles.taskLabel}>
                Rejected: <Text style={styles.taskValue}>{rejected}</Text>
              </Text>
            </View>
          </View>

          <View style={styles.imageContainer}>
            {image && (
              <Image
                source={imageMap[image]}
                style={styles.image}
                resizeMode="contain"
              />
            )}
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

TileCardComponent.propTypes = {
  title: PropTypes.string.isRequired,
  workType: PropTypes.string.isRequired,
  imageBg: PropTypes.string,
  bgColor: PropTypes.string,
  linearLight: PropTypes.string,
  linearDark: PropTypes.string,
  image: PropTypes.string,
  generatedTask: PropTypes.number,
  inProgressTask: PropTypes.number,
  closedTask: PropTypes.number,
  rejected: PropTypes.number,
  borderColor: PropTypes.string,
  onPress: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  cardWrapper: {
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 1,
  },
  card: {
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333333',
  },
  tasksContainer: {
    marginTop: 5,
  },
  taskLabel: {
    fontSize: 13,
    fontWeight: '400',
    color: '#666666',
  },
  taskValue: {
    fontWeight: '700',
  },
  imageContainer: {
    width: '30%',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  image: {
    position: 'absolute',
    width: 80,
    height: 80,
    opacity: 0.5,
    top: 60,
    right: -8,
  },
});

export default TileCardComponent;
