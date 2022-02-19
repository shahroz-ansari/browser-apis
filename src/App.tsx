import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ContactPickerAPI from './pages/ContactPickerAPI';
import GeoLocationAPI from './pages/GeoLocationAPI';
import DragDrop from './pages/DragDrop';
import Home from './pages/Home';
import ClipboardAPI from './pages/ClipboardAPI';

const App: FC<object> = () => (
  <Router basename="/browser-apis">
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/contact-picker" element={<ContactPickerAPI />} />
      <Route path="/geolocation" element={<GeoLocationAPI />} />
      <Route path="/drag-drop" element={<DragDrop />} />
      <Route path="/clipboard" element={<ClipboardAPI />} />
    </Routes>
  </Router>
);

export default App;
