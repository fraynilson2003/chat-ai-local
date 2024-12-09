"use client";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";

import { title, subtitle } from "@/components/primitives";

export default function Home() {
  return (
    <section className="mx-auto flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="inline-block max-w-xl text-center justify-center lg:pt-16">
        <span className={title({})}>Usa&nbsp;</span>
        <span className={title({ color: "green" })}>Chat IA local&nbsp;</span>
        <br />

        <div className={subtitle({ class: "mt-4" })}>
          Usa la inteligencia artificial localmente, sin internet.
        </div>

        <Link href="/chat">
          <Button className="mt-4 " color="success" variant="ghost">
            Empieza a chatear
          </Button>
        </Link>
      </div>
    </section>
  );
}
