export default function PoliciesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[32px] border border-[#E8E4DE] bg-white p-8 shadow-sm lg:p-10">
        <p className="eyebrow text-[#F36B21]">Shipping policies</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Shipping and prohibited items policy.</h1>
        <div className="mt-8 space-y-6 text-[#777777]">
          <p>
            Repida accepts shipments within the guidelines of our service terms. Certain restricted items may require special approval or may be prohibited under local law, customs rules or carrier handling limits.
          </p>
          <p>
            Customers are responsible for declaring both the contents and value of each package accurately before dispatch. Where the declaration is false, incomplete or unsupported, Repida may refuse or halt shipment processing.
          </p>
          <p>
            Shipments containing prohibited or hazardous items are not accepted unless prior written approval has been received. For specific route requirements, clients should contact our support team before booking.
          </p>
        </div>
      </div>
    </main>
  );
}
