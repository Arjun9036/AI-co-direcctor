import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// ✅ Import your image (make sure the path is correct)
import cameraImg from '../assets/camera.png';

const Login = ({ setAuth }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setAuth(true);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #000000 0%, #0a0f24 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: '420px',
          borderRadius: '20px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(20, 20, 20, 0.85)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: '#00bfff',
            fontWeight: 'bold',
            textShadow: '0px 0px 10px rgba(0, 191, 255, 0.5)'
          }}
        >
          LOGIN
        </Typography>

        {/* ✅ IMAGE ABOVE EMAIL & PASSWORD */}
        <Box sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
          <img
            src={cameraImg}
            alt="camera"
            style={{
              width: '150px',
              height: 'auto',
              opacity: 0.9,
              filter: 'drop-shadow(0 0 10px rgba(0,191,255,0.4))',
            }}
          />
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* ✅ FORM */}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#bbb' } }}
            InputProps={{
              style: { color: '#fff' },
              sx: {
                background: '#111',
                borderRadius: 2,
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00bfff' },
                '&.Mui-focused fieldset': { borderColor: '#00bfff' },
              }
            }}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            InputLabelProps={{ style: { color: '#bbb' } }}
            InputProps={{
              style: { color: '#fff' },
              sx: {
                background: '#111',
                borderRadius: 2,
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#00bfff' },
                '&.Mui-focused fieldset': { borderColor: '#00bfff' },
              }
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              background: 'linear-gradient(90deg, #00bfff, #0077ff)',
              fontWeight: 'bold',
              borderRadius: '30px',
              transition: '0.3s',
              '&:hover': {
                transform: 'scale(1.03)',
                background: 'linear-gradient(90deg, #0095cc, #005fcc)',
              }
            }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#000' }} /> : 'Login'}
          </Button>

          <Typography
            align="center"
            sx={{ mt: 2, color: '#aaa' }}
          >
            Don’t have an account?{' '}
            <Link
              to="/signup"
              style={{ color: '#00bfff', textDecoration: 'none', fontWeight: 'bold' }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;