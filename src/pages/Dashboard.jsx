import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiPlus, FiEdit2, FiTrash2, FiUsers, FiBriefcase, FiCalendar } = FiIcons;

function Dashboard() {
  const { user } = useAuth();
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCharts();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchCharts = async () => {
    const { data, error } = await supabase
      .from('charts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching charts:', error);
    } else {
      setCharts(data);
    }
    setLoading(false);
  };

  const deleteChart = async (id) => {
    if (confirm('Are you sure you want to delete this chart?')) {
      const { error } = await supabase
        .from('charts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting chart:', error);
      } else {
        setCharts(charts.filter(chart => chart.id !== id));
      }
    }
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <SafeIcon icon={FiUsers} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Welcome to Accountability Chart Maker
        </h2>
        <p className="text-gray-600 mb-6">
          Sign in to create and manage your EOS accountability charts
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign In to Get Started
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Accountability Charts
          </h1>
          <p className="text-gray-600">
            Create and manage your organizational accountability charts
          </p>
        </div>
        <Link to="/builder" className="btn btn-primary flex items-center space-x-2">
          <SafeIcon icon={FiPlus} className="w-4 h-4" />
          <span>New Chart</span>
        </Link>
      </div>

      {charts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <SafeIcon icon={FiBriefcase} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No charts yet
          </h3>
          <p className="text-gray-600 mb-6">
            Create your first accountability chart to get started
          </p>
          <Link to="/builder" className="btn btn-primary">
            Create Your First Chart
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {charts.map((chart) => (
            <div key={chart.id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {chart.title}
                  </h3>
                  <div className="flex items-center text-sm text-gray-500 space-x-4">
                    <span className="flex items-center space-x-1">
                      <SafeIcon icon={FiCalendar} className="w-4 h-4" />
                      <span>{new Date(chart.created_at).toLocaleDateString()}</span>
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/chart/${chart.id}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <SafeIcon icon={FiEdit2} className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => deleteChart(chart.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <SafeIcon icon={FiTrash2} className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 text-sm">
                {chart.description || 'No description'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;