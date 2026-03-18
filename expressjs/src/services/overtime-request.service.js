import crypto from "crypto";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";

const OVERTIME_STATUS_PENDING = "pending";

const createOvertimeTableIfNotExists = async () => {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS overtime_requests (
      id INT AUTO_INCREMENT PRIMARY KEY,
      requestCode VARCHAR(36) NOT NULL UNIQUE,
      userId INT NOT NULL,
      date DATE NOT NULL,
      startTime TIME NOT NULL,
      endTime TIME NOT NULL,
      reason TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX overtime_requests_user_id_idx (userId)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
};

const parseTimeToMinutes = (value) => {
  const [hour, minute] = String(value).split(":").map(Number);
  if (Number.isNaN(hour) || Number.isNaN(minute)) return NaN;
  return hour * 60 + minute;
};

const validatePayload = (body) => {
  const { date, startTime, endTime, reason } = body || {};

  if (!date || !startTime || !endTime || !reason) {
    throw new BadRequestException("Thiếu thông tin đăng ký tăng ca");
  }

  const startMinute = parseTimeToMinutes(startTime);
  const endMinute = parseTimeToMinutes(endTime);
  if (
    Number.isNaN(startMinute) ||
    Number.isNaN(endMinute) ||
    endMinute <= startMinute
  ) {
    throw new BadRequestException("Khung giờ tăng ca không hợp lệ");
  }

  if (String(reason).trim().length < 10) {
    throw new BadRequestException("Lý do tăng ca phải có ít nhất 10 ký tự");
  }
};

export const overtimeRequestService = {
  async create(req) {
    validatePayload(req.body);
    await createOvertimeTableIfNotExists();

    const requestCode = crypto.randomUUID();
    const date = req.body.date;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const reason = String(req.body.reason).trim();

    await prisma.$executeRaw`
      INSERT INTO overtime_requests (requestCode, userId, date, startTime, endTime, reason, status)
      VALUES (${requestCode}, ${req.user.id}, ${date}, ${startTime}, ${endTime}, ${reason}, ${OVERTIME_STATUS_PENDING})
    `;

    const rows = await prisma.$queryRaw`
      SELECT
        requestCode,
        DATE_FORMAT(date, '%Y-%m-%d') AS date,
        DATE_FORMAT(startTime, '%H:%i') AS startTime,
        DATE_FORMAT(endTime, '%H:%i') AS endTime,
        reason,
        status,
        createdAt,
        updatedAt
      FROM overtime_requests
      WHERE requestCode = ${requestCode}
      LIMIT 1
    `;

    const created = rows?.[0];
    if (!created) {
      throw new BadRequestException("Không thể tạo yêu cầu tăng ca");
    }

    return {
      id: created.requestCode,
      date: created.date,
      startTime: created.startTime,
      endTime: created.endTime,
      reason: created.reason,
      status: created.status,
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  },
};
