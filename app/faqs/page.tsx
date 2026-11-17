import { faqItems } from "@/lib/mock-data";

export default function FaqsPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="eyebrow text-[#F36B21]">FAQs</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Answers for customers and businesses.</h1>
      </div>

      <div className="mt-12 space-y-4">
        {faqItems.map((item) => (
          <div key={item.question} className="rounded-[28px] border border-[#E8E4DE] bg-white p-6 shadow-sm">
            <p className="text-xl font-bold text-[#171717]">{item.question}</p>
            <p className="mt-3 leading-7 text-[#777777]">{item.answer}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
