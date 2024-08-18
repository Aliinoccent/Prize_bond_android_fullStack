import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import COLORS from '../src/consts/color';
import { prizeContext } from './MnualBondScreen';
import WinningBondsPopup from './WinningBondsPopup';

const RangeNumberUi = ({ setPrizeBond }) => {
  const [startRange, setStartRange] = useState('');
  const [endRange, setEndRange] = useState('');
  const [rangeArray, setRangeArray] = useState([]);
  const { firstWin, secondWin, thirdWin, boxValuesSet ,firstWinAmount,secondWinAmount,thirdWinAmount,bondNumber} = useContext(prizeContext);

  const [totalAmount, setTotalAmount] = useState(0);
  const [firstWinCount, setFirstWinCount] = useState(0);
  const [secondWinCount, setSecondWinCount] = useState(0);
  const [thirdWinCount, setThirdWinCount] = useState(0);
  const [winningBonds, setWinningBonds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleButtonPress = () => {
    if (startRange === '' || endRange === '') {
      Alert.alert('Empty Field', 'Range values must be entered');
      return false;
    }

    if (!/^\d{6}$/.test(startRange) || !/^\d{6}$/.test(endRange)) {
      Alert.alert('Invalid Input', 'Both start and end ranges must be exactly 6 digits');
      return false;
    }

    // Ensure numeric comparison but keep as strings for leading zero preservation
    const start = startRange.padStart(6, '0'); // Ensure both have the same length
    const end = endRange.padStart(6, '0');

    if (parseInt(start, 10) > parseInt(end, 10)) {
      Alert.alert('Invalid Range', 'Start range must be less than or equal to end range.');
      return false;
    }

    const rangeValues = [];
    for (let i = parseInt(start, 10); i <= parseInt(end, 10); i++) {
      rangeValues.push(i.toString().padStart(6, '0')); // Convert each number to string and pad with leading zeros
    }

    setRangeArray(rangeValues);
    return true;
  };

  const calculatePrizes = () => {
    setLoading(true); // Start loading
    console.log('Calculating prize bonds...');
    let amount = 0;
    let firstCount = 0;
    let secondCount = 0;
    let thirdCount = 0;
    let winningBondsList = [];

    rangeArray.forEach(bond => {
      if (firstWin.includes(bond)) {
        amount += 3000000;
        firstCount += 1;
        console.log('First bond win');
        winningBondsList.push({ bondNumber,bond, prize: '3,000,000' });
      }
      if (secondWin.includes(bond)) {
        amount += 2000000;
        secondCount += 1;
        console.log('Second bond win');
        winningBondsList.push({bondNumber, bond, prize: '2,000,000' });
      }
      if (thirdWin.includes(bond)) {
        amount += 18000;
        thirdCount += 1;
        console.log('Third bond win');
        winningBondsList.push({bondNumber, bond, prize: '18,000' });
      }
    });

    if (winningBondsList.length === 0) {
      winningBondsList.push({ bond: 'No Bonds', prize: 'Sorry, no prize won.' });
    }

    setTotalAmount(amount);
    setFirstWinCount(firstCount);
    setSecondWinCount(secondCount);
    setThirdWinCount(thirdCount);
    setWinningBonds(winningBondsList);
    setModalVisible(true); // Show the modal before resetting PrizeBond
    setLoading(false); // Stop loading
  };

  useEffect(() => {
    if (rangeArray.length > 0) {
      calculatePrizes();
    }
  }, [rangeArray]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setPrizeBond([]); // Reset PrizeBond state after closing the modal
  };

  const handlePress = () => {
    if (handleButtonPress()) {
      calculatePrizes();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <Text style={styles.header}>List Range</Text>
        <TextInput
          style={styles.input}
          placeholder="Start Range"
          value={startRange}
          onChangeText={setStartRange}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor="gray"
        />
        <TextInput
          style={styles.input}
          placeholder="End Range"
          value={endRange}
          onChangeText={setEndRange}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor="gray"
        />
        <Button title="Submit" onPress={handlePress} />
      </View>
      {loading && <ActivityIndicator size="large" color={COLORS.blue} />} 
      <WinningBondsPopup visible={modalVisible} winningBonds={winningBonds} onClose={handleCloseModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  box: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: COLORS.blue,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: 'black'
  },
});

export default RangeNumberUi;
