'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Iconify from '@/components/iconify';
import { Box, Button, Checkbox, FormControlLabel, IconButton, InputAdornment, Link, TextField, Typography, Paper } from '@mui/material';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleShowPassword = () => setShowPassword((show) => !show);

  const handleRememberMe = (e) => setRememberMe(e.target.checked);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    axios
      .post('/auth/login', { ...form, remember: rememberMe })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          router.push('/');
        }
      })
      .catch((error) => {
        console.error('Login failed:', error);
      });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={handleShowPassword} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold-duotone' : 'solar:eye-closed-line-duotone'} />
                    </IconButton>
                  </InputAdornment>
                )
              }
            }}
          />
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 1,
              mb: 2
            }}
          >
            <FormControlLabel control={<Checkbox checked={rememberMe} onChange={handleRememberMe} color="primary" />} label="Remember me" />
            <Link href="#" variant="body2" underline="hover">
              Forgot password?
            </Link>
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 1 }}>
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
