import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

// --- Type Definitions ---

interface InfoRowProps {
  label: string;
  value: string | number;
}

// Data can be a displayable item or a divider
type DataItem = {label: string; value: string | number} | {type: 'divider'};

interface DetailsCardProps {
  title: string;
  data: DataItem[];
}

// --- Components ---

const InfoRow: React.FC<InfoRowProps> = ({label, value}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}: </Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const DetailsCard: React.FC<DetailsCardProps> = ({title, data}) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{title}</Text>
      {data.map((item, index) => {
        if ('type' in item && item.type === 'divider') {
          return <View key={`divider_${index}`} style={styles.divider} />;
        }
        if ('label' in item) {
          return (
            <InfoRow key={item.label} label={item.label} value={item.value} />
          );
        }
        return null;
      })}
    </View>
  );
};

// --- Styles ---

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '400',
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },
});

export default DetailsCard;
