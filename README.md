# ♻️ Recycling-App  
Machine-learning powered helper to decide “Can I recycle that?”

The web version uses **TensorFlow.js** with the **COCO-SSD** model to detect common household objects, then tells you which bin to use.  
A Capacitor wrapper lets you package the exact same codebase as a native iOS or Android app.

---

## 1  Quick start (web)

### Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| **Node.js** | ≥ 16 | `node -v` |
| **npm** | comes with Node | `npm -v` |

### Clone & run

```bash
git clone git@github.com:yildiz-fatih/recycling-app.git
cd recycling-app

# install JS dependencies
npm install         

# start local dev server on http://localhost:8081
npm start            
```

Your browser will open automatically.  
Hot-reload is enabled; save a file and the page refreshes.

---

## 2  Production build (web)

```bash
npm run build        # creates public/bundle.js + public/index.html
```

Everything in `public/` is now ready to deploy to any static host (GitHub Pages, Netlify, Firebase Hosting, …).

---

## 3  Run as a **mobile app**

> Capacitor projects are already committed, so you only need the platform SDKs.

### Prerequisites

| Platform | Requirements |
|----------|--------------|
| **iOS** | macOS, **Xcode 15+**, an Apple ID (free OK) |
| **Android (optional)** | Android Studio Hedgehog+ |

```bash
# make sure native deps are present
npm install

# fresh web build & copy into ios/android folders
npm run build
npx cap sync          # or: npx cap sync ios / android
```

---

### 3.1  iOS Simulator

```bash
# open the Xcode workspace
npx cap open ios
```

1. In Xcode’s toolbar choose an iPhone simulator (e.g. *iPhone 15 Pro*).  
2. Press **▶︎ Run** (⌘ R).  
   The simulator shows a checkerboard “test pattern”—that’s normal: the iOS Simulator has **no webcam**.  
   Use a real device for camera tests.

---

### 3.2  Physical Device (iPhone)

1. **Enable Developer Mode** on the phone (Settings ▸ Privacy & Security).  
2. Plug the iPhone into your Mac (or enable wireless debugging).  
3. In Xcode (already open from the step above):  
   * Select your phone in the device dropdown.  
   * **Signing & Capabilities** → tick **Automatically manage signing** → pick your Apple ID team.  
4. Press **▶︎ Run**.  
5. On first launch the phone will ask you to **Trust** the developer and to **allow camera access**. Tap *OK / Trust*.  
   Live camera feed now appears and the app is fully functional.

---

## 4  Handy npm scripts

| Command | What it does |
|---------|--------------|
| `npm start` | Webpack dev-server (hot reload) |
| `npm run build` | Production bundle to **public/** |
| `npm run sync` | `build` + `npx cap sync` (copies assets to native) |
| `npm run ios` | `build` + `cap sync ios` + open Xcode |
| `npm run android` | same for Android Studio |

---
