# Dota 2 Bot and Backend Integration Notes

## Overview

Goal: Build a SaaS platform that automates Dota 2 lobbies and tournaments —
handling match creation, lobby management, and data collection.

---

## 1. Dota 2 Data Access

- **Official APIs:** Valve doesn’t provide full match/lobby control via Web
  APIs.
- **Match Info:** Can be fetched using:
  - OpenDota API (community API for match stats, parsed `.dem` files)
  - Steam Web API (`GetMatchDetails`, `GetMatchHistory`)
  - `.dem` replay parsing (for in-depth stats or event analysis)
- **Limitations:** No direct API for creating leagues/lobbies — must use Game
  Coordinator (GC).

---

## 2. Creating Lobbies and Leagues

- Requires direct communication with the **Dota 2 Game Coordinator** through the
  Steam protocol.
- Common approach: connect a Steam bot account to the Dota 2 GC.
- Tasks handled by the GC layer:
  - Create/join lobbies
  - Set rules, passwords, and slots
  - Invite players
  - Receive match results

---

## 3. Package and Language Options

### ❌ Node.js `dota2` Package

- Outdated and unmaintained (last update 2017).
- Depends on old Steam libraries that no longer work with current GC protocol.

### ✅ `go-dota2` by Paralin

- Actively used and reliable for GC communication.
- Written in Go.
- Can:
  - Connect Steam accounts to Dota 2 GC
  - Create/manage lobbies
  - Listen for match events and results
  - Handle protobuf-based messaging

---

## 4. Recommended Architecture

**Hybrid Setup:**

- Use **Go (`go-dota2`)** as a microservice handling all GC logic.
- Use **Node.js/Bun backend** for web APIs, user management, and orchestration.

Architecture:

```
[Frontend / Dashboard]
        ↓
   [Bun API]
        ↓
[Go Microservice (go-dota2)]
        ↓
[Steam Game Coordinator]
```

---

## 5. Example: Using Go with Bun FFI

### a. Build Go as Shared Library

Expose simple functions like `Connect` and `CreateLobby`:

```go
go build -o libdota2bridge.so -buildmode=c-shared dota2bridge.go
```

### b. Load in Bun using `bun:ffi`

```ts
import { dlopen, FFIType } from "bun:ffi";

const lib = dlopen("./libdota2bridge.so", {
  Connect: { args: [FFIType.cstring, FFIType.cstring], returns: FFIType.int },
  CreateLobby: { args: [FFIType.cstring], returns: FFIType.int },
});

lib.symbols.Connect("mySteamUser", "mySteamPass");
lib.symbols.CreateLobby("Fun Lobby");
```

This allows calling Go-powered Dota 2 functions directly from Bun/Node.

---

## 6. Next Steps

- Add async event handling (lobby updates, match results).
- Store match/lobby data in DB.
- Add user accounts & Steam OAuth.
- Build frontend for lobby/tournament management.

---

**References:**

- [go-dota2 GitHub](https://github.com/paralin/go-dota2)
- [OpenDota API](https://docs.opendota.com/)
- [Bun FFI Docs](https://bun.sh/docs/api/ffi)
