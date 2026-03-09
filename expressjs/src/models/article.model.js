import { DataTypes, Sequelize } from "sequelize";
import sequelize from "../common/sequelize/connect.sequelize.js";

const Article = sequelize.define(
  "Article", // model name: tên cục bộ sử dụng trong sequelize
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.TEXT,
    },
    imageUrl: {
      type: DataTypes.STRING,
    },
    views: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        key: "id",
        model: "Users", // phải chính xác tên trong database
      },
    },
    deletedBy: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    isDeleted: {
      type: DataTypes.BOOLEAN, // tiny (1): chỉ chứa 2 giá trị: 0 và số 1
      defaultValue: 0, // 0: false, 1: true
    },
    deletedAt: {
      type: "TIMESTAMP",
      defaultValue: null,
      allowNull: true,
    },
    createdAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: "TIMESTAMP",
      allowNull: false,
      defaultValue: Sequelize.literal(
        "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
      ),
    },
  },
  {
    tableName: "Articles_demo",
    timestamps: false,
  },
);

// CODE FIRST
await Article.sync();

export default Article;
