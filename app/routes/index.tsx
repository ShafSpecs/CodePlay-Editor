import { useLoaderData, redirect, Form, Link } from "remix";
import { getUser } from "~/utils/session.server";
import { User } from "@prisma/client";
import { db } from "~/utils/db.server";
import { formatDistanceToNowStrict } from "date-fns";

import styles from "../styles/index.css";

import type { LoaderFunction, LinksFunction } from "remix";

type LoaderData = {
  user: User | null;
};

type PenData = {
  pens: {
    title: string;
    penId: number;
    updatedAt: Date;
  }[];
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<(PenData & LoaderData) | null> => {
  const user = await getUser(request);

  if (!user) {
    return null;
  }

  const pens = await db.pen.findMany({
    take: 5,
    where: {
      authorId: {
        contains: user.id,
      },
    },
    select: {
      penId: true,
      title: true,
      updatedAt: true,
    },
  });

  return { user, pens };
};

function GridCard({ name, date, link }: any) {
  return (
    <Link to={`/pen/${link}`}>
      <div className="card">
        <h3>{name}</h3>
        <p>
          <span>Last updated: </span>
          {date} ago
        </p>
      </div>
    </Link>
  );
}

export default function Index() {
  const data = useLoaderData<PenData & LoaderData>();
  
  return (
    <div className="page">
      <header>
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
        {data ? (
          <div className="right">
            <Link to="/dashboard">
              <div className="dashboard">Dashboard</div>
            </Link>
            <Form action="/logout" method="post">
              <button type="submit" className="logout">
                Log Out
              </button>
            </Form>
            <div className="user">{data && data.user?.icon}</div>
          </div>
        ) : (
          <Link to="/login">
            <div className="login">Log In</div>
          </Link>
        )}
      </header>
      <section className="main">
        <Link to="/new">
          <button className="btn">+ Create New Pen</button>
        </Link>
        {data && (
          <section className="recent">
            <div className="header">Recent Pens</div>
            <div className="grid">
              {data.pens?.map((pen) => (
                <GridCard
                  key={pen.penId}
                  name={pen.title}
                  date={formatDistanceToNowStrict(new Date(pen.updatedAt))}
                  link={pen.penId}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </div>
  );
}
