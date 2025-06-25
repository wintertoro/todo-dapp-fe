# 📝 Aptos To-do dApp

A decentralized to-do list application built on the Aptos blockchain, featuring a React frontend and Move smart contract. Create, manage, and track your to-dos on-chain with full transparency and decentralization.

## 🚀 Live Demo

**Production URL:** [https://todo-dapp-njbj390q2-jings-projects-01d0d4a6.vercel.app](https://todo-dapp-njbj390q2-jings-projects-01d0d4a6.vercel.app)

## ✨ Features

- 🔗 **Blockchain Integration**: Fully decentralized to-do storage on Aptos testnet
- 👛 **Wallet Authentication**: Seamless integration with Petra wallet
- ✅ **CRUD Operations**: Create, read, update, and delete to-dos
- ⏰ **Timestamp Tracking**: Automatic blockchain timestamp for to-do creation
- 📱 **Responsive Design**: Mobile-friendly interface with modern UI
- 📚 **Documentation**: Built-in documentation with split-view capability
- 🔒 **Secure**: All data stored on-chain with cryptographic security

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Ant Design** - Professional UI components
- **CSS3** - Modern styling with responsive design

### Blockchain
- **Aptos Move** - Smart contract language
- **Aptos SDK** - Blockchain interaction
- **Petra Wallet** - Wallet adapter for authentication

### Deployment
- **Vercel** - Production hosting
- **GitHub** - Version control and CI/CD

## 📋 Prerequisites

- **Node.js** >= 16.0.0
- **npm** or **yarn**
- **Petra Wallet** extension installed
- **Aptos CLI** (for smart contract development)

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/wintertoro/todo-dapp-fe.git
cd todo-dapp-fe
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_APTOS_NETWORK=testnet
VITE_CONTRACT_ADDRESS=0x5bd3338c9f09619c16a5207af405b84e98d041c8194ea90c2243be7dba513423
```

### 4. Run Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### 5. Build for Production
```bash
npm run build
```

## 🔧 Smart Contract Information

### Contract Details
- **Network**: Aptos Testnet
- **Contract Address**: `0x5bd3338c9f09619c16a5207af405b84e98d041c8194ea90c2243be7dba513423`
- **Language**: Move
- **Features**: Complete CRUD operations with on-chain storage

### Contract Structure
```move
struct TodoList {
    todos: vector<Todo>,
    set_todo_event: EventHandle<Todo>,
    create_todo_event: EventHandle<Todo>,
}

struct Todo {
    task_id: u64,
    address: address,
    content: string,
    completed: bool,
    created_at: u64,
}
```

### Available Functions
- `create_list()` - Initialize a new todo list
- `create_task(content: string)` - Create a new todo
- `complete_task(task_id: u64)` - Mark todo as completed
- `update_task(task_id: u64, content: string)` - Update todo content

## 🌐 Deployment

### Vercel Deployment
The app is automatically deployed to Vercel on every push to the main branch.

#### Environment Variables (Required)
- `VITE_APTOS_NETWORK=testnet`
- `VITE_CONTRACT_ADDRESS=0x5bd3338c9f09619c16a5207af405b84e98d041c8194ea90c2243be7dba513423`

#### Manual Deployment
```bash
# Link to Vercel project
npx vercel link

# Set environment variables
npx vercel env add VITE_APTOS_NETWORK production
npx vercel env add VITE_CONTRACT_ADDRESS production

# Deploy
npx vercel --prod
```

## 📖 Usage Guide

### Getting Started
1. **Install Petra Wallet**: Download and install the Petra wallet browser extension
2. **Connect Wallet**: Click "Connect Wallet" and approve the connection
3. **Initialize**: If first time, the app will initialize your todo list
4. **Create Todos**: Add new todos using the input field
5. **Manage Todos**: Mark as complete, edit content, or delete todos

### Navigation
- **Todo App**: Main todo management interface
- **Documentation**: Comprehensive guide and API reference
- **Split View**: Side-by-side todo app and documentation

### Wallet Integration
- Automatic network detection (Testnet)
- Transaction signing for all operations
- Real-time wallet connection status
- Disconnect functionality

## 🔍 Project Structure

```
todo-dapp-fe/
├── src/
│   ├── components/          # React components
│   │   ├── AddTodo.tsx     # Todo creation component
│   │   ├── TodoList.tsx    # Todo display and management
│   │   ├── WalletConnection.tsx  # Wallet integration
│   │   ├── Documentation.tsx     # Built-in documentation
│   │   └── WalletProvider.tsx    # Wallet context provider
│   ├── services/
│   │   └── aptosService.ts # Blockchain interaction service
│   ├── App.tsx             # Main application component
│   ├── AppRoutes.tsx       # Navigation routing
│   └── main.tsx           # Application entry point
├── contract/              # Move smart contract
│   ├── sources/
│   │   └── todo_list.move # Smart contract code
│   ├── tests/             # Contract tests
│   └── Move.toml          # Move project configuration
├── public/                # Static assets
├── dist/                  # Production build output
└── vercel.json           # Vercel deployment configuration
```

## 🧪 Testing

### Frontend Testing
```bash
# Run development server
npm run dev

# Build and test production
npm run build
npx serve dist
```

### Smart Contract Testing
```bash
# Navigate to contract directory
cd contract

# Run Move tests
aptos move test

# Compile contract
aptos move compile
```

## 🐛 Troubleshooting

### Common Issues

#### Wallet Connection Issues
- Ensure Petra wallet is installed and unlocked
- Check network settings (should be Testnet)
- Refresh page and try reconnecting

#### Transaction Failures
- Verify sufficient APT balance for gas fees
- Check contract address is correct
- Ensure wallet is connected to Testnet

#### Build/Deployment Issues
- Verify all environment variables are set
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`

### Browser Compatibility
- Chrome: ✅ Fully supported
- Firefox: ✅ Fully supported  
- Safari: ✅ Fully supported
- Edge: ✅ Fully supported

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Aptos Labs** - For the excellent blockchain infrastructure
- **Petra Wallet** - For seamless wallet integration
- **Ant Design** - For beautiful UI components
- **Vercel** - For reliable hosting and deployment

## 📞 Support

For support and questions:
- Create an issue in this repository
- Check the built-in documentation in the app
- Review the troubleshooting section above

---

**Built with ❤️ on Aptos blockchain** 