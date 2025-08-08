import dynamic from 'next/dynamic';

// @project
import { SEO_CONTENT } from '@/metadata';

const Login = dynamic(() => import('@/views/authendication/login'));

/***************************  METADATA - Login  ***************************/

export const metadata = { ...SEO_CONTENT.login };

/***************************  PAGE - Login  ***************************/

export default function LoginPage() {
  return <Login />;
}
