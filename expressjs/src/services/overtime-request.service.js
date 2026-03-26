import { buildQueryPrisma } from "../common/helpers/build-query-prisma.helper.js";
import { BadRequestException } from "../common/helpers/exception.helper.js";
import { prisma } from "../common/prisma/connect.prisma.js";

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
    const date = req.body.date;
    const startTime = req.body.startTime;
    const endTime = req.body.endTime;
    const reason = String(req.body.reason).trim();

    const [year, month, day] = date.split("-").map(Number);
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const startDateTime = new Date(
      year,
      month - 1,
      day,
      startHour,
      startMinute,
      0,
    );
    const endDateTime = new Date(year, month - 1, day, endHour, endMinute, 0);
    const totalHours = Number(
      (
        (endDateTime.getTime() - startDateTime.getTime()) /
        (1000 * 60 * 60)
      ).toFixed(2),
    );

    const created = await prisma.overtimeRequests.create({
      data: {
        userId: req.user.id,
        date: new Date(year, month - 1, day),
        startTime: startDateTime,
        endTime: endDateTime,
        hours: totalHours,
        reason,
      },
    });

    return {
      id: created.id,
      date,
      startTime,
      endTime,
      reason: created.reason,
      status: created.status,
      createdAt: created.createdAt,
    };
  },

  async findAll(req) {
    const { index, page, pageSize, where } = buildQueryPrisma(req);
    const baseWhere = { ...where, userId: req.user.id };

    const [items, totalItem] = await Promise.all([
      prisma.overtimeRequests.findMany({
        where: baseWhere,
        skip: index,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.overtimeRequests.count({ where: baseWhere }),
    ]);

    const totalPage = Math.ceil(totalItem / pageSize);
    return { totalItem, totalPage, page, pageSize, items };
  },
};
