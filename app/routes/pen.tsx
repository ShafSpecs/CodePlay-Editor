import React from "react";
import { Outlet, useFetcher, useLoaderData, redirect, useCatch } from "remix";

import SplitPane from "react-split-pane";
import { generateSlug } from "random-word-slugs";
import { useDebounce } from "../hooks/useDebounce";
import { db } from "~/utils/db.sever";

import type {
  LoaderFunction,
  ActionFunction,
  ErrorBoundaryComponent,
} from "remix";

import stylesUrl from "../styles/pen.css";

const random_number = require("random-number");

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

export const loader: LoaderFunction = async ({ params }) => {
  const { penId } = params;

  const penData = await db.pen
    .findUnique({
      where: {
        //@ts-ignore
        penId: parseInt(penId),
      },
    })
    .catch((err: Error) => console.log(err));

  if (!penData) {
    redirect("/");
  }

  return {
    data: penData,
  };
};

export default function Pen() {
  const data = useLoaderData();
  const fetcher = useFetcher();

  const [heightValue, setHeightValue] = React.useState("300px");
  const [title, setTitle] = React.useState("");
  const [outputValue, setOutputValue] = React.useState("");
  const [htmlValue, setHtmlValue] = React.useState(``);
  const [jsValue, setJsValue] = React.useState("");
  const [cssValue, setCssValue] = React.useState("");

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
    setTitle(data.data.title);
    setHtmlValue(data.data.html);
    setCssValue(data.data.css);
    setJsValue(data.data.js);
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
      {
        html: htmlValue,
        css: cssValue,
        js: jsValue,
        title: title,
        data: data.data.penId,
      },
      { method: "post", action: "/pen" }
    );
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
          <button>Load</button>
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
    )
}