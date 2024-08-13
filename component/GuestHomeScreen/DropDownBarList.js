import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import PopupSelectYear from "./PopupSelectYear";
import { useRoute } from "@react-navigation/native";
import { prizeContext } from "./MnualBondScreen";
import COLORS from "../src/consts/color";

const DropDownBarList = ({ PrizeBond }) => {
  const { thirdWin, setThirdWin, firstWin, setFirstWin, secondWin, setSecondWin } = useContext(prizeContext);
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(true);

  const route = useRoute();
  const { bondNumber } = route.params;

  const fetchYears = async () => {
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/List/getList?month=&year=&type=${bondNumber}`);
      if (response.ok) {
        const data = await response.json();
        setYears(data.data.year['$in']);
      } else {
        console.log('No response from API');
      }
    } catch (error) {
      console.log('Response not handled:', error);
    }
  };

  const fetchMonths = async (year) => {
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/List/getList?month=&year=${year}&type=${bondNumber}`);
      if (response.ok) {
        const data = await response.json();
        setMonths(data.data.month['$in']);
        console.log(response, 'this is response');
      } else {
        console.log('No response from API');
      }
    } catch (error) {
      console.log('Response not handled:', error);
    }
  };

  const fetchPrizeBonds = async (year, month) => {
    try {
      const response = await fetch(`https://prize-bond-backend.vercel.app/api/v1/List/getList?month=${month}&year=${year}&type=${bondNumber}`);
      if (response.ok) {
        const data = await response.json();
        console.log(data, 'this is data');
        if (data.data.length > 0) {
          setThirdWin(data.data[0].ThirdWin);
          setFirstWin(data.data[0].FirstWin);
          setSecondWin(data.data[0].SecondWin);
        } else {
          setThirdWin([]);
          setFirstWin([]);
          setSecondWin([]);
        }
      } else {
        console.log('other list is here');
      }
    } catch (error) {
      console.log('Response not handled:', error);
    }
  };

  useEffect(() => {
    fetchYears();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      fetchMonths(selectedYear);
    }
  }, [selectedYear]);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      fetchPrizeBonds(selectedYear, selectedMonth);
    }
  }, [selectedYear, selectedMonth]);

  const handleFetchPrizeBonds = () => {
    if (selectedYear && selectedMonth) {
      fetchPrizeBonds(selectedYear, selectedMonth);
      setIsModalVisible(false);
    }
  };

  const modifyList = () => {
    return thirdWin.sort((a, b) => a - b) || [];
  };

  const showList = (sortedList) => {
    const secondNumbers = secondWin.join('    ');

    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 20, color: COLORS.blue, fontWeight: '900' }}>FIRST PRIZE BOND</Text>
        <Text style={{ color: COLORS.blue, fontSize: 16, fontWeight: 'bold', marginTop: 10 ,padding:20,backgroundColor:'#f0f0f0'}}>{firstWin}</Text>
        <Text style={{ fontSize: 20, color: COLORS.blue, fontWeight: 'bold', marginTop: 10 }}>Second Prize of {secondWin.length} Winners</Text>
        <Text style={{ color: COLORS.blue, fontSize: 16, fontWeight: 'bold', marginTop: 10,padding:10,backgroundColor:'#f0f0f0' }}>{secondNumbers}</Text>
        <Text style={{ fontSize: 20, color: COLORS.blue, fontWeight: 'bold', marginTop: 10 }}>3rd Prize of {thirdWin.length} Winners</Text>
        <FlatList
          data={sortedList}
          keyExtractor={(element, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={{ fontWeight: 'bold', fontSize: 13, color: 'black', }}>{item}</Text>
            </View>
          )}
          numColumns={4}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <PopupSelectYear
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        years={years}
        months={months}
        onSelectYear={setSelectedYear}
        onSelectMonth={setSelectedMonth}
        selectedYear={selectedYear}
        selectedMonth={selectedMonth}
        functionHandel={handleFetchPrizeBonds}
      />
      {showList(modifyList())}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  item: {
    flex: 1,
    
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 8 ,
  },
});

export default DropDownBarList;
