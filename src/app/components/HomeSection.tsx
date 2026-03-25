import RevealOnScroll from "./RevealOnScroll";
import Section from "./Section";

export default function HeroSection() {
  return (
    <Section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden pt-16 moon-bg"
      style={{
        backgroundImage: "url(/crescent-moon.svg)",
        backgroundSize: "60%",
        backgroundPosition: "30% center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center px-8 text-center">
        <RevealOnScroll>
          <h1 className="mb-6 text-5xl font-bold tracking-tight text-white drop-shadow-lg md:text-7xl">
            Coming Soon
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delayMs={90}>
          <p className="mb-2 max-w-md text-xl text-zinc-100 drop-shadow-md md:text-2xl">
            We're working on something exciting.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delayMs={180}>
          <p className="max-w-md text-xl text-zinc-100 drop-shadow-md md:text-2xl">
            Stay tuned!
          </p>
        </RevealOnScroll>
      </div>
    </Section>
  );
}