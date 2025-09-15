import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Je laisse tomber cette feature (ident/authent) pour l'instant 

// const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// export async function middleware(req: NextRequest) {
//   if (req.nextUrl.pathname.startsWith("/login")) {
//     return NextResponse.next();
//   }

//   const token = req.cookies.get("auth_token")?.value;
//   if (!token) {
//     const url = new URL("/login", req.url);
//     url.searchParams.set("next", req.nextUrl.pathname);
//     return NextResponse.redirect(url);
//   }

//   try {
//     const { payload } = await jwtVerify(token, secret);
//     console.log("✅ payload vérifié :", payload);
//     return NextResponse.next();
//   } catch (err) {
//     console.error("❌ JWT invalide :", err);
//     const url = new URL("/login", req.url);
//     url.searchParams.set("next", req.nextUrl.pathname);
//     return NextResponse.redirect(url);
//   }
// }

// export const config = {
//   matcher: ["/((?!login).*)"], // toutes les routes sauf /login
// };
