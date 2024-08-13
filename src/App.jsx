
import React, { useState } from 'react';
import Navigation from '../component/Admin_Navigation';
import ActiveRouteContext from '../hooks/ActiveRoute';

function App() {
  const [activeRoute, setActiveRoute] = useState('GeastDashbord')

  return (
    <ActiveRouteContext.Provider value={[activeRoute, setActiveRoute]}>
      <Navigation />
    </ActiveRouteContext.Provider>
  );
}
export default App;
