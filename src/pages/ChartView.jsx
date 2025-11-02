import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiEdit, FiArrowLeft, FiDownload, FiUser, FiTarget, FiTrendingUp } = FiIcons;

function ChartView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [chart, setChart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChart();
  }, [id]);

  const fetchChart = async () => {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching chart:', error);
    } else {
      setChart(data);
    }
    setLoading(false);
  };

  const exportToJSON = () => {
    const dataStr = JSON.stringify(chart, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${chart.title.replace(/\s+/g, '_')}_chart.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!chart) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Chart not found
        </h2>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

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
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {chart.title}
            </h1>
            {chart.description && (
              <p className="text-gray-600 mt-1">{chart.description}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={exportToJSON}
            className="btn btn-secondary flex items-center space-x-2"
          >
            <SafeIcon icon={FiDownload} className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button
            onClick={() => navigate(`/builder?edit=${id}`)}
            className="btn btn-primary flex items-center space-x-2"
          >
            <SafeIcon icon={FiEdit} className="w-4 h-4" />
            <span>Edit</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {chart.positions && chart.positions.map((position, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {position.title || 'Untitled Position'}
                  </h3>
                  {position.name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <SafeIcon icon={FiUser} className="w-4 h-4 mr-1" />
                      {position.name}
                    </div>
                  )}
                </div>
              </div>

              {position.responsibilities && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <SafeIcon icon={FiTarget} className="w-4 h-4 mr-1" />
                    Responsibilities
                  </h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {position.responsibilities}
                  </p>
                </div>
              )}

              {position.kpis && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <SafeIcon icon={FiTrendingUp} className="w-4 h-4 mr-1" />
                    Key Performance Indicators
                  </h4>
                  <p className="text-sm text-gray-600 whitespace-pre-line">
                    {position.kpis}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ChartView;