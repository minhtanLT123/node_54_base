import { createServer } from "http";
import { Server } from "socket.io";

export const initSocket = (app) => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    /* options */
  });

  io.on("connection", (socket) => {
    console.log("socket-id: ", socket.id);

    socket.on("CREATE_ROOM", async (data, cb) => {
      let { targetUserIds, accessToken } = data;

      const { userId } = tokenService.verifyAccessToken(accessToken);
      const userExits = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });

      const targetUserIdsSet = new Set([...targetUserIds, userExits.id]);
      const targetUserIdsUnique = Array.from(targetUserIdsSet);

      if (targetUserIdsUnique.length === 2) {
        // chat 1 - 1
      } else {
        // chat nhóm
      }

      console.log("CREATE_ROOM", {
        targetUserIds,
        accessToken,
        targetUserIdsUnique,
        userId,
      });
    });
  });

  return httpServer;
};
