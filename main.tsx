import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { WalletProvider } from './components/WalletProvider'
import AppRoutes from './AppRoutes.tsx'
import './index.css'
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <AppRoutes />
    </WalletProvider>
  </StrictMode>,
) 