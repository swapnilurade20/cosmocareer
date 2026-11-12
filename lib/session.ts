import {SignJWT,jwtVerify} from "jose";
import type {UserRole} from "@/models/User";
export const SESSION_COOKIE="cosmocareer_session";
export type Session={userId:string;role:UserRole;email:string};
function getKey(){const secret=process.env.AUTH_SECRET;if(!secret||secret.length<32)throw new Error("AUTH_SECRET must be at least 32 characters");return new TextEncoder().encode(secret)}
export async function createSession(data:Session){return new SignJWT(data).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(getKey())}
export async function readSession(token:string):Promise<Session|null>{try{const {payload}=await jwtVerify(token,getKey());if(typeof payload.userId!=="string"||typeof payload.email!=="string"||!["student","teacher","employee","counsellor","admin"].includes(String(payload.role)))return null;return payload as unknown as Session}catch{return null}}
