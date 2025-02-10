import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from './../components/ui/Card';
import { Button } from './../components/ui/Button';
import { Input } from './../components/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './../components/ui/Tabs';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  collegeId: string;
  adminPassword: string;
  role: 'candidate' | 'examiner' | 'admin';
}

const Register: React.FC = () => {
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    collegeId: '',
    adminPassword: '',
    role: 'candidate',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (userType === 'user' && formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      setLoading(false);
      return;
    }

    try {
      const endpoint = userType === 'user' ? '/auth/register' : '/auth/admin-loginup?collegeId=';                                                                                                                          
      const payload =
        userType === 'user'
          ? formData
          : { collegeId: formData.collegeId, adminPassword: formData.adminPassword };

      const response = await axios.post(`http://localhost:4000${endpoint}`, payload);
      console.log('Registration/Login successful:', response.data);

      if (userType === 'user') {
        const userData = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
        };
        localStorage.setItem('user', JSON.stringify(userData));
      }

      navigate(userType === 'user' ? '/loginup' : '/admin-dashboard');
    } catch (error) {
      console.error('Registration/Login failed:', error);
      setError(
        userType === 'user'
          ? 'Registration failed. Please try again.'
          : 'Admin login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="user"
          onValueChange={(value: string) => setUserType(value as 'user' | 'admin')}
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user">User Registration</TabsTrigger>
            <TabsTrigger value="admin">Admin Login</TabsTrigger>
          </TabsList>

          <TabsContent value="user">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">First Name</label>
                <Input
                  name="firstName"
                  placeholder="Enter your first name"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Last Name</label>
                <Input
                  name="lastName"
                  placeholder="Enter your last name"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Email Address</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                >
                  <option value="candidate">Candidate</option>
                  <option value="examiner">Examiner</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Registering...' : 'Sign Up'}
              </Button>

              <p className="text-sm text-center mt-4">
                Already have an account?{' '}
                <a href="/login" className="text-blue-600 hover:underline">
                  Login
                </a>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="admin">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">College ID</label>
                <Input
                  name="collegeId"
                  placeholder="Enter your college ID"
                  value={formData.collegeId}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Admin Password</label>
                <Input
                  type="password"
                  name="adminPassword"
                  placeholder="Enter admin password"
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && <p className="text-red-500 text-sm">{error}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Admin Login'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default Register;
