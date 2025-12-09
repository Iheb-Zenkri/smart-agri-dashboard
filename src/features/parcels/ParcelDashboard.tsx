import { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  X,
  Save
} from 'lucide-react';
import { useAllParcels, useCreateParcel, useDeleteParcel, useUpdateParcel } from '../../hooks/useParcels';


const ParcelDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<any>(null);

  const { data: parcels, isLoading } = useAllParcels();
  const createParcel = useCreateParcel();
  const updateParcel = useUpdateParcel();
  const deleteParcel = useDeleteParcel();

  const filteredParcels = parcels?.filter((parcel: any) =>
    parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parcel.soilType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (parcel: any) => {
    setSelectedParcel(parcel);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this parcel?')) {
      deleteParcel.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-2">
            Parcels Management
          </h1>
          <p className="text-gray-400">
            Manage your agricultural parcels - REST API
          </p>
        </div>

        {/* Actions Bar */}
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
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40"
            >
              <Plus className="w-5 h-5" />
              New Parcel
            </button>
          </div>
        </div>

        {/* Parcels Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
            <span className="ml-3 text-gray-400">Loading parcels...</span>
          </div>
        ) : filteredParcels && filteredParcels.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredParcels.map((parcel: any) => (
              <ParcelCard
                key={parcel.id}
                parcel={parcel}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              No parcels found
            </h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Create your first parcel to get started'}
            </p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <ParcelModal
          title="Create New Parcel"
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(data) => {
            createParcel.mutate(data);
            setIsCreateModalOpen(false);
          }}
          isLoading={createParcel.isPending}
        />
      )}

      {/* Edit Modal */}
      {isEditModalOpen && selectedParcel && (
        <ParcelModal
          title="Edit Parcel"
          initialData={selectedParcel}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedParcel(null);
          }}
          onSubmit={(data) => {
            updateParcel.mutate({ id: selectedParcel.id, data });
            setIsEditModalOpen(false);
            setSelectedParcel(null);
          }}
          isLoading={updateParcel.isPending}
        />
      )}
    </div>
  );
};

// ============================================================================
// Parcel Card Component
// ============================================================================

type ParcelCardProps = {
  parcel: any;
  onEdit: (parcel: any) => void;
  onDelete: (id: number) => void;
};

const ParcelCard = ({ parcel, onEdit, onDelete }: ParcelCardProps) => {
  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 p-6 hover:border-blue-500/50 transition-all group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
            <MapPin className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-100">{parcel.name}</h3>
            <p className="text-sm text-gray-400">{parcel.location}</p>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3 mb-4">
        <DetailRow label="Surface Area" value={`${parcel.surfaceArea} hectares`} />
        <DetailRow label="Soil Type" value={parcel.soilType} />
        <DetailRow label="Current Crop" value={parcel.cropType} />
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-slate-700">
        <button
          onClick={() => onEdit(parcel)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors"
        >
          <Edit2 className="w-4 h-4" />
          Edit
        </button>
        <button
          onClick={() => onDelete(parcel.id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-400">{label}:</span>
    <span className="text-sm font-semibold text-gray-200">{value}</span>
  </div>
);

// ============================================================================
// Parcel Modal Component
// ============================================================================

type ParcelModalProps = {
  title: string;
  initialData?: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
};

const ParcelModal = ({ title, initialData, onClose, onSubmit, isLoading }: ParcelModalProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    location: initialData?.location || '',
    surfaceArea: initialData?.surfaceArea || '',
    soilType: initialData?.soilType || '',
    cropType: initialData?.cropType || ''
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl shadow-2xl border border-slate-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-2xl font-bold text-gray-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Parcel Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., North Field"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., Sector A"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Surface Area (hectares)
            </label>
            <input
              type="number"
              name="surfaceArea"
              value={formData.surfaceArea}
              onChange={handleChange}
              step="0.1"
              min="0"
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., 12.5"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Soil Type
            </label>
            <select
              name="soilType"
              value={formData.soilType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">Select soil type</option>
              <option value="Clay">Clay</option>
              <option value="Loam">Loam</option>
              <option value="Sandy">Sandy</option>
              <option value="Silt">Silt</option>
              <option value="Peaty">Peaty</option>
              <option value="Chalky">Chalky</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-2">
              Current Crop Type
            </label>
            <input
              type="text"
              name="cropType"
              value={formData.cropType}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              placeholder="e.g., Wheat"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-lg transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Parcel
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParcelDashboard;