import type { ElementType, ReactNode } from "react";
import {
  labsColumnClassName,
  labsPageClassName,
} from "@/components/shared/sectionStyles";
import { cn } from "@/lib/utils";

interface LabsPageProps {
  labelledBy: string;
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

/** Casca de página do Labs: coluna alinhada, padding compacto, main preenche a viewport. */
export const LabsPage = ({
  labelledBy,
  children,
  as: Comp = "section",
  className,
}: LabsPageProps) => (
  <Comp
    className={cn(labsPageClassName, className)}
    aria-labelledby={labelledBy}
  >
    <div className="container mx-auto flex flex-1 flex-col px-6">
      <div className={labsColumnClassName}>{children}</div>
    </div>
  </Comp>
);
