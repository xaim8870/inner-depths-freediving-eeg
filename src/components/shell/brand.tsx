import Image from "next/image";
import Link from "next/link";

export default function Brand({ tone }: { tone: "light" | "dark" }) {
  return (
    <Link href="/app/home" className="ui-brand" aria-label="Inner Depths home">
      <Image src={tone === "light" ? "/brand/inner-depths-mark-light.png" : "/brand/inner-depths-mark-dark.png"} alt="" width={23} height={40} priority />
      <span>
        Inner Depths
        <small>FREEDIVING</small>
      </span>
    </Link>
  );
}
