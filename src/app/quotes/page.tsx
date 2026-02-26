"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function QuotesPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/?openQuote=1");
  }, [router]);
  return null;
}
