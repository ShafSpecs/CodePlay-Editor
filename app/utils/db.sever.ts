import { PrismaClient } from "@prisma/client";

let db: PrismaClient;

declare global {
  var __db: PrismaClient | undefined;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
  db = new PrismaClient();
  db.$connect();
} else {
  if (!global.__db) {
    global.__db = new PrismaClient();
    global.__db.$connect();
  }
  db = global.__db;
}

export const createPen = async (pen: any) => {
  const data = await db.pen.create({
    data: {
      title: pen.title,
      html: pen.html,
      css: pen.css,
      js: pen.js,
    }
  })

  console.log(data)
}

export { db };