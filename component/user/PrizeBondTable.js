import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const PrizeBondTable = () => {
  const data = [
    { bond: 'Rs. 100', total: 0, lastDraw: '15-05-2024', nextDraw: '15-08-2024', color: '#E57373' },
    { bond: 'Rs. 200', total: 0, lastDraw: '15-03-2024', nextDraw: '17-06-2024', color: '#BA68C8' },
    { bond: 'Rs. 750', total: 12, lastDraw: '15-04-2024', nextDraw: '15-07-2024', color: '#4DB6AC' },
    { bond: 'Rs. 1500', total: 9, lastDraw: '15-05-2024', nextDraw: '15-08-2024', color: '#7986CB' },
  ];

  return (
    <ScrollView horizontal={true}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={styles.headerCell}>Prize Bond</Text>
          <Text style={styles.headerCell}>Total Bonds</Text>
          <Text style={styles.headerCell}>Last Draw</Text>
          <Text style={styles.headerCell}>Next Draw</Text>
        </View>
        {data.map((item, index) => (
          <View key={index} style={[styles.row, { backgroundColor: item.color }]}>
            <Text style={styles.cell}>{item.bond}</Text>
            <Text style={styles.cell}>{item.total}</Text>
            
            <Text style={styles.cell}>{item.lastDraw}</Text>
            <Text style={styles.cell}>{item.nextDraw}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  table: {
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: '#2c3e50',
    padding:10
  },
  headerCell: {
    width: 120,
    padding: 10,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    width: 120,
    padding: 10,
    textAlign: 'center',
    color: '#fff',
  },
});

export default PrizeBondTable;
