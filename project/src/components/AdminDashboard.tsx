import React, { useState, useRef } from 'react';
import { Upload, Users, MessageSquare, CheckCircle2 } from 'lucide-react';

type Tab = 'upload' | 'results' | 'feedback';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [feedback, setFeedback] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = [
    { id: 1, name: 'John Doe', score: 85 },
    { id: 2, name: 'Jane Smith', score: 92 },
    { id: 3, name: 'Alice Johnson', score: 78 },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputRef.current?.files?.length) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', inputRef.current.files[0]);

    setUploading(true);
    setUploadSuccess(null);

    try {
      const response = await fetch('http://localhost:4000/upload', {
        method: 'POST',
        body: formData,
      });
      const result = await response.text();
      console.log(result);

      if (response.ok) {
        setUploadSuccess(true);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
        console.log('File uploaded successfully');
      } else {
        setUploadSuccess(false);
        console.error('Error uploading file');
      }
    } catch (error) {
      setUploadSuccess(false);
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFeedbackSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
    console.log('Submitting feedback:', feedback);
    setFeedback('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {showSuccess && (
          <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-fade-in">
            <CheckCircle2 size={20} />
            <span>Action completed successfully!</span>
          </div>
        )}

        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-8">Manage your questions, results, and feedback</p>

        <div className="flex space-x-2 rounded-xl bg-white/50 backdrop-blur-sm p-1.5 mb-8 shadow-lg">
          <button
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
            }`}
            onClick={() => setActiveTab('upload')}
          >
            <Upload size={20} />
            <span>Question Upload</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'results'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
            }`}
            onClick={() => setActiveTab('results')}
          >
            <Users size={20} />
            <span>Results Management</span>
          </button>
          <button
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all duration-200 ${
              activeTab === 'feedback'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md transform scale-105'
                : 'text-gray-600 hover:text-gray-800 hover:bg-white/80'
            }`}
            onClick={() => setActiveTab('feedback')}
          >
            <MessageSquare size={20} />
            <span>Feedback</span>
          </button>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 transition-all duration-500">
          {activeTab === 'upload' && (
            <form onSubmit={handleUpload} className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Upload size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Upload Question File</h2>
                  <p className="text-gray-600">Select and upload your question file</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="border-2 border-dashed border-blue-200 rounded-xl p-8 text-center hover:border-blue-400 transition-colors">
                  <input
                    ref={inputRef}
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".txt,.doc,.docx,.jpeg"
                    required
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer block"
                  >
                    <Upload size={32} className="mx-auto mb-4 text-blue-500" />
                    <span className="text-gray-600">
                      {fileName ? fileName : 'Drop your file here or click to browse'}
                    </span>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  disabled={uploading}
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
              {uploadSuccess === true && <p className="text-green-600 mt-2">File uploaded successfully!</p>}
              {uploadSuccess === false && <p className="text-red-600 mt-2">Failed to upload file. Please try again.</p>}
            </form>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Users size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Results Management</h2>
                  <p className="text-gray-600">View and manage student results</p>
                </div>
              </div>
              <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-blue-50 to-blue-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-gray-600">#{result.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{result.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            result.score >= 90 ? 'bg-green-100 text-green-800' :
                            result.score >= 80 ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {result.score}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare size={24} className="text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">Personalized Feedback</h2>
                  <p className="text-gray-600">Provide feedback to students</p>
                </div>
              </div>
              <div className="space-y-4">
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback message here..."
                  className="w-full h-40 px-4 py-3 text-gray-700 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleFeedbackSubmit}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Submit Feedback
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;