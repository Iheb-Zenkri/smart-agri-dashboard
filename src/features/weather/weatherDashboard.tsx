import { useState } from 'react';
import {
  Cloud,
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  Calendar,
  TrendingUp,
  Loader2,
  Sun,
  Search,
  Plus,
} from 'lucide-react';
import { useClimateIndex, useCurrentWeather, useHistoricalWeather } from '../../hooks/useWeather';


const WeatherPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
  const [searchedLocation, setSearchedLocation] = useState('');



  const { data: currentWeather, isLoading: weatherLoading } = useCurrentWeather(searchedLocation, new Date());
  const { data: historicalData, isLoading: historicalLoading } = useHistoricalWeather(
    searchedLocation,
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    new Date()
  );
  const { data: climateIndex, isLoading: climateLoading } = useClimateIndex(searchedLocation, new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            Weather Monitoring
          </h1>
          <p className="text-gray-400">
            Real-time and historical weather data - SOAP API
          </p>
        </div>

        {/* Location Selector */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-100 mb-4 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-yellow-400" />
            Select Location
          </h2>
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 mb-8">
            <div className="flex items-center justify-between gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search parcels by name, location, or soil type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={() => setSearchedLocation(searchTerm)}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
              >
                <Plus className="w-5 h-5" />
                  Search Weather
              </button>
            </div>
        </div>

        </div>

        {searchedLocation && (
          <>
            {/* Current Weather */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                <Sun className="w-6 h-6 text-yellow-400" />
                Current Weather - {searchedLocation}
              </h2>
              
              {weatherLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading weather data...
                </div>
              ) : currentWeather ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Main Weather Card */}
                  <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 rounded-xl p-6 border border-yellow-500/20">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-sm text-gray-400">Temperature</div>
                        <div className="text-5xl font-bold text-yellow-400">
                          {currentWeather.temperatureAvg}°C
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          {currentWeather.temperatureMin}°C - {currentWeather.temperatureMax}°C
                        </div>
                      </div>
                      <div className="text-6xl">
                        {currentWeather.weatherCondition?.includes('Cloudy') ? '⛅' :
                         currentWeather.weatherCondition?.includes('Rain') ? '🌧️' :
                         currentWeather.weatherCondition?.includes('Clear') ? '☀️' : '🌤️'}
                      </div>
                    </div>
                    <div className="text-lg text-gray-300 font-semibold">
                      {currentWeather.weatherCondition}
                    </div>
                    <div className="text-sm text-gray-400">
                      {currentWeather.date}
                    </div>
                  </div>

                  {/* Weather Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <WeatherStatCard
                      icon={<Droplets className="w-5 h-5 text-blue-400" />}
                      label="Humidity"
                      value={`${currentWeather.humidity}%`}
                      color="blue"
                    />
                    <WeatherStatCard
                      icon={<CloudRain className="w-5 h-5 text-cyan-400" />}
                      label="Precipitation"
                      value={`${currentWeather.precipitation} mm`}
                      color="cyan"
                    />
                    <WeatherStatCard
                      icon={<Wind className="w-5 h-5 text-purple-400" />}
                      label="Wind Speed"
                      value={`${currentWeather.windSpeed} km/h`}
                      color="purple"
                    />
                    <WeatherStatCard
                      icon={<Cloud className="w-5 h-5 text-gray-400" />}
                      label="Cloud Cover"
                      value={`${currentWeather.cloudCover}%`}
                      color="gray"
                    />
                  </div>
                </div>
              ) : (
                <p className="text-gray-500">No weather data available</p>
              )}
            </div>

            {/* Climate Indices */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-100 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                Climate Indices
              </h2>
              
              {climateLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading climate data...
                </div>
              ) : climateIndex ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <ClimateIndexCard
                    label="Growing Degree Days"
                    value={climateIndex.growingDegreeDays}
                    unit="GDD"
                    description="Accumulated heat units"
                    color="green"
                  />
                  <ClimateIndexCard
                    label="Evapotranspiration"
                    value={climateIndex.evapotranspiration}
                    unit="mm/day"
                    description="Water loss rate"
                    color="blue"
                  />
                  <ClimateIndexCard
                    label="Drought Index"
                    value={climateIndex.droughtIndex}
                    unit=""
                    description="Water stress level"
                    color="orange"
                    isPercentage
                  />
                  <ClimateIndexCard
                    label="Heat Stress Index"
                    value={climateIndex.heatStressIndex}
                    unit=""
                    description="Crop stress indicator"
                    color="red"
                    isPercentage
                  />
                </div>
              ) : (
                <p className="text-gray-500">No climate data available</p>
              )}
            </div>

            {/* Historical Weather */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-100 flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-cyan-400" />
                  Historical Weather (Last 7 Days)
                </h2>
              </div>
              
              {historicalLoading ? (
                <div className="flex items-center gap-2 text-gray-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Loading historical data...
                </div>
              ) : historicalData && historicalData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Avg Temp</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Precipitation</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Humidity</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-semibold">Conditions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicalData.map((day: any, index: number) => (
                        <tr key={index} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                          <td className="py-3 px-4 text-gray-300">{day.date}</td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-yellow-400 font-semibold">
                              <Thermometer className="w-4 h-4" />
                              {day.temperatureAvg}°C
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-cyan-400 font-semibold">
                              <CloudRain className="w-4 h-4" />
                              {day.precipitation} mm
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="inline-flex items-center gap-1 text-blue-400 font-semibold">
                              <Droplets className="w-4 h-4" />
                              {day.humidity}%
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-gray-400">
                              {day.precipitation > 10 ? '🌧️ Rainy' :
                               day.precipitation > 0 ? '🌤️ Cloudy' : '☀️ Clear'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No historical data available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Helper Components
// ============================================================================

type WeatherStatCardProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'cyan' | 'purple' | 'gray';
};

const WeatherStatCard = ({ icon, label, value, color }: WeatherStatCardProps) => {
  const colorClasses = {
    blue: 'from-blue-500/10 to-blue-600/10 border-blue-500/20',
    cyan: 'from-cyan-500/10 to-cyan-600/10 border-cyan-500/20',
    purple: 'from-purple-500/10 to-purple-600/10 border-purple-500/20',
    gray: 'from-gray-500/10 to-gray-600/10 border-gray-500/20'
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4 border`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-100">{value}</div>
    </div>
  );
};

type ClimateIndexCardProps = {
  label: string;
  value: number;
  unit: string;
  description: string;
  color: 'green' | 'blue' | 'orange' | 'red';
  isPercentage?: boolean;
};

const ClimateIndexCard = ({ label, value, unit, description, color, isPercentage }: ClimateIndexCardProps) => {
  const colorClasses = {
    green: 'from-green-500/10 to-emerald-500/10 border-green-500/30 text-green-400',
    blue: 'from-blue-500/10 to-cyan-500/10 border-blue-500/30 text-blue-400',
    orange: 'from-orange-500/10 to-amber-500/10 border-orange-500/30 text-orange-400',
    red: 'from-red-500/10 to-rose-500/10 border-red-500/30 text-red-400'
  };

  const displayValue = isPercentage ? `${(value * 100).toFixed(0)}%` : value;

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} rounded-lg p-4 border`}>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-3xl font-bold mb-1">
        {displayValue}
        {!isPercentage && unit && <span className="text-lg ml-1">{unit}</span>}
      </div>
      <div className="text-xs text-gray-500">{description}</div>
    </div>
  );
};

export default WeatherPage;