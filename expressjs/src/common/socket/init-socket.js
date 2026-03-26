import { createServer } from "http";
import { Server } from "socket.io";
import { prisma } from "../prisma/connect.prisma.js";
import { tokenService } from "../../services/token.service.js";

const getAuthorizedUser = async (accessToken) => {
  if (!accessToken) {
    throw new Error("Thiếu accessToken");
  }

  const { userId } = tokenService.verifyAccessToken(accessToken, {
    ignoreExpiration: true,
  });
  const user = await prisma.users.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("User không tồn tại");
  }

  return user;
};

const ensureChatMember = async (chatGroupId, userId) => {
  const membership = await prisma.chatGroupMembers.findFirst({
    where: {
      chatGroupId,
      userId,
    },
  });

  if (!membership) {
    throw new Error("Bạn không thuộc phòng chat này");
  }

  return membership;
};

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
        const userExits = await getAuthorizedUser(accessToken);

        if (!Array.isArray(targetUserIds) || targetUserIds.length === 0) {
          throw new Error("Danh sách thành viên không hợp lệ");
        }

        const targetUserIdsSet = new Set([...targetUserIds, userExits.id]);
        const targetUserIdsUnique = Array.from(targetUserIdsSet).map(Number);

        if (targetUserIdsUnique.length === 2) {
          // tạo chatGroup 1 - 1
          // chat 1 - 1 chỉ tồn tại 1 chatGroup thôi

          // kiểm tra xem chatGroup đó đã tồn tại chưa

          let chatGroup = await prisma.chatGroups.findFirst({
            where: {
              ChatGroupMembers: {
                every: {
                  userId: {
                    in: targetUserIdsUnique,
                  },
                },
              },
            },
            include: {
              ChatGroupMembers: true,
            },
          });

          if (
            chatGroup &&
            chatGroup.ChatGroupMembers.length !== targetUserIdsUnique.length
          ) {
            chatGroup = null;
          }

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
            userId: userExits.id,
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
      try {
        const { chatGroupId, accessToken } = data;
        const normalizedChatGroupId = Number(chatGroupId);
        const userExits = await getAuthorizedUser(accessToken);

        await ensureChatMember(normalizedChatGroupId, userExits.id);

        socket.join(`chat:${normalizedChatGroupId}`);

        cb?.({
          status: "success",
          message: "Join phòng thành công",
          data: {
            chatGroupId: normalizedChatGroupId,
          },
        });

        console.log("tất cả các room", io.sockets.adapter.rooms);
        console.log("JOIN_ROOM", {
          chatGroupId: normalizedChatGroupId,
          userId: userExits.id,
        });
      } catch (error) {
        cb?.({
          status: "error",
          data: null,
          message: error.message || "Lỗi không xác định",
        });
      }
    });

    socket.on("SEND_MESSAGE", async (data, cb) => {
      try {
        const { chatGroupId, message, accessToken } = data;
        const normalizedChatGroupId = Number(chatGroupId);
        const normalizedMessage = message?.trim();
        const userExits = await getAuthorizedUser(accessToken);

        if (!normalizedMessage) {
          throw new Error("Nội dung tin nhắn không được để trống");
        }

        await ensureChatMember(normalizedChatGroupId, userExits.id);

        const createdMessage = await prisma.chatMessages.create({
          data: {
            chatGroupId: normalizedChatGroupId,
            messageText: normalizedMessage,
            userIdSender: userExits.id,
          },
        });

        const payload = {
          // Map sang định dạng TAllmessage của frontend
          messageText: createdMessage.messageText,
          userIdSender: String(createdMessage.userIdSender),
          chatGroupId: String(createdMessage.chatGroupId),
          createdAt: createdMessage.createdAt,
        };

        io.to(`chat:${normalizedChatGroupId}`).emit("SEND_MESSAGE", payload);
        cb?.({
          status: "success",
          message: "Gửi tin nhắn thành công",
          data: payload,
        });

        console.log("SEND_MESSAGE", {
          chatGroupId: normalizedChatGroupId,
          userId: userExits.id,
        });
      } catch (error) {
        cb?.({
          status: "error",
          data: null,
          message: error.message || "Lỗi không xác định",
        });
      }
    });
  });

  return httpServer;
};
