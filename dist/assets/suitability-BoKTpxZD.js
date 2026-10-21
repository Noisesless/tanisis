import{c as e,g as t,m as n,t as r}from"./default-CAKe9ffW.js";import{a as i,i as a}from"./x-CXWFwwzx.js";import{t as o}from"./layers-BAZPaPqw.js";import{C as s,b as c,p as l,s as u,r as createIcon}from"./index-CI1XYnwk.js";import{Q as d}from"./api-BxFGoia1.js";import{$ as f,A as p,At as m,B as h,Bn as g,Bt as ee,Cn as _,D as v,Dn as y,Dt as b,E as x,Ft as S,Gn as C,Gt as w,H as te,Ht as T,It as E,J as D,Kn as O,Kt as k,L as ne,Ln as A,Lt as j,Mt as re,N as ie,Nn as ae,Nt as M,O as oe,Ot as se,P as ce,Pn as le,Pt as ue,Q as de,R as fe,Rt as pe,Sn as me,St as he,T as ge,Tn as N,U as _e,Un as P,Ut as ve,V as ye,Vn as F,Vt as be,W as xe,X as Se,Y as Ce,Z as we,Zt as I,_t as L,a as Te,an as Ee,at as De,bn as R,bt as Oe,c as ke,ct as Ae,d as je,dt as Me,f as Ne,fn as Pe,ft as Fe,g as Ie,i as Le,in as Re,it as ze,j as Be,jt as z,k as Ve,kt as He,l as Ue,lt as We,mn as Ge,mt as Ke,nn as qe,nt as Je,o as Ye,ot as Xe,pn as Ze,pt as Qe,q as $e,qn as B,r as et,rt as tt,s as nt,st as rt,t as it,tt as at,u as ot,un as st,ut as ct,vn as V,vt as lt,wn as ut,x as dt,xt as ft,yn as pt,yt as mt,z as ht,zt as gt}from"./BarChart-CCPNsfhB.js";import{n as _t,r as vt,t as yt}from"./ActivePoints-D6c9LBAQ.js";var H=s(c()),bt=[`points`,`className`,`baseLinePoints`,`connectNulls`],xt;function U(){return U=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},U.apply(null,arguments)}function St(e,t){if(e==null)return{};var n,r,i=Ct(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function Ct(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function wt(e,t){return t||=e.slice(0),Object.freeze(Object.defineProperties(e,{raw:{value:Object.freeze(t)}}))}var Tt=e=>e!=null&&e.x===+e.x&&e.y===+e.y,Et=function(){var e=arguments.length>0&&arguments[0]!==void 0?arguments[0]:[],t=[[]];e.forEach(e=>{var n=t[t.length-1];Tt(e)?n&&n.push(e):n&&n.length>0&&t.push([])});var n=e[0],r=t[t.length-1];Tt(n)&&r&&r.push(n);var i=t[t.length-1];return i&&i.length<=0&&(t=t.slice(0,-1)),t},W=(e,t)=>{var n=Et(e);t&&(n=[n.reduce((e,t)=>[...e,...t],[])]);var r=n.map(e=>e.reduce((e,t,n)=>g(xt||=wt([``,``,``,`,`,``]),e,n===0?`M`:`L`,t.x,t.y),``)).join(``);return n.length===1?`${r}Z`:r},Dt=(e,t,n)=>{var r=W(e,n);return`${r.slice(-1)===`Z`?r.slice(0,-1):r}L${W(Array.from(t).reverse(),n).slice(1)}`},Ot=e=>{var t=e.points,n=e.className,r=e.baseLinePoints,i=e.connectNulls,a=St(e,bt);if(!t||!t.length)return null;var o=B(`recharts-polygon`,n);if(r&&r.length){var s=a.stroke&&a.stroke!==`none`,c=Dt(t,r,i);return H.createElement(`g`,{className:o},H.createElement(`path`,U({},P(a),{fill:c.slice(-1)===`Z`?a.fill:`none`,stroke:`none`,d:c})),s?H.createElement(`path`,U({},P(a),{fill:`none`,d:W(t,i)})):null,s?H.createElement(`path`,U({},P(a),{fill:`none`,d:W(r,i)})):null)}var l=W(t,i);return H.createElement(`path`,U({},P(a),{fill:l.slice(-1)===`Z`?a.fill:`none`,className:o,d:l}))},kt=e=>e.graphicalItems.polarItems,At=V([kt,L,V([z,m],Qe)],ct),jt=V([V([At],We),T],Xe),Mt=V([jt,L,At],at);V([jt,L,At],(e,t,n)=>n.length>0?e.flatMap(e=>n.flatMap(n=>({value:Ze(e,t.dataKey??n.dataKey),errorDomain:[]}))).filter(Boolean):t?.dataKey==null?e.map(e=>({value:e,errorDomain:[]})):e.map(e=>({value:Ze(e,t.dataKey),errorDomain:[]})));var Nt=()=>void 0,Pt=V([L,I,jt,Mt,be,z,V([L,lt,mt,Nt,V([jt,L,At,Ke,z,ve],rt),Nt,I,z],Fe)],Je),Ft=V([Pt,he,ft],Me),It=V([ft,V([L,Pt,Ft,z],tt)],se),Lt=(e,t,n)=>{switch(t){case`angleAxis`:return re(e,n);case`radiusAxis`:return S(e,n);default:throw Error(`Unexpected axis type: ${t}`)}},Rt=(e,t,n)=>{switch(t){case`angleAxis`:return M(e,n);case`radiusAxis`:return E(e,n);default:throw Error(`Unexpected axis type: ${t}`)}},G=V([V([Lt,ft,It,Rt],b)],He),zt=V([I,Mt,he,z],De),K=V([I,Lt,ft,G,Ft,Rt,Oe,zt,z],ze),Bt=V([K],e=>{if(e){var t=new Map;return e.forEach(e=>{var n=(e.coordinate+360)%360;t.has(n)||t.set(n,e)}),Array.from(t.values())}});V([I,Lt,G,Rt,Oe,zt,z],Ae);var Vt=V([(e,t)=>K(e,`angleAxis`,t,!1)],e=>{if(e)return e.map(e=>e.coordinate)}),Ht=V([(e,t)=>K(e,`radiusAxis`,t,!1)],e=>{if(e)return e.map(e=>e.coordinate)}),Ut=[`gridType`,`radialLines`,`angleAxisId`,`radiusAxisId`,`cx`,`cy`,`innerRadius`,`outerRadius`,`polarAngles`,`polarRadius`,`zIndex`];function Wt(e,t){if(e==null)return{};var n,r,i=Gt(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function Gt(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function q(){return q=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},q.apply(null,arguments)}function Kt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function qt(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Kt(Object(n),!0).forEach(function(t){Jt(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Kt(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Jt(e,t,n){return(t=Yt(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Yt(e){var t=Xt(e,`string`);return typeof t==`symbol`?t:t+``}function Xt(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var Zt=(e,t,n,r)=>{var i=``;return r.forEach((r,a)=>{var o=k(t,n,e,r);a?i+=`L ${o.x},${o.y}`:i+=`M ${o.x},${o.y}`}),i+=`Z`,i},Qt=e=>{var t=e.cx,n=e.cy,r=e.innerRadius,i=e.outerRadius,a=e.polarAngles,o=e.radialLines;if(!a||!a.length||!o)return null;var s=qt({},C(e));return H.createElement(`g`,{className:`recharts-polar-grid-angle`},a.map(e=>{var a=k(t,n,r,e),o=k(t,n,i,e);return H.createElement(`line`,q({key:`line-${e}`},s,{x1:a.x,y1:a.y,x2:o.x,y2:o.y}))}))},$t=e=>{var t=e.cx,n=e.cy,r=e.radius,i=qt({},C(e));return H.createElement(`circle`,q({},i,{className:B(`recharts-polar-grid-concentric-circle`,e.className),cx:t,cy:n,r}))},en=e=>{var t=e.radius,n=qt({},C(e));return H.createElement(`path`,q({},n,{className:B(`recharts-polar-grid-concentric-polygon`,e.className),d:Zt(t,e.cx,e.cy,e.polarAngles)}))},tn=e=>{var t=e.polarRadius,n=e.gridType;if(!t||!t.length)return null;var r=Math.max(...t),i=e.fill&&e.fill!==`none`;return H.createElement(`g`,{className:`recharts-polar-grid-concentric`},i&&n===`circle`&&H.createElement($t,q({},e,{radius:r})),i&&n!==`circle`&&H.createElement(en,q({},e,{radius:r})),t.map((t,r)=>{var i=r;return n===`circle`?H.createElement($t,q({key:i},e,{fill:`none`,radius:t})):H.createElement(en,q({key:i},e,{fill:`none`,radius:t}))}))},nn={angleAxisId:0,radiusAxisId:0,gridType:`polygon`,radialLines:!0,zIndex:ee.grid,stroke:`#ccc`,strokeWidth:1,fill:`none`},rn=e=>{var t=N(e,nn),n=t.gridType,r=t.radialLines,i=t.angleAxisId,a=t.radiusAxisId,o=t.cx,s=t.cy,c=t.innerRadius,l=t.outerRadius,u=t.polarAngles,d=t.polarRadius,p=t.zIndex,m=Wt(t,Ut),h=R(ue),g=R(e=>Vt(e,i)),ee=R(e=>Ht(e,a)),_=Array.isArray(u)?u:g,v=Array.isArray(d)?d:ee;if(_==null||v==null)return null;var y=qt({cx:h?.cx??o??0,cy:h?.cy??s??0,innerRadius:h?.innerRadius??c??0,outerRadius:h?.outerRadius??l??0,polarAngles:_,polarRadius:v,zIndex:p},m);return y.outerRadius<=0?null:H.createElement(f,{zIndex:y.zIndex},H.createElement(`g`,{className:`recharts-polar-grid`},H.createElement(tn,q({gridType:n,radialLines:r},y,{polarAngles:_,polarRadius:v})),H.createElement(Qt,q({gridType:n,radialLines:r},y,{polarAngles:_,polarRadius:v}))))};rn.displayName=`PolarGrid`;function an(e,t){if(e.length===0)return;let n=e[0],r=-1/0;for(let i=0;i<e.length;i++){let a=e[i],o=t(a,i,e);if(Number.isNaN(o))return a;o>r&&(r=o,n=a)}return n}function on(e,t){if(e!=null)return an(Array.from(e),_(t??ut))}function sn(e,t){if(e.length===0)return;let n=e[0],r=1/0;for(let i=0;i<e.length;i++){let a=e[i],o=t(a,i,e);if(Number.isNaN(o))return a;o<r&&(r=o,n=a)}return n}function cn(e,t){if(e!=null)return sn(Array.from(e),_(t??ut))}var ln=[`type`],un=[`cx`,`cy`,`angle`,`axisLine`],dn=[`angle`,`tickFormatter`,`stroke`,`tick`];function fn(){return fn=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},fn.apply(null,arguments)}function pn(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function J(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?pn(Object(n),!0).forEach(function(t){mn(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):pn(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function mn(e,t,n){return(t=hn(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function hn(e){var t=gn(e,`string`);return typeof t==`symbol`?t:t+``}function gn(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function _n(e,t){if(e==null)return{};var n,r,i=vn(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function vn(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}var yn=`radiusAxis`;function bn(e){var t=pt(),n=qe(),r=(0,H.useMemo)(()=>{var t=e.type,r=_n(e,ln),i=j(n,`radiusAxis`,t);if(i!=null)return J(J({},r),{},{type:i})},[e,n]);return(0,H.useEffect)(()=>r==null?A:(t(ht(r)),()=>{t(ye(r))}),[t,r]),null}var xn=(e,t,n,r)=>{var i=e.coordinate;return k(n,r,i,t)},Sn=e=>{var t;switch(e){case`left`:t=`end`;break;case`right`:t=`start`;break;default:t=`middle`;break}return t},Cn=(e,t,n,r)=>{var i=on(r,e=>e.coordinate||0);return{cx:t,cy:n,startAngle:e,endAngle:e,innerRadius:cn(r,e=>e.coordinate||0)?.coordinate||0,outerRadius:i?.coordinate||0,clockWise:!1}},wn=(e,t)=>{var n=e.cx,r=e.cy,i=e.angle,a=e.axisLine,o=_n(e,un),s=t.reduce((e,t)=>[Math.min(e[0],t.coordinate),Math.max(e[1],t.coordinate)],[1/0,-1/0]),c=k(n,r,s[0],i),l=k(n,r,s[1],i),u=J(J(J({},C(o)),{},{fill:`none`},C(a)),{},{x1:c.x,y1:c.y,x2:l.x,y2:l.y});return H.createElement(`line`,fn({className:`recharts-polar-radius-axis-line`},u))},Tn=(e,t,n)=>H.isValidElement(e)?H.cloneElement(e,t):typeof e==`function`?e(t):H.createElement(Ce,fn({},t,{className:`recharts-polar-radius-axis-tick-value`}),n),En=(e,t)=>{var n=e.angle,r=e.tickFormatter,i=e.stroke,a=e.tick,o=_n(e,dn),s=Sn(e.orientation),c=C(o),l=O(a),u=t.map((t,o)=>{var u=xn(t,e.angle,e.cx,e.cy),d=J(J(J(J({textAnchor:s,transform:`rotate(${90-n}, ${u.x}, ${u.y})`},c),{},{stroke:`none`,fill:i},l),{},{index:o},u),{},{payload:t});return H.createElement(F,fn({className:B(`recharts-polar-radius-axis-tick`,ne(a)),key:`tick-${t.coordinate}`},y(e,t,o)),Tn(a,d,r?r(t.value,o):t.value))});return H.createElement(F,{className:`recharts-polar-radius-axis-ticks`},u)},Dn=e=>{var t=e.radiusAxisId,n=R(ue),r=R(e=>G(e,`radiusAxis`,t)),i=R(e=>K(e,`radiusAxis`,t,!1));if(n==null||!i||!i.length||r==null)return null;var a=J(J({},e),{},{scale:r},n),o=a.tick,s=a.axisLine;return H.createElement(f,{zIndex:a.zIndex},H.createElement(F,{className:B(`recharts-polar-radius-axis`,yn,a.className)},s&&wn(a,i),o&&En(a,i),H.createElement($e,Cn(a.angle,a.cx,a.cy,i),H.createElement(D,{label:a.label}),a.children)))};function On(e){var t=N(e,pe);return H.createElement(H.Fragment,null,H.createElement(bn,{domain:t.domain,id:t.radiusAxisId,scale:t.scale,type:t.type,dataKey:t.dataKey,unit:void 0,name:t.name,allowDuplicatedCategory:t.allowDuplicatedCategory,allowDataOverflow:t.allowDataOverflow,reversed:t.reversed,includeHidden:t.includeHidden,allowDecimals:t.allowDecimals,niceTicks:t.niceTicks??`auto`,ticks:t.ticks,tickCount:t.tickCount,tick:t.tick}),H.createElement(Dn,t))}On.displayName=`PolarRadiusAxis`;var kn=[`children`,`type`],An=[`ref`];function Y(){return Y=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Y.apply(null,arguments)}function jn(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function X(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?jn(Object(n),!0).forEach(function(t){Mn(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):jn(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Mn(e,t,n){return(t=Nn(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Nn(e){var t=Pn(e,`string`);return typeof t==`symbol`?t:t+``}function Pn(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Fn(e,t){if(e==null)return{};var n,r,i=In(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function In(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}var Ln=1e-5,Rn=Math.cos(w(45)),zn=`angleAxis`;function Bn(e){var t=pt(),n=qe(),r=(0,H.useMemo)(()=>{e.children;var t=e.type,r=Fn(e,kn),i=j(n,`angleAxis`,t);if(i!=null)return X(X({},r),{},{type:i})},[e,n]),i=r===R(e=>re(e,r?.id));return(0,H.useEffect)(()=>r==null?A:(t(fe(r)),()=>{t(h(r))}),[t,r]),i?e.children:null}var Vn=(e,t)=>{var n=t.cx,r=t.cy,i=t.radius,a=t.orientation,o=t.tickSize||8,s=k(n,r,i,e.coordinate),c=k(n,r,i+(a===`inner`?-1:1)*o,e.coordinate);return{x1:s.x,y1:s.y,x2:c.x,y2:c.y}},Hn=(e,t)=>{var n=Math.cos(w(-e.coordinate));return n>Ln?t===`outer`?`start`:`end`:n<-Ln?t===`outer`?`end`:`start`:`middle`},Un=e=>{var t=Math.cos(w(-e.coordinate)),n=Math.sin(w(-e.coordinate));return Math.abs(t)<=Rn?n>0?`start`:`end`:`middle`},Wn=e=>{var t=e.cx,n=e.cy,r=e.radius,i=e.axisLineType,a=e.axisLine,o=e.ticks;if(!a)return null;var s=X(X({},C(e)),{},{fill:`none`},C(a));if(i===`circle`)return H.createElement(vt,Y({className:`recharts-polar-angle-axis-line`},s,{cx:t,cy:n,r}));var c=o.map(e=>k(t,n,r,e.coordinate));return H.createElement(Ot,Y({className:`recharts-polar-angle-axis-line`},s,{points:c}))},Gn=e=>{var t=e.tick,n=e.tickProps,r=e.value;return t?H.isValidElement(t)?H.cloneElement(t,n):typeof t==`function`?t(n):H.createElement(Ce,Y({},n,{className:`recharts-polar-angle-axis-tick-value`}),r):null},Kn=e=>{var t=e.tick,n=e.tickLine,r=e.tickFormatter,i=e.stroke,a=e.ticks,o=C(e);o.ref;var s=Fn(o,An),c=O(t),l=X(X({},s),{},{fill:`none`},C(n)),u=a.map((a,o)=>{var u=Vn(a,e),d=Hn(a,e.orientation),f=Un(a),p=X(X(X({},s),{},{textAnchor:d,verticalAnchor:f,stroke:`none`,fill:i},c),{},{index:o,payload:a,x:u.x2,y:u.y2});return H.createElement(F,Y({className:B(`recharts-polar-angle-axis-tick`,ne(t)),key:`tick-${a.coordinate}`},y(e,a,o)),n&&H.createElement(`line`,Y({className:`recharts-polar-angle-axis-tick-line`},l,u)),H.createElement(Gn,{tick:t,tickProps:p,value:r?r(a.value,o):a.value}))});return H.createElement(F,{className:`recharts-polar-angle-axis-ticks`},u)},qn=e=>{var t=e.angleAxisId,n=R(ue),r=R(e=>G(e,`angleAxis`,t)),i=Ee(),a=R(e=>Bt(e,`angleAxis`,t,i));if(n==null||!a||!a.length||r==null)return null;var o=X(X(X({},e),{},{scale:r},n),{},{radius:n.outerRadius,ticks:a});return H.createElement(f,{zIndex:o.zIndex},H.createElement(F,{className:B(`recharts-polar-angle-axis`,zn,o.className)},H.createElement(Wn,o),H.createElement(Kn,o)))};function Jn(e){var t=N(e,gt);return H.createElement(Bn,{id:t.angleAxisId,scale:t.scale,type:t.type,dataKey:t.dataKey,unit:void 0,name:t.name,allowDuplicatedCategory:!1,allowDataOverflow:!1,reversed:t.reversed,includeHidden:!1,allowDecimals:t.allowDecimals,tickCount:t.tickCount,niceTicks:t.niceTicks??`auto`,ticks:t.ticks,tick:t.tick,domain:t.domain},H.createElement(qn,t))}Jn.displayName=`PolarAngleAxis`;function Yn(e){return e[e.length-1]}function Xn(e){return Array.isArray(e)?e:Array.from(e)}function Zn(e){if(me(e))return Yn(Xn(e))}function Qn(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function $n(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Qn(Object(n),!0).forEach(function(t){er(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Qn(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function er(e,t,n){return(t=tr(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function tr(e){var t=nr(e,`string`);return typeof t==`symbol`?t:t+``}function nr(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var rr=(e,t)=>G(e,`radiusAxis`,t),ir=V([rr],e=>{if(e!=null)return{scale:e}}),ar=V([S,rr],(e,t)=>{if(!(e==null||t==null))return $n($n({},e),{},{scale:t})}),or=(e,t,n,r)=>K(e,`radiusAxis`,t,r),sr=(e,t,n)=>re(e,n),cr=(e,t,n)=>G(e,`angleAxis`,n),lr=V([sr,cr],(e,t)=>{if(!(e==null||t==null))return $n($n({},e),{},{scale:t})}),ur=(e,t,n,r)=>K(e,`angleAxis`,n,r),dr=V([sr,cr,ue],(e,t,n)=>{if(!(n==null||t==null))return{scale:t,type:e.type,dataKey:e.dataKey,cx:n.cx,cy:n.cy}}),fr=(e,t,n,r,i)=>i,pr=V([I,ar,or,lr,ur],(e,t,n,r,i)=>Ge(e,`radiusAxis`)?st(t,n,!1):st(r,i,!1)),mr=V([ir,dr,T,V([kt,fr],(e,t)=>{if(e!=null)return e.find(e=>e.type===`radar`&&t===e.id)?.dataKey}),pr],(e,t,n,r,i)=>{var a=n.chartData,o=n.dataStartIndex,s=n.dataEndIndex;if(!(e==null||t==null||a==null||i==null||r==null))return Er({radiusAxis:e,angleAxis:t,displayedData:a.slice(o,s+1),dataKey:r,bandSize:i})}),hr=[`id`];function Z(){return Z=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Z.apply(null,arguments)}function gr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function Q(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?gr(Object(n),!0).forEach(function(t){_r(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):gr(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function _r(e,t,n){return(t=vr(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function vr(e){var t=yr(e,`string`);return typeof t==`symbol`?t:t+``}function yr(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function br(e,t){if(e==null)return{};var n,r,i=xr(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function xr(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function Sr(e,t){return e&&e!==`none`?e:t}var Cr=e=>{var t=e.dataKey,n=e.name,r=e.stroke,i=e.fill,a=e.legendType;return[{inactive:e.hide,dataKey:t,type:a,color:Sr(r,i),value:Pe(n,t),payload:e}]},wr=H.memo(e=>{var t=e.dataKey,n=e.stroke,r=e.strokeWidth,i=e.fill,a=e.name,o=e.hide,s=e.tooltipType,c=e.id,l={dataDefinedOnItem:void 0,getPosition:A,settings:{stroke:n,strokeWidth:r,fill:i,nameKey:void 0,dataKey:t,name:Pe(a,t),hide:o,type:s,color:Sr(n,i),unit:``,graphicalItemId:c}};return H.createElement(ce,{tooltipEntrySettings:l})});function Tr(e){var t=e.points,n=e.props,r=n.dot,i=n.dataKey;n.id;var a=C(br(n,hr));return H.createElement(_t,{points:t,dot:r,className:`recharts-radar-dots`,dotClassName:`recharts-radar-dot`,dataKey:i,baseProps:a})}function Er(e){var t=e.radiusAxis,n=e.angleAxis,r=e.displayedData,i=e.dataKey,a=e.bandSize,o=n.cx,s=n.cy,c=!1,l=[],u=n.type===`number`?0:a??0;r.forEach((e,r)=>{var a=Ze(e,n.dataKey,r),d=Ze(e,i),f=(n.scale.map(a)??0)+u,p=Array.isArray(d)?Zn(d):d,m=le(p)?0:t.scale.map(p)??0;Array.isArray(d)&&d.length>=2&&(c=!0),l.push(Q(Q({},k(o,s,m,f)),{},{name:a,value:d,cx:o,cy:s,radius:m,angle:f,payload:e}))});var d=[];return c&&l.forEach(e=>{if(Array.isArray(e.value)){var n=e.value[0],r=le(n)?0:t.scale.map(n)??0;d.push(Q(Q({},e),{},{radius:r},k(o,s,r,e.angle)))}else d.push(e)}),{points:l,isRange:c,baseLinePoints:d}}function Dr(e){var t=e.showLabels,n=e.points,r=e.children,i=n.map(e=>{var t={x:e.x,y:e.y,width:0,lowerWidth:0,upperWidth:0,height:0};return Q(Q({},t),{},{value:e.value??``,payload:e.payload,parentViewBox:void 0,viewBox:t,fill:void 0})});return H.createElement(te,{value:t?i:void 0},r)}function Or(e){var t=e.points,n=e.baseLinePoints,r=e.props;if(t==null)return null;var i=r.shape,a=r.isRange,o=r.connectNulls,s=H.isValidElement(i)?H.cloneElement(i,Q(Q({},r),{},{points:t})):typeof i==`function`?i(Q(Q({},r),{},{points:t})):H.createElement(Ot,Z({},P(r),{onMouseEnter:e=>{var t=r.onMouseEnter;t&&t(r,e)},onMouseLeave:e=>{var t=r.onMouseLeave;t&&t(r,e)},points:t,baseLinePoints:a?n:void 0,connectNulls:o}));return H.createElement(F,{className:`recharts-radar-polygon`},s,H.createElement(Tr,{props:r,points:t}))}var kr=(e,t)=>e==null?[]:t===1?e.flatMap(e=>e.status===`removed`?[]:[e.next]):e.flatMap(e=>e.status===`removed`?[]:e.status===`matched`?[Q(Q({},e.next),{},{x:ae(e.prev.x,e.next.x,t),y:ae(e.prev.y,e.next.y,t)})]:[Q(Q({},e.next),{},{x:ae(e.next.cx,e.next.x,t),y:ae(e.next.cy,e.next.y,t)})]);function Ar(e){var t=e.props,n=e.previousPointsRef,r=e.previousBaseLinePointsRef,i=t.points,a=t.baseLinePoints,o=t.isAnimationActive,s=t.animationBegin,c=t.animationDuration,l=t.animationEasing,u=t.animationMatchBy,d=t.animationInterpolateFn,f=t.onAnimationStart,m=t.onAnimationEnd,h=Ve(t,r),g=h.startValue,ee=p(g??null,a,u),_=oe(f,m),y=_.isAnimating,b=_.handleAnimationStart,x=_.handleAnimationEnd,S=qe();return S==null?null:H.createElement(Dr,{showLabels:!y,points:i},H.createElement(v,{animationInput:t,animationIdPrefix:`recharts-radar-`,items:i,previousItemsRef:n,isAnimationActive:o,animationBegin:s,animationDuration:c,animationEasing:l,onAnimationStart:b,onAnimationEnd:x,animationInterpolateFn:d,animationMatchBy:u,layout:S},(e,n)=>{var r=n===1?a:d(ee,n,S);return h.syncStepValue(r,n),H.createElement(Or,{points:e,baseLinePoints:r,props:t})}),H.createElement(xe,{label:t.label}),t.children)}function jr(e){var t=(0,H.useRef)(void 0),n=(0,H.useRef)(void 0);return H.createElement(Ar,{props:e,previousPointsRef:t,previousBaseLinePointsRef:n})}var Mr={activeDot:!0,angleAxisId:0,animationBegin:0,animationDuration:1500,animationEasing:`ease`,animationMatchBy:Be,animationInterpolateFn:kr,dot:!1,hide:!1,isAnimationActive:`auto`,label:!1,legendType:`rect`,radiusAxisId:0,zIndex:ee.area};function Nr(e){var t=e.hide,n=e.className,r=e.points;if(t)return null;var i=B(`recharts-radar`,n);return H.createElement(f,{zIndex:e.zIndex},H.createElement(F,{className:i},H.createElement(jr,e)),H.createElement(yt,{points:r,mainColor:Sr(e.stroke,e.fill),itemDataKey:e.dataKey,activeDot:e.activeDot}))}function Pr(e){var t=Ee(),n=R(n=>mr(n,e.radiusAxisId,e.angleAxisId,t,e.id));return n?.points==null?null:H.createElement(Nr,Z({},e,{points:n?.points,baseLinePoints:n?.baseLinePoints,isRange:n?.isRange}))}function Fr(e){var t=N(e,Mr);return H.createElement(x,{id:t.id,type:`radar`},e=>H.createElement(H.Fragment,null,H.createElement(ge,{type:`radar`,id:e,data:void 0,dataKey:t.dataKey,hide:t.hide,angleAxisId:t.angleAxisId,radiusAxisId:t.radiusAxisId}),H.createElement(ie,{legendPayload:Cr(t)}),H.createElement(wr,{dataKey:t.dataKey,stroke:t.stroke,strokeWidth:t.strokeWidth,fill:t.fill,name:t.name,hide:t.hide,tooltipType:t.tooltipType,id:e}),H.createElement(Pr,Z({},t,{id:e}))))}Fr.displayName=`Radar`;function Ir(e){var t=pt();return(0,H.useEffect)(()=>{t(Ue(e))},[t,e]),null}var Lr=[`layout`];function Rr(){return Rr=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},Rr.apply(null,arguments)}function zr(e,t){if(e==null)return{};var n,r,i=Br(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)===-1&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}function Br(e,t){if(e==null)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(t.indexOf(r)!==-1)continue;n[r]=e[r]}return n}function Vr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function Hr(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Vr(Object(n),!0).forEach(function(t){Ur(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Vr(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Ur(e,t,n){return(t=Wr(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Wr(e){var t=Gr(e,`string`);return typeof t==`symbol`?t:t+``}function Gr(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var Kr=Hr({accessibilityLayer:!0,stackOffset:`none`,barCategoryGap:`10%`,barGap:4,margin:{top:5,right:5,bottom:5,left:5},reverseStackOrder:!1,syncMethod:`index`,layout:`radial`,responsive:!1,cx:`50%`,cy:`50%`,innerRadius:0,outerRadius:`80%`},ke),qr=(0,H.forwardRef)(function(e,t){var n=N(e.categoricalChartProps,Kr),r=n.layout,i=zr(n,Lr),a=e.chartName,o={chartName:a,defaultTooltipEventType:e.defaultTooltipEventType,validateTooltipEventTypes:e.validateTooltipEventTypes,tooltipPayloadSearcher:e.tooltipPayloadSearcher,eventEmitter:void 0};return H.createElement(nt,{preloadedState:{options:o},reduxStoreName:n.id??a},H.createElement(dt,{chartData:n.data}),H.createElement(Ye,{layout:r,margin:n.margin}),H.createElement(Le,{throttleDelay:n.throttleDelay,throttledEvents:n.throttledEvents}),H.createElement(Te,{baseValue:void 0,accessibilityLayer:n.accessibilityLayer,barCategoryGap:n.barCategoryGap,maxBarSize:n.maxBarSize,stackOffset:n.stackOffset,barGap:n.barGap,barSize:n.barSize,syncId:n.syncId,syncMethod:n.syncMethod,className:n.className,reverseStackOrder:n.reverseStackOrder}),H.createElement(Ir,{cx:n.cx,cy:n.cy,startAngle:n.startAngle,endAngle:n.endAngle,innerRadius:n.innerRadius,outerRadius:n.outerRadius}),H.createElement(et,Rr({},i,{ref:t})))});function Jr(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function Yr(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?Jr(Object(n),!0).forEach(function(t){Xr(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Jr(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Xr(e,t,n){return(t=Zr(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function Zr(e){var t=Qr(e,`string`);return typeof t==`symbol`?t:t+``}function Qr(e,t){if(typeof e!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(typeof r!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}var $r=[`axis`],ei=Yr(Yr({},Kr),{},{layout:`centric`,startAngle:90,endAngle:-270}),ti=(0,H.forwardRef)((e,t)=>{var n=N(e,ei);return H.createElement(qr,{chartName:`RadarChart`,defaultTooltipEventType:`axis`,validateTooltipEventTypes:$r,tooltipPayloadSearcher:de,categoricalChartProps:n,ref:t})}),$=l();

var React = H;
var jsx = $;
var LayoutWrapper = r;
var LoadingSpinner = u;
var MapPin = e;
var Award = t;
var Calendar = n;
var RadarChart = ti;
var PolarGrid = rn;
var PolarAngleAxis = Jn;
var PolarRadiusAxis = On;
var Radar = Fr;
var ResponsiveContainer = Re;
var BarChart = it;
var Bar = Ne;
var XAxis = je;
var YAxis = ot;
var Tooltip = we;
var CartesianGrid = Ie;
var Cell = Se;
var LabelList = _e;

// Lucide Icons
var LayersIcon = createIcon("layers", [
  ["polygon", { points: "12 2 2 7 12 12 22 7 12 2", key: "1" }],
  ["polyline", { points: "2 17 12 22 22 17", key: "2" }],
  ["polyline", { points: "2 12 12 17 22 12", key: "3" }]
]);
var WheatIcon = createIcon("wheat", [
  ["path", { d: "M2 22 16 8", key: "1" }],
  ["path", { d: "M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z", key: "2" }],
  ["path", { d: "M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z", key: "3" }],
  ["path", { d: "M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z", key: "4" }],
  ["path", { d: "M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z", key: "5" }]
]);
var CarrotIcon = createIcon("carrot", [
  ["path", { d: "M15 16a1 1 0 0 0-7-7q-4 4-5.987 12.385a.5.5 0 0 0 .602.602Q11 20 15 16l-3-3", key: "1" }],
  ["path", { d: "M15 9q4 4 7 0-3-4-7 0 4-4 0-7-4 3 0 7", key: "2" }],
  ["path", { d: "m8 15-2.58-2.58", key: "3" }]
]);
var CoffeeIcon = createIcon("coffee", [
  ["path", { d: "M10 2v2", key: "1" }],
  ["path", { d: "M14 2v2", key: "2" }],
  ["path", { d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1", key: "3" }],
  ["path", { d: "M6 2v2", key: "4" }]
]);
var LandPlotIcon = createIcon("land-plot", [
  ["path", { d: "m12 8 6-3-6-3v10", key: "1" }],
  ["path", { d: "m8 11.99-5.5 3.14a1 1 0 0 0 0 1.74l8.5 4.86a2 2 0 0 0 2 0l8.5-4.86a1 1 0 0 0 0-1.74L16 12", key: "2" }],
  ["path", { d: "m6.49 12.85 11.02 6.3", key: "3" }],
  ["path", { d: "M17.51 12.85 6.5 19.15", key: "4" }]
]);
var CheckCircleIcon = createIcon("check-circle-2", [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1" }],
  ["path", { d: "m9 12 2 2 4-4", key: "2" }]
]);
var SparklesIcon = createIcon("sparkles", [
  ["path", { d: "m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z", key: "1" }]
]);
var SearchIcon = createIcon("search", [
  ["circle", { cx: "11", cy: "11", r: "8", key: "1" }],
  ["path", { d: "m21 21-4.3-4.3", key: "2" }]
]);

// Helper format angka Indonesia
var fmtNum = (v) => new Intl.NumberFormat("id-ID").format(v || 0);
var fmtDec = (v, d = 1) => new Intl.NumberFormat("id-ID", { minimumFractionDigits: d, maximumFractionDigits: d }).format(v || 0);

// Palet warna per sektor
var SECTOR_COLORS = {
  "Tanaman Pangan": "#059669", // emerald
  "Hortikultura": "#ea580c",   // orange
  "Perkebunan": "#0284c7"      // sky
};

// Komponen tooltip Recharts kustom
var CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0];
  const item = p.payload || {};
  return (0, jsx.jsxs)("div", {
    className: "bg-white border border-slate-200 rounded-lg shadow-md px-3.5 py-2.5 text-xs",
    children: [
      (0, jsx.jsx)("p", { className: "font-semibold text-slate-900 mb-1", children: item.komoditas || label }),
      (0, jsx.jsxs)("div", {
        className: "flex items-center gap-2",
        children: [
          (0, jsx.jsx)("span", {
            className: "w-2.5 h-2.5 rounded-sm",
            style: { backgroundColor: p.color || SECTOR_COLORS[item.sektor] || "#1e293b" }
          }),
          (0, jsx.jsxs)("span", {
            className: "font-semibold text-slate-800 tabular-nums",
            children: [fmtNum(p.value), " Ton"]
          })
        ]
      }),
      item.luasHa > 0 && (0, jsx.jsxs)("p", {
        className: "text-slate-600 mt-1",
        children: ["Luas: ", fmtNum(item.luasHa), " Ha"]
      }),
      item.sharePct > 0 && (0, jsx.jsxs)("p", {
        className: "text-slate-600",
        children: ["Pangsa: ", fmtDec(item.sharePct), "% dari sektor"]
      }),
      (0, jsx.jsxs)("p", {
        className: "text-slate-700 font-medium mt-1 pt-1 border-t border-slate-100",
        children: ["Kelas: ", item.labelKelas || "–"]
      })
    ]
  });
};

function KesesuaianLahanPage() {
  const [sektor, setSektor] = React.useState("semua");
  const [kecamatan, setKecamatan] = React.useState("Semua Kecamatan");
  const [tahun, setTahun] = React.useState(2024);
  const [data, setData] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Filter tabel client-side
  const [search, setSearch] = React.useState("");
  const [kelasFilter, setKelasFilter] = React.useState("all");
  const [page, setPage] = React.useState(1);
  const pageSize = 12;

  // Fetch data dari endpoint /api/v1/lahan/kesesuaian
  React.useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const url = `/api/v1/lahan/kesesuaian?sektor=${sektor}&kecamatan=${encodeURIComponent(kecamatan)}&tahun=${tahun}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Gagal memuat data (HTTP ${res.status})`);
        const json = await res.json();
        if (active) {
          setData(json);
          if (json.tahun && json.tahun !== tahun) {
            setTahun(json.tahun);
          }
        }
      } catch (err) {
        if (active) setError(err.message || "Terjadi kesalahan saat memuat data.");
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchData();
    return () => { active = false; };
  }, [sektor, kecamatan, tahun]);

  // Tab konfigurasi
  const tabs = [
    { id: "semua", label: "Semua Sektor", icon: LayersIcon },
    { id: "pangan", label: "Tanaman Pangan", icon: WheatIcon },
    { id: "hortikultura", label: "Hortikultura", icon: CarrotIcon },
    { id: "perkebunan", label: "Perkebunan", icon: CoffeeIcon }
  ];

  // Olah item untuk visualisasi & tabel
  const rawItems = data?.items || [];
  const filteredItems = React.useMemo(() => {
    return rawItems.filter(it => {
      const matchSearch = !search || it.komoditas.toLowerCase().includes(search.toLowerCase()) || (it.subsektor || "").toLowerCase().includes(search.toLowerCase());
      const matchKelas = kelasFilter === "all" || it.kelas === kelasFilter;
      return matchSearch && matchKelas;
    });
  }, [rawItems, search, kelasFilter]);

  // Paginasi tabel
  const totalPages = Math.max(1, Math.ceil(filteredItems.length / pageSize));
  const paginatedItems = filteredItems.slice((page - 1) * pageSize, page * pageSize);

  // Data Radar Chart (top 7 komoditas aktif)
  const radarData = React.useMemo(() => {
    const activeTop = rawItems.filter(it => it.produksi > 0).slice(0, 7);
    if (!activeTop.length) return [];
    const maxVal = Math.max(...activeTop.map(it => it.produksi), 1);
    return activeTop.map(it => ({
      subject: it.komoditas.length > 12 ? it.komoditas.slice(0, 10) + "…" : it.komoditas,
      fullName: it.komoditas,
      nilai: it.produksi,
      skala100: Math.round((it.produksi / maxVal) * 100),
      sektor: it.sektor
    }));
  }, [rawItems]);

  // Data Bar Chart (top 8 komoditas)
  const barData = React.useMemo(() => {
    return rawItems.filter(it => it.produksi > 0).slice(0, 8).map(it => ({
      komoditas: it.komoditas,
      produksi: it.produksi,
      luasHa: it.luasHa,
      sektor: it.sektor,
      kelas: it.kelas,
      labelKelas: it.labelKelas,
      sharePct: it.sharePct,
      color: SECTOR_COLORS[it.sektor] || "#0284c7"
    }));
  }, [rawItems]);

  const kpi = data?.kpi || { totalProduksi: 0, komoditasAktif: 0, totalKomoditas: 0, komoditasPrioritas: 0 };
  const tutupan = data?.tutupanLahan || { sawahHa: 0, bukanSawahHa: 0, sawahPct: 0, bukanSawahPct: 0, tipologi: "–" };

  return (0, jsx.jsx)(LayoutWrapper, {
    children: (0, jsx.jsxs)("div", {
      className: "flex flex-col gap-6",
      children: [
        // 1. Header Halaman
        (0, jsx.jsxs)("header", {
          className: "flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 pb-3 mb-2",
          children: [
            (0, jsx.jsxs)("div", {
              className: "flex-1 min-w-0",
              children: [
                (0, jsx.jsx)("h1", {
                  className: "text-2xl font-bold tracking-tight text-slate-900",
                  children: "Kesesuaian Lahan Pertanian"
                }),
                (0, jsx.jsx)("p", {
                  className: "text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed",
                  children: "Evaluasi kecocokan lahan komprehensif berdasarkan volume produksi riil, luas panen, dan agroklimat per kecamatan di Kabupaten Banjarnegara (mencakup Tanaman Pangan, Hortikultura, dan Perkebunan Rakyat)."
                })
              ]
            }),
            (0, jsx.jsx)("img", {
              src: "/img/domain/suitability.png",
              alt: "Kesesuaian Lahan",
              className: "h-14 sm:h-16 w-auto object-contain shrink-0 select-none",
              style: { maxHeight: "60px" }
            })
          ]
        }),

        // 2. Tab Navigasi Sektor
        (0, jsx.jsx)("section", {
          className: "flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none",
          children: tabs.map(t => {
            const isActive = sektor === t.id;
            const IconComponent = t.icon;
            return (0, jsx.jsxs)("button", {
              type: "button",
              key: t.id,
              onClick: () => { setSektor(t.id); setPage(1); },
              className: `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                isActive
                  ? "bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800"
                  : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`,
              children: [
                (0, jsx.jsx)(IconComponent, { className: `w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}` }),
                (0, jsx.jsx)("span", { children: t.label })
              ]
            });
          })
        }),

        // 3. Bar Kontrol Filter & Konteks Tutupan Lahan
        (0, jsx.jsxs)("section", {
          className: "bg-white border border-slate-200 rounded-lg p-4 shadow-sm",
          children: [
            (0, jsx.jsxs)("div", {
              className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center",
              children: [
                // Dropdown Kecamatan
                (0, jsx.jsxs)("div", {
                  children: [
                    (0, jsx.jsx)("label", {
                      htmlFor: "st-kec",
                      className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5",
                      children: "Wilayah Kecamatan"
                    }),
                    (0, jsx.jsxs)("div", {
                      className: "relative",
                      children: [
                        (0, jsx.jsx)(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" }),
                        (0, jsx.jsxs)("select", {
                          id: "st-kec",
                          value: kecamatan,
                          onChange: (e) => { setKecamatan(e.target.value); setPage(1); },
                          className: "w-full pl-9 pr-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 appearance-none cursor-pointer",
                          children: [
                            (0, jsx.jsx)("option", { value: "Semua Kecamatan", children: "Semua Kecamatan (Agregat Kabupaten)" }),
                            (data?.kecamatanList || []).map(k => (0, jsx.jsx)("option", { value: k, children: `Kecamatan ${k}` }, k))
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Dropdown Tahun
                (0, jsx.jsxs)("div", {
                  children: [
                    (0, jsx.jsx)("label", {
                      htmlFor: "st-year",
                      className: "block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5",
                      children: "Tahun Basis Evaluasi"
                    }),
                    (0, jsx.jsxs)("div", {
                      className: "relative",
                      children: [
                        (0, jsx.jsx)(Calendar, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" }),
                        (0, jsx.jsx)("select", {
                          id: "st-year",
                          value: tahun,
                          onChange: (e) => { setTahun(Number(e.target.value)); setPage(1); },
                          className: "w-full pl-9 pr-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-emerald-600 appearance-none cursor-pointer",
                          children: (data?.tahunList || [2024, 2023, 2022, 2021, 2020, 2019, 2018]).map(y => (
                            (0, jsx.jsx)("option", { value: y, children: `Tahun ${y}` }, y)
                          ))
                        })
                      ]
                    })
                  ]
                }),

                // Panel Info Tutupan Lahan Wilayah
                (0, jsx.jsxs)("div", {
                  className: "bg-slate-50 border border-slate-200/80 rounded-lg p-2.5 text-xs text-slate-700 flex flex-col justify-center",
                  children: [
                    (0, jsx.jsxs)("div", {
                      className: "flex items-center justify-between font-semibold text-slate-900 mb-1",
                      children: [
                        (0, jsx.jsxs)("span", {
                          className: "inline-flex items-center gap-1.5",
                          children: [
                            (0, jsx.jsx)(LandPlotIcon, { className: "w-3.5 h-3.5 text-emerald-600" }),
                            "Profil Tutupan Lahan"
                          ]
                        }),
                        (0, jsx.jsxs)("span", { className: "text-[11px] text-slate-500", children: [fmtNum(tutupan.sawahHa + tutupan.bukanSawahHa), " Ha"] })
                      ]
                    }),
                    (0, jsx.jsxs)("div", {
                      className: "flex items-center gap-3 text-[11px] text-slate-600",
                      children: [
                        (0, jsx.jsxs)("span", { children: ["Sawah: ", (0, jsx.jsx)("strong", { className: "text-slate-800", children: fmtDec(tutupan.sawahPct) }), "%"] }),
                        (0, jsx.jsx)("span", { className: "text-slate-300", children: "•" }),
                        (0, jsx.jsxs)("span", { children: ["Tegal/Bukan Sawah: ", (0, jsx.jsx)("strong", { className: "text-slate-800", children: fmtDec(tutupan.bukanSawahPct) }), "%"] })
                      ]
                    }),
                    (0, jsx.jsx)("p", {
                      className: "text-[10px] text-slate-500 mt-1 truncate",
                      title: tutupan.tipologi,
                      children: tutupan.tipologi
                    })
                  ]
                })
              ]
            })
          ]
        }),

        // 4. Loading & Error States
        loading && (0, jsx.jsx)(LoadingSpinner, { label: "Menghitung kesesuaian lahan multi-sektor…" }),
        error && (0, jsx.jsxs)("div", {
          className: "bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-lg text-sm",
          children: ["Terjadi kesalahan: ", error]
        }),

        // 5. Konten Utama
        !loading && !error && (0, jsx.jsxs)(jsx.Fragment, {
          children: [
            // KPI Metrics Row (4 Cards)
            (0, jsx.jsxs)("section", {
              className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4",
              children: [
                // KPI 1: Total Produksi
                (0, jsx.jsxs)("div", {
                  className: "bg-white border border-slate-200 border-l-4 border-l-emerald-600 rounded-lg p-5 shadow-sm",
                  children: [
                    (0, jsx.jsx)("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Total Hasil Panen" }),
                    (0, jsx.jsxs)("p", {
                      className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums",
                      children: [fmtNum(kpi.totalProduksi), " ", (0, jsx.jsx)("span", { className: "text-sm font-normal text-slate-500", children: "Ton" })]
                    }),
                    (0, jsx.jsxs)("p", {
                      className: "text-xs text-slate-600 mt-1.5",
                      children: ["Sektor ", sektor === "semua" ? "terpadu" : sektor, " · Tahun ", tahun]
                    })
                  ]
                }),

                // KPI 2: Komoditas Terunggul
                (0, jsx.jsxs)("div", {
                  className: "bg-white border border-slate-200 border-l-4 border-l-blue-600 rounded-lg p-5 shadow-sm",
                  children: [
                    (0, jsx.jsx)("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Komoditas Basis Utama" }),
                    (0, jsx.jsx)("p", {
                      className: "text-xl font-bold text-slate-900 mt-2 truncate",
                      children: kpi.topKomoditas?.nama || "–"
                    }),
                    (0, jsx.jsx)("p", {
                      className: "text-xs text-slate-600 mt-1.5 tabular-nums",
                      children: kpi.topKomoditas ? `${fmtNum(kpi.topKomoditas.produksi)} Ton (${fmtDec(kpi.topKomoditas.share)}% pangsa)` : "Belum terdata"
                    })
                  ]
                }),

                // KPI 3: Komoditas Aktif
                (0, jsx.jsxs)("div", {
                  className: "bg-white border border-slate-200 border-l-4 border-l-amber-600 rounded-lg p-5 shadow-sm",
                  children: [
                    (0, jsx.jsx)("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Komoditas Aktif Panen" }),
                    (0, jsx.jsxs)("p", {
                      className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums",
                      children: [kpi.komoditasAktif, " ", (0, jsx.jsx)("span", { className: "text-sm font-normal text-slate-500", children: `/ ${kpi.totalKomoditas}` })]
                    }),
                    (0, jsx.jsx)("p", {
                      className: "text-xs text-slate-600 mt-1.5",
                      children: "komoditas memiliki catatan produksi"
                    })
                  ]
                }),

                // KPI 4: Potensi Kesesuaian Tinggi (S1/S2)
                (0, jsx.jsxs)("div", {
                  className: "bg-white border border-slate-200 border-l-4 border-l-teal-600 rounded-lg p-5 shadow-sm",
                  children: [
                    (0, jsx.jsx)("p", { className: "text-xs font-semibold uppercase tracking-wider text-slate-500", children: "Kesesuaian Tinggi (S1/S2)" }),
                    (0, jsx.jsxs)("p", {
                      className: "text-2xl font-bold text-slate-900 mt-2 tabular-nums text-teal-700",
                      children: [kpi.komoditasPrioritas, " ", (0, jsx.jsx)("span", { className: "text-sm font-normal text-slate-500", children: "komoditas" })]
                    }),
                    (0, jsx.jsx)("p", {
                      className: "text-xs text-slate-600 mt-1.5",
                      children: "prioritas sentra & intensifikasi budidaya"
                    })
                  ]
                })
              ]
            }),

            // 6. Visualisasi Grafis (Radar + Bar Chart)
            (0, jsx.jsxs)("section", {
              className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
              children: [
                // Kolom Kiri: Radar Karakteristik Sebaran
                (0, jsx.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-lg p-4 shadow-sm flex flex-col",
                  children: [
                    (0, jsx.jsxs)("div", {
                      className: "border-b border-slate-100 pb-3 mb-2",
                      children: [
                        (0, jsx.jsx)("h2", { className: "text-sm font-bold text-slate-900", children: "Radar Karakteristik Komoditas" }),
                        (0, jsx.jsxs)("p", { className: "text-xs text-slate-500 mt-0.5", children: ["Sebaran 7 komoditas teratas · ", kecamatan] })
                      ]
                    }),
                    (0, jsx.jsx)("div", {
                      className: "h-[300px] w-full flex items-center justify-center",
                      children: radarData.length > 2 ? (0, jsx.jsx)(ResponsiveContainer, {
                        width: "100%",
                        height: "100%",
                        children: (0, jsx.jsxs)(RadarChart, {
                          cx: "50%",
                          cy: "50%",
                          outerRadius: "68%",
                          data: radarData,
                          children: [
                            (0, jsx.jsx)(PolarGrid, { stroke: "#cbd5e1", strokeOpacity: 0.6 }),
                            (0, jsx.jsx)(PolarAngleAxis, { dataKey: "subject", tick: { fill: "#1e293b", fontSize: 10, fontWeight: 500 } }),
                            (0, jsx.jsx)(PolarRadiusAxis, { angle: 30, domain: [0, 100], tick: { fill: "#64748b", fontSize: 8 } }),
                            (0, jsx.jsx)(Radar, { name: "Indeks Kapasitas", dataKey: "skala100", stroke: "#059669", fill: "#059669", fillOpacity: 0.2, strokeWidth: 2 })
                          ]
                        })
                      }) : (0, jsx.jsx)("p", { className: "text-xs text-slate-500", children: "Data tidak mencukupi untuk render radar sebaran." })
                    }),
                    (0, jsx.jsxs)("p", {
                      className: "text-[11px] text-slate-500 border-t border-slate-100 pt-2 mt-auto text-center",
                      children: ["Skala dinormalisasi 0–100 terhadap komoditas terunggul (", kpi.topKomoditas?.nama || "–", ")"]
                    })
                  ]
                }),

                // Kolom Kanan: Bar Chart Komparasi Volume
                (0, jsx.jsxs)("div", {
                  className: "bg-white border border-slate-200 rounded-lg p-4 shadow-sm lg:col-span-2 flex flex-col",
                  children: [
                    (0, jsx.jsxs)("div", {
                      className: "border-b border-slate-100 pb-3 mb-2 flex items-center justify-between",
                      children: [
                        (0, jsx.jsxs)("div", {
                          children: [
                            (0, jsx.jsx)("h2", { className: "text-sm font-bold text-slate-900", children: "Peringkat Hasil Produksi Komoditas (Ton)" }),
                            (0, jsx.jsxs)("p", { className: "text-xs text-slate-500 mt-0.5", children: ["Hasil panen aktual tahun ", tahun, " · ", kecamatan] })
                          ]
                        }),
                        (0, jsx.jsxs)("div", {
                          className: "hidden sm:flex items-center gap-3 text-[11px]",
                          children: [
                            (0, jsx.jsxs)("span", { className: "flex items-center gap-1.5", children: [(0, jsx.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm bg-emerald-600" }), "Pangan"] }),
                            (0, jsx.jsxs)("span", { className: "flex items-center gap-1.5", children: [(0, jsx.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm bg-orange-600" }), "Hortikultura"] }),
                            (0, jsx.jsxs)("span", { className: "flex items-center gap-1.5", children: [(0, jsx.jsx)("span", { className: "w-2.5 h-2.5 rounded-sm bg-sky-600" }), "Perkebunan"] })
                          ]
                        })
                      ]
                    }),
                    (0, jsx.jsx)("div", {
                      className: "h-[300px] w-full",
                      children: barData.length > 0 ? (0, jsx.jsx)(ResponsiveContainer, {
                        width: "100%",
                        height: "100%",
                        children: (0, jsx.jsxs)(BarChart, {
                          data: barData,
                          margin: { top: 15, right: 10, left: 0, bottom: 40 },
                          children: [
                            (0, jsx.jsx)(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", vertical: false }),
                            (0, jsx.jsx)(XAxis, { dataKey: "komoditas", angle: -25, textAnchor: "end", interval: 0, height: 45, tick: { fill: "#334155", fontSize: 11 } }),
                            (0, jsx.jsx)(YAxis, { width: 55, tick: { fill: "#64748b", fontSize: 10 }, tickFormatter: (v) => fmtNum(v) }),
                            (0, jsx.jsx)(Tooltip, { content: (0, jsx.jsx)(CustomTooltip, {}) }),
                            (0, jsx.jsx)(Bar, {
                              dataKey: "produksi",
                              radius: [4, 4, 0, 0],
                              children: barData.map((entry, idx) => (
                                (0, jsx.jsx)(Cell, { fill: entry.color }, `cell-${idx}`)
                              ))
                            })
                          ]
                        })
                      }) : (0, jsx.jsx)("p", { className: "text-xs text-slate-500 py-16 text-center", children: "Belum ada data produksi yang tercatat pada kombinasi ini." })
                    })
                  ]
                })
              ]
            }),

            // 7. Tabel Matriks Kesesuaian Komoditas
            (0, jsx.jsxs)("section", {
              className: "bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden",
              children: [
                // Header Tabel & Filter Bar
                (0, jsx.jsxs)("div", {
                  className: "p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3",
                  children: [
                    (0, jsx.jsxs)("div", {
                      children: [
                        (0, jsx.jsx)("h2", { className: "text-base font-bold text-slate-900", children: "Matriks Evaluasi Kesesuaian Lahan Komoditas" }),
                        (0, jsx.jsxs)("p", { className: "text-xs text-slate-500 mt-0.5", children: ["Klasifikasi kecocokan agraria berdasarkan kinerja panen aktual di ", kecamatan, " (Tahun ", tahun, ")"] })
                      ]
                    }),
                    (0, jsx.jsxs)("div", {
                      className: "flex items-center gap-2.5",
                      children: [
                        // Pencarian Komoditas
                        (0, jsx.jsxs)("div", {
                          className: "relative",
                          children: [
                            (0, jsx.jsx)(SearchIcon, { className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" }),
                            (0, jsx.jsx)("input", {
                              type: "text",
                              value: search,
                              onChange: (e) => { setSearch(e.target.value); setPage(1); },
                              placeholder: "Cari komoditas…",
                              className: "pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 w-44"
                            })
                          ]
                        }),
                        // Filter Kelas
                        (0, jsx.jsxs)("select", {
                          value: kelasFilter,
                          onChange: (e) => { setKelasFilter(e.target.value); setPage(1); },
                          className: "py-1.5 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 text-slate-700 bg-white cursor-pointer",
                          children: [
                            (0, jsx.jsx)("option", { value: "all", children: "Semua Kelas" }),
                            (0, jsx.jsx)("option", { value: "S1", children: "Kelas S1 (Sangat Sesuai)" }),
                            (0, jsx.jsx)("option", { value: "S2", children: "Kelas S2 (Cukup Sesuai)" }),
                            (0, jsx.jsx)("option", { value: "S3", children: "Kelas S3 (Marjinal)" }),
                            (0, jsx.jsx)("option", { value: "N", children: "Kelas N (Tidak Diusahakan)" })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Isi Tabel
                (0, jsx.jsx)("div", {
                  className: "overflow-x-auto",
                  children: (0, jsx.jsxs)("table", {
                    className: "w-full text-xs text-left",
                    children: [
                      (0, jsx.jsx)("thead", {
                        className: "bg-slate-50 text-slate-700 font-semibold uppercase tracking-wider border-b border-slate-200",
                        children: (0, jsx.jsxs)("tr", {
                          children: [
                            (0, jsx.jsx)("th", { className: "px-4 py-3", children: "Komoditas" }),
                            (0, jsx.jsx)("th", { className: "px-3 py-3", children: "Sektor / Kelompok" }),
                            (0, jsx.jsx)("th", { className: "px-3 py-3 text-right", children: "Produksi (Ton)" }),
                            (0, jsx.jsx)("th", { className: "px-3 py-3 text-right", children: "Luas (Ha)" }),
                            (0, jsx.jsx)("th", { className: "px-3 py-3 text-center whitespace-nowrap", children: "Δ vs Thn Lalu" }),
                            (0, jsx.jsx)("th", { className: "px-3 py-3 text-right", children: "Pangsa Sektor" }),
                            (0, jsx.jsx)("th", { className: "px-3 py-3", children: "Kesesuaian" }),
                            (0, jsx.jsx)("th", { className: "px-4 py-3", children: "Rekomendasi Agronomi & Budidaya" })
                          ]
                        })
                      }),
                      (0, jsx.jsx)("tbody", {
                        className: "divide-y divide-slate-100",
                        children: paginatedItems.length > 0 ? paginatedItems.map((it) => {
                          return (0, jsx.jsxs)("tr", {
                            key: it.komoditas,
                            className: "hover:bg-slate-50 transition-colors",
                            children: [
                              // Komoditas
                              (0, jsx.jsxs)("td", {
                                className: "px-4 py-3 font-semibold text-slate-900 whitespace-nowrap",
                                children: [
                                  (0, jsx.jsx)("span", {
                                    className: "w-2 h-2 rounded-full inline-block mr-2 align-middle",
                                    style: { backgroundColor: SECTOR_COLORS[it.sektor] || "#64748b" }
                                  }),
                                  it.komoditas
                                ]
                              }),
                              // Sektor / Subsektor
                              (0, jsx.jsxs)("td", {
                                className: "px-3 py-3 text-slate-600 whitespace-nowrap",
                                children: [it.sektor, (0, jsx.jsx)("span", { className: "text-slate-400 block text-[10px]", children: it.subsektor })]
                              }),
                              // Produksi (Ton)
                              (0, jsx.jsx)("td", {
                                className: "px-3 py-3 text-right font-medium text-slate-900 tabular-nums whitespace-nowrap",
                                children: it.produksi > 0 ? fmtNum(it.produksi) : "–"
                              }),
                              // Luas Panen (Ha)
                              (0, jsx.jsx)("td", {
                                className: "px-3 py-3 text-right text-slate-600 tabular-nums whitespace-nowrap",
                                children: it.luasHa > 0 ? fmtNum(it.luasHa) : "–"
                              }),
                              // Perubahan vs Thn Lalu
                              (0, jsx.jsx)("td", {
                                className: "px-3 py-3 text-center tabular-nums whitespace-nowrap",
                                children: it.deltaPct !== null ? (0, jsx.jsxs)("span", {
                                  className: it.deltaTon > 0 ? "text-emerald-700 font-medium" : it.deltaTon < 0 ? "text-rose-700 font-medium" : "text-slate-500",
                                  children: [
                                    it.deltaTon > 0 ? "+" : "",
                                    fmtDec(it.deltaPct), "%",
                                    (0, jsx.jsxs)("span", { className: "text-slate-400 text-[10px] block", children: [it.deltaTon > 0 ? "+" : "", fmtNum(it.deltaTon), " T"] })
                                  ]
                                }) : (0, jsx.jsx)("span", { className: "text-slate-400", children: "–" })
                              }),
                              // Pangsa Sektor
                              (0, jsx.jsx)("td", {
                                className: "px-3 py-3 text-right text-slate-700 tabular-nums whitespace-nowrap",
                                children: it.sharePct > 0 ? `${fmtDec(it.sharePct)}%` : "–"
                              }),
                              // Kelas Kesesuaian
                              (0, jsx.jsx)("td", {
                                className: "px-3 py-3 whitespace-nowrap",
                                children: (0, jsx.jsxs)("span", {
                                  className: `inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${it.badgeColor}`,
                                  children: [
                                    (0, jsx.jsx)("span", { className: `w-1.5 h-1.5 rounded-full ${it.dotColor}` }),
                                    it.labelKelas
                                  ]
                                })
                              }),
                              // Rekomendasi Agronomi
                              (0, jsx.jsx)("td", {
                                className: "px-4 py-3 text-slate-600 text-[11px] leading-relaxed min-w-[260px]",
                                children: it.rekomendasi
                              })
                            ]
                          });
                        }) : (0, jsx.jsx)("tr", {
                          children: (0, jsx.jsx)("td", {
                            colSpan: 8,
                            className: "px-4 py-8 text-center text-slate-500",
                            children: "Tidak ada komoditas yang memenuhi kriteria pencarian/filter."
                          })
                        })
                      })
                    ]
                  })
                }),

                // Footer Paginasi
                totalPages > 1 && (0, jsx.jsxs)("div", {
                  className: "p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-600",
                  children: [
                    (0, jsx.jsxs)("span", {
                      children: [
                        "Menampilkan ",
                        (0, jsx.jsx)("strong", { children: (page - 1) * pageSize + 1 }),
                        "–",
                        (0, jsx.jsx)("strong", { children: Math.min(page * pageSize, filteredItems.length) }),
                        " dari ",
                        (0, jsx.jsx)("strong", { children: filteredItems.length }),
                        " komoditas"
                      ]
                    }),
                    (0, jsx.jsxs)("div", {
                      className: "flex items-center gap-1",
                      children: [
                        (0, jsx.jsx)("button", {
                          type: "button",
                          disabled: page === 1,
                          onClick: () => setPage(p => Math.max(1, p - 1)),
                          className: "px-2.5 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed",
                          children: "Sebelumnya"
                        }),
                        (0, jsx.jsxs)("span", { className: "px-2", children: [page, " / ", totalPages] }),
                        (0, jsx.jsx)("button", {
                          type: "button",
                          disabled: page === totalPages,
                          onClick: () => setPage(p => Math.min(totalPages, p + 1)),
                          className: "px-2.5 py-1 border border-slate-200 rounded bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed",
                          children: "Berikutnya"
                        })
                      ]
                    })
                  ]
                })
              ]
            }),

            // 8. Catatan Metodologi & Sumber Data (Pragmatic & Fact-Based)
            (0, jsx.jsxs)("section", {
              className: "bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 space-y-2",
              children: [
                (0, jsx.jsx)("p", {
                  className: "font-semibold text-slate-800",
                  children: "Kriteria Klasifikasi Kesesuaian Lahan & Sumber Data:"
                }),
                (0, jsx.jsxs)("ul", {
                  className: "list-disc pl-5 space-y-1 text-slate-600",
                  children: [
                    (0, jsx.jsxs)("li", {
                      children: [
                        (0, jsx.jsx)("strong", { className: "text-emerald-800", children: "S1 (Sangat Sesuai):" }),
                        " Komoditas basis wilayah dengan pangsa ≥ 15% dari total sektor di kecamatan tersebut, atau volume produksi ≥ 5.000 Ton di tingkat kabupaten."
                      ]
                    }),
                    (0, jsx.jsxs)("li", {
                      children: [
                        (0, jsx.jsx)("strong", { className: "text-blue-800", children: "S2 (Cukup Sesuai):" }),
                        " Komoditas adaptif dengan catatan panen teratur (pangsa 3%–15% atau volume ≥ 250 Ton); berpotensi ditingkatkan melalui intensifikasi."
                      ]
                    }),
                    (0, jsx.jsxs)("li", {
                      children: [
                        (0, jsx.jsx)("strong", { className: "text-amber-800", children: "S3 (Kesesuaian Marjinal):" }),
                        " Komoditas diusahakan dalam skala kecil atau pekarangan (pangsa < 3%); memerlukan dukungan teknologi atau modifikasi agroklimat mikro."
                      ]
                    }),
                    (0, jsx.jsxs)("li", {
                      children: [
                        (0, jsx.jsx)("strong", { className: "text-slate-700", children: "N (Tidak Diusahakan):" }),
                        " Tidak ada catatan produksi pada periode evaluasi terpilih."
                      ]
                    }),
                    (0, jsx.jsxs)("li", {
                      children: [
                        "Sumber data resmi: Dinas Pertanian, Perikanan dan Ketahanan Pangan Kabupaten Banjarnegara serta BPS Kabupaten Banjarnegara (tabel padi_produksi, palawija_produksi, horti_produksi, perkebunan_produksi, dan lahan_desa pada basis data MariaDB pertasis)."
                      ]
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]
    })
  });
}
export { KesesuaianLahanPage as default };
