import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Check, X, ChevronDown, ChevronUp, Archive } from 'lucide-react';
import ScrollReveal from '../components/ScrollReveal';
import MapboxCommunityMap from '../components/MapboxCommunityMap';
import { getAllSubmissions } from '../services/submissionService';
import { supabase } from '../lib/supabase';

interface Submission {
  id: string;
  pins: any[];
  form_data: any;
  approved: boolean;
  processed?: boolean; // Optional because existing records may not have this field
  created_at: string;
}

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showProcessed, setShowProcessed] = useState(false);

  const ADMIN_PASSWORD = 'ValeCash2025';

  useEffect(() => {
    if (isAuthenticated) {
      loadSubmissions();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError('Incorrect password');
    }
  };

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch (err) {
      setError('Failed to load submissions');
      console.error('Error loading submissions:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleApproval = async (submissionId: string, currentApproval: boolean) => {
    try {
      const { error } = await supabase
        .from('consultation_submissions')
        .update({ approved: !currentApproval })
        .eq('id', submissionId);

      if (error) {
        console.error('Error updating approval:', error);
        setError('Failed to update approval status');
        return;
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, approved: !currentApproval }
            : sub
        )
      );
    } catch (err) {
      console.error('Error toggling approval:', err);
      setError('Failed to update approval status');
    }
  };

  const toggleProcessed = async (submissionId: string, currentProcessed: boolean) => {
    try {
      const { error } = await supabase
        .from('consultation_submissions')
        .update({ processed: !currentProcessed })
        .eq('id', submissionId);

      if (error) {
        console.error('Error updating processed status:', error);
        setError('Failed to update processed status');
        return;
      }

      // Update local state
      setSubmissions(prev => 
        prev.map(sub => 
          sub.id === submissionId 
            ? { ...sub, processed: !currentProcessed }
            : sub
        )
      );
    } catch (err) {
      console.error('Error toggling processed status:', err);
      setError('Failed to update processed status');
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setPassword('');
    setSubmissions([]);
    setError(null);
  };

  // Separate processed and unprocessed submissions
  // Handle cases where processed field might be undefined (existing records)
  const unprocessedSubmissions = submissions.filter(sub => !sub.processed);
  const processedSubmissions = submissions.filter(sub => sub.processed === true);
  
  // Get all pins from all submissions (approved and unapproved)
  const allPins = submissions.flatMap(submission => submission.pins);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <ScrollReveal direction="up">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
                <p className="text-gray-600 mt-2">Enter password to access admin panel</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center">{error}</div>
                )}

                <button
                  type="submit"
                  className="w-full bg-brand-blue text-white py-3 px-4 rounded-lg font-semibold hover:bg-brand-blue/90 transition-colors"
                >
                  Access Admin Panel
                </button>
              </form>
            </div>
          </ScrollReveal>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-600 mt-1">Manage community suggestions</p>
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-brand-blue">{submissions.length}</div>
            <div className="text-gray-600">Total Submissions</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-green-600">
              {unprocessedSubmissions.filter(s => s.approved).length}
            </div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-yellow-600">
              {unprocessedSubmissions.filter(s => !s.approved).length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-2xl font-bold text-gray-600">
              {processedSubmissions.length}
            </div>
            <div className="text-gray-600">Processed</div>
          </div>
        </div>

        {/* Map */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">All Community Suggestions</h2>
            <p className="text-gray-600 mt-1">Showing all suggestions (approved and pending)</p>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-brand-blue mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading suggestions...</p>
                </div>
              </div>
            ) : allPins.length === 0 ? (
              <div className="h-[500px] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">🗺️</div>
                  <h3 className="text-2xl font-bold text-gray-600 mb-4">No suggestions yet</h3>
                  <p className="text-gray-500">Community suggestions will appear here</p>
                </div>
              </div>
            ) : (
              <div className="h-[500px] rounded-lg overflow-hidden">
                <MapboxCommunityMap pins={allPins} />
              </div>
            )}
          </div>
        </div>

        {/* Submissions List - Unprocessed */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold text-gray-900">Manage Submissions</h2>
            <p className="text-gray-600 mt-1">Approve or reject community suggestions</p>
          </div>
          
          <div className="divide-y">
            {unprocessedSubmissions.length === 0 ? (
              <div className="p-12 text-center">
                <div className="text-4xl mb-4">✅</div>
                <p className="text-gray-600">All submissions have been processed!</p>
              </div>
            ) : (
              unprocessedSubmissions.map((submission) => (
                <div key={submission.id} className="p-6 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          submission.approved 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {submission.approved ? 'Approved' : 'Pending'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(submission.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h3 className="font-medium text-gray-900 mb-2">Suggestions:</h3>
                        <div className="flex flex-wrap gap-2">
                          {submission.pins.map((pin, index) => (
                            <span key={index} className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm">
                              {pin.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleApproval(submission.id, submission.approved)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                          submission.approved
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {submission.approved ? (
                          <>
                            <X size={16} />
                            Reject
                          </>
                        ) : (
                          <>
                            <Check size={16} />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => toggleProcessed(submission.id, submission.processed || false)}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        <Archive size={16} />
                        Mark Processed
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Processed Submissions - Collapsible */}
        {processedSubmissions.length > 0 && (
          <div className="bg-white rounded-lg shadow">
            <button
              onClick={() => setShowProcessed(!showProcessed)}
              className="w-full p-6 border-b flex justify-between items-center hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900">Processed Submissions</h2>
                <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                  {processedSubmissions.length}
                </span>
              </div>
              {showProcessed ? (
                <ChevronUp size={24} className="text-gray-500" />
              ) : (
                <ChevronDown size={24} className="text-gray-500" />
              )}
            </button>
            
            <AnimatePresence>
              {showProcessed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="divide-y">
                    {processedSubmissions.map((submission) => (
                      <div key={submission.id} className="p-6 hover:bg-gray-50 bg-gray-50/50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                submission.approved 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {submission.approved ? 'Approved' : 'Pending'}
                              </span>
                              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-200 text-gray-700">
                                Processed
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(submission.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <div className="mb-3">
                              <h3 className="font-medium text-gray-900 mb-2">Suggestions:</h3>
                              <div className="flex flex-wrap gap-2">
                                {submission.pins.map((pin, index) => (
                                  <span key={index} className="px-3 py-1 bg-brand-blue/10 text-brand-blue rounded-full text-sm">
                                    {pin.label}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-3">
                            <button
                              onClick={() => toggleProcessed(submission.id, submission.processed || false)}
                              className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors"
                            >
                              <Archive size={16} />
                              Unmark Processed
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
