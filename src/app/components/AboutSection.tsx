import Section from './Section';

export default function AboutSection() {
  return (
    <Section id="about">
      <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-zinc-50 mb-6">
        About
      </h2>
      <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed">
        Welcome to Moon Seven. 
      </p>
    </Section>
  );
}
