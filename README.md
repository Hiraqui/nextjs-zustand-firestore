# Next.js + Zustand + Firestore

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-000000?style=flat&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0.8-2D2D2D?style=flat&logo=zustand&logoColor=white)](https://zustand-demo.pmnd.rs/)
[![Firebase](https://img.shields.io/badge/Firebase-12.3.0-FFCA28?style=flat&logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E_Testing-2EAD33?style=flat&logo=playwright&logoColor=white)](https://playwright.dev/)

> **Demo**: [nextjs-zustand-firestore.vercel.app](https://nextjs-zustand-firestore.vercel.app)

A production-ready demonstration showing how to use **Firestore as server-side persistence for Zustand stores** instead of localStorage/sessionStorage. This project showcases modern state management patterns with automatic server synchronization via Next.js Server Actions.

## 📋 Table of Contents

- [🎯 What This Demonstrates](#-what-this-demonstrates)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [✨ Key Features](#-key-features)
- [🚀 Quick Start](#-quick-start)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🛠️ Development](#️-development)
- [🧪 Testing](#-testing)
- [🚀 Deployment](#-deployment)
- [📁 Project Structure](#-project-structure)
- [🔧 Key Components](#-key-components)
- [📚 API Reference](#-api-reference)
- [🤝 Contributing](#-contributing)
- [🔧 Troubleshooting](#-troubleshooting)
- [🤖 AI Disclaimer](#-ai-disclaimer)
- [📄 License](#-license)

## 🎯 What This Demonstrates

This repository demonstrates:

- **🔄 Server-Side Store Persistence**: Zustand stores automatically sync to Firestore temp collections
- **⚡ Debounced Server Actions**: Smart batching to reduce database operations
- **🔒 Security-First Architecture**: Collection name mapping prevents unauthorized access
- **🧪 Firebase Emulator Integration**: Complete testing setup with Playwright
- **🎨 Modern UI/UX**: Built with Tailwind CSS and Radix UI components
- **📱 Cross-Tab Synchronization**: Real-time state sharing across browser tabs

## 🏗️ Architecture Overview

### Core Pattern: Server Storage for Zustand

Instead of using localStorage, this project implements a custom `ServerStorage` that:

1. **Client stores** call debounced server actions when state changes
2. **Server actions** validate and store data in Firestore temp collections
3. **Security layer** maps client storage names to server collection names
4. **User-scoped storage** ensures data isolation (`users/{userId}/temp/{collection}`)

```typescript
// Zustand store with server persistence
const store = create()(
  shared(
    subscribeWithSelector(
      persist(
        (set, get) => ({
          // State and actions
          calculateIsComplete: async () => {
            // Execute server logic inside Zustand store
            const result = await isOnboardingCompleteAction(data);
            set({ isComplete: result.data });
          },
        }),
        {
          name: STORAGES.onboarding,
          skipHydration: true, // Required for server storage
          storage: createServerStorage(writeValidator, { debounce: 2500 }),
        }
      )
    )
  )
);
```

### Server Action Pattern

```typescript
// Server action bridges client store to Firestore
export async function setTempCollectionAction(
  collection: string,
  value: string
): Promise<ActionResult> {
  // 1. Map client storage name to server collection
  const serverCollection = TEMP_COLLECTIONS_MAP[collection];

  // 2. Authenticate user and validate
  const { db, currentUser } = await getServerFirestore();

  // 3. Store in user-scoped Firestore path
  await setTempCollection(db, currentUser.uid, serverCollection, value);
  return createSuccessResult();
}
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Firebase CLI: `npm install -g firebase-tools`

### Installation

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/Hiraqui/nextjs-zustand-firestore.git
   cd nextjs-zustand-firestore
   npm install
   ```

2. **Set up environment**

   ```bash
   cp .env.default .env
   # Edit .env with your Firebase configuration
   ```

3. **Start Firebase emulators**

   ```bash
   npm run emulators:demo
   ```

4. **Run development server**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)**

## 🧪 Testing with Firebase Emulators

This project features comprehensive testing with Firebase emulators:

### E2E Testing with Playwright

```bash
# Run tests with emulators (automatically handled)
npm run test:e2e

# Run specific test with emulator integration
firebase emulators:exec --project demo-nextjs-zustand-firestore "npx playwright test"
```

### Playwright + Firebase Integration

The project includes a custom Playwright setup that:

- **Automatically starts/stops Firebase emulators**
- **Provides authenticated user fixtures**
- **Tests real Firestore persistence**
- **Validates cross-tab synchronization**

#### Custom Test Fixtures

The project uses custom Playwright fixtures defined in `e2e/fixtures/base-fixtures.ts` that provide:

```typescript
type AuthenticatedFixtures = {
  homePage: HomePage;        // Home page object with navigation methods
  onboardingPage: OnboardingPage; // Onboarding page with form interactions
  user: {                    // Authenticated user data
    email: string;
    name: string;
  };
};
```

#### Authentication Flow

The `user` fixture automatically handles the complete authentication flow:

1. **Navigate to home page** and verify sign-in button
2. **Handle Google sign-in popup** with test user generation
3. **Wait for onboarding redirect** with retry logic (45s timeout)
4. **Provide authenticated user context** for subsequent tests

#### Usage Examples

```typescript
// Basic authenticated test
test("should complete onboarding flow", async ({
  onboardingPage,
  user,
}) => {
  console.log(`Testing with user: ${user.name} (${user.email})`);
  
  await onboardingPage.startOnboarding();
  await onboardingPage.fillCompleteOnboarding(testData);
  
  // Data is automatically persisted to Firestore emulator
  // and synchronized across browser tabs
  const summaryPage = new SummaryPage(onboardingPage.page);
  await summaryPage.verifyDataPersistence();
});

// Test with multiple fixtures
test("should allow logout from onboarding", async ({
  onboardingPage,
  user,
  homePage,
}) => {
  await onboardingPage.logoutButton.click();
  await homePage.verifyWelcomeMessage();
});
```

#### Fixture Dependencies

- **`homePage`**: Available immediately, no dependencies
- **`user`**: Depends on `homePage` and `context`, handles full auth flow (45s timeout)
- **`onboardingPage`**: Depends on `user` and `homePage`, provides authenticated onboarding context

#### Advanced Testing Features

The fixture implementation includes several advanced features for robust testing:

- **Retry Logic**: The authentication flow uses `toPass()` with custom intervals `[1000, 2000, 3000]`
- **Page Promise Handling**: Properly waits for Google sign-in popup window
- **User Generation**: Creates unique test users with `generateNewUserAndLogin()`
- **State Isolation**: Each test gets a fresh authenticated user context
- **Timeout Management**: Custom 45-second timeout for authentication flow
- **Dependency Injection**: Fixtures are properly chained to ensure correct initialization order

## 🏢 Project Structure

```
src/
├── actions/                    # Next.js Server Actions
│   ├── set-temp-collection-action.ts    # Store data in Firestore
│   ├── get-temp-collection-action.ts    # Retrieve persisted data
│   └── is-onboarding-complete-action.ts # Server-side validation logic
├── store/
│   ├── onboarding-store.ts           # Zustand store with server persistence
│   ├── server-storage.ts             # Custom ServerStorage implementation
│   └── client-storages.ts            # Storage name mappings
├── lib/
│   ├── firebase/
│   │   ├── firestores.ts            # Firestore CRUD operations
│   │   ├── server-app.ts            # Firebase server-side config
│   │   └── emulator-config.ts       # Emulator connection setup
│   └── utils/
│       └── temp-collections-map.ts  # Security mapping layer
├── components/
│   ├── onboarding/                  # Step-based form components
│   └── auth/                        # Authentication components
└── app/
    ├── onboarding/                  # Onboarding flow pages
    └── page.tsx                     # Landing page

e2e/                            # End-to-end testing with Playwright
├── fixtures/
│   └── base-fixtures.ts            # Custom authenticated test fixtures
├── pages/                          # Page Object Model classes
│   ├── google-sign-in-page.ts     # Google OAuth page interactions
│   ├── home-page.ts                # Home page interactions
│   ├── onboarding-page.ts          # Onboarding form interactions
│   └── summary-page.ts             # Summary page verification
├── home.spec.ts                    # Basic application tests
└── onboarding.spec.ts              # Authenticated onboarding flow tests
```

## 🔐 Security Features

### Collection Name Mapping

Client storage names are mapped to server collection names for security:

```typescript
// Client uses storage names
STORAGES = {
  onboarding: "onboarding-storage",
};

// Server maps to secure collection names
TEMP_COLLECTIONS_MAP = {
  "onboarding-storage": "onboarding_data_v1",
};

// Stored in Firestore as: users/{userId}/temp/onboarding_data_v1
```

### Authentication & Validation

- **All server actions** require authenticated users
- **Collection names** are validated against whitelists
- **User data isolation** via Firestore security rules
- **Debounced writes** prevent API abuse

## 🎨 Tech Stack

| Category             | Technology         | Purpose                                      |
| -------------------- | ------------------ | -------------------------------------------- |
| **Framework**        | Next.js 15.5.4     | React framework with App Router              |
| **State Management** | Zustand 5.0.8      | Lightweight state management                 |
| **Database**         | Firebase Firestore | Document database with real-time sync        |
| **Authentication**   | Firebase Auth      | User authentication & session management     |
| **UI Framework**     | Tailwind CSS       | Utility-first CSS framework                  |
| **UI Components**    | Radix UI           | Accessible component primitives              |
| **Testing**          | Playwright         | End-to-end testing with emulator integration |
| **Type Safety**      | TypeScript 5.x     | Static type checking                         |
| **Cross-Tab Sync**   | use-broadcast-ts   | Browser tab synchronization                  |

## 🚦 Available Scripts

| Script                   | Description                             |
| ------------------------ | --------------------------------------- |
| `npm run dev`            | Start development server with Turbopack |
| `npm run build`          | Build production application            |
| `npm run test`           | Run unit tests with Jest                |
| `npm run test:e2e`       | Run Playwright E2E tests                |
| `npm run emulators`      | Start Firebase emulators                |
| `npm run emulators:demo` | Start emulators with demo project       |
| `npm run lint`           | Run ESLint                              |

## 🔧 Configuration

### Environment Variables

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Emulator Configuration (for development)
NEXT_PUBLIC_FIREBASE_EMULATOR_HOST=127.0.0.1     # Host address - determines if emulators are used (unset = production mode)
NEXT_PUBLIC_FIRESTORE_EMULATOR=true              # Enable Firestore emulator connection
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR=true          # Enable Firebase Auth emulator connection
NEXT_PUBLIC_FIRESTORE_EMULATOR_PORT=8080         # Port for Firestore emulator (default: 8080)
NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_PORT=9099     # Port for Firebase Auth emulator (default: 9099)
```

### Firebase Setup

1. Create a Firebase project
2. Enable Firestore and Authentication
3. Configure Google Auth provider
4. Update `.env` with your configuration

## 📚 Key Concepts

### Server Storage Implementation

The `ServerStorage` class implements Zustand's `StateStorage` interface:

```typescript
class ServerStorage implements StateStorage {
  async getItem(name: string) {
    // Fetch from Firestore via server action
    const result = await getTempCollectionAction(name);
    return result.success ? result.data : null;
  }

  async setItem(name: string, value: string) {
    // Debounced write to Firestore
    if (this.writeValidator()) {
      this.debouncedSetItem(name, value);
    }
  }
}
```

### Cross-Tab Synchronization

Using `use-broadcast-ts` for real-time state sharing:

```typescript
// Automatically syncs state across browser tabs
const store = create()(
  shared(
    // <- Enables cross-tab sync
    subscribeWithSelector(persist(/* store config */))
  )
);
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Authors

- **Martin Moro** - _Initial work_ - [@Hiraqui](https://github.com/Hiraqui)
- **Francesca Rinaldi** - _Contributor_

## 🤖 AI Assistance Disclaimer

This project was developed with assistance from GitHub Copilot, which helped generate:

- Test cases
- Code documentation and comments
- README documentation

While AI tools provided valuable assistance, all code has been reviewed, tested, and validated by human developers to ensure quality and functionality.

## 🙏 Acknowledgments

- [Next.js team](https://nextjs.org/) for the amazing React framework
- [Zustand](https://zustand-demo.pmnd.rs/) for lightweight state management
- [Firebase](https://firebase.google.com/) for backend services
- [Playwright](https://playwright.dev/) for reliable E2E testing
- [Vercel](https://vercel.com/) for seamless deployment

---

**⭐ Star this repo if you find it helpful!**
