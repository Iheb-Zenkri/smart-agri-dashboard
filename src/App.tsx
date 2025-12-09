
import { Routes, Route } from 'react-router-dom';
import Dashboard from './features/dashboard/Dashboard';
import Layout from './components/layout/Layout';
import WeatherDashboard from './features/weather/weatherDashboard';
import ParcelDashboard from './features/parcels/ParcelDashboard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/parcels" element={<ParcelDashboard />} />
        <Route path="/weather" element={<WeatherDashboard />} />
      </Routes>
    </Layout>
  );
}

export default App;