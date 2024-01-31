import createPromise from "@anio-js-core-foundation/create-promise"

function createWebWorkerInstance({
	web_worker,
	web_worker_message_buffer
}) {
	let instance = {}

	Object.defineProperty(instance, "onMessage", {
		set(handler) {
			// dump message buffer first
			while (web_worker_message_buffer.length) {
				const msg = web_worker_message_buffer.shift()

				handler(msg.data)
			}

			web_worker.onmessage = (msg) => handler(msg.data)
		}
	})

	Object.defineProperty(instance, "sendMessage", {
		enumerable: true,
		get() { return (str) => web_worker.postMessage(str) }
	})

	Object.defineProperty(instance, "terminate", {
		enumerable: true,
		get() { return () => web_worker.terminate() }
	})

	return instance
}

function createBootstrapBlob() {
	const blob = new Blob(["// importShim\n(function(){const A=\"undefined\"!==typeof window;const e=\"undefined\"!==typeof document;const noop=()=>{};const t=e?document.querySelector(\"script[type=esms-options]\"):void 0;const o=t?JSON.parse(t.innerHTML):{};Object.assign(o,self.esmsInitOptions||{});let C=!e||!!o.shimMode;const s=globalHook(C&&o.onimport);const r=globalHook(C&&o.resolve);let n=o.fetch?globalHook(o.fetch):fetch;const E=o.meta?globalHook(C&&o.meta):noop;const i=o.mapOverrides;let g=o.nonce;if(!g&&e){const A=document.querySelector(\"script[nonce]\");A&&(g=A.nonce||A.getAttribute(\"nonce\"))}const a=globalHook(o.onerror||noop);const c=o.onpolyfill?globalHook(o.onpolyfill):()=>{console.log(\"%c^^ Module TypeError above is polyfilled and can be ignored ^^\",\"font-weight:900;color:#391\")};const{revokeBlobURLs:l,noLoadEventRetriggers:p,enforceIntegrity:I}=o;function globalHook(A){return\"string\"===typeof A?self[A]:A}const f=Array.isArray(o.polyfillEnable)?o.polyfillEnable:[];const m=f.includes(\"css-modules\");const d=f.includes(\"json-modules\");const u=!navigator.userAgentData&&!!navigator.userAgent.match(/Edge\\/\\d+\\.\\d+/);const k=e?document.baseURI:`${location.protocol}//${location.host}${location.pathname.includes(\"/\")?location.pathname.slice(0,location.pathname.lastIndexOf(\"/\")+1):location.pathname}`;const createBlob=(A,e=\"text/javascript\")=>URL.createObjectURL(new Blob([A],{type:e}));let{skip:h}=o;if(Array.isArray(h)){const A=h.map((A=>new URL(A,k).href));h=e=>A.some((A=>\"/\"===A[A.length-1]&&e.startsWith(A)||e===A))}else if(\"string\"===typeof h){const A=new RegExp(h);h=e=>A.test(e)}const eoop=A=>setTimeout((()=>{throw A}));const throwError=e=>{(self.reportError||A&&window.safari&&console.error||eoop)(e),void a(e)};function fromParent(A){return A?` imported from ${A}`:\"\"}let K=false;function setImportMapSrcOrLazy(){K=true}if(!C)if(document.querySelectorAll(\"script[type=module-shim],script[type=importmap-shim],link[rel=modulepreload-shim]\").length)C=true;else{let A=false;for(const e of document.querySelectorAll(\"script[type=module],script[type=importmap]\"))if(A){if(\"importmap\"===e.type&&A){K=true;break}}else\"module\"!==e.type||e.ep||(A=true)}const D=/\\\\/g;function isURL(A){if(-1===A.indexOf(\":\"))return false;try{new URL(A);return true}catch(A){return false}}function resolveUrl(A,e){return resolveIfNotPlainOrUrl(A,e)||(isURL(A)?A:resolveIfNotPlainOrUrl(\"./\"+A,e))}function resolveIfNotPlainOrUrl(A,e){const t=e.indexOf(\"#\"),o=e.indexOf(\"?\");t+o>-2&&(e=e.slice(0,-1===t?o:-1===o||o>t?t:o));-1!==A.indexOf(\"\\\\\")&&(A=A.replace(D,\"/\"));if(\"/\"===A[0]&&\"/\"===A[1])return e.slice(0,e.indexOf(\":\")+1)+A;if(\".\"===A[0]&&(\"/\"===A[1]||\".\"===A[1]&&(\"/\"===A[2]||2===A.length&&(A+=\"/\"))||1===A.length&&(A+=\"/\"))||\"/\"===A[0]){const t=e.slice(0,e.indexOf(\":\")+1);let o;if(\"/\"===e[t.length+1])if(\"file:\"!==t){o=e.slice(t.length+2);o=o.slice(o.indexOf(\"/\")+1)}else o=e.slice(8);else o=e.slice(t.length+(\"/\"===e[t.length]));if(\"/\"===A[0])return e.slice(0,e.length-o.length-1)+A;const C=o.slice(0,o.lastIndexOf(\"/\")+1)+A;const s=[];let r=-1;for(let A=0;A<C.length;A++)if(-1===r){if(\".\"===C[A]){if(\".\"===C[A+1]&&(\"/\"===C[A+2]||A+2===C.length)){s.pop();A+=2;continue}if(\"/\"===C[A+1]||A+1===C.length){A+=1;continue}}while(\"/\"===C[A])A++;r=A}else if(\"/\"===C[A]){s.push(C.slice(r,A+1));r=-1}-1!==r&&s.push(C.slice(r));return e.slice(0,e.length-o.length)+s.join(\"\")}}function resolveAndComposeImportMap(A,e,t){const o={imports:Object.assign({},t.imports),scopes:Object.assign({},t.scopes)};A.imports&&resolveAndComposePackages(A.imports,o.imports,e,t);if(A.scopes)for(let C in A.scopes){const s=resolveUrl(C,e);resolveAndComposePackages(A.scopes[C],o.scopes[s]||(o.scopes[s]={}),e,t)}return o}function getMatch(A,e){if(e[A])return A;let t=A.length;do{const o=A.slice(0,t+1);if(o in e)return o}while(-1!==(t=A.lastIndexOf(\"/\",t-1)))}function applyPackages(A,e){const t=getMatch(A,e);if(t){const o=e[t];if(null===o)return;return o+A.slice(t.length)}}function resolveImportMap(A,e,t){let o=t&&getMatch(t,A.scopes);while(o){const t=applyPackages(e,A.scopes[o]);if(t)return t;o=getMatch(o.slice(0,o.lastIndexOf(\"/\")),A.scopes)}return applyPackages(e,A.imports)||-1!==e.indexOf(\":\")&&e}function resolveAndComposePackages(A,e,t,o){for(let s in A){const r=resolveIfNotPlainOrUrl(s,t)||s;if((!C||!i)&&e[r]&&e[r]!==A[r])throw Error(`Rejected map override \"${r}\" from ${e[r]} to ${A[r]}.`);let n=A[s];if(\"string\"!==typeof n)continue;const E=resolveImportMap(o,resolveIfNotPlainOrUrl(n,t)||n,t);E?e[r]=E:console.warn(`Mapping \"${s}\" -> \"${A[s]}\" does not resolve`)}}let L=!e&&(0,eval)(\"u=>import(u)\");let J;const y=e&&new Promise((A=>{const e=Object.assign(document.createElement(\"script\"),{src:createBlob(\"self._d=u=>import(u)\"),ep:true});e.setAttribute(\"nonce\",g);e.addEventListener(\"load\",(()=>{if(!(J=!!(L=self._d))){let A;window.addEventListener(\"error\",(e=>A=e));L=(e,t)=>new Promise(((o,C)=>{const s=Object.assign(document.createElement(\"script\"),{type:\"module\",src:createBlob(`import*as m from'${e}';self._esmsi=m`)});A=void 0;s.ep=true;g&&s.setAttribute(\"nonce\",g);s.addEventListener(\"error\",cb);s.addEventListener(\"load\",cb);function cb(r){document.head.removeChild(s);if(self._esmsi){o(self._esmsi,k);self._esmsi=void 0}else{C(!(r instanceof Event)&&r||A&&A.error||new Error(`Error loading ${t&&t.errUrl||e} (${s.src}).`));A=void 0}}document.head.appendChild(s)}))}document.head.removeChild(e);delete self._d;A()}));document.head.appendChild(e)}));let N=false;let U=false;let F=!(!e||!HTMLScriptElement.supports)&&HTMLScriptElement.supports(\"importmap\");let v=F;const q=\"import.meta\";const S='import\"x\"assert{type:\"css\"}';const Y='import\"x\"assert{type:\"json\"}';const R=Promise.resolve(y).then((()=>{if(J&&(!F||m||d))return e?new Promise((A=>{const e=document.createElement(\"iframe\");e.style.display=\"none\";e.setAttribute(\"nonce\",g);function cb({data:[t,o,C,s]}){F=t;v=o;U=C;N=s;A();document.head.removeChild(e);window.removeEventListener(\"message\",cb,false)}window.addEventListener(\"message\",cb,false);const t=`<script nonce=${g||\"\"}>b=(s,type='text/javascript')=>URL.createObjectURL(new Blob([s],{type}));document.head.appendChild(Object.assign(document.createElement('script'),{type:'importmap',nonce:\"${g}\",innerText:\\`{\"imports\":{\"x\":\"\\${b('')}\"}}\\`}));Promise.all([${F?\"true,true\":`'x',b('${q}')`}, ${m?`b('${S}'.replace('x',b('','text/css')))`:\"false\"}, ${d?`b('${Y}'.replace('x',b('{}','text/json')))`:\"false\"}].map(x =>typeof x==='string'?import(x).then(x =>!!x,()=>false):x)).then(a=>parent.postMessage(a,'*'))<\\/script>`;e.onload=()=>{const A=e.contentDocument;if(A&&0===A.head.childNodes.length){const e=A.createElement(\"script\");g&&e.setAttribute(\"nonce\",g);e.innerHTML=t.slice(15+(g?g.length:0),-9);A.head.appendChild(e)}};document.head.appendChild(e);\"srcdoc\"in e?e.srcdoc=t:e.contentDocument.write(t)})):Promise.all([F||L(createBlob(q)).then((()=>v=true),noop),m&&L(createBlob(S.replace(\"x\",createBlob(\"\",\"text/css\")))).then((()=>U=true),noop),d&&L(createBlob(jsonModulescheck.replace(\"x\",createBlob(\"{}\",\"text/json\")))).then((()=>N=true),noop)])}));const G=1===new Uint8Array(new Uint16Array([1]).buffer)[0];function parse(A,e=\"@\"){if(!M)return b.then((()=>parse(A)));const t=A.length+1,o=(M.__heap_base.value||M.__heap_base)+4*t-M.memory.buffer.byteLength;o>0&&M.memory.grow(Math.ceil(o/65536));const C=M.sa(t-1);if((G?B:Q)(A,new Uint16Array(M.memory.buffer,C,t)),!M.parse())throw Object.assign(new Error(`Parse error ${e}:${A.slice(0,M.e()).split(\"\\n\").length}:${M.e()-A.lastIndexOf(\"\\n\",M.e()-1)}`),{idx:M.e()});const s=[],r=[];for(;M.ri();){const e=M.is(),t=M.ie(),o=M.ai(),C=M.id(),r=M.ss(),n=M.se();let E;M.ip()&&(E=w(A.slice(-1===C?e-1:e,-1===C?t+1:t))),s.push({n:E,s:e,e:t,ss:r,se:n,d:C,a:o})}for(;M.re();){const e=M.es(),t=M.ee(),o=M.els(),C=M.ele(),s=A.slice(e,t),n=s[0],E=o<0?void 0:A.slice(o,C),i=E?E[0]:\"\";r.push({s:e,e:t,ls:o,le:C,n:'\"'===n||\"'\"===n?w(s):s,ln:'\"'===i||\"'\"===i?w(E):E})}function w(A){try{return(0,eval)(A)}catch(A){}}return[s,r,!!M.f()]}function Q(A,e){const t=A.length;let o=0;for(;o<t;){const t=A.charCodeAt(o);e[o++]=(255&t)<<8|t>>>8}}function B(A,e){const t=A.length;let o=0;for(;o<t;)e[o]=A.charCodeAt(o++)}let M;const b=WebAssembly.compile(($=\"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\",\"undefined\"!=typeof Buffer?Buffer.from($,\"base64\"):Uint8Array.from(atob($),(A=>A.charCodeAt(0))))).then(WebAssembly.instantiate).then((({exports:A})=>{M=A}));var $;async function _resolve(A,e){const t=resolveIfNotPlainOrUrl(A,e);return{r:resolveImportMap(x,t||A,e)||throwUnresolved(A,e),b:!t&&!isURL(A)}}const H=r?async(A,e)=>{let t=r(A,e,defaultResolve);t&&t.then&&(t=await t);return t?{r:t,b:!resolveIfNotPlainOrUrl(A,e)&&!isURL(A)}:_resolve(A,e)}:_resolve;async function importShim(A,...t){let o=t[t.length-1];\"string\"!==typeof o&&(o=k);await P;s&&await s(A,\"string\"!==typeof t[1]?t[1]:{},o);if(_||C||!O){e&&processScriptsAndPreloads(true);C||(_=false)}await X;return topLevelLoad((await H(A,o)).r,{credentials:\"same-origin\"})}self.importShim=importShim;function defaultResolve(A,e){return resolveImportMap(x,resolveIfNotPlainOrUrl(A,e)||A,e)||throwUnresolved(A,e)}function throwUnresolved(A,e){throw Error(`Unable to resolve specifier '${A}'${fromParent(e)}`)}const resolveSync=(A,e=k)=>{e=`${e}`;const t=r&&r(A,e,defaultResolve);return t&&!t.then?t:defaultResolve(A,e)};function metaResolve(A,e=this.url){return resolveSync(A,e)}importShim.resolve=resolveSync;importShim.getImportMap=()=>JSON.parse(JSON.stringify(x));importShim.addImportMap=A=>{if(!C)throw new Error(\"Unsupported in polyfill mode.\");x=resolveAndComposeImportMap(A,k,x)};const j=importShim._r={};async function loadAll(A,e){if(!A.b&&!e[A.u]){e[A.u]=1;await A.L;await Promise.all(A.d.map((A=>loadAll(A,e))));A.n||(A.n=A.d.some((A=>A.n)))}}let x={imports:{},scopes:{}};let O;const P=R.then((()=>{O=true!==o.polyfillEnable&&J&&v&&F&&(!d||N)&&(!m||U)&&!K&&true;if(e){if(!F){const A=HTMLScriptElement.supports||(A=>\"classic\"===A||\"module\"===A);HTMLScriptElement.supports=e=>\"importmap\"===e||A(e)}if(C||!O){new MutationObserver((A=>{for(const e of A)if(\"childList\"===e.type)for(const A of e.addedNodes)if(\"SCRIPT\"===A.tagName){A.type===(C?\"module-shim\":\"module\")&&processScript(A,true);A.type===(C?\"importmap-shim\":\"importmap\")&&processImportMap(A,true)}else\"LINK\"===A.tagName&&A.rel===(C?\"modulepreload-shim\":\"modulepreload\")&&processPreload(A)})).observe(document,{childList:true,subtree:true});processScriptsAndPreloads();if(\"complete\"===document.readyState)readyStateCompleteCheck();else{async function readyListener(){await P;processScriptsAndPreloads();if(\"complete\"===document.readyState){readyStateCompleteCheck();document.removeEventListener(\"readystatechange\",readyListener)}}document.addEventListener(\"readystatechange\",readyListener)}}}return b}));let X=P;let T=true;let _=true;async function topLevelLoad(A,e,t,o,r){C||(_=false);await P;await X;s&&await s(A,\"string\"!==typeof e?e:{},\"\");if(!C&&O){if(o)return null;await r;return L(t?createBlob(t):A,{errUrl:A||t})}const n=getOrCreateLoad(A,e,null,t);const E={};await loadAll(n,E);Z=void 0;resolveDeps(n,E);await r;if(t&&!C&&!n.n&&true){const A=await L(createBlob(t),{errUrl:t});l&&revokeObjectURLs(Object.keys(E));return A}if(T&&!C&&n.n&&o){c();T=false}const i=await L(C||n.n||!o?n.b:n.u,{errUrl:n.u});n.s&&(await L(n.s)).u$_(i);l&&revokeObjectURLs(Object.keys(E));return i}function revokeObjectURLs(A){let e=0;const t=A.length;const o=self.requestIdleCallback?self.requestIdleCallback:self.requestAnimationFrame;o(cleanup);function cleanup(){const C=100*e;if(!(C>t)){for(const e of A.slice(C,C+100)){const A=j[e];A&&URL.revokeObjectURL(A.b)}e++;o(cleanup)}}}function urlJsString(A){return`'${A.replace(/'/g,\"\\\\'\")}'`}let Z;function resolveDeps(A,e){if(A.b||!e[A.u])return;e[A.u]=0;for(const n of A.d)resolveDeps(n,e);const[t,o]=A.a;const C=A.S;let s=u&&Z?`import '${Z}';`:\"\";if(t.length){let i=0,g=0,a=[];function pushStringTo(e){while(a[a.length-1]<e){const e=a.pop();s+=`${C.slice(i,e)}, ${urlJsString(A.r)}`;i=e}s+=C.slice(i,e);i=e}for(const{s:c,ss:l,se:p,d:I}of t)if(-1===I){let f=A.d[g++],m=f.b,d=!m;d&&((m=f.s)||(m=f.s=createBlob(`export function u$_(m){${f.a[1].map((({s:A,e:e},t)=>{const o='\"'===f.S[A]||\"'\"===f.S[A];return`e$_${t}=m${o?\"[\":\".\"}${f.S.slice(A,e)}${o?\"]\":\"\"}`})).join(\",\")}}${f.a[1].length?`let ${f.a[1].map(((A,e)=>`e$_${e}`)).join(\",\")};`:\"\"}export {${f.a[1].map((({s:A,e:e},t)=>`e$_${t} as ${f.S.slice(A,e)}`)).join(\",\")}}\\n//# sourceURL=${f.r}?cycle`)));pushStringTo(c-1);s+=`/*${C.slice(c-1,p)}*/${urlJsString(m)}`;if(!d&&f.s){s+=`;import*as m$_${g} from'${f.b}';import{u$_ as u$_${g}}from'${f.s}';u$_${g}(m$_${g})`;f.s=void 0}i=p}else if(-2===I){A.m={url:A.r,resolve:metaResolve};E(A.m,A.u);pushStringTo(c);s+=`importShim._r[${urlJsString(A.u)}].m`;i=p}else{pushStringTo(l+6);s+=\"Shim(\";a.push(p-1);i=c}A.s&&(s+=`\\n;import{u$_}from'${A.s}';try{u$_({${o.filter((A=>A.ln)).map((({s:A,e:e,ln:t})=>`${C.slice(A,e)}: ${t}`)).join(\",\")}})}catch(_){};\\n`);pushStringTo(C.length)}else s+=C;let r=false;s=s.replace(V,((e,t,o)=>(r=!t,e.replace(o,(()=>new URL(o,A.r))))));r||(s+=\"\\n//# sourceURL=\"+A.r);A.b=Z=createBlob(s);A.S=void 0}const V=/\\n\\/\\/# source(Mapping)?URL=([^\\n]+)\\s*((;|\\/\\/[^#][^\\n]*)\\s*)*$/;const z=/^(text|application)\\/(x-)?javascript(;|$)/;const W=/^(text|application)\\/json(;|$)/;const AA=/^(text|application)\\/css(;|$)/;const eA=/url\\(\\s*(?:([\"'])((?:\\\\.|[^\\n\\\\\"'])+)\\1|((?:\\\\.|[^\\s,\"'()\\\\])+))\\s*\\)/g;let QA=[];let tA=0;function pushFetchPool(){if(++tA>100)return new Promise((A=>QA.push(A)))}function popFetchPool(){tA--;QA.length&&QA.shift()()}async function doFetch(A,e,t){if(I&&!e.integrity)throw Error(`No integrity for ${A}${fromParent(t)}.`);const o=pushFetchPool();o&&await o;try{var C=await n(A,e)}catch(e){e.message=`Unable to fetch ${A}${fromParent(t)} - see network log for details.\\n`+e.message;throw e}finally{popFetchPool()}if(!C.ok)throw Error(`${C.status} ${C.statusText} ${C.url}${fromParent(t)}`);return C}async function fetchModule(A,e,t){const o=await doFetch(A,e,t);const C=o.headers.get(\"content-type\");if(z.test(C))return{r:o.url,s:await o.text(),t:\"js\"};if(W.test(C))return{r:o.url,s:`export default ${await o.text()}`,t:\"json\"};if(AA.test(C))return{r:o.url,s:`var s=new CSSStyleSheet();s.replaceSync(${JSON.stringify((await o.text()).replace(eA,((e,t=\"\",o,C)=>`url(${t}${resolveUrl(o||C,A)}${t})`)))});export default s;`,t:\"css\"};throw Error(`Unsupported Content-Type \"${C}\" loading ${A}${fromParent(t)}. Modules must be served with a valid MIME type like application/javascript.`)}function getOrCreateLoad(A,e,t,o){let s=j[A];if(s&&!o)return s;s={u:A,r:o?A:void 0,f:void 0,S:void 0,L:void 0,a:void 0,d:void 0,b:void 0,s:void 0,n:false,t:null,m:null};if(j[A]){let A=0;while(j[s.u+ ++A]);s.u+=A}j[s.u]=s;s.f=(async()=>{if(!o){let r;({r:s.r,s:o,t:r}=await(sA[A]||fetchModule(A,e,t)));if(r&&!C){if(\"css\"===r&&!m||\"json\"===r&&!d)throw Error(`${r}-modules require <script type=\"esms-options\">{ \"polyfillEnable\": [\"${r}-modules\"] }<\\/script>`);(\"css\"===r&&!U||\"json\"===r&&!N)&&(s.n=true)}}try{s.a=parse(o,s.u)}catch(A){throwError(A);s.a=[[],[],false]}s.S=o;return s})();s.L=s.f.then((async()=>{let A=e;s.d=(await Promise.all(s.a[0].map((async({n:e,d:t})=>{(t>=0&&!J||-2===t&&!v)&&(s.n=true);if(-1!==t||!e)return;const{r:o,b:C}=await H(e,s.r||s.u);!C||F&&!K||(s.n=true);if(-1===t){if(h&&h(o))return{b:o};A.integrity&&(A=Object.assign({},A,{integrity:void 0}));return getOrCreateLoad(o,A,s.r).f}})))).filter((A=>A))}));return s}function processScriptsAndPreloads(A=false){if(!A)for(const A of document.querySelectorAll(C?\"link[rel=modulepreload-shim]\":\"link[rel=modulepreload]\"))processPreload(A);for(const A of document.querySelectorAll(C?\"script[type=importmap-shim]\":\"script[type=importmap]\"))processImportMap(A);if(!A)for(const A of document.querySelectorAll(C?\"script[type=module-shim]\":\"script[type=module]\"))processScript(A)}function getFetchOpts(A){const e={};A.integrity&&(e.integrity=A.integrity);A.referrerpolicy&&(e.referrerPolicy=A.referrerpolicy);\"use-credentials\"===A.crossorigin?e.credentials=\"include\":\"anonymous\"===A.crossorigin?e.credentials=\"omit\":e.credentials=\"same-origin\";return e}let oA=Promise.resolve();let CA=1;function domContentLoadedCheck(){0!==--CA||p||document.dispatchEvent(new Event(\"DOMContentLoaded\"))}e&&document.addEventListener(\"DOMContentLoaded\",(async()=>{await P;!C&&O||domContentLoadedCheck()}));let BA=1;function readyStateCompleteCheck(){0!==--BA||p||document.dispatchEvent(new Event(\"readystatechange\"))}const hasNext=A=>A.nextSibling||A.parentNode&&hasNext(A.parentNode);const epCheck=(A,e)=>A.ep||!e&&(!A.src&&!A.innerHTML||!hasNext(A))||null!==A.getAttribute(\"noshim\")||!(A.ep=true);function processImportMap(A,e=BA>0){if(!epCheck(A,e)){if(A.src){if(!C)return;setImportMapSrcOrLazy()}if(_){X=X.then((async()=>{x=resolveAndComposeImportMap(A.src?await(await doFetch(A.src,getFetchOpts(A))).json():JSON.parse(A.innerHTML),A.src||k,x)})).catch((e=>{console.log(e);e instanceof SyntaxError&&(e=new Error(`Unable to parse import map ${e.message} in: ${A.src||A.innerHTML}`));throwError(e)}));C||(_=false)}}}function processScript(A,e=BA>0){if(epCheck(A,e))return;const t=null===A.getAttribute(\"async\")&&BA>0;const o=CA>0;t&&BA++;o&&CA++;const s=topLevelLoad(A.src||k,getFetchOpts(A),!A.src&&A.innerHTML,!C,t&&oA).catch(throwError);t&&(oA=s.then(readyStateCompleteCheck));o&&s.then(domContentLoadedCheck)}const sA={};function processPreload(A){if(!A.ep){A.ep=true;sA[A.href]||(sA[A.href]=fetchModule(A.href,getFetchOpts(A)))}}})();\n\nfunction createWebWorkerThis({\n\timportmap\n}) {\n\tlet new_this = {}\n\n\tObject.defineProperty(new_this, \"importmap\", {\n\t\tset() { throw new Error(`Cannot set importmap.`) },\n\t\tget() { return importmap }\n\t})\n\n\tObject.defineProperty(new_this, \"sendMessage\", {\n\t\tset() { throw new Error(`Cannot set sendMessage.`) },\n\t\tget() { return (str) => postMessage(str) }\n\t})\n\n\tObject.defineProperty(new_this, \"onMessage\", {\n\t\tget() { throw new Error(`Cannot read onMessage.`) },\n\t\tset(v) { onmessage = (msg) => v(msg.data) }\n\t})\n\n\treturn new_this\n}\n\nonmessage = (msg) => {\n\tif (msg.data.startsWith(\"init\")) {\n\t\tonmessage = undefined\n\n\t\tconst payload = JSON.parse(msg.data.slice(\"init\".length))\n\t\tlet importmap = {}\n\n\t\tif (\"importmap\" in payload.additional) {\n\t\t\timportShim.addImportMap(payload.additional.importmap)\n\n\t\t\timportmap = payload.additional.importmap\n\t\t}\n\n\t\timportShim(payload.worker_file_url)\n\t\t.then(mod => {\n\t\t\tconst init_args = payload.worker_args\n\n\t\t\tlet new_this = createWebWorkerThis({importmap})\n\n\t\t\treturn mod.WebWorkerMain.apply(new_this, init_args)\n\t\t})\n\t\t.then(() => {\n\t\t\tpostMessage(payload.init_token)\n\t\t})\n\t}\n}\n"], {type: "text/javascript"})

	return URL.createObjectURL(blob)
}

export default function browserCreateWebWorker(worker_file_url, worker_args, additional = {}) {
	let {promise, resolve, reject} = createPromise()

	const init_token = Math.random().toString(32) + "_" + Math.random().toString(32)

	const url = createBootstrapBlob()

	let web_worker = new window.Worker(url)
	let web_worker_message_buffer = []

	web_worker.onerror = reject

	web_worker.onmessage = msg => {
		if (msg.data === init_token) {
			web_worker.onerror = undefined

			resolve(
				createWebWorkerInstance({
					web_worker,
					web_worker_message_buffer
				})
			)
		}
		// buffer other messages between web worker and main script
		else {
			web_worker_message_buffer.push(msg)
		}
	}

	web_worker.postMessage("init" + JSON.stringify({
		worker_file_url,
		worker_args,
		init_token,
		additional
	}))

	return promise
}
