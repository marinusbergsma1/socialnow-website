import { jsx as base, jsxs as bases, Fragment } from "react/jsx-runtime";
import { Link, NavLink } from "react-router-dom";
import { LocalizedElement } from "./context";
export { Fragment };
export type { JSX } from "react/jsx-runtime";
export function jsx(type:any,props:any,key?:any) { return (typeof type === "string" || type === Fragment || type === Link || type === NavLink) ? base(LocalizedElement,{...props,element:type},key) : base(type,props,key); }
export function jsxs(type:any,props:any,key?:any) { return (typeof type === "string" || type === Fragment || type === Link || type === NavLink) ? bases(LocalizedElement,{...props,element:type},key) : bases(type,props,key); }
