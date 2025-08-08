'use client';
import axios from 'axios';
import { useState } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import InputAdornment from '@mui/material/InputAdornment';
import { Checkbox, FormControlLabel } from '@mui/material';

import { useRouter } from 'next/navigation';
// import { useAuth } from 'src/context/AuthContext';

import Iconify from '@/components/iconify';

export default function Form() {
  const router = useRouter();
  //   const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [loginStatusMessage, setLoginStatusMessage] = useState(' ');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoginStatusMessage(' ');
    setLoading(true);
    if (email === '' || email === null || password === '' || password === null) {
      setTimeout(() => {
        setLoginStatusMessage('Email and Password is required.');
        setLoading(false);
      }, 1000);
    } else {
      axios
        .post(`/auth/login`, { email, password, remember })
        .then((response) => {
          // console.log(response);
          setLoginStatus(response.data.status);
          if (response.data.status) {
            setTimeout(() => {
              // const sessionData ={
              //     token:response.data.token,
              //     userData:response.data.user_data,
              // }
              // login(remember, response.data.token, response.data.user_data);
              // setLoginStatusMessage(response.data.message);
              setLoading(false);
              router.push('/');
            }, 1000);
          }
        })
        .catch((error) => {
          console.error('Login error:', error);
          setTimeout(() => {
            if (error.response.data.status_code === 400) {
              setLoginStatusMessage(error.response.data.results.errors[0].msg);
            } else {
              setLoginStatusMessage(error.response.data.message);
            }
            setLoading(false);
          }, 1000);
        });
    }
  };

  return (
    <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 8, width: '100%' }}>
      <Stack spacing={3}>
        <TextField
          required
          fullWidth
          autoFocus
          id="email"
          name="email"
          label="Email"
          margin="normal"
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextField
          id="password"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          autoComplete="current-password"
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setPassword(e.target.value)}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    <Iconify icon={showPassword ? 'solar:eye-bold-duotone' : 'solar:eye-closed-line-duotone'} />
                  </IconButton>
                </InputAdornment>
              )
            }
          }}
        />
      </Stack>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              onChange={() => {
                setRemember((prev) => !prev);
              }}
              color="primary"
            />
          }
          label="Remember me"
        />
        <Link href="forgot_password" variant="subtitle2" underline="hover" sx={{ cursor: 'pointer' }}>
          Forgot password?
        </Link>
      </Stack>

      <LoadingButton fullWidth loading={loading} size="large" type="submit" variant="contained" sx={{ mb: 1 }}>
        Login
      </LoadingButton>

      <Typography variant="body2" sx={{ fontWeight: 600 }} color={loginStatus ? 'text.success' : 'error'} align="center">
        {loginStatusMessage}
      </Typography>
    </Box>
  );
}
