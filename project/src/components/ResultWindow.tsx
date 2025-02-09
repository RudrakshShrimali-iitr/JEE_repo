import { Medal, Target, Clock, TrendingUp, Award, CheckCircle2, XCircle, AlertCircle, BarChart3, ArrowUpRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SubjectScore {
  subject: string;
  score: number;
  total: number;
  color: string;
  correct: number;
  wrong: number;
  unattempted: number;
}

export default function ResultWindow() {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("Location state:", location.state);
 
 
  const { timeused } = location.state || { timeSpent: 0 };
  // Default values to avoid runtime errors
  const { Physics = { correct: 0, wrong: 0, unattempted: 30 }, Chemistry = { correct: 0, wrong: 0, unattempted: 30 }, Mathematics = { correct: 0, wrong: 0, unattempted: 30} } = location.state || {};

  console.log("Received scores:", Physics, Chemistry, Mathematics);

  const scores: SubjectScore[] = [
    { subject: 'Physics', score: (4 * Physics.correct - Physics.wrong), total: 120, color: 'from-blue-500 to-blue-600', correct: Physics.correct, wrong: Physics.wrong, unattempted: 30-Physics.correct-Physics.wrong },
    { subject: 'Chemistry', score: (4 * Chemistry.correct - Chemistry.wrong), total: 120, color: 'from-green-500 to-green-600', correct: Chemistry.correct, wrong: Chemistry.wrong, unattempted: 30-Chemistry.correct-Chemistry.wrong },
    { subject: 'Mathematics', score: (4 * Mathematics.correct - Mathematics.wrong), total: 120, color: 'from-purple-500 to-purple-600', correct: Mathematics.correct, wrong: Mathematics.wrong, unattempted: 30-Mathematics.correct-Mathematics.wrong },
  ];

  // Calculate total score, total possible, and percentage
  const totalScore = scores.reduce((acc, curr) => acc + curr.score, 0);
  const totalPossible = scores.reduce((acc, curr) => acc + curr.total, 0);
  const percentage = ((totalScore / totalPossible) * 100).toFixed(1);

  // Calculate strongest and weakest subjects
  const strongestSubject = scores.reduce((prev, curr) => (curr.score > prev.score ? curr : prev)).subject;
  const weakestSubject = scores.reduce((prev, curr) => (curr.score < prev.score ? curr : prev)).subject;

  // Calculate accuracy
  const totalCorrect = scores.reduce((acc, curr) => acc + curr.correct, 0);
  const totalAttempted = scores.reduce((acc, curr) => acc + curr.correct + curr.wrong, 0);
  const accuracy = ((totalCorrect / totalAttempted) * 100).toFixed(1);
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">JEE Mock Test Results</h1>
              <p className="text-gray-600">Test Date: {new Date().toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Medal className="w-8 h-8 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
            </div>
          </div>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Overall Score</h3>
              <Target className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">
              {totalScore}<span className="text-lg text-gray-500">/{totalPossible}</span>
            </div>
            <div className="mt-2 flex items-center text-green-600">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span className="text-sm">Top 5% of test takers</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Time Spent</h3>
              <Clock className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">{formatTime(timeused)}</div>
            <div className="mt-2 text-gray-600 text-sm">Average time per question: 2.5 min</div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-700">Accuracy</h3>
              <TrendingUp className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-3xl font-bold text-indigo-600">{accuracy}%</div>
            <div className="mt-2 text-gray-600 text-sm">{totalCorrect} correct out of {totalAttempted} attempts</div>
          </div>
        </div>

        {/* Subject-wise Analysis */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Subject-wise Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scores.map((data) => (
              <div key={data.subject} className="space-y-4">
                <h3 className="text-lg font-semibold capitalize text-gray-700">{data.subject}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      <span className="text-gray-600">Correct</span>
                    </div>
                    <span className="font-semibold">{data.correct}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <XCircle className="w-5 h-5 text-red-500 mr-2" />
                      <span className="text-gray-600">Incorrect</span>
                    </div>
                    <span className="font-semibold">{data.wrong}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mr-2" />
                      <span className="text-gray-600">Unattempted</span>
                    </div>
                    <span className="font-semibold">{data.unattempted}</span>
                  </div>
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Score</span>
                      <span className="font-bold text-indigo-600">{data.score}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-xl font-bold mb-4 flex items-center">
            <Award className="w-6 h-6 mr-2" />
            Performance Insights
          </h2>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle2 className="w-5 h-5 mr-2 mt-0.5 text-green-300" />
              <span>Strong performance in {strongestSubject} with {Math.max(...scores.map(s => s.score))} score. Keep up the excellent work!</span>
            </li>
            <li className="flex items-start">
              <AlertCircle className="w-5 h-5 mr-2 mt-0.5 text-yellow-300" />
              <span>Consider focusing more on {weakestSubject} topics to improve overall score.</span>
            </li>
            <li className="flex items-start">
              <BarChart3 className="w-5 h-5 mr-2 mt-0.5 text-blue-300" />
              <span>Your speed is above average. Practice more complex problems to maintain this edge.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}