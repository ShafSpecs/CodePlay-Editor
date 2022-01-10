import React from "react";
import SplitPane from "react-split-pane";

import { JavascriptEditor, CssEditor, HtmlEditor } from "../components/editor.client";
import { useDebounce } from "../hooks/useDebounce";
import { ClientOnly } from "remix-utils";
import stylesUrl from "../styles/index.css";

export function links() {
  return [{ rel: "stylesheet", href: stylesUrl }];
}

export default function Index() {
  const [heightValue, setHeightValue] = React.useState("300px");

  const [htmlValue, setHtmlValue] = React.useState(``);
  const [jsValue, setJsValue] = React.useState("");
  const [cssValue, setCssValue] = React.useState("");
  const [outputValue, setOutputValue] = React.useState("");

  const debouncedHtml = useDebounce(htmlValue, 1000);
  const debouncedJs = useDebounce(jsValue, 1000);
  const debouncedCss = useDebounce(cssValue, 1000);

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
    <SplitPane
      split="horizontal"
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
  );
}
