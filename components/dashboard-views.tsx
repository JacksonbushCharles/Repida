"use client";

import { authClient } from "@/lib/auth-client";
import {
  ArrowRight,
  Bell,
  MapPin,
  Package,
  Search,
  Truck,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";

type CustomerShipment = {
  id: string;
  trackingNumber: string;
  status: string;
  serviceLevel: string;
  originCity: string | null;
  originCountry: string;
  destinationCity: string | null;
  destinationCountry: string;
  recipientName: string;
  recipientPhone: string;
  deliveryAddress: string;
  estimatedDelivery: string | null;
  paymentStatus: string;
};

type TrackingEvent = {
  id: string;
  eventType: string;
  location: string | null;
  details: string | null;
  checkpointStatus: "COMPLETED" | "CURRENT" | "UPCOMING";
  eventAt: string;
};

type CustomerDashboardData = {
  metrics: {
    totalShipments: number;
    pending: number;
    processing: number;
    inTransit: number;
    delivered: number;
  };
  shipments: CustomerShipment[];
};

type AdminCustomer = {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
};

type AdminShipment = CustomerShipment & {
  customerId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  createdAt: string;
};

type AdminDashboardData = {
  metrics: {
    totalCustomers: number;
    totalShipments: number;
    pending: number;
    processing: number;
    inTransit: number;
    delivered: number;
    delayed: number;
  };
  customers: AdminCustomer[];
  shipments: AdminShipment[];
};

const shipmentStatuses = [
  "PENDING",
  "PROCESSING",
  "IN_TRANSIT",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "DELAYED",
  "CANCELLED",
];

function formatStatus(status: string) {
  return status.toLowerCase().replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not set"
    : new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(date);
}

function place(city: string | null, country: string) {
  return [city, country].filter(Boolean).join(", ");
}

function dateTimeLocal(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 16);
}

function localDateTimeValue(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function CustomerDashboardView() {
  const { data: session } = authClient.useSession();
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [selectedTracking, setSelectedTracking] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/customer/shipments")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load your shipments.");
        if (active) {
          setData(result as CustomerDashboardData);
          setSelectedTracking(result.shipments[0]?.trackingNumber ?? "");
        }
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load your shipments.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedTracking) {
      setEvents([]);
      return;
    }

    let active = true;
    fetch(`/api/tracking/${encodeURIComponent(selectedTracking)}`)
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load tracking history.");
        if (active) setEvents(result.events as TrackingEvent[]);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load tracking history.");
      });
    return () => {
      active = false;
    };
  }, [selectedTracking]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data?.shipments ?? []).filter((item) =>
      [
        item.trackingNumber,
        place(item.originCity, item.originCountry),
        place(item.destinationCity, item.destinationCountry),
      ].some((value) => value.toLowerCase().includes(term)),
    );
  }, [data, search]);
  const selectedShipment = data?.shipments.find((item) => item.trackingNumber === selectedTracking);
  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[28px] border border-border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Overview</p>
          <h2 className="mt-2 text-3xl font-bold text-[#171717]">
            Welcome back, {session?.user.name || "User"}
          </h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-[#171717]">
            <Bell className="h-4 w-4" />
            Shipment updates
          </span>
          <Link href="/track" className="inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-4 py-2 text-sm font-semibold text-white">
            Track a shipment
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {[
          ["Total shipments", metrics?.totalShipments],
          ["Pending", metrics?.pending],
          ["Processing", metrics?.processing],
          ["In transit", metrics?.inTransit],
          ["Delivered", metrics?.delivered],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[24px] border border-border bg-white p-4 shadow-sm">
            <p className="text-sm text-[#777777]">{label}</p>
            <p className="mt-3 text-3xl font-bold text-[#171717]">{loading ? "…" : value}</p>
          </div>
        ))}
      </div>

      {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      <div className="rounded-[28px] border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">My shipments</p>
            <h3 className="mt-2 text-2xl font-bold text-[#171717]">Shipment activity</h3>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-border bg-[#F4F0EA] px-3 py-2">
            <Search className="h-4 w-4 text-[#777777]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Search shipments"
              placeholder="Search tracking"
              className="w-40 bg-transparent text-sm text-[#171717] outline-none placeholder:text-[#777777]"
            />
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[#777777]">
                <th className="pb-3 pr-4 font-medium">Tracking</th>
                <th className="pb-3 pr-4 font-medium">Origin</th>
                <th className="pb-3 pr-4 font-medium">Destination</th>
                <th className="pb-3 pr-4 font-medium">Status</th>
                <th className="pb-3 pr-4 font-medium">ETA</th>
                <th className="pb-3 font-medium">Payment</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id} className="border-b border-border/80 align-middle">
                  <td className="py-4 pr-4">
                    <button
                      type="button"
                      onClick={() => setSelectedTracking(item.trackingNumber)}
                      className="font-semibold text-[#171717] hover:text-[#F36B21]"
                    >
                      {item.trackingNumber}
                    </button>
                  </td>
                  <td className="py-4 pr-4 text-[#171717]">{place(item.originCity, item.originCountry)}</td>
                  <td className="py-4 pr-4 text-[#171717]">{place(item.destinationCity, item.destinationCountry)}</td>
                  <td className="py-4 pr-4">{formatStatus(item.status)}</td>
                  <td className="py-4 pr-4 text-[#171717]">{formatDate(item.estimatedDelivery)}</td>
                  <td className="py-4">{formatStatus(item.paymentStatus)}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-[#777777]">No shipments found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="rounded-[28px] border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Tracking history</p>
          <h3 className="mt-2 text-2xl font-bold text-[#171717]">
            {selectedShipment?.trackingNumber ?? "Select a shipment"}
          </h3>
          <div className="mt-5 space-y-4">
            {events.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <span className={`mt-1 h-3 w-3 rounded-full ${
                    item.checkpointStatus === "CURRENT"
                      ? "bg-[#F36B21]"
                      : item.checkpointStatus === "UPCOMING"
                        ? "bg-[#E8A23A]"
                        : "bg-[#249B68]"
                  }`} />
                  {index < events.length - 1 && <span className="mt-2 h-full w-px bg-[#E8E4DE]" />}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-medium text-[#171717]">{item.eventType}</p>
                    <time className="text-xs text-[#777777]">{formatDate(item.eventAt)}</time>
                  </div>
                  <p className="mt-1 text-xs text-[#777777]">{formatStatus(item.checkpointStatus)}</p>
                  {item.location && <p className="mt-1 text-sm text-[#777777]">{item.location}</p>}
                  {item.details && <p className="mt-1 text-sm text-[#777777]">{item.details}</p>}
                </div>
              </div>
            ))}
            {!loading && selectedShipment && events.length === 0 && (
              <p className="text-sm text-[#777777]">No tracking events have been recorded yet.</p>
            )}
            {!loading && !selectedShipment && (
              <p className="text-sm text-[#777777]">Your shipments and tracking updates will appear here.</p>
            )}
          </div>
        </div>

        <div className="rounded-[28px] border border-border bg-white p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Shipment summary</p>
          {selectedShipment ? (
            <div className="mt-4 space-y-4 text-sm text-[#171717]">
              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#F4F0EA] p-3">
                <span className="text-[#777777]">Current status</span>
                <span className="font-semibold">{formatStatus(selectedShipment.status)}</span>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#F4F0EA] p-3">
                <MapPin className="h-4 w-4 text-[#F36B21]" />
                {place(selectedShipment.originCity, selectedShipment.originCountry)} to {place(selectedShipment.destinationCity, selectedShipment.destinationCountry)}
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#F4F0EA] p-3">
                <Truck className="h-4 w-4 text-[#F36B21]" />
                {formatStatus(selectedShipment.serviceLevel)}
              </div>
              <div className="rounded-2xl bg-[#F4F0EA] p-3">
                <p className="text-xs text-[#777777]">Deliver to</p>
                <p className="mt-1 font-medium">{selectedShipment.recipientName}</p>
                <p className="text-[#777777]">{selectedShipment.recipientPhone}</p>
                <p className="mt-1 text-[#777777]">{selectedShipment.deliveryAddress}</p>
              </div>
              <div className="flex items-center gap-3 rounded-2xl bg-[#F4F0EA] p-3">
                <Wallet className="h-4 w-4 text-[#F36B21]" />
                {formatStatus(selectedShipment.paymentStatus)}
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-[#777777]">No shipment selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardView() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    const response = await fetch("/api/admin/dashboard");
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || "Could not load admin dashboard.");
    setData(result as AdminDashboardData);
  }

  useEffect(() => {
    let active = true;
    fetch("/api/admin/dashboard")
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || "Could not load admin dashboard.");
        if (active) setData(result as AdminDashboardData);
      })
      .catch((loadError: unknown) => {
        if (active) setError(loadError instanceof Error ? loadError.message : "Could not load admin dashboard.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  async function changeStatus(id: string, status: string) {
    setError("");
    try {
      const response = await fetch(`/api/admin/shipments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update shipment status.");
      await loadDashboard();
    } catch (updateError) {
      setError(updateError instanceof Error ? updateError.message : "Could not update shipment status.");
    }
  }

  const metrics = data?.metrics;

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Operations overview</p>
        <h2 className="mt-2 text-3xl font-bold text-[#171717]">Global dispatch control</h2>
      </div>

      {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Total customers", metrics?.totalCustomers],
          ["Total shipments", metrics?.totalShipments],
          ["Pending", metrics?.pending],
          ["Processing", metrics?.processing],
          ["In transit", metrics?.inTransit],
          ["Delivered", metrics?.delivered],
          ["Delayed", metrics?.delayed],
        ].map(([label, value]) => (
          <div key={label} className="rounded-[24px] border border-border bg-white p-4 shadow-sm">
            <p className="text-sm text-[#777777]">{label}</p>
            <p className="mt-3 text-3xl font-bold text-[#171717]">{loading ? "…" : value}</p>
          </div>
        ))}
      </div>

      <CreateShipmentForm
        customers={data?.customers ?? []}
        onCreated={async () => {
          try {
            await loadDashboard();
          } catch (loadError) {
            setError(loadError instanceof Error ? loadError.message : "Shipment was created, but the dashboard could not refresh.");
          }
        }}
      />

      <div className="rounded-[28px] border border-border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Recent shipments</p>
        <h3 className="mt-2 text-2xl font-bold text-[#171717]">Shipment management</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[#777777]">
                <th className="pb-3 pr-4 font-medium">Tracking ID</th>
                <th className="pb-3 pr-4 font-medium">Customer</th>
                <th className="pb-3 pr-4 font-medium">Recipient</th>
                <th className="pb-3 pr-4 font-medium">Route</th>
                <th className="pb-3 pr-4 font-medium">Created</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.shipments.map((item) => (
                <tr key={item.id} className="border-b border-border/80">
                  <td className="py-4 pr-4 font-semibold text-[#171717]">{item.trackingNumber}</td>
                  <td className="py-4 pr-4 text-[#171717]">
                    <span className="block">{item.customerName || "Unnamed customer"}</span>
                    <span className="text-xs text-[#777777]">{item.customerEmail || "Unregistered recipient"}</span>
                  </td>
                  <td className="py-4 pr-4 text-[#171717]">
                    <span className="block">{item.recipientName}</span>
                    <span className="text-xs text-[#777777]">{item.recipientPhone}</span>
                  </td>
                  <td className="py-4 pr-4 text-[#171717]">
                    {place(item.originCity, item.originCountry)} to {place(item.destinationCity, item.destinationCountry)}
                  </td>
                  <td className="py-4 pr-4 text-[#171717]">{formatDate(item.createdAt)}</td>
                  <td className="py-4">
                    <select
                      aria-label={`Status for ${item.trackingNumber}`}
                      value={item.status.toUpperCase()}
                      onChange={(event) => void changeStatus(item.id, event.target.value)}
                      className="rounded-full border border-border bg-white px-3 py-2 text-xs"
                    >
                      {!shipmentStatuses.includes(item.status.toUpperCase()) && (
                        <option value={item.status.toUpperCase()}>{formatStatus(item.status)}</option>
                      )}
                      {shipmentStatuses.map((status) => (
                        <option key={status} value={status}>{formatStatus(status)}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {!loading && data?.shipments.length === 0 && (
                <tr><td colSpan={6} className="py-8 text-center text-[#777777]">No shipments have been created.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TimelineManager />

      <div className="rounded-[28px] border border-border bg-white p-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Customer accounts</p>
        <h3 className="mt-2 text-2xl font-bold text-[#171717]">Registered users</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[#777777]">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 pr-4 font-medium">Email</th>
                <th className="pb-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {data?.customers.map((customer) => (
                <tr key={customer.id} className="border-b border-border/80">
                  <td className="py-4 pr-4 text-[#171717]">{customer.name || "Unnamed customer"}</td>
                  <td className="py-4 pr-4 text-[#171717]">{customer.email}</td>
                  <td className="py-4 text-[#171717]">{formatDate(customer.createdAt)}</td>
                </tr>
              ))}
              {!loading && data?.customers.length === 0 && (
                <tr><td colSpan={3} className="py-8 text-center text-[#777777]">No customer accounts have registered.</td></tr>
              )}
              {data && data.metrics.totalCustomers > data.customers.length && (
                <tr><td colSpan={3} className="py-3 text-xs text-[#777777]">Showing the 100 most recently registered accounts.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function CreateShipmentForm({
  customers,
  onCreated,
}: {
  customers: AdminCustomer[];
  onCreated: () => Promise<void>;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setTrackingNumber("");
    const form = event.currentTarget;
    const values = new FormData(form);
    try {
      const response = await fetch("/api/admin/shipments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: values.get("customerId"),
          originCity: values.get("originCity"),
          originCountry: values.get("originCountry"),
          destinationCity: values.get("destinationCity"),
          destinationCountry: values.get("destinationCountry"),
          recipientName: values.get("recipientName"),
          recipientPhone: values.get("recipientPhone"),
          deliveryAddress: values.get("deliveryAddress"),
          serviceLevel: values.get("serviceLevel"),
          declaredValue: values.get("declaredValue"),
          shippingCost: values.get("shippingCost"),
          estimatedDelivery: values.get("estimatedDelivery"),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not create shipment.");
      setTrackingNumber(result.shipment.trackingNumber);
      form.reset();
      await onCreated();
    } catch (createError) {
      setError(createError instanceof Error ? createError.message : "Could not create shipment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-[28px] border border-border bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Dispatch</p>
        <h3 className="mt-2 text-2xl font-bold text-[#171717]">Create a delivery</h3>
        <p className="mt-2 text-sm text-[#777777]">A unique tracking number and initial tracking event will be generated.</p>
      </div>
      <label className="block text-sm text-[#171717]">
        Customer account
        <select name="customerId" className="form-input mt-2">
          <option value="">No registered customer (recipient only)</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name || customer.email} ({customer.email})
            </option>
          ))}
        </select>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm text-[#171717]">Recipient name<input name="recipientName" required maxLength={100} className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">Recipient phone<input name="recipientPhone" type="tel" required maxLength={30} className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717] sm:col-span-2">Delivery street address<input name="deliveryAddress" required maxLength={250} className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">Origin city<input name="originCity" required maxLength={100} className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">Origin country<input name="originCountry" required maxLength={100} className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">Destination city<input name="destinationCity" required maxLength={100} className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">Destination country<input name="destinationCountry" required maxLength={100} className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">
          Service level
          <select name="serviceLevel" required className="form-input mt-2">
            <option value="STANDARD">Standard</option>
            <option value="EXPRESS">Express</option>
            <option value="AIR_FREIGHT">Air freight</option>
            <option value="SEA_FREIGHT">Sea freight</option>
            <option value="ROAD">Road</option>
          </select>
        </label>
        <label className="block text-sm text-[#171717]">Estimated delivery<input name="estimatedDelivery" type="date" className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">Declared value<input name="declaredValue" type="number" min="0" step="1" defaultValue="0" className="form-input mt-2" /></label>
        <label className="block text-sm text-[#171717]">Shipping cost<input name="shippingCost" type="number" min="0" step="1" defaultValue="0" className="form-input mt-2" /></label>
      </div>
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      {trackingNumber && (
        <p role="status" className="rounded-2xl bg-green-50 p-3 text-sm text-green-800">
          Delivery created. Tracking number: <strong>{trackingNumber}</strong>
        </p>
      )}
      <button disabled={pending} className="rounded-full bg-[#F36B21] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
        {pending ? "Creating delivery…" : "Create delivery"}
      </button>
    </form>
  );
}

function TimelineManager() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [loadedTrackingNumber, setLoadedTrackingNumber] = useState("");
  const [shipmentStatus, setShipmentStatus] = useState("PENDING");
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadTimeline(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const tracking = trackingNumber.trim().toUpperCase();
    if (!tracking) {
      setError("Enter a tracking number.");
      return;
    }

    setPending(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch(`/api/admin/timeline?trackingNumber=${encodeURIComponent(tracking)}`);
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load timeline.");
      setLoadedTrackingNumber(result.shipment.trackingNumber);
      setTrackingNumber(result.shipment.trackingNumber);
      setShipmentStatus(result.shipment.status);
      setEvents(result.events as TrackingEvent[]);
      setEditingId(null);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Could not load timeline.");
      setLoadedTrackingNumber("");
      setEvents([]);
    } finally {
      setPending(false);
    }
  }

  async function submitCheckpoint(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!loadedTrackingNumber) return;

    setPending(true);
    setError("");
    setMessage("");
    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/timeline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackingNumber: loadedTrackingNumber,
          eventType: values.get("eventType"),
          location: values.get("location"),
          details: values.get("details"),
          checkpointStatus: values.get("checkpointStatus"),
          shipmentStatus: values.get("shipmentStatus"),
          eventAt: localDateTimeValue(values.get("eventAt")),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not add checkpoint.");
      await loadTimeline();
      setMessage("Timeline checkpoint added.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not add checkpoint.");
    } finally {
      setPending(false);
    }
  }

  async function updateCheckpoint(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setPending(true);
    setError("");
    setMessage("");
    const values = new FormData(event.currentTarget);
    try {
      const response = await fetch(`/api/admin/timeline/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventType: values.get("eventType"),
          location: values.get("location"),
          details: values.get("details"),
          checkpointStatus: values.get("checkpointStatus"),
          shipmentStatus: values.get("shipmentStatus"),
          eventAt: localDateTimeValue(values.get("eventAt")),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update checkpoint.");
      await loadTimeline();
      setMessage("Timeline checkpoint updated.");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update checkpoint.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="space-y-5 rounded-[28px] border border-border bg-white p-5 shadow-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#777777]">Tracking timeline</p>
        <h3 className="mt-2 text-2xl font-bold text-[#171717]">Manage checkpoints and delivery updates</h3>
        <p className="mt-2 text-sm text-[#777777]">Find a shipment by tracking ID, then add or edit past, current, and upcoming checkpoints.</p>
      </div>

      <form onSubmit={(event) => void loadTimeline(event)} className="flex flex-col gap-3 sm:flex-row">
        <input
          value={trackingNumber}
          onChange={(event) => setTrackingNumber(event.target.value)}
          required
          aria-label="Tracking ID to manage"
          placeholder="Enter tracking ID, e.g. RPD-..."
          className="form-input flex-1"
        />
        <button disabled={pending} className="rounded-full border border-border px-5 py-3 text-sm font-semibold disabled:opacity-50">
          {pending ? "Loading…" : "Load timeline"}
        </button>
      </form>

      {error && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {message && <p role="status" className="text-sm text-green-700">{message}</p>}

      {loadedTrackingNumber && (
        <>
          <div className="rounded-2xl bg-[#F4F0EA] p-4 text-sm">
            <span className="text-[#777777]">Tracking ID </span>
            <strong>{loadedTrackingNumber}</strong>
            <span className="ml-4 text-[#777777]">Current shipment status </span>
            <strong>{formatStatus(shipmentStatus)}</strong>
          </div>

          <form onSubmit={(event) => void submitCheckpoint(event)} className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
            <h4 className="font-semibold sm:col-span-2">Add checkpoint</h4>
            <label className="text-sm">Checkpoint title<input name="eventType" required maxLength={100} placeholder="Picked up" className="form-input mt-2" /></label>
            <label className="text-sm">Location<input name="location" maxLength={160} placeholder="USA sorting hub" className="form-input mt-2" /></label>
            <label className="text-sm">Date and time<input name="eventAt" type="datetime-local" required className="form-input mt-2" /></label>
            <label className="text-sm">
              Timeline position
              <select name="checkpointStatus" className="form-input mt-2">
                <option value="UPCOMING">Upcoming</option>
                <option value="CURRENT">Current</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </label>
            <label className="text-sm sm:col-span-2">Delivery update / notes<textarea name="details" maxLength={500} rows={2} className="form-input mt-2" /></label>
            <label className="text-sm">
              Shipment status (used when this is Current)
              <select name="shipmentStatus" defaultValue={shipmentStatus} className="form-input mt-2">
                {shipmentStatuses.map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}
              </select>
            </label>
            <button disabled={pending} className="self-end rounded-full bg-[#F36B21] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50">
              Add checkpoint
            </button>
          </form>

          <ol className="space-y-3">
            {events.map((item, index) => (
              <li key={item.id} className="rounded-2xl bg-[#F4F0EA] p-4">
                {editingId === item.id ? (
                  <form onSubmit={(event) => void updateCheckpoint(event, item.id)} className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm">Title<input name="eventType" required defaultValue={item.eventType} maxLength={100} className="form-input mt-2" /></label>
                    <label className="text-sm">Location<input name="location" defaultValue={item.location ?? ""} maxLength={160} className="form-input mt-2" /></label>
                    <label className="text-sm">Date and time<input name="eventAt" type="datetime-local" required defaultValue={dateTimeLocal(item.eventAt)} className="form-input mt-2" /></label>
                    <label className="text-sm">
                      Timeline position
                      <select name="checkpointStatus" defaultValue={item.checkpointStatus} className="form-input mt-2">
                        <option value="UPCOMING">Upcoming</option>
                        <option value="CURRENT">Current</option>
                        <option value="COMPLETED">Completed</option>
                      </select>
                    </label>
                    <label className="text-sm sm:col-span-2">Notes<textarea name="details" defaultValue={item.details ?? ""} maxLength={500} rows={2} className="form-input mt-2" /></label>
                    <label className="text-sm">
                      Shipment status (used when this is Current)
                      <select name="shipmentStatus" defaultValue={shipmentStatus} className="form-input mt-2">
                        {shipmentStatuses.map((status) => <option key={status} value={status}>{formatStatus(status)}</option>)}
                      </select>
                    </label>
                    <div className="flex items-end gap-2">
                      <button disabled={pending} className="rounded-full bg-[#F36B21] px-4 py-2 text-sm font-semibold text-white">Save</button>
                      <button type="button" onClick={() => setEditingId(null)} className="rounded-full border border-border px-4 py-2 text-sm">Cancel</button>
                    </div>
                  </form>
                ) : (
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="flex gap-3">
                      <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${item.checkpointStatus === "CURRENT" ? "bg-[#F36B21]" : item.checkpointStatus === "COMPLETED" ? "bg-[#249B68]" : "bg-[#E8A23A]"}`} />
                      <div>
                        <p className="font-semibold text-[#171717]">{index + 1}. {item.eventType} <span className="ml-2 text-xs font-normal text-[#777777]">{formatStatus(item.checkpointStatus)}</span></p>
                        <p className="mt-1 text-xs text-[#777777]">{formatDate(item.eventAt)}{item.location ? ` · ${item.location}` : ""}</p>
                        {item.details && <p className="mt-2 text-sm text-[#777777]">{item.details}</p>}
                      </div>
                    </div>
                    <button type="button" onClick={() => setEditingId(item.id)} className="rounded-full border border-border px-4 py-2 text-sm">Edit</button>
                  </div>
                )}
              </li>
            ))}
            {events.length === 0 && <li className="text-sm text-[#777777]">No checkpoints recorded yet.</li>}
          </ol>
        </>
      )}
    </section>
  );
}
