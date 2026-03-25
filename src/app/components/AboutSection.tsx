import RevealOnScroll from "./RevealOnScroll";
import Section from "./Section";

export default function AboutSection() {
  return (
    <Section id="about">
      <RevealOnScroll>
        <h2 className="mb-6 text-4xl font-bold text-black dark:text-zinc-50 md:text-5xl">
          About
        </h2>
      </RevealOnScroll>
      <RevealOnScroll delayMs={100}>
        <p className="text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-xl">
        Coming soon... 🌒
        </p>
      </RevealOnScroll>
    </Section>
  );
}
