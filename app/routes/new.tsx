import React from "react";
import { useFetcher, useLoaderData, redirect, Link } from "remix";
import { getUser } from "~/utils/server/session.server";

import SplitPane from "react-split-pane";

import type { ActionFunction, ErrorBoundaryComponent, LoaderFunction } from "remix";

import {
  JavascriptEditor,
  CssEditor,
  HtmlEditor,
} from "../utils/client/editor.client";
import { useDebounce } from "../hooks/useDebounce";
import { ClientOnly } from "remix-utils";
import { db } from "~/utils/server/db.server";
import { generateSlug } from "random-word-slugs";

import stylesUrl from "../styles/new.css";

const random_number = require("random-number");

export function links() {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const user = await getUser(request);
  if (!user) {
    return redirect("/login");
  }

  const data = await db.pen.create({
    data: {
      //@ts-ignore
      penId: random_number({ min: 100000000, max: 999999999, integer: true }),
      //@ts-ignore
      title: body.get("title"),
      //@ts-ignore
      html: body.get("html"),
      //@ts-ignore
      css: body.get("css"),
      //@ts-ignore
      js: body.get("js"),
      //@ts-ignore
      authorId: user.id,
    },
  });

  return redirect(`/pen/${data.penId}`);
};

export const loader: LoaderFunction = async ({ params, request }) => {
  const user = await getUser(request);

  return {
    user
  };
}

export default function Index() {
  const data = useLoaderData();
  const fetcher = useFetcher();
  const { user } = data;

  const [heightValue, setHeightValue] = React.useState("300px");

  const [title, setTitle] = React.useState("");
  const [htmlValue, setHtmlValue] = React.useState(``);
  const [jsValue, setJsValue] = React.useState("");
  const [cssValue, setCssValue] = React.useState("");
  const [outputValue, setOutputValue] = React.useState("");

  const debouncedHtml = useDebounce(htmlValue, 1000);
  const debouncedJs = useDebounce(jsValue, 1000);
  const debouncedCss = useDebounce(cssValue, 1000);

  const titleRef = React.useRef<HTMLDivElement>(null!);
  const editRef = React.useRef<HTMLButtonElement>(null!);
  const saveRef = React.useRef<HTMLButtonElement>(null!);

  React.useEffect(() => {
    let number = Math.round(Math.random());
    number == 0 ? (number = 2) : (number = 3);

    const slug = generateSlug(number, { format: "title" });

    setTitle(slug);
  }, []);

  const edit = () => {
    titleRef.current.innerHTML =
      '<input type="text" value="' + title + '" class="title-input" placeholder="Enter the title of your project..."/>';
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

  const submit = async () => {
    fetcher.submit(
      { html: htmlValue, css: cssValue, js: jsValue, title: title },
      { method: "post" }
    );
  };

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

  return (
    <div className="container">
      <div className="header">
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
        <h3 ref={titleRef}>{title}</h3>
        <button onClick={edit} className="edit" ref={editRef}>
          Edit
        </button>
        <button onClick={save} className="save" ref={saveRef}>
          Save
        </button>
        <div className="right">
          <button onClick={submit}>Save</button>
          <button>Load</button>
          {user && <Link to='/dashboard'><div className="logo">{user.icon}</div></Link>}
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
        <SplitPane split="vertical" minSize={"33%"}>
          <ClientOnly>
            <HtmlEditor
              height={heightValue}
              value={htmlValue}
              onChange={setHtmlValue}
            />
          </ClientOnly>
          <SplitPane split="vertical" minSize={"50%"}>
            <ClientOnly>
              <CssEditor
                height={heightValue}
                value={cssValue}
                onChange={setCssValue}
              />
            </ClientOnly>
            <ClientOnly>
              <JavascriptEditor
                height={heightValue}
                value={jsValue}
                onChange={setJsValue}
              />
            </ClientOnly>
          </SplitPane>
        </SplitPane>
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
  )
}