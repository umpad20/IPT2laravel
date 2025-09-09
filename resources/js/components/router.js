// router.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;