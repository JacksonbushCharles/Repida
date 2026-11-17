export default async function SignalSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-5xl px-6 py-20">
      <h1 className="text-4xl font-semibold tracking-tight">Signal: {slug}</h1>
      <p className="mt-4 text-base text-foreground/70">Legacy compatibility route placeholder.</p>
    </main>
  );
}
