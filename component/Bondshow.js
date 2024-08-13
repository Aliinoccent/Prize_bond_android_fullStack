import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import SearchBar from "./searchbar";
import NumberShow from "./bondnumbershow";
import { createContext } from "react";
const BondContext = createContext();
const BondGet = () => {
    const router = useRoute();
    const saveBound = router.params.saveBond;
    // console.log(saveBound)
    const Savedone = saveBound.map(bond => (bond.PrizeBondNumber)).flat();
    console.log(Savedone);

    const [saveBonds, setsaveBond] = useState([])
    const [searchData,setSearchData]=useState(null);
    const handelSaveBond = () => {
        setsaveBond(Savedone);
    }
    useEffect(() => {
        handelSaveBond();
    }, [])
    return (
        <BondContext.Provider value={{searchData, setSearchData}}>
            <>
                <SearchBar />
                <NumberShow data={saveBonds} />

            </>
        </BondContext.Provider>
    )
}
export default BondGet;
export { BondContext };