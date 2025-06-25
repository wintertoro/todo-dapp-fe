import { Button, Typography, Modal, Dropdown, Space } from 'antd';
import { WalletOutlined, DisconnectOutlined } from '@ant-design/icons';
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { WalletName } from "@aptos-labs/wallet-adapter-react";
import { useState } from 'react';

const { Text } = Typography;

export default function WalletConnection() {
  const { connected, wallets, connect, disconnect, wallet, account } = useWallet();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      console.log('✅ Wallet disconnected');
    } catch (error) {
      console.error('❌ Failed to disconnect:', error);
    }
  };

  // If connected, show wallet info with disconnect dropdown
  if (connected && account) {
    // Simplified dropdown items for better compatibility
    const dropdownItems = {
      items: [
        {
          key: 'info',
          label: `${wallet?.name || 'Wallet'}: ${formatAddress(account.address)}`,
          disabled: true,
        },
        {
          type: 'divider' as const,
        },
        {
          key: 'disconnect',
          label: 'Disconnect Wallet',
          icon: <DisconnectOutlined />,
          danger: true,
          onClick: () => {
            console.log('🔌 Disconnect clicked from dropdown menu');
            handleDisconnect();
          }
        },
      ]
    };

    return (
      <div style={{ position: 'relative' }}>
        <Dropdown 
          menu={dropdownItems}
          trigger={['click']}
          placement="bottomRight"
          overlayStyle={{ 
            zIndex: 9999,
          }}
          onOpenChange={(open) => {
            console.log('🔍 Dropdown onOpenChange:', open);
          }}
        >
          <Button 
            type="primary" 
            icon={<WalletOutlined />}
            className="wallet-button connected"
            style={{ 
              cursor: 'pointer',
              height: '40px',
              padding: '0 16px',
              borderRadius: '8px'
            }}
            onClick={(e) => {
              console.log('🖱️ Wallet button clicked!', e);
              e.stopPropagation();
            }}
          >
            <Space>
              {wallet?.name || 'Wallet'}
              <Text style={{ color: 'inherit', fontSize: '12px' }}>
                {formatAddress(account.address)}
              </Text>
              <span style={{ fontSize: '10px', opacity: 0.7 }}>▼</span>
            </Space>
          </Button>
        </Dropdown>
        
        {/* Temporary: Alternative simple dropdown for testing */}
        <Button 
          danger
          size="small"
          icon={<DisconnectOutlined />}
          onClick={handleDisconnect}
          style={{ 
            marginLeft: '8px',
            height: '32px'
          }}
          title="Disconnect (temporary button)"
        >
          Disconnect
        </Button>
      </div>
    );
  }

  // Available wallets for connection
  const availableWallets = (wallets || []).filter(w => w.readyState === 'Installed');

  const handleConnect = async (walletName: WalletName) => {
    setConnecting(true);
    try {
      await connect(walletName);
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <>
      <Button 
        type="primary" 
        icon={<WalletOutlined />}
        onClick={() => setIsModalVisible(true)}
        className="wallet-button"
        size="large"
      >
        Connect Wallet
      </Button>

      <Modal
        title="Connect Wallet"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        centered
        className="wallet-modal"
      >
        <div style={{ padding: '20px 0' }}>
          {availableWallets.length > 0 ? (
            <>
              <Text strong style={{ marginBottom: 16, display: 'block' }}>
                Detected Wallets:
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {availableWallets.map((wallet) => (
                  <Button
                    key={wallet.name}
                    size="large"
                    style={{ 
                      width: '100%', 
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                      padding: '0 20px'
                    }}
                    loading={connecting}
                    onClick={() => handleConnect(wallet.name)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {wallet.icon && (
                        <img 
                          src={wallet.icon} 
                          alt={wallet.name} 
                          style={{ width: 24, height: 24 }}
                        />
                      )}
                      <Text strong>{wallet.name}</Text>
                    </div>
                  </Button>
                ))}
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <Text type="secondary">
                No wallets detected. Please install a supported wallet:
              </Text>
              <div style={{ marginTop: 20, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <Button 
                  type="link" 
                  href="https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci"
                  target="_blank"
                  size="large"
                >
                  📦 Install Petra Wallet
                </Button>
                <Button 
                  type="link" 
                  href="https://chromewebstore.google.com/detail/martian-aptos-wallet/efbglgofoippbgcjepnhiblaibcnclgk"
                  target="_blank"
                  size="large"
                >
                  🚀 Install Martian Wallet
                </Button>
                <Button 
                  type="link" 
                  href="https://chromewebstore.google.com/detail/pontem-aptos-wallet/phkbamefinggmakgklpkljjmgibohnba"
                  target="_blank"
                  size="large"
                >
                  💎 Install Pontem Wallet
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
} 