import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import COLORS from '../src/consts/color';
import WinningBondsPopup from './WinningBondsPopup';
import NoBondsEnteredPopup from './manual_search_Popup'; // Import the new popup component
import { prizeContext } from './MnualBondScreen';


const ManualSearchBond = ({ setPrizeBond, PrizeBond }) => {
  const { firstWin, secondWin, thirdWin, boxValuesSet ,firstWinAmount,secondWinAmount,thirdWinAmount,bondNumber} = useContext(prizeContext);
console.log(PrizeBond,'prizebond type')
  const [text, setText] = useState('');
  const [data, setData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [firstWinCount, setFirstWinCount] = useState(0);
  const [secondWinCount, setSecondWinCount] = useState(0);
  const [thirdWinCount, setThirdWinCount] = useState(0);
  const [winningBonds, setWinningBonds] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [noBondsEnteredVisible, setNoBondsEnteredVisible] = useState(false); // State for the no bonds popup

  useEffect(() => {
    if (PrizeBond.length > 0) {
      calculatePrizes();
    }
  }, [PrizeBond]);

  const calculatePrizes = () => {
    let amount = 0;
    let firstCount = 0;
    let secondCount = 0;
    let thirdCount = 0;
    let winningBondsList = [];

    const bonds = PrizeBond.map(bond => bond.toString());
    console.log(bonds,'bonds print for checking');
    console.log(bondNumber,'undefine or not');
    bonds.forEach(bond => {
      if (firstWin.includes(bond)) {
        amount += firstWinAmount;
        firstCount += 1;
        winningBondsList.push({ bondNumber, bond, prize: firstWinAmount }); // Adding bondNumber
      }
      if (secondWin.includes(bond)) {
        amount += secondWinAmount;
        secondCount += 1;
        winningBondsList.push({ bondNumber, bond, prize: secondWinAmount }); // Adding bondNumber
      }
      if (thirdWin.includes(bond)) {
        amount += thirdWinAmount;
        thirdCount += 1;
        winningBondsList.push({ bondNumber, bond, prize: thirdWinAmount }); // Adding bondNumber
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
  };

  const addItem = () => {
    if (/^\d{6}$/.test(text)) {
      setData([...data, text]);
      setText('');
    } else {
      Alert.alert('Error', 'Please enter a valid 6-digit bond number');
    }
  };

  const removeItem = (index) => {
    setData(data.filter((_, i) => i !== index));
  };

  const checkItems = () => {
    if (data.length === 0) {
      setNoBondsEnteredVisible(true); // Show the no bonds entered popup
     
      return;
    }

    setPrizeBond([...PrizeBond, ...data]);
    console.log('prize bond is ' ,PrizeBond)
    setData([]);
    calculatePrizes();
  };

  const handleCloseNoBondsPopup = () => {
    setNoBondsEnteredVisible(false);
  };

  const handleCloseWinningPopup = () => {
    setModalVisible(false);
    setPrizeBond([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Enter Number"
          keyboardType="numeric"
          maxLength={6}
        />
        <TouchableOpacity style={styles.button} onPress={addItem}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item}</Text>
            <TouchableOpacity onPress={() => removeItem(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <TouchableOpacity style={styles.buttonChekit} onPress={checkItems}>
        <Text style={styles.ButtonCheckitText}>Check it</Text>
      </TouchableOpacity>

      {boxValuesSet && <PopupSelectYear />}
      <WinningBondsPopup visible={modalVisible} winningBonds={winningBonds} onClose={handleCloseWinningPopup} />
      <NoBondsEnteredPopup visible={noBondsEnteredVisible} onClose={handleCloseNoBondsPopup} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  inputContainer: {
    flexDirection: 'row',
    height: 40,
    width: 'auto',
    alignItems: 'center',
    marginBottom: 20,
    paddingLeft: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 20,
    marginRight: 10,
    borderRadius: 20,
    color: 'black',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  itemText: {
    fontSize: 20,
    color: 'black',
  },
  button: {
    backgroundColor: COLORS.blue,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 25,
  },
  buttonChekit: {
    backgroundColor: COLORS.blue,
    height: '8%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ButtonCheckitText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  removeButton: {
    color: 'red',
  },
});

export default ManualSearchBond;
