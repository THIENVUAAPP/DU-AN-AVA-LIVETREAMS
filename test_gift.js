const { io } = require("socket.io-client");
const socket = io("http://localhost:3001");
socket.on("connect", () => {
  console.log("Connected to server");
  const payload = {
    userId: "123456",
    uniqueId: "test_user_vip",
    nickname: "Test User VIP",
    username: "Test User VIP",
    giftId: "rose",
    giftName: "Hoa Hồng",
    diamondCount: 1,
    count: 1,
    repeatCount: 1,
    totalRepeatCount: 1,
    profilePictureUrl: "",
    avatar: ""
  };
  socket.emit("tiktok_gift", payload);
  // Wait, server.cjs doesn't handle `tiktok_gift` from client to server!
  // TikTokConnector emits it.
});
