import type { Role } from "@/lib/roles";

interface Props {
  role: Role;
  label?: string;
  compact?: boolean;
}

export function RoleCard({ role, label, compact }: Props) {
  return (
    <div className="card-pop p-6 flex flex-col gap-3">
      {label && <span className="sticker self-start">{label}</span>}
      <div className="flex items-center gap-3">
        <div
          className={[
            "w-16 h-16 rounded-full border-2 border-[var(--ink)] flex items-center justify-center text-2xl font-black shadow-[3px_3px_0_0_var(--ink)]",
            role.accent === "orange"
              ? "bg-primary text-primary-foreground"
              : "bg-accent text-accent-foreground",
          ].join(" ")}
          aria-hidden
        >
          {role.id}
        </div>
        <div>
          <div className="text-xs text-muted-foreground font-semibold">
            {role.groupLabel}
          </div>
          <h3 className="text-2xl font-extrabold leading-tight">{role.name}</h3>
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
