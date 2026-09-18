import { NextRequest, NextResponse } from "next/server";

type SessionClaims = {
  exp?: unknown;
  role?: unknown;
  sub?: unknown;
  userId?: unknown;
};

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const decoded = atob(padded);

  return Uint8Array.from(decoded, (character) => character.charCodeAt(0));
}

async function hasEmployeeSession(request: NextRequest) {
  const secret = process.env.SESSION_SECRET;
  const session = request.cookies.get("session")?.value;

  if (!secret || !session) {
    return false;
  }

  try {
    const [encodedHeader, encodedPayload, encodedSignature, extraSegment] =
      session.split(".");

    if (!encodedHeader || !encodedPayload || !encodedSignature || extraSegment) {
      return false;
    }

    const header = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedHeader)),
    ) as { alg?: unknown };
    const claims = JSON.parse(
      new TextDecoder().decode(decodeBase64Url(encodedPayload)),
    ) as SessionClaims;

    if (header.alg !== "HS256") {
      return false;
    }

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"],
    );
    const isValidSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      decodeBase64Url(encodedSignature),
      new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
    );
    const hasUserId =
      (typeof claims.sub === "string" && claims.sub.length > 0) ||
      (typeof claims.userId === "string" && claims.userId.length > 0);
    const isUnexpired =
      typeof claims.exp === "number" && claims.exp > Date.now() / 1000;

    return isValidSignature && hasUserId && isUnexpired && claims.role === "EMPLOYEE";
  } catch {
    return false;
  }
}

export default async function proxy(request: NextRequest) {
  if (!(await hasEmployeeSession(request))) {
    return NextResponse.redirect(new URL("/login/employee", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/employee/:path*"],
};
