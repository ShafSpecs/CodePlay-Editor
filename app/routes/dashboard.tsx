import { Form, Link, redirect, useLoaderData } from "remix";
import { User } from "@prisma/client";
import { getUser } from "~/utils/server/session.server";
import { db } from "~/utils/server/db.server";
import { formatDistanceToNowStrict } from "date-fns";

import styles from "../styles/dashboard.css";

import type { LinksFunction, LoaderFunction } from "remix";

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
}): Promise<(PenData & LoaderData) | Response> => {
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }
  const pens = await db.pen.findMany({
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

export default function Dashboard() {
  const data = useLoaderData<PenData & LoaderData>();
  const { user, pens } = data;

  return (
    <div>
      <section className="hero">
        <div className="hero-img">
          <div className="hero-profile">{user?.icon}</div>
        </div>
      </section>
      <section className="sub-title">
        <h2 className="info">{`Hello there ${user?.username} 👋`}</h2>
      </section>
      <section className="pen">
        <div className="header">
          Your Work
          <div className="right-side">
            <Link to="/new">
              <button>New Pen</button>
            </Link>
            <Form action="/logout" method="post">
              <button className="sign-out">Sign Out</button>
            </Form>
          </div>
        </div>
        <div className="grid">
          {pens.map((pen) => (
            <GridCard
              key={pen.title}
              link={pen.penId}
              name={pen.title}
              date={formatDistanceToNowStrict(new Date(pen.updatedAt))}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
