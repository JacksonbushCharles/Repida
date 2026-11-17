export type ServiceItem = {
  title: string;
  description: string;
  accent: string;
};

export type Shipment = {
  trackingId: string;
  status: "In transit" | "Processing" | "Delivered" | "Delayed" | "Pending";
  origin: string;
  destination: string;
  route: string;
  eta: string;
  service: string;
  payment: "Paid" | "Outstanding" | "Refunded";
};

export const services: ServiceItem[] = [
  {
    title: "International parcel delivery",
    description: "Door-to-door parcel delivery across key global corridors.",
    accent: "bg-orange-100 text-orange-700",
  },
  {
    title: "Express delivery",
    description: "Priority collections and same-day handoffs for critical shipments.",
    accent: "bg-amber-100 text-amber-700",
  },
  {
    title: "Air freight",
    description: "Fast-moving cargo solutions for urgent commercial consignments.",
    accent: "bg-sky-100 text-sky-700",
  },
  {
    title: "Sea freight",
    description: "Cost-effective FCL and LCL options for high-volume global shipments.",
    accent: "bg-teal-100 text-teal-700",
  },
  {
    title: "Road transportation",
    description: "Regional and cross-border road freight with planned transit windows.",
    accent: "bg-violet-100 text-violet-700",
  },
  {
    title: "Corporate logistics",
    description: "Managed supply-chain fulfilment for retail, e-commerce and enterprise teams.",
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Last-mile delivery",
    description: "Final-mile handoff, route optimization and proof-of-delivery workflows.",
    accent: "bg-rose-100 text-rose-700",
  },
  {
    title: "Package collection",
    description: "Convenient scheduled pickups from homes, stores and business locations.",
    accent: "bg-indigo-100 text-indigo-700",
  },
];

export const destinations = [
  "United Kingdom",
  "United Arab Emirates",
  "United States",
  "South Africa",
  "Germany",
  "Saudi Arabia",
  "France",
  "Kenya",
  "China",
  "India",
  "Ghana",
  "Brazil",
];

export const shippingSteps = [
  "Book your shipment",
  "Package collection",
  "Processing and dispatch",
  "International transit",
  "Customs clearance",
  "Final delivery",
];

export const faqItems = [
  {
    question: "How long does international delivery usually take?",
    answer:
      "Delivery times vary by route, service tier and customs processing. Typical express options can reach major cities within 3–7 days, while standard freight may take longer.",
  },
  {
    question: "Can I schedule a pickup from my business or home?",
    answer:
      "Yes. Repida supports scheduled pickups for homes, retail stores, offices and managed logistics sites depending on your chosen service area.",
  },
  {
    question: "Do you handle customs documentation?",
    answer:
      "We provide documentation support for customs clearance and can guide import/export compliance requirements for eligible routes.",
  },
  {
    question: "What can I send with Repida?",
    answer:
      "We support parcels, commercial goods, documents and selected freight categories. Restricted or hazardous items are subject to approval and handling rules.",
  },
];

export const customerShipments: Shipment[] = [
  {
    trackingId: "RPD-4821A",
    status: "In transit",
    origin: "Lagos, NG",
    destination: "London, UK",
    route: "Lagos → London",
    eta: "Today, 15:30",
    service: "Express air",
    payment: "Paid",
  },
  {
    trackingId: "RPD-2019L",
    status: "Pending",
    origin: "Abuja, NG",
    destination: "Dubai, AE",
    route: "Abuja → Dubai",
    eta: "Thu, 12 Jun",
    service: "Priority parcel",
    payment: "Outstanding",
  },
  {
    trackingId: "RPD-7745J",
    status: "Delivered",
    origin: "Accra, GH",
    destination: "Cairo, EG",
    route: "Accra → Cairo",
    eta: "Delivered",
    service: "Standard road",
    payment: "Paid",
  },
  {
    trackingId: "RPD-6112C",
    status: "Delayed",
    origin: "Johannesburg, ZA",
    destination: "Frankfurt, DE",
    route: "Johannesburg → Frankfurt",
    eta: "Fri, 14 Jun",
    service: "Sea freight",
    payment: "Paid",
  },
];

export const trackingTimeline = [
  { title: "Shipment booked", time: "Mon, 10:10", status: "complete" },
  { title: "Pickup confirmed", time: "Mon, 14:25", status: "complete" },
  { title: "Sorting hub scanned", time: "Tue, 09:15", status: "complete" },
  { title: "International flight departure", time: "Wed, 17:45", status: "complete" },
  { title: "Customs clearance", time: "Today, 08:00", status: "current" },
  { title: "Delivery scheduled", time: "Today, 15:30", status: "pending" },
];

export const adminStats = [
  { label: "Total customers", value: "18.4K" },
  { label: "Total shipments", value: "9,420" },
  { label: "Pending", value: "342" },
  { label: "In transit", value: "2,184" },
  { label: "Delivered", value: "6,470" },
  { label: "Delayed", value: "89" },
  { label: "Total drivers", value: "460" },
  { label: "Active drivers", value: "398" },
  { label: "Revenue", value: "$1.24M" },
  { label: "Outstanding", value: "$182K" },
];

export const routeHighlights = [
  { name: "Lagos → London", value: 31 },
  { name: "Abuja → Dubai", value: 24 },
  { name: "Accra → Paris", value: 19 },
  { name: "Johannesburg → Frankfurt", value: 14 },
  { name: "Nairobi → Geneva", value: 11 },
];

export const supportTickets = [
  { id: "SUP-8421", customer: "Amina B.", subject: "Shipment delay", status: "Open" },
  { id: "SUP-7394", customer: "Tariq K.", subject: "Address update", status: "Pending" },
  { id: "SUP-6288", customer: "Grace M.", subject: "Invoice clarification", status: "Resolved" },
];

export const customerOverviewStats = [
  { label: "Total shipments", value: "34" },
  { label: "Pending", value: "6" },
  { label: "In transit", value: "11" },
  { label: "Delivered", value: "17" },
  { label: "Outstanding", value: "$480" },
];

export function getMockShipment(tracking = "RPD-4821A") {
  return customerShipments.find((shipment) => shipment.trackingId === tracking) ?? customerShipments[0];
}
