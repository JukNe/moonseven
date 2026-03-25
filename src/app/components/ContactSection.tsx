import Section from './Section';

export default function ContactSection() {
  return (
    <Section id="contact" className="bg-zinc-100 dark:bg-zinc-900">
      <h2 className="text-4xl md:text-5xl font-bold text-black dark:text-zinc-50 mb-6">
        Contact
      </h2>
      <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-8">
        Get in touch with us. We'd love to hear from you!
      </p>
      <div className="space-y-4">
        <p className="text-lg text-zinc-700 dark:text-zinc-300">
          Email: contact@moonseven.fi
        </p>
      </div>
    </Section>
  );
}
