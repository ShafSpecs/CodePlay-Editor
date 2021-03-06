import AceEditor from 'react-ace';
import { ClientOnly } from "remix-utils";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-css"
import "ace-builds/src-noconflict/mode-javascript"
import "ace-builds/src-noconflict/mode-html"
import "ace-builds/src-noconflict/theme-tomorrow_night"

import styles from "../../styles/Editor.css";

export function links() {
    return [{ rel: "stylesheet", href: styles }];
}

export const JavascriptEditor = (props: any) => {
    return <ClientOnly><Editor mode="javascript" title={"JS"} {...props} /></ClientOnly>;
};

export const HtmlEditor = (props: any) => {
    return <ClientOnly><Editor mode="html" title={"HTML"} {...props} /></ClientOnly>;
};

export const CssEditor = (props: any) => {
    return <ClientOnly><Editor mode="css" title={"CSS"} {...props} /></ClientOnly>;
};

const Editor = ({ mode, onChange, value, title, height }: any) => {
    return (
        <ClientOnly>
            <div className='editorContainer' style={{backgroundColor: '#1f1f2b', height: '100%', color: '#CDCABC', position:'relative', margin: 0}}>
                <div className='editorTitle' style={{padding: '10px', fontFamily: 'Tahoma', fontWeight: 'bold'}}>
                    {title}
                </div>
                <AceEditor
                    mode={mode}
                    theme="pastel_on_dark"
                    name={title}
                    height={height}
                    width="100%"
                    value={value}
                    onChange={onChange}
                    setOptions={{
                        useWorker: false,
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        enableSnippets: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                    showPrintMargin={true}
                    showGutter={true}
                    highlightActiveLine={true}
                    wrapEnabled={true}
                />
            </div></ClientOnly>
    );
};

// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWMMM
// MMMMMMMMMMMMMMMMMMMMMMMMMMWWWWWWWWWWWWWWWWWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMWNNXXXNNNNNNNNNNNNNNNXXNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMWNKOOOKXXNNNNNNNNNNNNNNX0OKNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMWKxxkkO0KXNNNNNNNNNNNNNXKOOKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMWXkllxkO0XXNNNNNNNNNNNXKOO0NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMWO::ok0KXNNNNNNNNNNNXK00KWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMWx:cxO0XX0OkxxddolcccllxWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMXl;lldolcc:k0c;;;,,,. ,WMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMWo .;lcccldXWN00xc,,,olKWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMW0:';ccoxOXNWWW0c::;,.d0WWWK0O0NWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMMKOo;:clc:xXK0KNO:;;,.l;:Odoc:dXWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMWWNNNNNOol.,::cckoc:;:ol:lc:;'.''''ck0XWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMW0dc;;;;::oo:ccll::c;;;'.........',llcdOXMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMWKl;;;,''..............;:codxl;,,cddddkXWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMWNkc::;,..','dkxxOOOx:xxc;.'..cl:odoxXXWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMWXkl;lc:.:,.',..,,,cd'.':cl;;xx:ol:dO0WMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMNOxocc;.;l';:odxo,oKklxxddkOkclxoO00WMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMWX0odl:o;.lxkdOO0Kkd0KxOKOkkdo;;.  .oNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMWN00c;;c,.;ookO0KOdk0xcx0Odld;:.    .XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMXl;c:.. .,;dx00d'.;,;xOkdxO;kNo    'kNWWMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMWWKl,'     coxkO0OxoloO0xdkOxoK0.      .'cxxxkk0XWMWNWMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMWNOl,..       ..':k0kdoccllcod00ld;'x.      .;ooolllldkl:cxWMMMMMMMMMMMMMM
// MMMMMMMMMMNold,... .       .:;,:kOOxc,';oOk00x'...''.    .:oolcccllllc:;x0WMMMMMMMMMMMM
// MMMMMMMMMMx.,,'  . .         .:oddllodOKXXkl:.. ..,'       .llccccllloc',lNMMMMMMMMMMMM
// MMMMMMMMMW;.,;,.  .          ldxOkkoco0000k' .',',,'..     ,ll:;:lclOdc,.:'lNMMMMMMMMMM
// MMMMMMMMMMc  ..'..          :k,;cdxoxx;,cld;   .,,,...'...',,;,''.;:dcc' ;, :WMMMMMMMMM
// MMMMMMMMMWl .   ...        .oOx'',xOO0kx,,dd;oc,'.:xx''..,,'... ..;::::. ol..0MMMMMMMMM
// MMMMMMMMMo..               ddkko;:oxoc:;..oOOKWWNK0Ko'.  ....,' .;;;;:. .o: .xXMMMMMMMM
// MMMMMMMMM0  ..         ...'xoxkxdlokOkxl:oK00KWWWXKKx..,;,,;,;'.',,,',  :,  'c,WMMMMMMM
// MMMMMMMMMWo .','...    .';ol::OK0Oxolcc,lxdOO0NWWWXKO..,;,,',,'.''''.  ;.  ;: 'WMMMMMMM
// MMMMMMMMNd;',;;;,,,,  .lOoxc'':ddlclcc;:OkdkOKNNWWWX0 .';,,;;,';'',. .;. 'kc  o0MMMMMMM
// MMMMMMMMO  ....,;',,;c0Kkcxo,'''cd;... '0O:okOKXNWWXx .';;;;,'',,:;  .. :X: ,KoxMMMMMMM
// MMMMMMMMWo  ...'..;,;kKK0:ko;,,','... .,0XOOXNK00KXNc .,;;;;,''':c,  ..;c..:X0dkMMMMMMM
// MMMMMMMMWd......,:;.lXXKKkodo:;':d,    ,OKNWWKNWNXOk: .,,,;c,''.lc.  .c:,;oXNxd0WMMMMMM
// MMMMMMMMO. .....'c'.dNN0OK0ddc:;kxo.   ,OOXNWWXKXNKkc .,,,,;,,'.lc.  .okkxNXdlxWMMMMMMM
// MMMMMMMWd  ....,lc. lXNX0OKO,dOKkl;  . '00OXNNNWX0XKd .,,,,,,,.,occ.  ,KXNWXkKWMMMMMMMM
// MMMMMMMWx..,:;cl;...'OKNN0KxdKo.       .d0ONXNWWWKK00  .',,,,' :l:l;  .0XWMMMMMMMMMMMMM
// MMMMMMMNd',;,;:'....':k0KK0O0o.         .lcdKWWWNK00O. .,,,,,..lldd:cx;kXWMMMMMMMMMMMMM
// MMMMMMMWc'.'..... ... .:c,okdc.    ..    .xxcOWWN00K0.  ,,,'' ;loK0kNNdkXWMMMMMMMMMMMMM
// MMMMMMMM0, .....'.        'll.     ..     oXXKK0k0ONXl  ';,,..clkWMMMMWNMMMMMMMMMMMMMMM
// MMMMMMMMWx  .....                   ..    ;000kxOOXWNK,  ,,, 'olKMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMN' ...  .        ..              ,NKOkk0KNWNWk, .'; oWNWMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMWx                                .ldoc:dNNWWWd. .c.:WMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMWO:'','                         .;;,cdONNWMMMNc...;:XWMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMWWX:'.''..                 .ddk0KXNWMMMMWK0XkNWKNMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMWWWWNd..             .  .KNNWNNWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMMWo.             ,, cd0WWMWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMWXd'  ;x;.       .:.'XMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMWN0ccdOOO00Ox..'l;l'OWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMMMMWWWWWWWN:.cXKXOOWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWXxkNMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMWWMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
// MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM
