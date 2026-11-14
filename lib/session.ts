import {SignJWT,jwtVerify} from "jose";import type {UserRole} from "@/models/User";
export const SESSION_COOKIE="cosmocareer_session";export type Session={userId:string;role:UserRole;email:string};
function getKey(){const secret=process.env.AUTH_SECRET;if(!secret||secret.length<32)throw new Error("AUTH_SECRET must be at least 32 characters");return new TextEncoder().encode(secret)}
export async function createSession(data:Session){return new SignJWT(data).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(getKey())}
export async function readSession(token:string):Promise<Session|null>{try{const {payload}=await jwtVerify(token,getKey());if(typeof payload.userId!=="string"||typeof payload.email!=="string"||!["student","teacher","employee","counsellor","employer","admin"].includes(String(payload.role)))return null;return payload as unknown as Session}catch{return null}}
import {createClient,type SupabaseClient} from "@supabase/supabase-js";
let supabaseAdmin:SupabaseClient|null=null;
let supabasePublic:SupabaseClient|null=null;
function supabaseConfig(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;const service=process.env.SUPABASE_SERVICE_ROLE_KEY;if(!url||!anon||!service)throw new Error("Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in Hostinger.");return {url,anon,service}}
export function getSupabaseAdmin(){if(!supabaseAdmin){const c=supabaseConfig();supabaseAdmin=createClient(c.url,c.service,{auth:{autoRefreshToken:false,persistSession:false}})}return supabaseAdmin}
export function getSupabasePublic(){if(!supabasePublic){const c=supabaseConfig();supabasePublic=createClient(c.url,c.anon,{auth:{autoRefreshToken:false,persistSession:false}})}return supabasePublic}
export async function createSupabaseIdentity(email:string,password:string,name:string){const {data,error}=await getSupabaseAdmin().auth.admin.createUser({email,password,email_confirm:true,user_metadata:{full_name:name}});if(error)throw new Error(error.message);return data.user.id}
export async function authenticateSupabase(email:string,password:string){const {data,error}=await getSupabasePublic().auth.signInWithPassword({email,password});if(error||!data.user)throw new Error("Email or password is incorrect.");return data.user}
