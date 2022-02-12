import { Form, useSearchParams, useActionData, json, Link } from "remix";
import { db } from "~/utils/server/db.server";
import {
  login,
  register,
  createUserSession,
} from "~/utils/server/session.server";
import { createAvatar } from "@dicebear/avatars";
import * as style from "@dicebear/avatars-identicon-sprites";

import type { ActionFunction } from "remix";

import styles from "../styles/login.css";

export const links = () => {
  return [{ rel: "stylesheet", href: styles }];
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    loginType: string;
    username: string;
    password: string;
  };
};

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const loginType = form.get("loginType");
  const username = form.get("username");
  const password = form.get("password");
  const redirectTo = form.get("redirectTo") || "/";

  const lucky_number = Math.random() * 10;

  const iconArray: string[] = [
    "🤖",
    "😎",
    "🤡",
    "👾",
    "🐱‍👤",
    "👨‍💻",
    "💿",
    "💻",
    "😄",
    "🥳",
  ];

  if (
    typeof loginType !== "string" ||
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }

  const fields = { loginType, username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });

  switch (loginType) {
    case "login": {
      const user = await login({ username, password });
      if (!user) {
        return badRequest({
          fields,
          formError: `Username/Password combination is incorrect`,
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    case "register": {
      const userExists = await db.user.findFirst({
        where: { username },
      });
      if (userExists) {
        return badRequest({
          fields,
          formError: `User with username ${username} already exists`,
        });
      }
      const user = await register({
        username,
        password,
        icon: iconArray[Math.round(lucky_number) - 1],
      });
      if (!user) {
        return badRequest({
          fields,
          formError: `Something went wrong trying to create a new user.`,
        });
      }
      return createUserSession(user.id, redirectTo);
    }
    default: {
      return badRequest({
        fields,
        formError: `Login type invalid`,
      });
    }
  }
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  const [searchParams] = useSearchParams();

  return (
    <div className="page">
      <header>
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="logo"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              className="logo"
              fillRule="evenodd"
              d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
              clipRule="evenodd"
            />
          </svg>
          <div className="title">Codeplay</div>
        </Link>
      </header>
      <div className="page-content">
        <section className="go-back">
          <Link to="/">
            <span>&#8592;</span> Go back
          </Link>
        </section>
        <div className="container">
          <h2>Login to CodePlay</h2>
          <Form
            action="/login"
            method="post"
            aria-describedby={
              actionData?.formError ? "form-error-message" : undefined
            }
          >
            <input
              type="hidden"
              name="redirectTo"
              value={searchParams.get("redirectTo") ?? undefined}
            />
            <fieldset>
              <legend className="sr-only">Login or Register?</legend>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="login"
                  defaultChecked={
                    !actionData?.fields?.loginType ||
                    actionData?.fields?.loginType === "login"
                  }
                />{" "}
                Login
              </label>
              <label>
                <input
                  type="radio"
                  name="loginType"
                  value="register"
                  defaultChecked={actionData?.fields?.loginType === "register"}
                />{" "}
                Register
              </label>
            </fieldset>
            <div>
              <label htmlFor="username-input">Username</label>
              <input
                type="text"
                id="username-input"
                name="username"
                defaultValue={actionData?.fields?.username}
                aria-invalid={Boolean(actionData?.fieldErrors?.username)}
                aria-describedby={
                  actionData?.fieldErrors?.username
                    ? "username-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.username ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="username-error"
                >
                  {actionData?.fieldErrors.username}
                </p>
              ) : null}
            </div>
            <div>
              <label htmlFor="password-input">Password</label>
              <input
                id="password-input"
                name="password"
                defaultValue={actionData?.fields?.password}
                type="password"
                aria-invalid={
                  Boolean(actionData?.fieldErrors?.password) || undefined
                }
                aria-describedby={
                  actionData?.fieldErrors?.password
                    ? "password-error"
                    : undefined
                }
              />
              {actionData?.fieldErrors?.password ? (
                <p
                  className="form-validation-error"
                  role="alert"
                  id="password-error"
                >
                  {actionData?.fieldErrors.password}
                </p>
              ) : null}
            </div>
            <div id="form-error-message">
              {actionData?.formError ? (
                <p className="form-validation-error" role="alert">
                  {actionData?.formError}
                </p>
              ) : null}
            </div>
            <button type="submit" className="button">
              Submit
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
}
