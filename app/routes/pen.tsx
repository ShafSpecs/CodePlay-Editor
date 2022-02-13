import React from "react";
import {
  Outlet,
  useFetcher,
  useLoaderData,
  redirect,
  useCatch,
  Link,
} from "remix";
import { getUser } from "~/utils/server/session.server";

import SplitPane from "react-split-pane";
import { useDebounce } from "../hooks/useDebounce";
import { db } from "~/utils/server/db.server";
import { formatDistanceToNowStrict } from "date-fns";

import type {
  LoaderFunction,
  ActionFunction,
  ErrorBoundaryComponent,
} from "remix";

import stylesUrl from "../styles/pen.css";

export function links() {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();

  const data = await db.pen
    .update({
      where: {
        //@ts-ignore
        penId: parseInt(body.get("data")),
      },
      data: {
        //@ts-ignore
        title: body.get("title"),
        //@ts-ignore
        html: body.get("html"),
        //@ts-ignore
        css: body.get("css"),
        //@ts-ignore
        js: body.get("js"),
      },
    })
    .catch((err: Error) => console.log(err));

  return {
    data: data,
  };
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const { penId } = params;
  const user = await getUser(request);

  const penData = await db.pen
    .findUnique({
      where: {
        //@ts-ignore
        penId: parseInt(penId),
      },
    })
    .catch((err: Error) => console.log(err));

  if (!user) {
    return null;
  }

  const userPens = await db.pen
    .findMany({
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
    })
    .catch((err: Error) => console.log(err));

  if (!penData) {
    redirect("/");
  }

  return {
    penData,
    user,
    userPens,
  };
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

export default function Pen() {
  const data = useLoaderData();
  const fetcher = useFetcher();

  const { user, penData, userPens } = data;

  const modal = React.useRef<HTMLDivElement>(null!);

  const [heightValue, setHeightValue] = React.useState("300px");
  const [title, setTitle] = React.useState<string>("");
  const [outputValue, setOutputValue] = React.useState<string>("");
  const [htmlValue, setHtmlValue] = React.useState<string>(``);
  const [jsValue, setJsValue] = React.useState<string>("");
  const [cssValue, setCssValue] = React.useState<string>("");

  const debouncedHtml = useDebounce(htmlValue, 1000);
  const debouncedJs = useDebounce(jsValue, 1000);
  const debouncedCss = useDebounce(cssValue, 1000);

  const titleRef = React.useRef<HTMLDivElement>(null!);
  const editRef = React.useRef<HTMLButtonElement>(null!);
  const saveRef = React.useRef<HTMLButtonElement>(null!);

  React.useEffect(() => {
    const output = `<html>
                        <head>
                          <style>
                          ${debouncedCss}
                          </style>
                        </head>
                          <body>
                          ${debouncedHtml}
                          <script type="text/javascript">
                          ${debouncedJs}
                          </script>
                          </body>
                        </html>`;
    setOutputValue(output);
  }, [debouncedHtml, debouncedCss, debouncedJs]);

  React.useEffect(() => {
    setTitle(penData.title);
    setHtmlValue(penData.html);
    setCssValue(penData.css);
    setJsValue(penData.js);
  }, []);

  const edit = () => {
    titleRef.current.innerHTML =
      '<input type="text" value="' +
      title +
      '" class="title-input" placeholder="Enter the title of your project..."/>';
    editRef.current.style.display = "none";
    saveRef.current.style.display = "block";
  };

  const save = () => {
    const input = titleRef.current.firstChild as HTMLInputElement;
    const saved = input.value;
    saved.length > 0 ? setTitle(saved) : alert("Title cannot be empty");

    titleRef.current.innerText = title;
    editRef.current.style.display = "block";
    saveRef.current.style.display = "none";
  };

  const load = () => {
    modal.current.style.display = "flex";
  };

  typeof window !== "undefined" &&
    window.addEventListener("click", (e) => {
      if (e.target === modal.current) {
        modal.current.style.display = "none";
      }
    });

  const submit = async () => {
    if (!user) {
      return redirect("/login");
    } else {
      fetcher.submit(
        {
          html: htmlValue,
          css: cssValue,
          js: jsValue,
          title: title,
          data: penData.penId,
        },
        { method: "post", action: "/pen" }
      );
    }
  };

  return (
    <div className="container">
      <div className="header">
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="code-play"
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
        </Link>
        <h3 ref={titleRef}>{title}</h3>
        <button onClick={edit} className="edit" ref={editRef}>
          Edit
        </button>
        <button onClick={save} className="save" ref={saveRef}>
          Save
        </button>
        <div className="right">
          <button onClick={submit}>Save</button>
          <button className="load" onClick={load}>
            Load
          </button>
          {user && (
            <Link to="/dashboard">
              <div className="logo">{user.icon}</div>
            </Link>
          )}
        </div>
      </div>
      <div className="modal" ref={modal}>
        <div className="modal-content">
          <section className="title">
            <h3>Your Pens</h3>
          </section>
          <section className="pens">
            <div className="grid">
              {userPens.map((pen: any) => (
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
      </div>
      <SplitPane
        split="horizontal"
        className="editor-container"
        minSize={"50%"}
        onDragFinished={(height) => {
          setHeightValue(`${height - 40}px`);
        }}
      >
        <Outlet
          context={{
            height: heightValue,
            html: htmlValue,
            css: cssValue,
            js: jsValue,
            setHtml: setHtmlValue,
            setCss: setCssValue,
            setJs: setJsValue,
          }}
        />
        <iframe title={"Doc"} srcDoc={outputValue} className="previewIframe" />
      </SplitPane>
    </div>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = () => {
  return (
    <div className="error-boundary">
      <h1>Something went wrong</h1>
      <p>
        We are very sorry, but something went wrong. Please try again later.
      </p>
    </div>
  );
};

export const CatchBoundary = () => {
  return (
    <div className="catch-boundary">
      <h1>Something went wrong</h1>
      <p>
        We are very sorry, but something went wrong. Please try again later.
      </p>
    </div>
  );
};
