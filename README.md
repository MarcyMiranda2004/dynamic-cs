# Dynamic CS (DCS) 🎲

**Dynamic CS (DCS)** is an application designed to build dynamic, interactive character sheets for various Tabletop Role-Playing Game (TTRPG) systems.

Far beyond traditional, static PDF-like sheets, DCS provides fully dynamic interfaces that make managing and navigating your character sheet an absolute breeze during gaming sessions.

---

## ✨ Features

- **Dynamic Interfaces:** Reactive and interactive layouts built specifically to improve the gameplay experience.
- **Offline-First Capabilities:** Access and edit your character sheets anywhere, anytime, even without an internet connection.
- **Automatic Syncing:** All changes made offline are automatically synchronized to the database as soon as you reconnect.
- **Multi-System Support:** Designed to support multiple TTRPG rulesets flexible to your needs.

---

## 🛠️ Tech Stack

- **UI & Local State Management:** [Zustand](https://github.com/pmndrs/zustand) for fast, seamless, and lightweight local state management.
- **Database & Cloud Storage:** [Firebase](https://firebase.google.com/) for cloud backup, user authentication, and multi-device database synchronization.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your environment:

- **Node.js** (v16.x or higher recommended)
- **npm** or **yarn** / **pnpm**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/dynamic-cs.git
   cd dynamic-cs
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Firebase configurations:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
