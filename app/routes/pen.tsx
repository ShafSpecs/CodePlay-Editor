import React from "react";
import {
  Outlet,
  useFetcher,
  useLoaderData,
  redirect,
  useCatch,
  Link,
} from "remix";
import { getUser } from "~/utils/session.server";

import SplitPane from "react-split-pane";
import { useDebounce } from "../hooks/useDebounce";
import { db } from "~/utils/db.server";
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
      '<input type="text" value="' + title + '" class="title-input"/>';
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

  typeof window !== "undefined" && window.addEventListener("click", (e) => {
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
