import {createClient,type SupabaseClient} from "@supabase/supabase-js";

let adminClient:SupabaseClient|null=null;
let publicClient:SupabaseClient|null=null;

function config(){
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.SUPABASE_URL;
  const anonKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY||process.env.SUPABASE_ANON_KEY;
  const serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!anonKey||!serviceKey)throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY in Hostinger.");
  return {url,anonKey,serviceKey};
}

export function getSupabasePublic(){
  if(publicClient)return publicClient;
  const {url,anonKey}=config();
  publicClient=createClient(url,anonKey,{auth:{autoRefreshToken:false,persistSession:false,detectSessionInUrl:false}});
  return publicClient;
}

export function getSupabaseAdmin(){
  if(adminClient)return adminClient;
  const {url,serviceKey}=config();
  adminClient=createClient(url,serviceKey,{auth:{autoRefreshToken:false,persistSession:false,detectSessionInUrl:false}});
  return adminClient;
}

export async function createSupabaseIdentity(email:string,password:string,name:string){
  const {data,error}=await getSupabaseAdmin().auth.admin.createUser({
    email,
    password,
    email_confirm:true,
    user_metadata:{name}
  });
  if(error)throw error;
  if(!data.user)throw new Error("Supabase did not return a user.");
  return data.user;
}

export async function findSupabaseUserByEmail(email:string){
  const admin=getSupabaseAdmin();
  for(let page=1;page<=20;page++){
    const {data,error}=await admin.auth.admin.listUsers({page,perPage:1000});
    if(error)throw error;
    const found=data.users.find(u=>u.email?.toLowerCase()===email.toLowerCase());
    if(found)return found;
    if(data.users.length<1000)return null;
  }
  throw new Error("Supabase user lookup exceeded the safety limit.");
}

export async function ensureSupabaseUser(email:string,password:string,metadata:Record<string,string>={}){
  const admin=getSupabaseAdmin();
  let user=await findSupabaseUserByEmail(email);
  if(user){
    const {data,error}=await admin.auth.admin.updateUserById(user.id,{password,user_metadata:{...user.user_metadata,...metadata}});
    if(error)throw error;
    user=data.user;
  }else{
    const {data,error}=await admin.auth.admin.createUser({email,password,email_confirm:true,user_metadata:metadata});
    if(error)throw error;
    user=data.user;
  }
  if(!user)throw new Error("Supabase did not return a user.");
  return user;
}
