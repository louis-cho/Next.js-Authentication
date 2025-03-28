
import Layout from '@/components/layout/layout';
import { AuthProvider } from '@/context/AuthContext'; // 경로 맞춰주세요
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </AuthProvider>
  )
}