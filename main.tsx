import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletProvider } from './components/WalletProvider'
import AppRoutes from './AppRoutes.tsx'
import './index.css'
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

// Add Buffer and process polyfills for crypto libraries
import { Buffer } from 'buffer';
import process from 'process';

(window as any).global = globalThis;
(window as any).Buffer = Buffer;
(window as any).process = process;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <AppRoutes />
    </WalletProvider>
  </StrictMode>,
) 