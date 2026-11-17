"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, MapPinned, Package, Search, ShieldCheck, Truck } from "lucide-react";

type TrackingResult = {
  shipment: {
    trackingNumber: string;
    status: string;
    serviceLevel: string;
    originCity: string | null;
    originCountry: string;
    destinationCity: string | null;
    destinationCountry: string;
    estimatedDelivery: string | null;
    events: Array<{
      id: string;
      eventType: string;
      location: string | null;
      details: string | null;
      checkpointStatus: "COMPLETED" | "CURRENT" | "UPCOMING";
      eventAt: string;
    }>;
  };
};

function formatStatus(status: string) {
  return status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function place(city: string | null, country: string) {
  return [city, country].filter(Boolean).join(", ");
}

export default function TrackPage() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function track(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const tracking = trackingNumber.trim().toUpperCase();
    if (!tracking) {
      setError("Enter a tracking number.");
      return;
    }

    setPending(true);
    setError("");
    setResult(null);
    try {
      const response = await fetch(`/api/tracking/${encodeURIComponent(tracking)}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not look up that shipment.");
      setResult(data as TrackingResult);
    } catch (trackError) {
      setError(trackError instanceof Error ? trackError.message : "Could not look up that shipment.");
    } finally {
      setPending(false);
    }
  }

  const shipment = result?.shipment;

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[38px] border border-[#E8E4DE] bg-white p-8 shadow-[0_20px_60px_rgba(23,23,23,0.04)] lg:p-12">
        <p className="eyebrow text-[#F36B21]">Track shipment</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Follow every milestone in transit.</h1>
        <form onSubmit={track} className="mt-8 flex max-w-2xl gap-3 rounded-full border border-[#E8E4DE] bg-[#F4F0EA] p-2">
          <input
            value={trackingNumber}
            onChange={(event) => setTrackingNumber(event.target.value)}
            aria-label="Tracking number"
            className="w-full bg-transparent px-4 py-3 text-sm text-[#171717] outline-none placeholder:text-[#777777]"
            placeholder="Enter tracking reference"
          />
          <button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
            <Search className="h-4 w-4" />
            {pending ? "Searching…" : "Track"}
          </button>
        </form>
        {error && <p role="alert" className="mt-4 max-w-2xl rounded-2xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}
      </div>

      {shipment && (
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-[#E8E4DE] bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#777777]">Tracking reference</p>
                <h2 className="mt-1 text-3xl font-bold text-[#171717]">{shipment.trackingNumber}</h2>
              </div>
              <div className="rounded-full bg-[#F36B21]/10 px-3 py-1 text-sm font-semibold text-[#F36B21]">
                {formatStatus(shipment.status)}
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-[#F4F0EA] p-4">
                <p className="text-sm text-[#777777]">Origin</p>
                <p className="mt-2 font-semibold text-[#171717]">{place(shipment.originCity, shipment.originCountry)}</p>
              </div>
              <div className="rounded-2xl bg-[#F4F0EA] p-4">
                <p className="text-sm text-[#777777]">Destination</p>
                <p className="mt-2 font-semibold text-[#171717]">{place(shipment.destinationCity, shipment.destinationCountry)}</p>
              </div>
              <div className="rounded-2xl bg-[#F4F0EA] p-4">
                <p className="text-sm text-[#777777]">Service</p>
                <p className="mt-2 font-semibold text-[#171717]">{formatStatus(shipment.serviceLevel)}</p>
              </div>
              <div className="rounded-2xl bg-[#F4F0EA] p-4">
                <p className="text-sm text-[#777777]">Estimated delivery</p>
                <p className="mt-2 font-semibold text-[#171717]">{formatDate(shipment.estimatedDelivery)}</p>
              </div>
            </div>

            <div className="mt-8 rounded-[28px] border border-[#E8E4DE] bg-[#F4F0EA] p-5">
              <div className="mb-4 flex items-center gap-3">
                <MapPinned className="h-5 w-5 text-[#F36B21]" />
                <p className="text-lg font-semibold text-[#171717]">Tracking history</p>
              </div>
              <div className="space-y-4">
                {shipment.events.map((item, index) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className={`mt-1 h-3 w-3 rounded-full ${item.checkpointStatus === "CURRENT" ? "bg-[#F36B21]" : item.checkpointStatus === "UPCOMING" ? "bg-[#E8A23A]" : "bg-[#249B68]"}`} />
                      {index < shipment.events.length - 1 && <span className="mt-2 h-full w-px bg-[#E8E4DE]" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-[#171717]">{item.eventType}</p>
                        <time className="text-xs text-[#777777]">{formatDate(item.eventAt)}</time>
                      </div>
                      <p className="mt-1 text-xs text-[#777777]">{formatStatus(item.checkpointStatus)}</p>
                      {item.location && <p className="mt-1 text-sm text-[#777777]">{item.location}</p>}
                      {item.details && <p className="mt-1 text-sm text-[#777777]">{item.details}</p>}
                    </div>
                  </div>
                ))}
                {shipment.events.length === 0 && (
                  <p className="text-sm text-[#777777]">No tracking events have been recorded yet.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[32px] border border-[#E8E4DE] bg-[#171717] p-8 text-white shadow-sm">
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-[#F36B21]" />
                <p className="text-lg font-semibold">Current route</p>
              </div>
              <p className="mt-5 text-2xl font-bold">
                {place(shipment.originCity, shipment.originCountry)} to {place(shipment.destinationCity, shipment.destinationCountry)}
              </p>
              <div className="mt-6 flex items-center gap-3 rounded-2xl bg-white/5 p-3 text-sm text-white/75">
                <ShieldCheck className="h-5 w-5 text-[#F36B21]" />
                Latest status: {formatStatus(shipment.status)}
              </div>
            </div>

            <div className="rounded-[32px] border border-[#E8E4DE] bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-[#F36B21]" />
                <p className="text-lg font-semibold text-[#171717]">Shipment summary</p>
              </div>
              <div className="mt-5 space-y-4 text-sm text-[#171717]">
                <div className="flex items-center justify-between">
                  <span className="text-[#777777]">Status</span>
                  <span className="font-semibold">{formatStatus(shipment.status)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#777777]">Service</span>
                  <span className="font-semibold">{formatStatus(shipment.serviceLevel)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#777777]">Estimated delivery</span>
                  <span className="font-semibold">{formatDate(shipment.estimatedDelivery)}</span>
                </div>
              </div>
              <p className="mt-6 inline-flex items-center gap-2 text-sm text-[#777777]">
                Need help? <a href="/support" className="font-semibold text-[#F36B21]">Contact support <ArrowRight className="inline h-4 w-4" /></a>
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
