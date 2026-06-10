var tt=Object.defineProperty;var et=(t,e,i)=>e in t?tt(t,e,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[e]=i;var n=(t,e,i)=>et(t,typeof e!="symbol"?e+"":e,i);import{C as it,W as st,S as ot,P as rt,M as q,a as nt,b as H,I as lt,B as at,c as O,d as ct,A as ht,e as ut}from"./three-Co1cQZzS.js";(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))o(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const a of r.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&o(a)}).observe(document,{childList:!0,subtree:!0});function i(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(s){if(s.ep)return;s.ep=!0;const r=i(s);fetch(s.href,r)}})();var F="1.3.23";function V(t,e,i){return Math.max(t,Math.min(e,i))}function dt(t,e,i){return(1-i)*t+i*e}function pt(t,e,i,o){return dt(t,e,1-Math.exp(-i*o))}function mt(t,e){return(t%e+e)%e}var vt=class{constructor(){n(this,"isRunning",!1);n(this,"value",0);n(this,"from",0);n(this,"to",0);n(this,"currentTime",0);n(this,"lerp");n(this,"duration");n(this,"easing");n(this,"onUpdate")}advance(t){var i;if(!this.isRunning)return;let e=!1;if(this.duration&&this.easing){this.currentTime+=t;const o=V(0,this.currentTime/this.duration,1);e=o>=1;const s=e?1:this.easing(o);this.value=this.from+(this.to-this.from)*s}else this.lerp?(this.value=pt(this.value,this.to,this.lerp*60,t),Math.round(this.value)===Math.round(this.to)&&(this.value=this.to,e=!0)):(this.value=this.to,e=!0);e&&this.stop(),(i=this.onUpdate)==null||i.call(this,this.value,e)}stop(){this.isRunning=!1}fromTo(t,e,{lerp:i,duration:o,easing:s,onStart:r,onUpdate:a}){this.from=this.value=t,this.to=e,this.lerp=i,this.duration=o,this.easing=s,this.currentTime=0,this.isRunning=!0,r==null||r(),this.onUpdate=a}};function ft(t,e){let i;return function(...o){clearTimeout(i),i=setTimeout(()=>{i=void 0,t.apply(this,o)},e)}}var gt=class{constructor(t,e,{autoResize:i=!0,debounce:o=250}={}){n(this,"width",0);n(this,"height",0);n(this,"scrollHeight",0);n(this,"scrollWidth",0);n(this,"debouncedResize");n(this,"wrapperResizeObserver");n(this,"contentResizeObserver");n(this,"resize",()=>{this.onWrapperResize(),this.onContentResize()});n(this,"onWrapperResize",()=>{this.wrapper instanceof Window?(this.width=window.innerWidth,this.height=window.innerHeight):(this.width=this.wrapper.clientWidth,this.height=this.wrapper.clientHeight)});n(this,"onContentResize",()=>{this.wrapper instanceof Window?(this.scrollHeight=this.content.scrollHeight,this.scrollWidth=this.content.scrollWidth):(this.scrollHeight=this.wrapper.scrollHeight,this.scrollWidth=this.wrapper.scrollWidth)});this.wrapper=t,this.content=e,i&&(this.debouncedResize=ft(this.resize,o),this.wrapper instanceof Window?window.addEventListener("resize",this.debouncedResize):(this.wrapperResizeObserver=new ResizeObserver(this.debouncedResize),this.wrapperResizeObserver.observe(this.wrapper)),this.contentResizeObserver=new ResizeObserver(this.debouncedResize),this.contentResizeObserver.observe(this.content)),this.resize()}destroy(){var t,e;(t=this.wrapperResizeObserver)==null||t.disconnect(),(e=this.contentResizeObserver)==null||e.disconnect(),this.wrapper===window&&this.debouncedResize&&window.removeEventListener("resize",this.debouncedResize)}get limit(){return{x:this.scrollWidth-this.width,y:this.scrollHeight-this.height}}},X=class{constructor(){n(this,"events",{})}emit(t,...e){var o;const i=this.events[t]||[];for(let s=0,r=i.length;s<r;s++)(o=i[s])==null||o.call(i,...e)}on(t,e){return this.events[t]?this.events[t].push(e):this.events[t]=[e],()=>{var i;this.events[t]=(i=this.events[t])==null?void 0:i.filter(o=>e!==o)}}off(t,e){var i;this.events[t]=(i=this.events[t])==null?void 0:i.filter(o=>e!==o)}destroy(){this.events={}}};const wt=100/6,b={passive:!1};function I(t,e){return t===1?wt:t===2?e:1}var yt=class{constructor(t,e={wheelMultiplier:1,touchMultiplier:1}){n(this,"touchStart",{x:0,y:0});n(this,"lastDelta",{x:0,y:0});n(this,"window",{width:0,height:0});n(this,"emitter",new X);n(this,"onTouchStart",t=>{const{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:0,y:0},this.emitter.emit("scroll",{deltaX:0,deltaY:0,event:t})});n(this,"onTouchMove",t=>{const{clientX:e,clientY:i}=t.targetTouches?t.targetTouches[0]:t,o=-(e-this.touchStart.x)*this.options.touchMultiplier,s=-(i-this.touchStart.y)*this.options.touchMultiplier;this.touchStart.x=e,this.touchStart.y=i,this.lastDelta={x:o,y:s},this.emitter.emit("scroll",{deltaX:o,deltaY:s,event:t})});n(this,"onTouchEnd",t=>{this.emitter.emit("scroll",{deltaX:this.lastDelta.x,deltaY:this.lastDelta.y,event:t})});n(this,"onWheel",t=>{let{deltaX:e,deltaY:i,deltaMode:o}=t;const s=I(o,this.window.width),r=I(o,this.window.height);e*=s,i*=r,e*=this.options.wheelMultiplier,i*=this.options.wheelMultiplier,this.emitter.emit("scroll",{deltaX:e,deltaY:i,event:t})});n(this,"onWindowResize",()=>{this.window={width:window.innerWidth,height:window.innerHeight}});this.element=t,this.options=e,window.addEventListener("resize",this.onWindowResize),this.onWindowResize(),this.element.addEventListener("wheel",this.onWheel,b),this.element.addEventListener("touchstart",this.onTouchStart,b),this.element.addEventListener("touchmove",this.onTouchMove,b),this.element.addEventListener("touchend",this.onTouchEnd,b)}on(t,e){return this.emitter.on(t,e)}destroy(){this.emitter.destroy(),window.removeEventListener("resize",this.onWindowResize),this.element.removeEventListener("wheel",this.onWheel,b),this.element.removeEventListener("touchstart",this.onTouchStart,b),this.element.removeEventListener("touchmove",this.onTouchMove,b),this.element.removeEventListener("touchend",this.onTouchEnd,b)}};const C=t=>Math.min(1,1.001-2**(-10*t));var St=class{constructor({wrapper:t=window,content:e=document.documentElement,eventsTarget:i=t,smoothWheel:o=!0,syncTouch:s=!1,syncTouchLerp:r=.075,touchInertiaExponent:a=1.7,duration:l,easing:u,lerp:d=.1,infinite:m=!1,orientation:p="vertical",gestureOrientation:h=p==="horizontal"?"both":"vertical",touchMultiplier:v=1,wheelMultiplier:c=1,autoResize:f=!0,prevent:g,virtualScroll:w,overscroll:y=!0,autoRaf:S=!1,anchors:x=!1,autoToggle:L=!1,allowNestedScroll:A=!1,__experimental__naiveDimensions:T=!1,naiveDimensions:Q=T,stopInertiaOnNavigate:Z=!1}={}){n(this,"_isScrolling",!1);n(this,"_isStopped",!1);n(this,"_isLocked",!1);n(this,"_preventNextNativeScrollEvent",!1);n(this,"_resetVelocityTimeout",null);n(this,"_rafId",null);n(this,"isTouching");n(this,"time",0);n(this,"userData",{});n(this,"lastVelocity",0);n(this,"velocity",0);n(this,"direction",0);n(this,"options");n(this,"targetScroll");n(this,"animatedScroll");n(this,"animate",new vt);n(this,"emitter",new X);n(this,"dimensions");n(this,"virtualScroll");n(this,"onScrollEnd",t=>{t instanceof CustomEvent||(this.isScrolling==="smooth"||this.isScrolling===!1)&&t.stopPropagation()});n(this,"dispatchScrollendEvent",()=>{this.options.wrapper.dispatchEvent(new CustomEvent("scrollend",{bubbles:this.options.wrapper===window,detail:{lenisScrollEnd:!0}}))});n(this,"onTransitionEnd",t=>{var e;(e=t.propertyName)!=null&&e.includes("overflow")&&t.target===this.rootElement&&this.checkOverflow()});n(this,"onClick",t=>{const e=t.composedPath().filter(o=>o instanceof HTMLAnchorElement&&o.href).map(o=>new URL(o.href)),i=new URL(window.location.href);if(this.options.anchors){const o=e.find(s=>i.host===s.host&&i.pathname===s.pathname&&s.hash);if(o){const s=typeof this.options.anchors=="object"&&this.options.anchors?this.options.anchors:void 0,r=`#${o.hash.split("#")[1]}`;this.scrollTo(r,s);return}}if(this.options.stopInertiaOnNavigate&&e.some(o=>i.host===o.host&&i.pathname!==o.pathname)){this.reset();return}});n(this,"onPointerDown",t=>{t.button===1&&this.reset()});n(this,"onVirtualScroll",t=>{if(typeof this.options.virtualScroll=="function"&&this.options.virtualScroll(t)===!1)return;const{deltaX:e,deltaY:i,event:o}=t;if(this.emitter.emit("virtual-scroll",{deltaX:e,deltaY:i,event:o}),o.ctrlKey||o.lenisStopPropagation)return;const s=o.type.includes("touch"),r=o.type.includes("wheel");this.isTouching=o.type==="touchstart"||o.type==="touchmove";const a=e===0&&i===0;if(this.options.syncTouch&&s&&o.type==="touchstart"&&a&&!this.isStopped&&!this.isLocked){this.reset();return}const l=this.options.gestureOrientation==="vertical"&&i===0||this.options.gestureOrientation==="horizontal"&&e===0;if(a||l)return;let u=o.composedPath();u=u.slice(0,u.indexOf(this.rootElement));const d=this.options.prevent,m=Math.abs(e)>=Math.abs(i)?"horizontal":"vertical";if(u.find(c=>{var f,g,w,y,S;return c instanceof HTMLElement&&(typeof d=="function"&&(d==null?void 0:d(c))||((f=c.hasAttribute)==null?void 0:f.call(c,"data-lenis-prevent"))||m==="vertical"&&((g=c.hasAttribute)==null?void 0:g.call(c,"data-lenis-prevent-vertical"))||m==="horizontal"&&((w=c.hasAttribute)==null?void 0:w.call(c,"data-lenis-prevent-horizontal"))||s&&((y=c.hasAttribute)==null?void 0:y.call(c,"data-lenis-prevent-touch"))||r&&((S=c.hasAttribute)==null?void 0:S.call(c,"data-lenis-prevent-wheel"))||this.options.allowNestedScroll&&this.hasNestedScroll(c,{deltaX:e,deltaY:i}))}))return;if(this.isStopped||this.isLocked){o.cancelable&&o.preventDefault();return}if(!(this.options.syncTouch&&s||this.options.smoothWheel&&r)){this.isScrolling="native",this.animate.stop(),o.lenisStopPropagation=!0;return}let p=i;this.options.gestureOrientation==="both"?p=Math.abs(i)>Math.abs(e)?i:e:this.options.gestureOrientation==="horizontal"&&(p=e),(!this.options.overscroll||this.options.infinite||this.options.wrapper!==window&&this.limit>0&&(this.animatedScroll>0&&this.animatedScroll<this.limit||this.animatedScroll===0&&i>0||this.animatedScroll===this.limit&&i<0))&&(o.lenisStopPropagation=!0),o.cancelable&&o.preventDefault();const h=s&&this.options.syncTouch,v=s&&o.type==="touchend";v&&(p=Math.sign(p)*Math.abs(this.velocity)**this.options.touchInertiaExponent),this.scrollTo(this.targetScroll+p,{programmatic:!1,...h?{lerp:v?this.options.syncTouchLerp:1}:{lerp:this.options.lerp,duration:this.options.duration,easing:this.options.easing}})});n(this,"onNativeScroll",()=>{if(this._resetVelocityTimeout!==null&&(clearTimeout(this._resetVelocityTimeout),this._resetVelocityTimeout=null),this._preventNextNativeScrollEvent){this._preventNextNativeScrollEvent=!1;return}if(this.isScrolling===!1||this.isScrolling==="native"){const t=this.animatedScroll;this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity,this.velocity=this.animatedScroll-t,this.direction=Math.sign(this.animatedScroll-t),this.isStopped||(this.isScrolling="native"),this.emit(),this.velocity!==0&&(this._resetVelocityTimeout=setTimeout(()=>{this.lastVelocity=this.velocity,this.velocity=0,this.isScrolling=!1,this.emit()},400))}});n(this,"raf",t=>{const e=t-(this.time||t);this.time=t,this.animate.advance(e*.001),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))});window.lenisVersion=F,window.lenis||(window.lenis={}),window.lenis.version=F,p==="horizontal"&&(window.lenis.horizontal=!0),s===!0&&(window.lenis.touch=!0),(!t||t===document.documentElement)&&(t=window),typeof l=="number"&&typeof u!="function"?u=C:typeof u=="function"&&typeof l!="number"&&(l=1),this.options={wrapper:t,content:e,eventsTarget:i,smoothWheel:o,syncTouch:s,syncTouchLerp:r,touchInertiaExponent:a,duration:l,easing:u,lerp:d,infinite:m,gestureOrientation:h,orientation:p,touchMultiplier:v,wheelMultiplier:c,autoResize:f,prevent:g,virtualScroll:w,overscroll:y,autoRaf:S,anchors:x,autoToggle:L,allowNestedScroll:A,naiveDimensions:Q,stopInertiaOnNavigate:Z},this.dimensions=new gt(t,e,{autoResize:f}),this.updateClassName(),this.targetScroll=this.animatedScroll=this.actualScroll,this.options.wrapper.addEventListener("scroll",this.onNativeScroll),this.options.wrapper.addEventListener("scrollend",this.onScrollEnd,{capture:!0}),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.addEventListener("click",this.onClick),this.options.wrapper.addEventListener("pointerdown",this.onPointerDown),this.virtualScroll=new yt(i,{touchMultiplier:v,wheelMultiplier:c}),this.virtualScroll.on("scroll",this.onVirtualScroll),this.options.autoToggle&&(this.checkOverflow(),this.rootElement.addEventListener("transitionend",this.onTransitionEnd)),this.options.autoRaf&&(this._rafId=requestAnimationFrame(this.raf))}destroy(){this.emitter.destroy(),this.options.wrapper.removeEventListener("scroll",this.onNativeScroll),this.options.wrapper.removeEventListener("scrollend",this.onScrollEnd,{capture:!0}),this.options.wrapper.removeEventListener("pointerdown",this.onPointerDown),(this.options.anchors||this.options.stopInertiaOnNavigate)&&this.options.wrapper.removeEventListener("click",this.onClick),this.virtualScroll.destroy(),this.dimensions.destroy(),this.cleanUpClassName(),this._rafId&&cancelAnimationFrame(this._rafId)}on(t,e){return this.emitter.on(t,e)}off(t,e){return this.emitter.off(t,e)}get overflow(){const t=this.isHorizontal?"overflow-x":"overflow-y";return getComputedStyle(this.rootElement)[t]}checkOverflow(){["hidden","clip"].includes(this.overflow)?this.internalStop():this.internalStart()}setScroll(t){this.isHorizontal?this.options.wrapper.scrollTo({left:t,behavior:"instant"}):this.options.wrapper.scrollTo({top:t,behavior:"instant"})}resize(){this.dimensions.resize(),this.animatedScroll=this.targetScroll=this.actualScroll,this.emit()}emit(){this.emitter.emit("scroll",this)}reset(){this.isLocked=!1,this.isScrolling=!1,this.animatedScroll=this.targetScroll=this.actualScroll,this.lastVelocity=this.velocity=0,this.animate.stop()}start(){if(this.isStopped){if(this.options.autoToggle){this.rootElement.style.removeProperty("overflow");return}this.internalStart()}}internalStart(){this.isStopped&&(this.reset(),this.isStopped=!1,this.emit())}stop(){if(!this.isStopped){if(this.options.autoToggle){this.rootElement.style.setProperty("overflow","clip");return}this.internalStop()}}internalStop(){this.isStopped||(this.reset(),this.isStopped=!0,this.emit())}scrollTo(t,{offset:e=0,immediate:i=!1,lock:o=!1,programmatic:s=!0,lerp:r=s?this.options.lerp:void 0,duration:a=s?this.options.duration:void 0,easing:l=s?this.options.easing:void 0,onStart:u,onComplete:d,force:m=!1,userData:p}={}){if((this.isStopped||this.isLocked)&&!m)return;let h=t,v=e;if(typeof h=="string"&&["top","left","start","#"].includes(h))h=0;else if(typeof h=="string"&&["bottom","right","end"].includes(h))h=this.limit;else{let c=null;if(typeof h=="string"?(c=document.querySelector(h),c||(h==="#top"?h=0:console.warn("Lenis: Target not found",h))):h instanceof HTMLElement&&(h!=null&&h.nodeType)&&(c=h),c){if(this.options.wrapper!==window){const x=this.rootElement.getBoundingClientRect();v-=this.isHorizontal?x.left:x.top}const f=c.getBoundingClientRect(),g=getComputedStyle(c),w=this.isHorizontal?Number.parseFloat(g.scrollMarginLeft):Number.parseFloat(g.scrollMarginTop),y=getComputedStyle(this.rootElement),S=this.isHorizontal?Number.parseFloat(y.scrollPaddingLeft):Number.parseFloat(y.scrollPaddingTop);h=(this.isHorizontal?f.left:f.top)+this.animatedScroll-(Number.isNaN(w)?0:w)-(Number.isNaN(S)?0:S)}}if(typeof h=="number"){if(h+=v,this.options.infinite){if(s){this.targetScroll=this.animatedScroll=this.scroll;const c=h-this.animatedScroll;c>this.limit/2?h-=this.limit:c<-this.limit/2&&(h+=this.limit)}}else h=V(0,h,this.limit);if(h===this.targetScroll){u==null||u(this),d==null||d(this);return}if(this.userData=p!=null?p:{},i){this.animatedScroll=this.targetScroll=h,this.setScroll(this.scroll),this.reset(),this.preventNextNativeScrollEvent(),this.emit(),d==null||d(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()});return}s||(this.targetScroll=h),typeof a=="number"&&typeof l!="function"?l=C:typeof l=="function"&&typeof a!="number"&&(a=1),this.animate.fromTo(this.animatedScroll,h,{duration:a,easing:l,lerp:r,onStart:()=>{o&&(this.isLocked=!0),this.isScrolling="smooth",u==null||u(this)},onUpdate:(c,f)=>{this.isScrolling="smooth",this.lastVelocity=this.velocity,this.velocity=c-this.animatedScroll,this.direction=Math.sign(this.velocity),this.animatedScroll=c,this.setScroll(this.scroll),s&&(this.targetScroll=c),f||this.emit(),f&&(this.reset(),this.emit(),d==null||d(this),this.userData={},requestAnimationFrame(()=>{this.dispatchScrollendEvent()}),this.preventNextNativeScrollEvent())}})}}preventNextNativeScrollEvent(){this._preventNextNativeScrollEvent=!0,requestAnimationFrame(()=>{this._preventNextNativeScrollEvent=!1})}hasNestedScroll(t,{deltaX:e,deltaY:i}){var A;const o=Date.now();t._lenis||(t._lenis={});const s=t._lenis;let r,a,l,u,d,m,p,h,v,c;if(o-((A=s.time)!=null?A:0)>2e3){s.time=Date.now();const T=window.getComputedStyle(t);if(s.computedStyle=T,r=["auto","overlay","scroll"].includes(T.overflowX),a=["auto","overlay","scroll"].includes(T.overflowY),d=["auto"].includes(T.overscrollBehaviorX),m=["auto"].includes(T.overscrollBehaviorY),s.hasOverflowX=r,s.hasOverflowY=a,!(r||a))return!1;p=t.scrollWidth,h=t.scrollHeight,v=t.clientWidth,c=t.clientHeight,l=p>v,u=h>c,s.isScrollableX=l,s.isScrollableY=u,s.scrollWidth=p,s.scrollHeight=h,s.clientWidth=v,s.clientHeight=c,s.hasOverscrollBehaviorX=d,s.hasOverscrollBehaviorY=m}else l=s.isScrollableX,u=s.isScrollableY,r=s.hasOverflowX,a=s.hasOverflowY,p=s.scrollWidth,h=s.scrollHeight,v=s.clientWidth,c=s.clientHeight,d=s.hasOverscrollBehaviorX,m=s.hasOverscrollBehaviorY;if(!(r&&l||a&&u))return!1;const f=Math.abs(e)>=Math.abs(i)?"horizontal":"vertical";let g,w,y,S,x,L;if(f==="horizontal")g=Math.round(t.scrollLeft),w=p-v,y=e,S=r,x=l,L=d;else if(f==="vertical")g=Math.round(t.scrollTop),w=h-c,y=i,S=a,x=u,L=m;else return!1;return!L&&(g>=w||g<=0)?!0:(y>0?g<w:g>0)&&S&&x}get rootElement(){return this.options.wrapper===window?document.documentElement:this.options.wrapper}get limit(){return this.options.naiveDimensions?this.isHorizontal?this.rootElement.scrollWidth-this.rootElement.clientWidth:this.rootElement.scrollHeight-this.rootElement.clientHeight:this.dimensions.limit[this.isHorizontal?"x":"y"]}get isHorizontal(){return this.options.orientation==="horizontal"}get actualScroll(){var e,i;const t=this.options.wrapper;return this.isHorizontal?(e=t.scrollX)!=null?e:t.scrollLeft:(i=t.scrollY)!=null?i:t.scrollTop}get scroll(){return this.options.infinite?mt(this.animatedScroll,this.limit):this.animatedScroll}get progress(){return this.limit===0?1:this.scroll/this.limit}get isScrolling(){return this._isScrolling}set isScrolling(t){this._isScrolling!==t&&(this._isScrolling=t,this.updateClassName())}get isStopped(){return this._isStopped}set isStopped(t){this._isStopped!==t&&(this._isStopped=t,this.updateClassName())}get isLocked(){return this._isLocked}set isLocked(t){this._isLocked!==t&&(this._isLocked=t,this.updateClassName())}get isSmooth(){return this.isScrolling==="smooth"}get className(){let t="lenis";return this.options.autoToggle&&(t+=" lenis-autoToggle"),this.isStopped&&(t+=" lenis-stopped"),this.isLocked&&(t+=" lenis-locked"),this.isScrolling&&(t+=" lenis-scrolling"),this.isScrolling==="smooth"&&(t+=" lenis-smooth"),t}updateClassName(){this.cleanUpClassName(),this.className.split(" ").forEach(t=>{this.rootElement.classList.add(t)})}cleanUpClassName(){for(const t of Array.from(this.rootElement.classList))(t==="lenis"||t.startsWith("lenis-"))&&this.rootElement.classList.remove(t)}};const xt=`
  // Simplex 3D noise — Ashima Arts / Stefan Gustavson (MIT)
  vec4 permute(vec4 x){ return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g  = step(x0.yzx, x0.xyz);
    vec3 l  = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 1.0/7.0;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }
`,k=`
  vec3 palette(float t) {
    return 0.5 + 0.5 * cos(6.28318 * (t + vec3(0.00, 0.33, 0.67)));
  }
  vec3 aurora(float t) {
    // bias the cosine palette toward violet → cyan → warm gold
    vec3 a = vec3(0.45, 0.40, 0.62);
    vec3 b = vec3(0.55, 0.45, 0.45);
    vec3 c = vec3(1.00, 1.00, 1.00);
    vec3 d = vec3(0.05, 0.30, 0.62);
    return a + b * cos(6.28318 * (c * t + d));
  }
`,bt=`
  uniform float uTime;
  uniform float uAmp;
  uniform float uFreq;
  uniform float uPulse;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  ${xt}

  float displace(vec3 p) {
    float t = uTime * 0.25;
    float n = snoise(p * uFreq + vec3(t, t * 0.8, -t * 0.6));
    n += 0.45 * snoise(p * uFreq * 2.3 - vec3(t * 1.4, 0.0, t));
    // tap shockwave: a ring travelling outward from the "north" of the orb
    float wave = sin(p.y * 9.0 - uTime * 7.0) * uPulse * 0.22;
    return n * uAmp * 0.28 + wave;
  }

  void main() {
    vec3 pos = position + normal * displace(position);

    // recompute normals from displaced neighbours so lighting stays crisp
    float e = 0.08;
    vec3 tangent = normalize(cross(normal, vec3(0.0, 1.0, 0.001)));
    vec3 bitangent = normalize(cross(normal, tangent));
    vec3 pT = position + tangent * e;
    vec3 pB = position + bitangent * e;
    pT += normal * displace(pT);
    pB += normal * displace(pB);
    vec3 newNormal = normalize(cross(pT - pos, pB - pos));

    vNoise = displace(position);
    vNormal = normalMatrix * newNormal;

    vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
    vViewDir = normalize(-mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`,Et=`
  uniform float uHue;
  uniform float uTime;

  varying vec3 vNormal;
  varying vec3 vViewDir;
  varying float vNoise;

  ${k}

  void main() {
    vec3 n = normalize(vNormal);
    vec3 v = normalize(vViewDir);

    float fres = pow(1.0 - max(dot(n, v), 0.0), 1.8);

    // thin-film style banding driven by fresnel + surface noise
    vec3 irid = aurora(fres * 0.85 + vNoise * 1.4 + uHue);

    // deep, almost-black core so the rim glows like molten glass
    vec3 base = vec3(0.015, 0.014, 0.030);
    vec3 col = mix(base, irid, smoothstep(0.0, 1.0, fres) * 0.92 + 0.10);

    // two fake studio lights
    vec3 l1 = normalize(vec3(0.7, 0.9, 0.6));
    vec3 l2 = normalize(vec3(-0.8, -0.3, 0.4));
    float spec1 = pow(max(dot(reflect(-l1, n), v), 0.0), 28.0);
    float spec2 = pow(max(dot(reflect(-l2, n), v), 0.0), 60.0);
    col += spec1 * 0.55 * aurora(uHue + 0.15);
    col += spec2 * 0.35;

    // subtle inner shimmer
    col += aurora(uHue + vNoise * 0.5 + uTime * 0.02) * 0.05;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`,zt=`
  uniform float uTime;
  uniform float uSize;
  uniform float uSpread;
  uniform float uScroll;

  attribute float aSeed;
  attribute float aRadius;

  varying float vSeed;
  varying float vAlpha;

  void main() {
    vSeed = aSeed;

    // each particle orbits at its own radius / speed / phase
    float speed = 0.05 + aSeed * 0.12;
    float angle = uTime * speed + aSeed * 6.28318;
    float r = aRadius * uSpread;

    vec3 p = position;
    float ca = cos(angle), sa = sin(angle);
    p = vec3(ca * p.x - sa * p.z, p.y, sa * p.x + ca * p.z) * r;

    // slow vertical breathing + scroll drift
    p.y += sin(uTime * 0.4 + aSeed * 12.0) * 0.25;
    p.y += uScroll * (0.5 + aSeed) * 1.5;

    vec4 mvPos = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mvPos;

    float twinkle = 0.65 + 0.35 * sin(uTime * (1.0 + aSeed * 3.0) + aSeed * 40.0);
    vAlpha = twinkle * smoothstep(14.0, 4.0, -mvPos.z);

    float size = uSize * (0.4 + aSeed) * (1.0 / -mvPos.z) * 30.0;
    gl_PointSize = min(size, 22.0);
  }
`,Tt=`
  uniform float uHue;

  varying float vSeed;
  varying float vAlpha;

  ${k}

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float circle = smoothstep(0.5, 0.05, d);
    vec3 col = aurora(vSeed * 0.35 + uHue + 0.1);
    gl_FragColor = vec4(col, circle * vAlpha * 0.5);
    #include <colorspace_fragment>
  }
`,Mt=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`,Lt=`
  uniform float uTime;
  uniform float uHue;
  uniform vec2 uPointer;

  varying vec2 vUv;

  ${k}

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  void main() {
    vec2 uv = vUv;
    vec2 centered = uv - 0.5;

    // deep space base
    vec3 col = mix(vec3(0.030, 0.028, 0.052), vec3(0.012, 0.012, 0.022), length(centered) * 1.6);

    // two drifting aurora glows, one follows the pointer a little
    vec2 g1 = vec2(0.30 + sin(uTime * 0.05) * 0.12, 0.72 + cos(uTime * 0.04) * 0.10);
    vec2 g2 = vec2(0.78 + cos(uTime * 0.06) * 0.10, 0.25 + sin(uTime * 0.05) * 0.12) + uPointer * 0.06;

    float d1 = smoothstep(0.75, 0.0, distance(uv, g1));
    float d2 = smoothstep(0.65, 0.0, distance(uv, g2));

    col += aurora(uHue) * d1 * d1 * 0.10;
    col += aurora(uHue + 0.45) * d2 * d2 * 0.085;

    // vignette
    col *= 1.0 - dot(centered, centered) * 0.9;

    // dither to kill gradient banding (crucial on OLED phones)
    col += (hash(uv * 821.0 + uTime) - 0.5) * 0.012;

    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }
`,{lerp:E,clamp:Nt}=ut,z=[{at:0,x:0,y:-.2,scale:1,amp:1.2,freq:1.5,hue:0,spread:1,rot:.15},{at:.16,x:1.5,y:.1,scale:.62,amp:2.1,freq:2.4,hue:.1,spread:1.35,rot:.45},{at:.4,x:-1.6,y:0,scale:.8,amp:.7,freq:3.6,hue:.28,spread:1.1,rot:.25},{at:.62,x:1.6,y:-.2,scale:.58,amp:2.6,freq:1.2,hue:.46,spread:1.6,rot:.6},{at:.84,x:0,y:0,scale:1.2,amp:.45,freq:2,hue:.62,spread:.7,rot:.1},{at:1,x:0,y:.15,scale:.92,amp:2.5,freq:2.8,hue:.78,spread:2.2,rot:.8}];class Pt{constructor(e,{isMobile:i,reducedMotion:o}){this.canvas=e,this.isMobile=i,this.reducedMotion=o,this.scroll=0,this.pointer={x:0,y:0,tx:0,ty:0},this.pulse=0,this.running=!0,this.dprSteps=i?[1.75,1.5,1.25,1]:[2,1.75,1.5,1.25],this.dprIndex=0,this.slowFrames=0,this.clock=new it,this.initRenderer(),this.initScene(),this.bindEvents(),this.resize()}initRenderer(){this.renderer=new st({canvas:this.canvas,antialias:!this.isMobile,alpha:!1,powerPreference:"high-performance",stencil:!1,depth:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.dprSteps[0]))}initScene(){this.scene=new ot,this.camera=new rt(42,1,.1,50),this.camera.position.z=5,this.backdrop=new q(new nt(2,2),new H({vertexShader:Mt,fragmentShader:Lt,uniforms:{uTime:{value:0},uHue:{value:0},uPointer:{value:{x:0,y:0}}},depthWrite:!1,depthTest:!1})),this.backdrop.frustumCulled=!1,this.backdrop.renderOrder=-1,this.scene.add(this.backdrop);const e=this.isMobile?48:72;this.orb=new q(new lt(1,e),new H({vertexShader:bt,fragmentShader:Et,uniforms:{uTime:{value:0},uAmp:{value:1.2},uFreq:{value:1.5},uHue:{value:0},uPulse:{value:0}}})),this.scene.add(this.orb);const i=this.isMobile?500:1300,o=new Float32Array(i*3),s=new Float32Array(i),r=new Float32Array(i);for(let l=0;l<i;l++){const u=Math.random()*Math.PI*2,d=Math.acos(2*Math.random()-1);o[l*3+0]=Math.sin(d)*Math.cos(u),o[l*3+1]=Math.cos(d)*.8,o[l*3+2]=Math.sin(d)*Math.sin(u),s[l]=Math.random(),r[l]=1.6+Math.random()*2.6}const a=new at;a.setAttribute("position",new O(o,3)),a.setAttribute("aSeed",new O(s,1)),a.setAttribute("aRadius",new O(r,1)),this.particles=new ct(a,new H({vertexShader:zt,fragmentShader:Tt,uniforms:{uTime:{value:0},uSize:{value:this.isMobile?6:8},uSpread:{value:1},uScroll:{value:0},uHue:{value:0}},transparent:!0,depthWrite:!1,blending:ht})),this.scene.add(this.particles)}bindEvents(){window.addEventListener("resize",()=>this.resize()),window.addEventListener("pointermove",e=>{this.pointer.tx=e.clientX/window.innerWidth*2-1,this.pointer.ty=-(e.clientY/window.innerHeight*2-1)},{passive:!0}),window.addEventListener("pointerdown",()=>{this.pulse=1},{passive:!0}),document.addEventListener("visibilitychange",()=>{this.running=document.visibilityState==="visible",this.running&&this.clock.getDelta()})}resize(){const e=window.innerWidth,i=window.innerHeight;this.viewport={w:e,h:i},this.camera.aspect=e/i,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,i)}setScroll(e){this.scroll=Nt(e,0,1)}sampleKeyframes(){const e=this.scroll;let i=z[0],o=z[z.length-1];for(let a=0;a<z.length-1;a++)if(e>=z[a].at&&e<=z[a+1].at){i=z[a],o=z[a+1];break}const s=o.at-i.at||1;let r=(e-i.at)/s;return r=r*r*(3-2*r),{x:E(i.x,o.x,r),y:E(i.y,o.y,r),scale:E(i.scale,o.scale,r),amp:E(i.amp,o.amp,r),freq:E(i.freq,o.freq,r),hue:E(i.hue,o.hue,r),spread:E(i.spread,o.spread,r),rot:E(i.rot,o.rot,r)}}update(){if(!this.running)return;const e=Math.min(this.clock.getDelta(),.05),i=this.clock.elapsedTime;this.watchPerformance(e);const o=1-Math.exp(-4*e);this.pointer.x+=(this.pointer.tx-this.pointer.x)*o,this.pointer.y+=(this.pointer.ty-this.pointer.y)*o,this.pulse=Math.max(0,this.pulse-e*1.4);const s=this.sampleKeyframes(),r=this.reducedMotion?.25:1,a=this.isMobile?.45:1;this.orb.position.x=s.x*a,this.orb.position.y=s.y+Math.sin(i*.6)*.06*r,this.orb.scale.setScalar(s.scale*(this.isMobile?.8:1)),this.orb.rotation.y=i*.1*s.rot*r+this.pointer.x*.35,this.orb.rotation.x=-this.pointer.y*.3+i*.04*r;const l=this.orb.material.uniforms;l.uTime.value=i*r,l.uAmp.value=s.amp*r+(this.reducedMotion?.3:0),l.uFreq.value=s.freq,l.uHue.value=s.hue,l.uPulse.value=this.pulse;const u=this.particles.material.uniforms;u.uTime.value=i*r,u.uSpread.value=s.spread,u.uScroll.value=this.scroll,u.uHue.value=s.hue,this.particles.position.copy(this.orb.position);const d=this.backdrop.material.uniforms;d.uTime.value=i*r,d.uHue.value=s.hue,d.uPointer.value.x=this.pointer.x,d.uPointer.value.y=this.pointer.y,this.camera.position.x=this.pointer.x*.18*r,this.camera.position.y=this.pointer.y*.12*r,this.camera.lookAt(0,0,0),this.renderer.render(this.scene,this.camera)}watchPerformance(e){e>1/40?this.slowFrames++:this.slowFrames=Math.max(0,this.slowFrames-2),this.slowFrames>90&&this.dprIndex<this.dprSteps.length-1&&(this.dprIndex++,this.slowFrames=0,this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,this.dprSteps[this.dprIndex])))}}const R=matchMedia("(pointer: coarse)").matches||window.innerWidth<768,P=matchMedia("(prefers-reduced-motion: reduce)").matches;document.documentElement.classList.toggle("is-mobile",R);const Y=new Pt(document.getElementById("webgl"),{isMobile:R,reducedMotion:P}),M=new St({duration:P?0:1.15,smoothWheel:!P,syncTouch:!1});M.on("scroll",({scroll:t,limit:e})=>{Y.setScroll(e>0?t/e:0)});document.querySelectorAll('a[href^="#"]').forEach(t=>{t.addEventListener("click",e=>{const i=t.getAttribute("href");if(i.length<2)return;const o=document.querySelector(i);o&&(e.preventDefault(),j(),M.scrollTo(o,{offset:0}))})});function U(t){M.raf(t),Y.update(),requestAnimationFrame(U)}requestAnimationFrame(U);const B=document.getElementById("preloader"),D=document.getElementById("preloaderCount"),At=document.getElementById("preloaderBar");{let t=0,e=30,i=!1,o=0;const s=()=>{e=100,o||(o=performance.now())};Promise.allSettled([document.fonts?document.fonts.ready:Promise.resolve(),new Promise(a=>{document.readyState==="complete"?a():window.addEventListener("load",a,{once:!0})})]).then(s),setTimeout(s,2e3);const r=()=>{t+=(e-t)*.16;const a=Math.round(t);D.textContent=a,At.style.transform=`scaleX(${t/100})`;const l=o&&performance.now()-o>800;if((t>99||l)&&!i){i=!0,D.textContent=100,B.classList.add("is-done"),document.body.classList.add("is-loaded"),setTimeout(()=>B.remove(),1200);return}i||requestAnimationFrame(r)};requestAnimationFrame(r)}const _=document.getElementById("menuToggle"),Ht=document.getElementById("menuOverlay");let W=!1;function $(t){W=t,document.body.classList.toggle("menu-open",t),_.setAttribute("aria-expanded",String(t)),Ht.setAttribute("aria-hidden",String(!t));const e=_.querySelector(".header__menu-word");e.textContent=t?e.dataset.open:e.dataset.closed,t?M.stop():M.start()}const j=()=>W&&$(!1);_.addEventListener("click",()=>$(!W));window.addEventListener("keydown",t=>{t.key==="Escape"&&j()});const G=new IntersectionObserver(t=>{for(const e of t)e.isIntersecting&&(e.target.classList.add("in-view"),G.unobserve(e.target))},{threshold:.18,rootMargin:"0px 0px -8% 0px"});document.querySelectorAll(".reveal").forEach(t=>G.observe(t));const N=document.getElementById("manifesto");if(N){const t=N.textContent.trim().split(/\s+/);N.innerHTML=t.map(o=>`<span class="mw"><span>${o}</span></span>`).join(" ");const e=N.querySelectorAll(".mw > span"),i=()=>{const o=N.getBoundingClientRect(),s=window.innerHeight,r=Math.min(1,Math.max(0,(s*.85-o.top)/(s*.7))),a=Math.floor(r*e.length);e.forEach((l,u)=>l.classList.toggle("lit",u<=a))};M.on("scroll",i),i()}const K=new IntersectionObserver(t=>{for(const e of t){if(!e.isIntersecting)continue;K.unobserve(e.target);const i=e.target,o=parseInt(i.dataset.count,10),s=performance.now(),r=P?1:1400,a=l=>{const u=Math.min(1,(l-s)/r);i.textContent=Math.round(o*(1-Math.pow(1-u,3))),u<1&&requestAnimationFrame(a)};requestAnimationFrame(a)}},{threshold:.6});document.querySelectorAll("[data-count]").forEach(t=>K.observe(t));const Ot=document.getElementById("clock"),J=()=>{const t=new Date;Ot.textContent=String(t.getHours()).padStart(2,"0")+":"+String(t.getMinutes()).padStart(2,"0")};J();setInterval(J,2e4);if(!R&&!P){const t=document.getElementById("cursor"),e=document.getElementById("cursorLabel");let i=-100,o=-100,s=-100,r=-100;window.addEventListener("pointermove",l=>{s=l.clientX,r=l.clientY},{passive:!0}),document.querySelectorAll("[data-cursor]").forEach(l=>{l.addEventListener("pointerenter",()=>{e.textContent=l.dataset.cursor,t.classList.add("is-label")}),l.addEventListener("pointerleave",()=>{t.classList.remove("is-label")})});const a=()=>{i+=(s-i)*.2,o+=(r-o)*.2,t.style.transform=`translate(${i}px, ${o}px)`,requestAnimationFrame(a)};requestAnimationFrame(a),document.body.classList.add("has-cursor"),document.querySelectorAll("[data-magnetic]").forEach(l=>{l.addEventListener("pointermove",d=>{const m=l.getBoundingClientRect(),p=d.clientX-(m.left+m.width/2),h=d.clientY-(m.top+m.height/2);l.style.transform=`translate(${p*.35}px, ${h*.35}px)`}),l.addEventListener("pointerleave",()=>{l.style.transform=""})})}
