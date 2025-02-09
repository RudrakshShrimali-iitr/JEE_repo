import { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
export default function PersonalizedFeedback() {
  const [feedback, setFeedback] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim()) {
      toast.success('Feedback submitted successfully!');
      setFeedback('');
    } else {
      toast.error('Please enter feedback before submitting.');
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <MessageSquare className="w-6 h-6 mr-2 text-indigo-600" />
        Personalized Feedback
      </h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Enter personalized feedback..."
          rows={4}
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 
            transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Submit Feedback
        </button>
      </form>
    </div>
  );
}