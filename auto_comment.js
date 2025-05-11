// Auto Comment Bot mit steem.js

const steem = require("steem");
const fs = require("fs");
const axios = require("axios");
const path = require("path");

// === Konfiguration ===
const settings = require("./settings.json")[0];
const account = settings.account;
const postingKey = settings.key;
const webhookUrl = settings.discord_webhook;
const nodes = settings.nodes || ["https://api.steemit.com"];

async function initNode() {
  for (const node of nodes) {
    try {
      steem.api.setOptions({ url: node });
      await new Promise((resolve, reject) => {
        steem.api.getDynamicGlobalProperties((err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      console.log(`🌐 Verbindung hergestellt zu Node: ${node}`);
      return;
    } catch (err) {
      console.warn(`⚠️ Node nicht erreichbar: ${node}`);
    }
  }
  console.error("❌ Kein aktiver Node gefunden. Bot wird beendet.");
  process.exit(1);
}

const MESSAGE = `
<h3>🎉 Congratulations!</h3>
<p>Your post has been upvoted by <strong>CCS Curation Trail</strong> – a community powered by witness <a href="https://steemit.com/@visionaer3003">@visionaer3003</a>.</p>

<p align="center">
  <img src="https://cdn.steemitimages.com/DQmc3DyanLgpkbSkuYmLQR7Rw3apNdoWKJF7uB6mB6xkEJM/png_20230714_223610_0000.png" alt="CCS Logo">
</p>

<p style="text-align:center;"><em>“Home is where your heart is ❤️.”</em></p>

<p align="center">
  👉 <a href="https://ccsvote.campingclub.me">Join the CCS Curation Trail</a> |
  <a href="https://steemit.com/ccs/@emranhasan/follow-ccs-curation-trail-inviting-all-user-of-our-ccs-community">Full Community Invitation</a>
</p>

<hr>

<p align="center">
  <img src="https://cdn.steemitimages.com/DQmXSVqwZ6r341K5gywpqYU6JRoMwLSSJFwsQ6GL8Pw8qjc/cyxkEVqiiLy2ofdgrJNxeZC3WCHPBwR7MjUDzY4kBNr81LgoDfTovZFjKgw6zMQtAnAPjGMC8RWTcjJfJscBJfnwR4Gi8DzYa91VcGQiVQ6nybhCecG6tn97bGn4jfYjj26.png" style="max-width:100%; height:auto;" alt="Vote Banner">
</p>

<p align="center">
  ✅ <a href="https://steemitwallet.com/~witnesses">Vote for @visionaer3003 as witness</a>
</p>
`;

function sendDiscordAlert(message) {
  if (!webhookUrl) return;
  axios.post(webhookUrl, { content: message }).catch((err) => {
    console.error("❌ Discord-Webhook fehlgeschlagen:", err.message);
  });
}

function logVote(op) {
  const filename = path.join(__dirname, "vote_log.csv");
  const row = `${new Date().toISOString()},${op.voter},${op.author},${op.permlink},${op.weight / 100}\n`;
  if (!fs.existsSync(filename)) {
    fs.writeFileSync(filename, "timestamp,voter,author,permlink,weight\n");
  }
  fs.appendFileSync(filename, row);
}

function sendComment(author, permlink) {
  const permlinkComment = `${Math.floor(Math.random() * 10000)}-auto-comment-${Math.floor(Math.random() * 10000)}`;
  steem.broadcast.comment(
    postingKey,
    author,
    permlink,
    account,
    permlinkComment,
    "",
    MESSAGE,
    JSON.stringify({ app: "CCSAutoCommentBot/1.0" }),
    (err, result) => {
      if (err) {
        console.error("❌ Fehler beim Kommentieren:", err.message);
      } else {
        console.log(`✅ Kommentar gepostet an @${author}/${permlink}`);
      }
    }
  );
}

function startStream() {
  console.log("✅ Bot lauscht auf Votes...");
  steem.api.streamOperations((err, op) => {
    if (err) {
      console.error("❌ Stream-Fehler:", err.message);
      return;
    }
    if (op[0] === "vote") {
      const data = op[1];
      if (data.voter === account) {
        console.log(`📨 Vote erkannt: @${data.author}/${data.permlink} mit ${data.weight / 100}%`);
        logVote(data);
        sendComment(data.author, data.permlink);
      }
    }
  });
}

initNode().then(startStream);
