import { useState } from 'react';
import { api } from '../../../services/api';

export function useLogin(onLoginSuccess: (user: any) => void) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please provide both username and password.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/shops/login', { username, password });
      if (response.shop) {
        onLoginSuccess(response.shop);
      } else {
        setError('Login failed. Invalid response from server.');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid username or password.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    username, setUsername,
    password, setPassword,
    showPassword, setShowPassword,
    error, isLoading,
    handleSubmit
  };
}
