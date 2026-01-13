export default function Home() {
  return (
    <div 
      className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black relative"
      style={{
        backgroundImage: 'url(/crescent-moon.svg)',
        backgroundSize: 'contain',
        backgroundPosition: '40% center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <main className="flex flex-col items-center justify-center text-center px-8 relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-black dark:text-zinc-50 mb-4">
          Coming Soon
        </h1>
        <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-md">
          We're working on something exciting. 
        </p>
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-md">
        Stay tuned!
        </p>
      </main>
    </div>
  );
}
