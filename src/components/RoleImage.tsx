import type { RoleId } from "@/lib/roles";
import { ROLE_IMAGES } from "@/lib/role-images";

interface Props {
  roleId: RoleId;
  alt?: string;
  className?: string;
}

export function RoleImage({ roleId, alt, className }: Props) {
  const image = ROLE_IMAGES[roleId];

  return (
    <img
      src={image.url}
      alt={alt ?? image.alt}
      loading="lazy"
      decoding="async"
      className={className ?? "h-32 w-32 object-contain"}
    />
  );
}
