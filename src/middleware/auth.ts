import { NextRequest, NextResponse } from "next/server";

export function withAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    try {
      // Get session from cookie
      const session = request.cookies.get("session")?.value;

      if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
      }

      // Parse and validate session (in production, use proper JWT or session store)
      let sessionData;
      try {
        sessionData = JSON.parse(Buffer.from(session, "base64").toString());
      } catch (e) {
        return NextResponse.json(
          { message: "Invalid session" },
          { status: 401 },
        );
      }

      // Attach session to request
      (request as any).session = sessionData;

      return handler(request, context);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 },
      );
    }
  };
}

export function withAdminAuth(handler: Function) {
  return withAuth(async (request: NextRequest, context: any) => {
    const session = (request as any).session;

    if (session.role !== "admin") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    return handler(request, context);
  });
}
