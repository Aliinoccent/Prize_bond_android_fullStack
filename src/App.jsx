
import React, { useEffect, useState } from 'react';
import Navigation from '../component/Admin_Navigation';
import ActiveRouteContext from '../hooks/ActiveRoute';
import SplashScreen from 'react-native-splash-screen';
function App() {
  const [activeRoute, setActiveRoute] = useState('GeastDashbord')
useEffect(()=>{
  
  SplashScreen.hide();
},[]);
  return (
    <ActiveRouteContext.Provider value={[activeRoute, setActiveRoute]}>
      <Navigation />
    </ActiveRouteContext.Provider>
  );
}
export default App;
