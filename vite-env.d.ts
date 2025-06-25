/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APTOS_NETWORK: string
  readonly VITE_CONTRACT_ADDRESS: string
  readonly VITE_APTOS_NODE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 