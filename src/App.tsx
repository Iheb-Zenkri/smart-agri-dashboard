
import { Routes, Route } from 'react-router-dom';
import Dashboard from './features/dashboard/Dashboard';
import RecommendationsDashboard from './features/recommendations/RecommendationsDashboard';
import AlertCenter from './features/alerts/AlertCenter';
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
        <Route path="/recommendations" element={<RecommendationsDashboard />} />
        <Route path="/alerts" element={<AlertCenter />} />
      </Routes>
    </Layout>
  );
}

export default App;