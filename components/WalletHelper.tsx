import { useEffect, useState, useCallback, useMemo } from 'react';
import { Alert, Button, Space, Typography, Card } from 'antd';
import { WarningOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useWallet } from "@aptos-labs/wallet-adapter-react";

const { Title, Text, Paragraph } = Typography;

// Types
interface WalletInfo {
  name: string;
  detected: boolean;
  installUrl: string;
  detectionKey: string;
}

// Constants
const PETRA_WALLET_URL = 'https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci?pli=1';

const WALLET_CONFIGS: Readonly<WalletInfo[]> = [
  {
    name: 'Petra Wallet',
    detectionKey: 'petra',
    detected: false,
    installUrl: PETRA_WALLET_URL
  },
  {
    name: 'Martian Wallet',
    detectionKey: 'martian',
    detected: false,
    installUrl: 'https://chrome.google.com/webstore/detail/martian-wallet/efbglgofoippbgcjepnhiblaibcnclgk'
  },
  {
    name: 'Pontem Wallet',
    detectionKey: 'pontem',
    detected: false,
    installUrl: 'https://chrome.google.com/webstore/detail/pontem-aptos-wallet/phkbamefinggmakgklpkljjmgibohnba'
  }
] as const;

const DETECTION_DELAY = 2000; // 2 seconds

const WalletHelper = () => {
  const { connected } = useWallet();
  const [wallets, setWallets] = useState<WalletInfo[]>([...WALLET_CONFIGS]);
  const [hasAnyWallet, setHasAnyWallet] = useState(false);

  // Check for wallet installations
  const checkWallets = useCallback(() => {
    const updatedWallets = WALLET_CONFIGS.map(wallet => ({
      ...wallet,
      detected: detectWallet(wallet.detectionKey)
    }));

    setWallets(updatedWallets);
    setHasAnyWallet(updatedWallets.some(wallet => wallet.detected));
  }, []);

  // Wallet detection helper
  const detectWallet = useCallback((detectionKey: string): boolean => {
    try {
      const windowAny = window as any;
      
      switch (detectionKey) {
        case 'petra':
          return !!(windowAny.aptos && windowAny.petra);
        case 'martian':
          return !!windowAny.martian;
        case 'pontem':
          return !!windowAny.pontem;
        default:
          return false;
      }
    } catch (error) {
      console.warn(`Error detecting ${detectionKey} wallet:`, error);
      return false;
    }
  }, []);

  // Handle wallet installation
  const handleInstallWallet = useCallback((installUrl: string) => {
    try {
      window.open(installUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Error opening wallet installation URL:', error);
    }
  }, []);

  // Effect for wallet detection
  useEffect(() => {
    // Check immediately
    checkWallets();

    // Check again after delay (wallets might load asynchronously)
    const timer = setTimeout(checkWallets, DETECTION_DELAY);

    // Listen for window load event in case wallets load later
    const handleWindowLoad = () => {
      setTimeout(checkWallets, 500);
    };

    if (document.readyState === 'loading') {
      window.addEventListener('load', handleWindowLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', handleWindowLoad);
    };
  }, [checkWallets]);

  // Memoized success alert
  const SuccessAlert = useMemo(() => (
    <Alert
      message="Wallets Detected"
      description="Aptos wallets found! Click the 'Connect Wallet' button in the header to get started."
      type="success"
      icon={<CheckCircleOutlined />}
      showIcon
      style={{ marginBottom: 16 }}
    />
  ), []);

  // Memoized wallet list (excluding Petra since it's featured above)
  const WalletList = useMemo(() => {
    const alternativeWallets = wallets.filter(wallet => wallet.detectionKey !== 'petra');
    
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        {alternativeWallets.map((wallet) => (
          <div 
            key={wallet.name} 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '8px 12px',
              border: '1px solid #f0f0f0',
              borderRadius: '6px',
              background: wallet.detected ? '#f6ffed' : '#fff'
            }}
          >
            <div>
              <Text strong>{wallet.name}</Text>
              {wallet.detected && (
                <Text type="success" style={{ marginLeft: 8 }}>
                  ✓ Installed
                </Text>
              )}
            </div>
            {!wallet.detected && (
              <Button 
                type="default" 
                size="small"
                onClick={() => handleInstallWallet(wallet.installUrl)}
              >
                Install
              </Button>
            )}
          </div>
        ))}
      </Space>
    );
  }, [wallets, handleInstallWallet]);

  // Memoized instructions
  const Instructions = useMemo(() => (
    <Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
      <Text type="secondary">
        <strong>After installing Petra Wallet:</strong>
        <br />
        1. Refresh this page or restart your browser
        <br />
        2. Set your wallet to "Testnet" mode in wallet settings
        <br />
        3. Click "Connect Wallet" in the header to get started
        <br />
        4. Create or import your wallet account
      </Text>
    </Paragraph>
  ), []);

  // Don't render anything if wallet is connected
  if (connected) {
    return null;
  }

  // Early return for successful detection
  if (hasAnyWallet) {
    return SuccessAlert;
  }

  return (
    <Card style={{ marginBottom: 16 }}>
      <Alert
        message="No Aptos Wallet Detected"
        description="You need to install an Aptos wallet to use this dApp."
        type="warning"
        icon={<WarningOutlined />}
        showIcon
        style={{ marginBottom: 20 }}
      />
      
      {/* Recommended Petra Wallet Section */}
      <div style={{ 
        marginBottom: 24, 
        padding: 16, 
        background: '#f6ffed',
        border: '1px solid #b7eb8f',
        borderRadius: 8
      }}>
        <Title level={4} style={{ marginBottom: 8, color: '#52c41a' }}>
          ⭐ RECOMMENDED: Install Petra Wallet
        </Title>
        <Paragraph style={{ marginBottom: 12, color: '#333' }}>
          <Text strong>Official wallet by Aptos Labs</Text> • 4.9⭐ rating • 400,000+ users
        </Paragraph>
        <Button 
          type="primary" 
          size="large"
          style={{ 
            background: '#52c41a',
            borderColor: '#52c41a',
            height: 'auto',
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
          onClick={() => handleInstallWallet(PETRA_WALLET_URL)}
        >
          📦 INSTALL PETRA WALLET
        </Button>
      </div>

      {/* Alternative Wallets */}
      <Title level={5} style={{ marginBottom: 12, color: '#666' }}>
        Alternative Wallets:
      </Title>
      {WalletList}
      {Instructions}
    </Card>
  );
};

export default WalletHelper; 