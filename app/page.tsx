import Image from "next/image";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-6 py-16 dark:bg-zinc-950">
      <main className="flex max-w-lg flex-col items-center text-center">
        <Image
          src="/ShiftBob-circle-logo-light-1024.png"
          alt="ShiftBob"
          width={1024}
          height={1024}
          priority
          className="h-auto w-[min(280px,80vw)] sm:w-[min(320px,70vw)]"
        />
        <p className="mt-8 text-lg font-medium tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-xl">
          We&apos;re working on a tight schedule!
        </p>
      </main>
    </div>
  );
}
