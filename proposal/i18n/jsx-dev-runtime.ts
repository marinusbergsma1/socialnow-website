import { jsxDEV as base, Fragment } from "react/jsx-dev-runtime";
import { Link, NavLink } from "react-router-dom";
import { LocalizedElement } from "./context";
export { Fragment };
export type { JSX } from "react/jsx-dev-runtime";
export function jsxDEV(type:any,props:any,key:any,isStatic:boolean,source:any,self:any) { return (typeof type === "string" || type === Fragment || type === Link || type === NavLink) ? base(LocalizedElement,{...props,element:type},key,isStatic,source,self) : base(type,props,key,isStatic,source,self); }
