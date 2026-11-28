# Mobile Chat Application (MVC Architecture)

A full-featured mobile chat application built with **React Native**, **Expo**, **Node.js**, **Express**, **WebSocket**, and **SQLite**, structured in strict **Model-View-Controller (MVC)** architecture with robust local persistence and offline capabilities.

---

## Architecture Overview (MVC)

The codebase is organized cleanly into distinct layers:

```
chat_app/
├── server/                                # Express + WebSocket + SQLite backend
│   ├── data/chats.json                    # Initial seed data
│   ├── server.js                          # REST endpoints + WebSocket connection handler
│   ├── db.js                              # SQLite database schema and queries
│   └── reset.js                           # DB reset utility
│
├── src/
│   ├── config/
│   │   └── apiConfig.js                   # Dynamic server URL resolution and storage keys
│   │
│   ├── models/                            # MODEL LAYER (Data, storage, network)
│   │   ├── ChatModel.js                   # Entity schemas, data normalizers, time helpers
│   │   ├── StorageService.js              # AsyncStorage manager (cache, drafts, active chat)
│   │   ├── OutboxService.js               # Offline message queue management
│   │   ├── ApiService.js                  # REST API client with graceful offline fallback
│   │   └── WebSocketService.js            # Bi-directional WebSocket client for live chats & typing
│   │
│   ├── controllers/                       # CONTROLLER LAYER (State & business logic)
│   │   ├── useChatListController.js       # Chat list orchestration, focus auto-reload, search
│   │   ├── useIndividualChatController.js # Message streams, draft auto-save, outbox auto-flush
│   │   ├── useSettingsController.js       # Server IP configuration and cache clearing
│   │   └── useSessionRestoreController.js # Cold startup session resume
│   │
│   ├── views/                             # VIEW LAYER (Pure presentation & components)
│   │   ├── screens/
│   │   │   ├── ChatListScreen.jsx         # Conversation list with search & resume banners
│   │   │   ├── IndividualChatScreen.jsx   # Live conversation screen with keyboard avoidance
│   │   │   └── SettingsScreen.jsx         # Host IP configuration and storage diagnostics
│   │   ├── components/
│   │   │   ├── ChatItem.jsx               # Contact list row with avatar, last message & badge
│   │   │   ├── ChatHeader.jsx             # Top bar header with contact initials and status
│   │   │   ├── MessageBubble.jsx          # Outgoing (blue) and incoming (gray) bubbles + delivery status
│   │   │   ├── MessageInput.jsx           # Input bar with send button
│   │   │   ├── SearchBar.jsx              # Search and filtering component
│   │   │   ├── ConnectionBanner.jsx       # Real-time WebSocket connectivity status
│   │   │   ├── MessageActionsModal.jsx    # Floating emoji reaction bar and message deletion
│   │   │   └── TypingIndicator.jsx        # "X is typing…" broadcast indicator
│   │   └── styles/
│   │       └── theme.js                   # Unified design system tokens (colors, typography, spacing)
│   │
│   └── utils/
│       ├── avatarColors.js                # Deterministic avatar color palette generator
│       └── dateFormatter.js               # Relative timestamp formatter ("Today", "Yesterday")
│
├── App.js                                 # Root navigation stack configuration
├── app.json                               # Expo project manifest
└── package.json                           # App dependencies and scripts
```

---

## Key Features

1. **Model Layer (`src/models/`)**
   - **AsyncStorage Persistence**: Drafts are saved on every keystroke (`draft:${chatId}`) and restored on reopen.
   - **Offline Caching**: Cached chats (`chat_app:chats`) and cached messages (`chat_app:messages:${chatId}`) display instantly even without network connectivity.
   - **Offline Outbox**: When offline, outgoing messages are queued in `OutboxService` with a `Sending…` indicator and automatically flushed when the WebSocket reconnects.
   - **Dynamic Server URL**: Easily configure your computer's LAN IP from the app's Settings screen without modifying code.

2. **Controller Layer (`src/controllers/`)**
   - **`useChatListController`**: Handles initial load, focus refresh (`navigation.addListener`), pull-to-refresh, contact filtering via search, and unread count clearing.
   - **`useIndividualChatController`**: Connects WebSocket, subscribes to message/typing events, throttles typing broadcasts (max once every 2 seconds), and handles optimistic UI updates.
   - **`useSessionRestoreController`**: Remembers the last viewed chat across app restarts for seamless multitasking.

3. **View Layer (`src/views/`)**
   - **Native Stack Navigation**: iOS and Android native transitions with customizable header.
   - **Responsive UI**: `KeyboardAvoidingView` ensures message inputs and bottom bubbles remain visible when the keyboard opens.
   - **Dynamic Avatars**: Unique consistent avatar background colors generated based on contact names.

---

## Getting Started

### 1. Start the Chat Server

```bash
cd server
npm install
npm start
```

The server starts on port `3001` and prints its LAN IP address:
```
From your phone: http://192.168.1.7:3001/chats   ws://192.168.1.7:3001/ws
```

### 2. Start the Mobile Application

In the root directory:

```bash
npm install
npx expo start
```

- Press `i` to open in iOS Simulator (macOS)
- Press `a` to open in Android Emulator
- Scan the QR code using the **Expo Go** app on your physical iPhone or Android device

### 3. Connect Phone to Computer

Make sure your phone and computer are on the same Wi-Fi network. Open **Settings** in the top right of the mobile app, enter the server IP (e.g. `192.168.1.7:3001`), and tap **Save Server IP**.
