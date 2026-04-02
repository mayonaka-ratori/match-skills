import Link from "next/link";
import Image from "next/image";
import { MapPin, Star, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPricePerHour, labelGenre, labelInstrument } from "@/lib/format";
import { AvailabilityBadge } from "./AvailabilityBadge";
import type { Musician } from "@/lib/types";

interface MusicianCardProps {
  musician: Musician;
  requestId?: string;
  className?: string;
}

export function MusicianCard({ musician, requestId, className }: MusicianCardProps) {
  const href = requestId
    ? `/musicians/${musician.slug}?requestId=${requestId}`
    : `/musicians/${musician.slug}`;

  return (
    <Link
      href={href}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md",
        className
      )}
    >
      {/* Photo */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        {musician.photoUrl ? (
          <Image
            src={musician.photoUrl}
            alt={musician.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <span className="text-4xl">🎵</span>
          </div>
        )}
        {/* Availability badge overlay */}
        <div className="absolute top-2 left-2">
          <AvailabilityBadge
            status={musician.availabilityStatus}
            label={musician.availabilityLabel}
          />
        </div>
        {/* Curated badge */}
        {musician.isCurated && (
          <div className="absolute top-2 right-2">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-background/90 px-1.5 py-0.5 text-xs font-medium backdrop-blur">
              <Star className="size-3 fill-amber-400 text-amber-400" />
              公認
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Name + ensemble */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold">{musician.name}</h3>
            <p className="text-xs text-muted-foreground">{musician.ensembleType}</p>
          </div>
          <span className="shrink-0 text-sm font-medium whitespace-nowrap">
            {formatPricePerHour(musician.pricePerHour)}
          </span>
        </div>

        {/* Tagline */}
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {musician.tagline}
        </p>

        {/* Genre tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {musician.genres.slice(0, 3).map((g) => (
            <span
              key={g}
              className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
            >
              {labelGenre(g)}
            </span>
          ))}
        </div>

        {/* Footer: area + trust signals */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <MapPin className="size-3 shrink-0" />
            {musician.neighborhood}
          </span>
          <div className="flex items-center gap-2">
            {musician.responseLabel && (
              <span className="flex items-center gap-0.5 text-emerald-600">
                <Zap className="size-3" />
                {musician.responseLabel}
              </span>
            )}
            <span>実績{musician.bookingCount}件</span>
          </div>
        </div>

        {/* Instruments */}
        <div className="mt-2 text-xs text-muted-foreground">
          {musician.instruments.map(labelInstrument).join("・")}
        </div>
      </div>
    </Link>
  );
}
