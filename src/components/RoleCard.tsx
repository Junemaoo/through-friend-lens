import { RoleImage } from "@/components/RoleImage";
import type { Role } from "@/lib/roles";

interface Props {
  role: Role;
  label?: string;
  compact?: boolean;
}

export function RoleCard({ role, label, compact }: Props) {
  return (
    <div className="card-pop p-6 flex flex-col gap-4">
      {label && <span className="sticker self-start">{label}</span>}
      <div className="grid gap-4 sm:grid-cols-[120px_minmax(0,1fr)] sm:items-center">
        <div className="rounded-[1.25rem] border-2 border-[var(--ink)] bg-secondary p-3 flex items-center justify-center">
          <RoleImage roleId={role.id} className="h-24 w-24 sm:h-28 sm:w-28 object-contain" />
        </div>
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={[
              "w-14 h-14 rounded-full border-2 border-[var(--ink)] flex items-center justify-center text-xl font-black shadow-[3px_3px_0_0_var(--ink)] shrink-0",
              role.accent === "orange"
                ? "bg-primary text-primary-foreground"
                : "bg-accent text-accent-foreground",
            ].join(" ")}
            aria-hidden
          >
            {role.id}
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground font-semibold">
              {role.groupLabel}
            </div>
            <h3 className="text-2xl font-extrabold leading-tight break-words">{role.name}</h3>
          </div>
        </div>
      </div>
      <p className="font-semibold text-foreground/90 italic">"{role.tagline}"</p>
      {!compact && (
        <p className="text-sm text-foreground/80 leading-relaxed">
          {role.description}
        </p>
      )}
    </div>
  );
}

