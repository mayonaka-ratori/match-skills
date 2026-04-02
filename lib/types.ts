// Shared TypeScript types for match-skills Phase 0
// These types mirror the future Supabase schema — do not add fields that cannot be persisted.

export type UserRole = "organizer" | "musician" | "admin";

export type EventType =
  | "corporate"
  | "restaurant"
  | "hotel_lounge"
  | "private_party";

export type Genre =
  | "jazz"
  | "classical"
  | "bossa_nova"
  | "pop"
  | "acoustic"
  | "latin"
  | "soul"
  | "flamenco"
  | "lounge";

export type Instrument =
  | "piano"
  | "violin"
  | "guitar"
  | "saxophone"
  | "harp"
  | "cello"
  | "vocal"
  | "bass"
  | "flute"
  | "keyboard"
  | "trumpet";

export type AvailabilityStatus =
  | "available_today"
  | "available_this_week"
  | "available_weekend"
  | "contact_required";

export type RequestStatus =
  | "pending"
  | "shortlisted"
  | "offers_sent"
  | "confirmed"
  | "cancelled";

export type OfferStatus = "pending" | "accepted" | "held" | "declined";

export type TimeSlot = "morning" | "afternoon" | "evening";

// ────────────────────────────────────────────────────────────────────────────────
// Musician
// ────────────────────────────────────────────────────────────────────────────────

export interface Musician {
  id: string; // "m-001"
  slug: string; // URL-safe identifier
  name: string;
  nameKana?: string;
  tagline: string; // short one-liner shown on cards
  bio: string;
  instruments: Instrument[];
  genres: Genre[];
  ensembleType: string; // "ソロ", "デュオ", "トリオ" etc.
  neighborhood: string; // primary base area
  travelAreas: string[]; // neighborhoods they cover
  pricePerHour: number; // JPY
  priceNote?: string; // e.g. "2時間以上から承ります"
  availabilityStatus: AvailabilityStatus;
  availabilityLabel: string; // display label e.g. "今週末対応可"
  bookingCount: number;
  responseLabel?: string; // e.g. "返信が早い"
  popularityLabel?: string; // e.g. "よく決まる"
  suitableEvents: EventType[];
  photoUrl: string | null;
  mediaUrl: string | null; // placeholder video/audio URL
  isCurated: boolean;
  tags: string[];
}

// ────────────────────────────────────────────────────────────────────────────────
// Organizer
// ────────────────────────────────────────────────────────────────────────────────

export interface Organizer {
  id: string; // "o-001"
  name: string;
  companyName: string;
  email: string;
  phone?: string;
}

// ────────────────────────────────────────────────────────────────────────────────
// BookingRequest
// ────────────────────────────────────────────────────────────────────────────────

export interface BookingRequest {
  id: string; // "req-001"
  organizerId: string;
  eventType: EventType;
  eventDate: string; // "YYYY-MM-DD"
  eventTime: string; // "HH:MM"
  venueName: string;
  venueNeighborhood: string;
  durationHours: number;
  preferredGenres: Genre[];
  budgetPerHour: number | null;
  notes?: string | null;
  status: RequestStatus;
  shortlistedMusicianIds: string[];
  confirmedMusicianId: string | null;
  createdAt: string; // ISO string
}

// ────────────────────────────────────────────────────────────────────────────────
// Offer
// ────────────────────────────────────────────────────────────────────────────────

export interface Offer {
  id: string; // "offer-001"
  token: string; // URL-safe unique token for /offer/[token]
  requestId: string;
  musicianId: string;
  status: OfferStatus;
  sentAt: string;
  respondedAt: string | null;
  fee: number; // JPY total (pricePerHour × durationHours)
}

// ────────────────────────────────────────────────────────────────────────────────
// AvailabilitySlot
// ────────────────────────────────────────────────────────────────────────────────

export interface AvailabilitySlot {
  id: string;
  musicianId: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: TimeSlot;
  isAvailable: boolean;
}

// ────────────────────────────────────────────────────────────────────────────────
// Mock session user
// ────────────────────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string;
  role: UserRole;
  name: string;
  musicianId?: string; // set when role === "musician"
  organizerId?: string; // set when role === "organizer"
}

// ────────────────────────────────────────────────────────────────────────────────
// RequestDraft — transient form state written to sessionStorage on submit
// Shape mirrors BookingRequest minus server-assigned fields (id, organizerId, status, etc.)
// TODO Phase 1: replace with a real BookingRequest row created via Supabase insert
// ────────────────────────────────────────────────────────────────────────────────

export interface RequestDraft {
  eventType: EventType;
  eventDate: string; // "YYYY-MM-DD"
  eventTime: string; // "HH:MM"
  durationHours: number;
  venueNeighborhood: string;
  venueName: string; // empty string when not collected by form
  preferredGenres: Genre[];
  budgetPerHour: number | null;
  notes: string | null;
}

// ────────────────────────────────────────────────────────────────────────────────
// DemoScenario — pre-baked demo entry points (Phase 0 only)
// ────────────────────────────────────────────────────────────────────────────────

export interface DemoScenario {
  id: string; // "demo-001"
  label: string; // short display name, e.g. "企業レセプション"
  title: string; // one-liner shown in picker
  description: string; // 1–2 sentences for interview context
  eventType: EventType;
  requestId: string; // links to existing MOCK_REQUESTS entry
  startRole: UserRole; // which role to activate when entering
  contextNote: string; // interviewer hint, shown only in demo panel
}
