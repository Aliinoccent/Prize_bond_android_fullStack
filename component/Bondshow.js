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
    const [refreshing,setRefreshing]=useState(false);
    const handelSaveBond = () => {
        setsaveBond(Savedone);
        const onRefresh = () => {
            setRefreshing(true);
            // Simulate a network request or other operation
            setTimeout(() => {
                handelSaveBond(); // Reuse the same handler to reset the bonds
                setRefreshing(false); // Stop the refreshing animation
            }, 1000); // 1 second delay to mimic an API call
        };
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