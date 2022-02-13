import bcrypt from "bcryptjs";
import { db } from '~/utils/server/db.server';
import {
  createCookieSessionStorage,
  redirect
} from "remix";

type LoginForm = {
  username: string;
  password: string;
  icon?: string;
};

export async function register({
  username,
  password,
  icon
}: LoginForm) {
  password = await bcrypt.hash(password, 10);
  return db.user.create({
    data: { username, password, icon }
  });
}

export async function login({
  username,
  password
}: LoginForm) {
  const user = await db.user.findUnique({
    where: { username }
  });
  if (!user) return null;
  const isCorrectPassword = await bcrypt.compare(
    password,
    user.password
  );
  if (!isCorrectPassword) return null;
  return user;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "RJ_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

export function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId || typeof userId !== "string") {
    const searchParams = new URLSearchParams([
      ["redirectTo", redirectTo]
    ]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (typeof userId !== "string") {
    return null;
  }

  try {
    const user = await db.user.findUnique({
      where: { id: userId }
    });
    return user;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await storage.getSession(
    request.headers.get("Cookie")
  );
  return redirect("/", {
    headers: {
      "Set-Cookie": await storage.destroySession(session)
    }
  });
}

export async function createUserSession(
  userId: string,
  redirectTo: string
) {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session)
    }
  });
}