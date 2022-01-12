import React from "react";
import {
  useFetcher,
  useLoaderData,
  redirect
} from 'remix'

import SplitPane from "react-split-pane";

import type { LoaderFunction, ActionFunction } from "remix";

import { JavascriptEditor, CssEditor, HtmlEditor } from "../components/editor.client";
import { useDebounce } from "../hooks/useDebounce";
import { ClientOnly } from "remix-utils";
import { db } from "~/utils/db.sever";

import stylesUrl from "../styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  
  const data = await db.pen.create({
    data: {
      //@ts-ignore
      title: body.get("title"),
      //@ts-ignore
      html: body.get("html"),
      //@ts-ignore
      css: body.get("css"),
      //@ts-ignore
      js: body.get("js")
    }
  })

  console.log(body)
  return redirect(`/${data.id}`)
}

export const loader: LoaderFunction = async () => {
  const data = 1
  return { data }
}

export default function Index() {
  const data = useLoaderData()
  const fetcher = useFetcher()

  const [heightValue, setHeightValue] = React.useState("300px");

  const [htmlValue, setHtmlValue] = React.useState(``);
  const [jsValue, setJsValue] = React.useState("");
  const [cssValue, setCssValue] = React.useState("");
  const [outputValue, setOutputValue] = React.useState("");

  const debouncedHtml = useDebounce(htmlValue, 1000);
  const debouncedJs = useDebounce(jsValue, 1000);
  const debouncedCss = useDebounce(cssValue, 1000);

  console.log(data)

  const submit = async () => {
    fetcher.submit({html: htmlValue, css: cssValue, js: jsValue, title: 'tie'}, {method: 'post'})
  }

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
        <h3>Name</h3>
        <div className="btns">
          <button onClick={submit}>
            Save
          </button>
          <button>
            Load
          </button>
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
