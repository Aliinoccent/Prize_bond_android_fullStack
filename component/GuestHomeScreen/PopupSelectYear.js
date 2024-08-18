import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList, ActivityIndicator } from "react-native";
import COLORS from "../src/consts/color";

const PopupSelectYear = ({
  visible,
  onClose,
  years,
  months,
  onSelectYear,
  onSelectMonth,
  selectedYear,
  selectedMonth,
  functionHandel,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (years.length > 0 || months.length > 0) {
      setLoading(false);
    }
  }, [years, months]);

  const renderItem = ({ item }, type) => (
    <TouchableOpacity
      style={[
        styles.item,
        type === 'year' ? styles.yearItem : styles.monthItem,
        (type === 'year' && item === selectedYear) || (type === 'month' && item === selectedMonth) ? styles.selectedItem : {},
      ]}
      onPress={() => {
        type === 'year' ? onSelectYear(item) : onSelectMonth(item);
      }}
    >
      <Text style={styles.itemText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.headerText}>Select Year</Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.blue} />
          ) : (
            <FlatList
              data={years}
              keyExtractor={(item) => item.toString()}
              renderItem={(props) => renderItem(props, 'year')}
              contentContainerStyle={styles.list}
            />
          )}
          <Text style={styles.headerText}>Select Month</Text>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.blue} />
          ) : (
            <FlatList
              data={months}
              keyExtractor={(item) => item.toString()}
              renderItem={(props) => renderItem(props, 'month')}
              contentContainerStyle={styles.list}
            />
          )}
          <TouchableOpacity style={styles.submitButton} onPress={functionHandel}>
            <Text style={styles.submitButtonText}>Apply</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: COLORS.blue,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  list: {
    width: '100%',
    marginBottom: 20,
  },
  item: {
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  yearItem: {
    backgroundColor: '#e0f7fa',
  },
  monthItem: {
    backgroundColor: '#e8f5e9',
  },
  selectedItem: {
    backgroundColor: COLORS.blue,
  },
  itemText: {
    fontSize: 16,
    color: COLORS.blue,
  },
  submitButton: {
    padding: 15,
    backgroundColor: COLORS.blue,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 15,
    backgroundColor: '#d9534f',
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PopupSelectYear;
