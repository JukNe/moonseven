import Section from "./Section";

export default function HeroSection() {
  return (
    <Section 
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden pt-16 moon-bg"
      style={{
        backgroundImage: 'url(/crescent-moon.svg)',
        backgroundSize: '60%',
        backgroundPosition: '30% center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="absolute inset-0 bg-black/20 dark:bg-black/40"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-8">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 drop-shadow-lg">
          Coming Soon
        </h1>
        <p className="text-xl md:text-2xl text-zinc-100 max-w-md mb-2 drop-shadow-md">
          We're working on something exciting.
        </p>
        <p className="text-xl md:text-2xl text-zinc-100 max-w-md drop-shadow-md">
          Stay tuned!
        </p>
      </div>
    </Section>
  );
}
