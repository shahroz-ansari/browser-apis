import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactPickerAPI from './pages/ContactPickerAPI';
import Home from './pages/Home';

const App: FC<object> = () => (
  <Router basename="/browser-apis">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact-picker" element={<ContactPickerAPI />} />
    </Routes>
  </Router>
);

export default App;
