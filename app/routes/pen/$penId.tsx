import React, { useEffect } from "react"
import { useOutletContext } from "remix";

import SplitPane from "react-split-pane"
import { ClientOnly } from "remix-utils"
import { JavascriptEditor, CssEditor, HtmlEditor } from "../../components/editor.client";

import styles from "../../styles/pen-slug.css";

export let handle = { id: "penId" }; 

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export default function PenId() {
    const parentData: any = useOutletContext();

    const [heightValue, setHeightValue] = React.useState("300px");
    const [htmlValue, setHtmlValue] = React.useState(``);
    const [jsValue, setJsValue] = React.useState("");
    const [cssValue, setCssValue] = React.useState("");

    useEffect(() => {
        setHtmlValue(parentData.html);
        setJsValue(parentData.js);
        setCssValue(parentData.css);
    }, [parentData.html, parentData.js, parentData.css]);

    useEffect(() => {
        setHeightValue(parentData.height);
    }, [parentData.height]);

    return (
        <SplitPane split="vertical" minSize={"33%"}>
            <ClientOnly>
                <HtmlEditor
                    height={heightValue}
                    value={htmlValue}
                    onChange={(value: string) => {setHtmlValue(value); parentData.setHtml(value)}}
                    />
            </ClientOnly>
            <SplitPane split="vertical" minSize={"50%"}>
                <ClientOnly>
                    <CssEditor
                        height={heightValue}
                        value={cssValue}
                        onChange={(value: string) => {setCssValue(value); parentData.setCss(value)}}
                        />
                </ClientOnly>
                <ClientOnly>
                    <JavascriptEditor
                        height={heightValue}
                        value={jsValue}
                        onChange={(value: string) => {setJsValue(value); parentData.setJs(value)}}
                        />
                </ClientOnly>
            </SplitPane>
        </SplitPane>
    )
}