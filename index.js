const { Client, LocalAuth, MessageMedia } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const path = require("path");

const client = new Client();

client.once("ready", () => {
  console.log("Client is ready!");
});
client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
  console.log("QR RECEIVED", qr);
});

client.on("message", async (msg) => {
  if (msg.body === "!ping") {
    msg.reply("pong");
  }

  if (msg.hasMedia) {
    const media = await msg.downloadMedia();
    const dir = "./media-downloads/";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const fileName = `${new Date().getTime()}-${msg.id.id}.${
      media.mimetype.split("/")[1]
    }`;
    const filePath = path.join(dir, fileName);
    fs.writeFileSync(filePath, media.data, { encoding: "base64" });
    console.log(`Media saved to: ${filePath}`);
  }
});

client.initialize();
