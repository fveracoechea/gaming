**Steam API Integration for Match Validation (Example: Dota 2 &
Counter-Strike)**

---

### 1. Purpose

Integrating with the **Steam Web API** allows the tournament platform to
automatically validate match results, player participation, and stats for
supported games such as **Dota 2** and **Counter-Strike**. This ensures
integrity in competitive play, reduces manual reporting, and builds player
trust.

---

### 2. Goals

- Automatically verify that a match has occurred and confirm the winner.
- Fetch player Steam IDs and confirm registered participants took part in the
  match.
- Retrieve match statistics (scores, kills, duration, etc.) for record-keeping.
- Detect discrepancies between reported results and actual data.

---

### 3. Supported Games

#### A. **Dota 2**

Dota 2 provides one of the most structured public APIs for match validation.

**Key API Endpoints:**

- `GetMatchDetails(v1)` – Retrieve match data by match ID.
- `GetMatchHistory(v1)` – Query recent matches by player or lobby.

**Core Data Points:**

- Match ID, start/end time.
- Radiant vs Dire results.
- Player list with Steam IDs.
- Kills, deaths, assists, hero IDs, and GPM/XPM.

**Integration Flow:**

1. Tournament system generates or validates a **match lobby ID**.
2. Once the game concludes, the system fetches match data using the organizer’s
   **Steam Web API key**.
3. The platform compares the match participants and result against expected
   players.
4. Match is marked as **verified** once all checks pass.

**Requirements:**

- Players must link their **Steam account** to their platform profile.
- Organizers or bots may need to run private lobbies with “public match history”
  enabled for participants.

---

#### B. **Counter-Strike (CS:GO / CS2)**

Counter-Strike APIs are more limited publicly but can still be used for
validation with either official APIs or game server logs.

**Approaches:**

1. **Game Server Log Uploads**

   - Custom game servers log match results (round wins, player Steam IDs, MVPs).
   - Platform fetches logs through SFTP, webhook, or direct server integration.

2. **Valve Game Coordinator (via GOTV / Game State Integration)**

   - Game servers push live or final match data to a specified HTTPS endpoint.
   - JSON payload includes map, score, and player list.

**Core Data Points:**

- Map name and duration.
- Team A/B scores.
- Steam IDs for all players.
- MVP count, kills, deaths, assists.

**Integration Flow:**

1. Organizer sets up a server with **Game State Integration (GSI)** config.
2. After match completion, the server automatically POSTs a match summary to the
   tournament platform.
3. Platform validates the data and updates match status.

**Requirements:**

- Organizers must host or have access to game servers.
- Players must link Steam IDs.
- API or webhook secrets must be configured securely.

---

### 4. Account Linking

Before a tournament starts:

- Players link their **Steam accounts** using OAuth via
  `https://steamcommunity.com/openid`.
- The platform stores their **SteamID64** for later match validation.
- When a match completes, the system uses this ID to cross-reference
  participation.

---

### 5. Validation Rules

When fetching data:

- Check that all registered players appear in the match player list.
- Confirm match occurred within the tournament window.
- Verify correct lobby or server ID.
- Compare winning team to tournament bracket expectation.
- Flag mismatches or missing players for manual review.

---

### 6. Data Storage & Audit

- Store match IDs, Steam IDs, and key stats for replay.
- Log API calls and responses for transparency.
- Optionally, allow players to view linked Steam match pages for verification.

---

### 7. Future Enhancements

- Add support for more Steam-integrated games (Team Fortress 2, Apex Legends,
  etc.).
- Implement replay file parsing for deeper stat insights.
- Introduce anti-cheat validation via VAC status checks.
- Provide automated Discord notifications for verified results.

---

**Outcome:** By integrating with the Steam Web API and game server endpoints,
the platform ensures accurate, automatic match verification for games like Dota
2 and Counter-Strike, minimizing disputes and enhancing trust in community-led
tournaments.
