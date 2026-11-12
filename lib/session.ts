import {SignJWT,jwtVerify} from "jose";
import type {UserRole} from "@/models/User";
const secret=process.env.AUTH_SECRET;
if(!secret||secret.length<32)throw new Error("AUTH_SECRET must be at least 32 characters");
const key=new TextEncoder().encode(secret);
export const SESSION_COOKIE="cosmocareer_session";
export type Session={userId:string;role:UserRole;email:string};
export async function createSession(data:Session){return new SignJWT(data).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(key)}
export async function readSession(token:string):Promise<Session|null>{try{const {payload}=await jwtVerify(token,key);if(typeof payload.userId!=="string"||typeof payload.email!=="string"||!["student","teacher","employee","counsellor","admin"].includes(String(payload.role)))return null;return payload as unknown as Session}catch{return null}}
