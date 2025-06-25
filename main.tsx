import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletProvider } from './components/WalletProvider'
import AppRoutes from './AppRoutes.tsx'
import './index.css'
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

// Add Buffer polyfill for crypto libraries
import { Buffer } from 'buffer';
(window as any).global = globalThis;
(window as any).Buffer = Buffer;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <AppRoutes />
    </WalletProvider>
  </StrictMode>,
) 