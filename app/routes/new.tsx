import React from "react";
import { useFetcher, useLoaderData, redirect, Link } from "remix";
import { getUser } from "~/utils/session.server";

import SplitPane from "react-split-pane";

import type { ActionFunction, ErrorBoundaryComponent, LoaderFunction } from "remix";

import {
  JavascriptEditor,
  CssEditor,
  HtmlEditor,
} from "../components/editor.client";
import { useDebounce } from "../hooks/useDebounce";
import { ClientOnly } from "remix-utils";
import { db } from "~/utils/db.server";
import { generateSlug } from "random-word-slugs";

import stylesUrl from "../styles/new.css";

const random_number = require("random-number");

export function links() {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const user = await getUser(request);
  console.log(user)

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