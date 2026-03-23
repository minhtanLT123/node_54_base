import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma/connect.prisma.js";
import { tokenService } from "../../services/token.service.js";

export const initSocket = (app) => {
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    /* options */
  });

  io.on("connection", (socket) => {
    console.log("socket-id: ", socket.id);
    // khi chưa có chatGroup nào
    // trạng thái ban đầu, mà user mốn nhắn tine với 1 người mới hoàn toàn
    socket.on("CREATE_ROOM", async (data, cb) => {
      try {
        let { targetUserIds, accessToken, name } = data;

        const { userId } = tokenService.verifyAccessToken(accessToken, {
          ignoreExpiration: true,
        });
        const userExits = await prisma.users.findUnique({
          where: {
            id: userId,
          },
        });
        if (!userExits) {
          throw new Error("User không tồn tại");
        }

        const targetUserIdsSet = new Set([...targetUserIds, userExits.id]);
        const targetUserIdsUnique = Array.from(targetUserIdsSet);

        if (targetUserIdsUnique.length === 2) {
          // tạo chatGroup 1 - 1
          // chat 1 - 1 chỉ tồn tại 1 chatGroup thôi

          // kiểm tra xem chatGroup đó đã tồn tại chưa

          let chatGroup = await prisma.chatGroups.findFirst({
            where: {
              ChatGroupMembers: {
                // every: tất cả phải khớp
                // none: không khớp
                // some: chỉ cần 1 cái khớp
                every: {
                  userId: {
                    in: targetUserIdsUnique,
                  },
                },
              },
            },
          });

          // nếu chưa tồn tại chatGroup thì tạo mới
          if (!chatGroup) {
            chatGroup = await prisma.chatGroups.create({
              data: {
                ownerId: userExits.id,
                // tham khảo cú pháp tạo nhanh của prisma
                // ChatGroupMembers: {
                //     createMany: {
                //         data: [
                //             { userId: targetUserIdsUnique[0] }, //
                //             { userId: targetUserIdsUnique[1] },
                //         ],
                //     },
                // },
              },
            });
            await prisma.chatGroupMembers.createMany({
              data: [
                { userId: targetUserIdsUnique[0], chatGroupId: chatGroup.id }, //
                { userId: targetUserIdsUnique[1], chatGroupId: chatGroup.id },
              ],
            });
          }

          // nếu đã tồn tại, thì đi tiếp
          chatGroup;
          socket.join(`chat:${chatGroup.id}`);
          cb({
            status: "success",
            message: "Tạo phòng thành công",
            data: {
              chatGroupId: chatGroup.id,
            },
          });
          console.log("CREATE_ROOM", {
            targetUserIds,
            accessToken,
            targetUserIdsUnique,
            userId,
            chatGroup,
          });
        } else {
          // tạo chatGroup nhóm nhiều thành viên
          const chatGroup = await prisma.chatGroups.create({
            data: {
              name: name,
              ownerId: userExits.id,
            },
          });

          await prisma.chatGroupMembers.createMany({
            data: targetUserIdsUnique.map((userId) => {
              return { userId: userId, chatGroupId: chatGroup.id };
            }),
          });
          socket.join(`chat:${chatGroup.id}`);

          cb({
            status: "success",
            message: "Tạo phòng thành công",
            data: {
              chatGroupId: chatGroup.id,
            },
          });
        }
      } catch (error) {
        cb({
          status: "error",
          data: null,
          message: error.message || "Lỗi không xác định",
        });
      }
    });
    // khi đã có chatGroup rồi
    // user click vào một chatGroup (1 box chat)
    socket.on("JOIN_ROOM", async (data, cb) => {
      const { chatGroupId, accessToken } = data;

      const { userId } = tokenService.verifyAccessToken(accessToken, {
        ignoreExpiration: true,
      });
      const userExits = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userExits) {
        throw new Error("User không tồn tại");
      }

      socket.join(`chat:${chatGroupId}`);

      console.log("tất cả các room", io.sockets.adapter.rooms);

      console.log("JOIN_ROOM", { chatGroupId, accessToken });
    });

    socket.on("SEND_MESSAGE", async (data) => {
      const { chatGroupId, message, accessToken } = data;

      const { userId } = tokenService.verifyAccessToken(accessToken, {
        ignoreExpiration: true,
      });
      const userExits = await prisma.users.findUnique({
        where: {
          id: userId,
        },
      });
      if (!userExits) {
        throw new Error("User không tồn tại");
      }

      const createdAt = new Date().toISOString();

      io.to(`chat:${chatGroupId}`).emit(`SEND_MESSAGE`, {
        messageText: message,
        userIdSender: userExits.id,
        chatGroupId: chatGroupId,
        createdAt: createdAt,
      });

      // để sau io.to => để đạt tốc độ tốt nhất
      await prisma.chatMessages.create({
        data: {
          chatGroupId: chatGroupId,
          messageText: message,
          userIdSender: userExits.id,
          createdAt: createdAt,
        },
      });

      console.log("SEND_MESSAGE", { chatGroupId, message, accessToken });
    });
  });

  return httpServer;
};
