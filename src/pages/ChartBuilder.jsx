import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiSave, FiPlus, FiTrash2, FiArrowLeft } = FiIcons;

function ChartBuilder() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [positions, setPositions] = useState([
    { id: 1, title: '', name: '', responsibilities: '', kpis: '' }
  ]);
  const [loading, setLoading] = useState(false);

  const addPosition = () => {
    const newId = Math.max(...positions.map(p => p.id), 0) + 1;
    setPositions([...positions, { 
      id: newId, 
      title: '', 
      name: '', 
      responsibilities: '', 
      kpis: '' 
    }]);
  };

  const updatePosition = (id, field, value) => {
    setPositions(positions.map(pos => 
      pos.id === id ? { ...pos, [field]: value } : pos
    ));
  };

  const removePosition = (id) => {
    if (positions.length > 1) {
      setPositions(positions.filter(pos => pos.id !== id));
    }
  };

  const saveChart = async () => {
    if (!title.trim()) {
      alert('Please enter a chart title');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('charts')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim(),
          positions: positions.filter(p => p.title.trim() || p.name.trim()),
          created_at: new Date().toISOString()
        })
        .select();

      if (error) throw error;
      navigate(`/chart/${data[0].id}`);
    } catch (error) {
      console.error('Error saving chart:', error);
      alert('Error saving chart. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <SafeIcon icon={FiArrowLeft} className="w-4 h-4" />
            <span>Back</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Create Accountability Chart
          </h1>
        </div>
        <button
          onClick={saveChart}
          disabled={loading}
          className="btn btn-primary flex items-center space-x-2"
        >
          <SafeIcon icon={FiSave} className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Chart'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Chart Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chart Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g., Company Accountability Chart"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field"
                  rows={4}
                  placeholder="Brief description of this accountability chart..."
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Positions & Responsibilities
              </h2>
              <button
                onClick={addPosition}
                className="btn btn-secondary flex items-center space-x-2"
              >
                <SafeIcon icon={FiPlus} className="w-4 h-4" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-6">
              {positions.map((position, index) => (
                <div key={position.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Position {index + 1}
                    </h3>
                    {positions.length > 1 && (
                      <button
                        onClick={() => removePosition(position.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Position Title
                      </label>
                      <input
                        type="text"
                        value={position.title}
                        onChange={(e) => updatePosition(position.id, 'title', e.target.value)}
                        className="input-field"
                        placeholder="e.g., CEO, Marketing Manager"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        value={position.name}
                        onChange={(e) => updatePosition(position.id, 'name', e.target.value)}
                        className="input-field"
                        placeholder="Person's name"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Responsibilities
                      </label>
                      <textarea
                        value={position.responsibilities}
                        onChange={(e) => updatePosition(position.id, 'responsibilities', e.target.value)}
                        className="input-field"
                        rows={3}
                        placeholder="List the key responsibilities..."
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Performance Indicators
                      </label>
                      <textarea
                        value={position.kpis}
                        onChange={(e) => updatePosition(position.id, 'kpis', e.target.value)}
                        className="input-field"
                        rows={2}
                        placeholder="List the KPIs for this position..."
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChartBuilder;