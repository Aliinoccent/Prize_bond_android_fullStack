import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState, createContext } from "react";
import { Text } from "react-native";
import SearchBar from "./searchbar";
import NumberShow from "./bondnumbershow";

const BondContext = createContext();

const BondGet = () => {
    const router = useRoute();
    const saveBond = router.params.saveBond;
    const bondType = router.params.BondType; // Extract BondType from route parameters

    const Savedone = saveBond.map(bond => bond.PrizeBondNumber).flat();
    console.log("BondType:", bondType); // You can use this BondType wherever needed

    const [saveBonds, setsaveBond] = useState([]);
    const [searchData, setSearchData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const handelSaveBond = () => {
        setsaveBond(Savedone);
    };

    const onRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            handelSaveBond(); // Reuse the same handler to reset the bonds
            setRefreshing(false); // Stop the refreshing animation
        }, 1000); // 1 second delay to mimic an API call
    };

    useEffect(() => {
        handelSaveBond();
    }, []);

    return (
        <BondContext.Provider value={{ searchData, setSearchData,bondType }}>
            <>
                <SearchBar />
                <NumberShow data={saveBonds } />
                
            </>
        </BondContext.Provider>
    );
};

export default BondGet;
export { BondContext };
