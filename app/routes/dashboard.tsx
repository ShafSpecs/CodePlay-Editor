import React from "react";
import { Form, redirect, useLoaderData } from "remix";
import { User } from "@prisma/client";
import { getUser } from "~/utils/session.server";

import { db } from "~/utils/db.server";

import styles from "../styles/dashboard.css";

import type { LinksFunction, LoaderFunction } from "remix";

type LoaderData = {
  user: User | null;
};

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

export const loader: LoaderFunction = async ({
  request,
}): Promise<LoaderData | Response> => {
  const user = await getUser(request);
  if (!user) {
      return redirect("/login");
  }
  return { user };
};

function GridCard ({ name, date}: any) {
    return (
        <div className="card">
            <h3>{name}</h3>
            <p><span>Last updated: </span>{date}</p>
        </div>
    )
}

export default function Dashboard() {
  const data = useLoaderData<LoaderData>();
  const { user } = data;
  console.log(user);

  return (
    <div>
      <section className="hero">
        <div className="hero-img">
          <div className="hero-profile"></div>
        </div>
      </section>
      <section className="sub-title">
        <h2 className="info">{`Hello there ${user?.username} 👋`}</h2>
        <Form action="/logout" method="post">
          <button className="sign-out">Sign Out</button>
        </Form>
      </section>
      <section className="pen">
        <div className="header">Your Work</div>
        <div className="grid">
            <GridCard name='test' date='2 months ago' />
            <GridCard name='test' date='2 months ago' />
            <GridCard name='test' date='2 months ago' />
            <GridCard name='test' date='2 months ago' />
            <GridCard name='test' date='2 months ago' />
            <GridCard name='test' date='2 months ago' />
            <GridCard name='test' date='2 months ago' />
        </div>
      </section>
    </div>
  );
}
