import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import COLORS from '../src/consts/color';
import { prizeContext } from './MnualBondScreen';
import WinningBondsPopup from './WinningBondsPopup';

const RangeNumberUi = ({ setPrizeBond }) => {
  const [startRange, setStartRange] = useState('');
  const [endRange, setEndRange] = useState('');
  const [rangeArray, setRangeArray] = useState([]);
  const { firstWin, secondWin, thirdWin, boxValuesSet, firstWinAmount, secondWinAmount, thirdWinAmount, bondNumber } = useContext(prizeContext);

  const [totalAmount, setTotalAmount] = useState(0);
  const [firstWinCount, setFirstWinCount] = useState(0);
  const [secondWinCount, setSecondWinCount] = useState(0);
  const [thirdWinCount, setThirdWinCount] = useState(0);
  const [winningBonds, setWinningBonds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleButtonPress = () => {
    if (startRange === '' || endRange === '') {
      Alert.alert('Empty Field', 'Range values must be entered');
      return false;
    }

    if (!/^\d{6}$/.test(startRange) || !/^\d{6}$/.test(endRange)) {
      Alert.alert('Invalid Input', 'Both start and end ranges must be exactly 6 digits');
      return false;
    }

    const start = startRange.padStart(6, '0');
    const end = endRange.padStart(6, '0');

    if (parseInt(start, 10) > parseInt(end, 10)) {
      Alert.alert('Invalid Range', 'Start range must be less than or equal to end range.');
      return false;
    }

    const rangeValues = [];
    for (let i = parseInt(start, 10); i <= parseInt(end, 10); i++) {
      rangeValues.push(i.toString().padStart(6, '0'));
    }

    setRangeArray(rangeValues);
    return true;
  };

  const calculatePrizes = () => {
    setLoading(true);
    let amount = 0;
    let firstCount = 0;
    let secondCount = 0;
    let thirdCount = 0;
    let winningBondsList = [];

    rangeArray.forEach(bond => {
      if (firstWin.includes(bond)) {
        amount += firstWinAmount;
        firstCount += 1;
        winningBondsList.push({ bondNumber, bond,  });
      }
      if (secondWin.includes(bond)) {
        amount += secondWinAmount;
        secondCount += 1;
        winningBondsList.push({ bondNumber, bond,  });
      }
      if (thirdWin.includes(bond)) {
        amount += thirdWinAmount;
        thirdCount += 1;
        winningBondsList.push({ bondNumber, bond,  });
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
    setModalVisible(true);
    setLoading(false);
  };

  useEffect(() => {
    if (rangeArray.length > 0) {
      calculatePrizes();
    }
  }, [rangeArray]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setPrizeBond([]);
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
          placeholderTextColor={COLORS.placeholder}
        />
        <TextInput
          style={styles.input}
          placeholder="End Range"
          value={endRange}
          onChangeText={setEndRange}
          keyboardType="numeric"
          maxLength={6}
          placeholderTextColor={COLORS.placeholder}
        />
        <Button title="Submit" onPress={handlePress} color={COLORS.blue} />
      </View>
      {loading && <ActivityIndicator size="large" color={COLORS.blue} style={styles.loader} />}
      <WinningBondsPopup visible={modalVisible} winningBonds={winningBonds} onClose={handleCloseModal} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  box: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: COLORS.text,
  },
  loader: {
    marginTop: 20,
  },
});

export default RangeNumberUi;
