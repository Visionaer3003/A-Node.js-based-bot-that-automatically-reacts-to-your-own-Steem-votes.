# CCS Auto Comment Bot (steem.js)

&#x20;

A Node.js-based bot that automatically reacts to your own Steem votes. It detects when your account upvotes a post, leaves a comment in response, and logs the action to a CSV file. Supports multiple RPC nodes and optional Discord notifications.

---

## 🚀 Features

* Listens to the blockchain and detects self-cast votes
* Automatically comments on the upvoted post
* Logs vote data to `vote_log.csv`
* Automatically connects to the first reachable node in the list
* Optional: sends error alerts to a Discord webhook

---

## ⚙️ Requirements

* Node.js (recommended: v18 or higher)
* Package manager: `npm`

### Installation:

```bash
npm install steem axios
```

---

## 📁 Project Structure

```
.
├── auto_comment.js       # Main bot script
├── vote_log.csv          # (auto-generated log)
├── settings.json         # Configuration file
└── README.md             # This documentation
```

### Example `settings.json`

```json
[
  {
    "account": "ccscurator",
    "key": "POSTING_KEY",
    "nodes": [
      "https://api.campingclub.me/",
      "https://api.moecki.online/",
      "https://api.pennsif.net/"
    ],
    "discord_webhook": "https://discord.com/api/webhooks/..."
  }
]
```

---

## ▶️ Run the Bot

```bash
node auto_comment.js
```

---

## 📌 Notes

* Uses `streamOperations` to detect blockchain activity in real-time
* Comments include a custom HTML template with community links and images
* Each vote is logged with timestamp, author, permlink, and weight

### 🖼 Example Comment Template Snippet

```html
<p align="center">
  <img src="https://cdn.steemitimages.com/DQmXSVqwZ6r341K5gywpqYU6JRoMwLSSJFwsQ6GL8Pw8qjc/cyxkEVqiiLy2ofdgrJNxeZC3WCHPBwR7MjUDzY4kBNr81LgoDfTovZFjKgw6zMQtAnAPjGMC8RWTcjJfJscBJfnwR4Gi8DzYa91VcGQiVQ6nybhCecG6tn97bGn4jfYjj26.png" style="max-width:100%; height:auto;" alt="Vote Banner">
</p>
```

---

## 🛠 Ideas for Extension

* Post-process curation rewards
* Build a web dashboard for vote analytics
* Add filters by tag or author
* Integrate with cron jobs or PM2

---

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---

© 2025 Camping Club Steem // Developed by @visionaer3003

