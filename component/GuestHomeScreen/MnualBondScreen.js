
import { View } from 'react-native';
import ManualSearchBond from './manualSearch';
import DropDownBarList from './DropDownBarList';
import { useEffect, useState } from 'react';
import { createContext } from 'react';
import RangeNumbersUi from './rangenumbers';
// const {number,setnumbers}=useState([]);

const prizeContext=createContext();
const ManualBondClik = ({route}) => {// its check the name of navigation if user click the manual bond then move manual search or if click list from gast dashbrd then in manualbond click has to move list navigation
  const {bondType,bondNumber}= route.params;
  let [prizebond, setPrizeBond] = useState([]);
    const [firstWin, setFirstWin] = useState([]);
    const [secondWin, setSecondWin] = useState([]);
    const [thirdWin, setThirdWin] = useState([]);
    const [firstWinAmount, setFirstWinAmount] = useState(0);
    const [secondWinAmount, setSecondWinAmount] = useState(0);
    const [thirdWinAmount, setThirdWinAmount] = useState(0);
    

  
    
    // console.log('hello worlds')
    useEffect(() => {
      
      console.log(bondType, 'this type is checked');//manual4
      console.log(bondNumber,'this number is checked')
      
      // Fetch or update data based on bondType and bondNumber here
    }, [bondType]);
  console.log(bondType,'this type is checked');
    if(bondType=='manual'){return (
      <prizeContext.Provider value={{
        firstWin,
        setFirstWin,
        secondWin,
        setSecondWin,
        thirdWin,
        setThirdWin,
        firstWinAmount,
        setFirstWinAmount,
        secondWinAmount,
        setSecondWinAmount,
        thirdWinAmount,
        setThirdWinAmount,
        bondNumber
    }}>
       <View style={{ flex: 1 }}>
          <DropDownBarList PrizeBond={prizebond} />
        </View>
        <View style={{ flex: 30 }}>
          <ManualSearchBond setPrizeBond={setPrizeBond} PrizeBond={prizebond} />
        </View>
       
        </prizeContext.Provider>
    )}
    if(bondType==='lists'){
      return (
        <prizeContext.Provider value={{
          firstWin,
          setFirstWin,
          secondWin,
          setSecondWin,
          thirdWin,
          setThirdWin,
          firstWinAmount,
          setFirstWinAmount,
          secondWinAmount,
          setSecondWinAmount,
          thirdWinAmount,
          setThirdWinAmount,
          bondNumber
      }}>
          <View style={{ flex: 40 }}>
             <DropDownBarList PrizeBond={prizebond} />
           </View>
           <View style={{ flex: 1,display:'none' }}>
             <ManualSearchBond setPrizeBond={setPrizeBond} PrizeBond={prizebond} />
           </View>
          
           </prizeContext.Provider>
      )
    }
    if(bondType==='range'){
      return (
        <prizeContext.Provider value={{thirdWin,setThirdWin,firstWin,setFirstWin,secondWin,setSecondWin,bondNumber}}>
          <View style={{ flex:1}}>
             <DropDownBarList PrizeBond={prizebond} />
           </View>
           <View style={{ flex: 30 ,display:'none'}}>
             <ManualSearchBond setPrizeBond={setPrizeBond} PrizeBond={prizebond}/>
           </View>
           <View style={{ flex: 30,backgroundColor:'white'}}>
             <RangeNumbersUi  setPrizeBond={setPrizeBond} />
           </View>
          
           </prizeContext.Provider>
      )
    }
    
}

export default ManualBondClik;
export {prizeContext}