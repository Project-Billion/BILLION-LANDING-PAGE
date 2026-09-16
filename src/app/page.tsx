import { CTA } from "@/components/sections/CTA";
import { Hero } from "@/components/sections/Hero";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Industries } from "@/components/sections/Industries";
import { Proof } from "@/components/sections/Proof";
import { ValueProps } from "@/components/sections/ValueProps";

/** Landing page, sections 01 to 06 in BRIEF order; the footer (07) lives in the root layout. */
export default function Home() {
  return (
    <>
      <Hero />
      <ValueProps />
      <Industries />
      <HowItWorks />
      <Proof />
      <CTA />
    </>
  );
}
