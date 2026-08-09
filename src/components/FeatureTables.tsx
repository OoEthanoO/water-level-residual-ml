import { geospatialFeatures, temporalFeatures } from "@/lib/paper";

export function FeatureTables() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <FeatureColumn
        title="Temporal features"
        subtitle="Both models"
        color="var(--baseline)"
        soft="var(--baseline-soft)"
        items={temporalFeatures}
      />
      <FeatureColumn
        title="Geospatial features"
        subtitle="XGBoost only"
        color="var(--accent)"
        soft="var(--accent-soft)"
        items={geospatialFeatures}
      />
    </div>
  );
}

function FeatureColumn({
  title,
  subtitle,
  color,
  soft,
  items,
}: {
  title: string;
  subtitle: string;
  color: string;
  soft: string;
  items: readonly { name: string; desc: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border-base bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-border-base px-5 py-3.5">
        <h4 className="text-[0.92rem] font-semibold text-ink">{title}</h4>
        <span
          className="rounded-md px-2 py-0.5 text-[0.7rem] font-medium"
          style={{ color, background: soft }}
        >
          {subtitle}
        </span>
      </div>
      <ul className="divide-y divide-[color:var(--border)]">
        {items.map((f) => (
          <li
            key={f.name}
            className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-5 py-2.5 transition-colors hover:bg-surface-2"
          >
            <code className="num text-[0.8rem] font-medium text-ink">{f.name}</code>
            <span className="text-[0.8rem] text-muted">{f.desc}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
