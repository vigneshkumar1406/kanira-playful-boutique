import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requiredEnv } from "./env";
const Credentials=z.object({email:z.string().email(),password:z.string().min(8).max(128)});
async function authRequest(path:string,body:unknown){const base=requiredEnv("VITE_SUPABASE_URL").replace(/\/$/,"");const key=requiredEnv("VITE_SUPABASE_ANON_KEY");const response=await fetch(`${base}/auth/v1/${path}`,{method:"POST",headers:{apikey:key,"Content-Type":"application/json"},body:JSON.stringify(body)});const result=await response.json() as {access_token?:string;refresh_token?:string;user?:{id:string;email?:string};msg?:string;message?:string};if(!response.ok)throw new Error(result.msg??result.message??"Authentication failed");return result;}
export const signInWithEmail=createServerFn({method:"POST"}).validator(Credentials).handler(({data})=>authRequest("token?grant_type=password",data));
export const signUpWithEmail=createServerFn({method:"POST"}).validator(Credentials.extend({fullName:z.string().trim().min(1).max(100)})).handler(({data})=>authRequest("signup",{email:data.email,password:data.password,data:{full_name:data.fullName}}));
