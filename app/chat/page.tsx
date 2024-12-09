"use client";
import { useEffect, useState } from "react";

import ChatLocal from "@/components/ChatLocal";
import { title } from "@/components/primitives";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex-1 max-w-5xl mx-auto pt-6 flex flex-col items-center justify-center gap-4 w-full lg:pt-14">
      <h1 className={title({ size: "md" })}>
        <span className={title({})}>Preguntale a tu&nbsp;</span>
        <span className={title({ color: "green" })}>Chat IA local&nbsp;</span>
      </h1>
      <ChatLocal />
    </div>
  );
}
