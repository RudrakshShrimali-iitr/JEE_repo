import { Users } from 'lucide-react';
export default function ResultsManagement() {
  const results = [
    { id: 1, name: 'John Doe', score: 85 },
    { id: 2, name: 'Jane Smith', score: 92 },
    { id: 3, name: 'Alice Johnson', score: 78 },
  ];
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <Users className="w-6 h-6 mr-2 text-indigo-600" />
        Results Management
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2">ID</th>
              <th className="py-2">Name</th>
              <th className="py-2">Score</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result) => (
              <tr key={result.id} className="border-b">
                <td className="py-2">{result.id}</td>
                <td className="py-2">{result.name}</td>
                <td className="py-2">{result.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}