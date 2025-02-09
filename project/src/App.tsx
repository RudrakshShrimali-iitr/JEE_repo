import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import  { useEffect, useState } from 'react';
import Register from './components/Register';
import LoginPage from './components/LoginPage';
import ExamPage from './components/ExamPage';
import AdminDashboard from './components/AdminDashboard';
import ResultWindow from './components/ResultWindow';

// import axios,{AxiosResponse} from './utils/axios';


function App() {
  // const [data, setData] = useState(null);

  //   useEffect(() => {
  //       // Make an API call to your backend
  //       axios.get('/users')  // Adjust the endpoint as needed
  //           .then((response:AxiosResponse) => {
  //               setData(response.data);
  //           })
  //           .catch((error:unknown) => {
  //               console.error('There was an error fetching the data!', error);
  //           });
  //   }, []);
  return (
    <BrowserRouter>
    {/* <div>Data: {JSON.stringify(data)}</div> */}
      <Routes>
        {/* Default route to LoginPage */}
        <Route path="/" element={<LoginPage />} />

        {/* Route for user registration */}
        <Route path="/register" element={<Register />} />

        {/* Route for the exam page */}
        <Route path="/exam" element={<ExamPage />} />

        {/* Route for the admin dashboard with nested routes */}
        <Route path="/admin/" element={<AdminDashboard />} />
        
        {/* Route for the results page */}
        <Route path="/results*" element={<ResultWindow />} />

        {/* Optional: 404 Not Found Route */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
