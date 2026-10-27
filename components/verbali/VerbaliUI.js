import {
  ArrowLeft,
  ChevronRight,
  ExclamationTriangle,
  Inbox,
  InfoCircle,
} from "react-bootstrap-icons";
import moment from "moment";
import styles from "../../styles/Verbali.module.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const isEmpty = (value) =>
  value === null || value === undefined || String(value).trim() === "";

export const formatDate = (value, format = "DD/MM/YYYY") => {
  if (!value) return "";
  const m = moment(value);
  return m.isValid() ? m.format(format) : "";
};

export const formatEuro = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const num = Number(value);
  if (!Number.isFinite(num)) return "";
  return `€ ${num.toLocaleString("it-IT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// Deduce il tono del badge dalla descrizione dello stato
export function statusTone(label) {
  const s = (label || "").toString().toUpperCase();
  if (!s) return "neutral";
  if (/PAGAT|CHIUS|DEFINIT|ESTINT/.test(s)) return "success";
  if (/ANNULL|ARCHIVI|SOSPES/.test(s)) return "neutral";
  if (/RATEIZZ/.test(s)) return "info";
  if (/RUOLO|INSOLUT|SCADUT|RICORS|CONTEST/.test(s)) return "danger";
  if (/NOTIFIC|ATTESA|APERT|DA PAGARE|EMESS|INSERIT/.test(s)) return "warning";
  return "info";
}

const toneClass = {
  success: styles.statusSuccess,
  warning: styles.statusWarning,
  danger: styles.statusDanger,
  info: styles.statusInfo,
  neutral: styles.statusNeutral,
};

export function StatusBadge({ label, className }) {
  if (isEmpty(label)) return <span className={styles.infoValueEmpty}>—</span>;
  return (
    <span className={cx(styles.status, toneClass[statusTone(label)], className)}>
      {label}
    </span>
  );
}

export function Plate({ value }) {
  if (isEmpty(value)) return <span className={styles.infoValueEmpty}>—</span>;
  return <span className={styles.plate}>{value}</span>;
}

export function PageShell({ children }) {
  return <div className={cx("container", styles.page)}>{children}</div>;
}

export function PageHeader({ eyebrow, title, subtitle, aside }) {
  return (
    <div className={styles.pageHeader}>
      <div>
        {eyebrow ? <span className={styles.eyebrow}>{eyebrow}</span> : null}
        <h1 className={styles.pageTitle}>{title}</h1>
        {subtitle ? <p className={styles.pageSubtitle}>{subtitle}</p> : null}
      </div>
      {aside}
    </div>
  );
}

export function CfChip({ cf }) {
  return <span className={styles.cfChip}>CF {cf}</span>;
}

/**
 * Tabella risultati.
 * columns: [{ key, label, render?(row), className? }]
 * rows: array di oggetti; getKey(row, i); onOpen(row); canOpen(row)
 */
export function ResultsTable({
  title = "Risultati",
  columns,
  rows,
  loading,
  error,
  emptyTitle = "Nessun verbale trovato",
  emptyText,
  getKey,
  onOpen,
  canOpen = () => true,
}) {
  const list = Array.isArray(rows) ? rows : [];

  return (
    <div className={styles.card}>
      <div className={styles.cardToolbar}>
        <h2 className={styles.cardToolbarTitle}>
          {title}
          {!loading ? (
            <span className={styles.countBadge}>{list.length}</span>
          ) : null}
        </h2>
      </div>

      {error ? (
        <div className={styles.errorBanner} role="alert">
          <ExclamationTriangle className="flex-shrink-0 mt-1" />
          <span>{error}</span>
        </div>
      ) : null}

      {loading ? (
        <table className={styles.table} aria-busy="true">
          <tbody>
            {[0, 1, 2].map((i) => (
              <tr key={i} className={styles.skeletonRow}>
                {columns.map((c, j) => (
                  <td key={c.key}>
                    <span
                      className={styles.skeleton}
                      style={{ width: `${55 + ((i + j) % 3) * 15}%` }}
                    />
                  </td>
                ))}
                <td />
              </tr>
            ))}
          </tbody>
        </table>
      ) : list.length > 0 ? (
        <div className="table-responsive">
          <table className={cx(styles.table, styles.responsiveTable)}>
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} scope="col">
                    {c.label}
                  </th>
                ))}
                <th scope="col">
                  <span className="sr-only">Azioni</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {list.map((row, i) => {
                const enabled = canOpen(row);
                const open = () => enabled && onOpen && onOpen(row);
                return (
                  <tr
                    key={getKey ? getKey(row, i) : i}
                    className={enabled ? styles.clickableRow : undefined}
                    onClick={open}
                    tabIndex={enabled ? 0 : undefined}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        open();
                      }
                    }}
                  >
                    {columns.map((c) => (
                      <td key={c.key} data-label={c.label} className={c.className}>
                        {c.render ? c.render(row) : row[c.key] || "—"}
                      </td>
                    ))}
                    <td className={styles.cellEnd}>
                      <button
                        type="button"
                        className={styles.openBtn}
                        disabled={!enabled}
                        onClick={(e) => {
                          e.stopPropagation();
                          open();
                        }}
                      >
                        Apri <ChevronRight size={11} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : !error ? (
        <div className={styles.stateBox}>
          <span className={styles.stateIcon}>
            <Inbox size={18} />
          </span>
          <p className={styles.stateTitle}>{emptyTitle}</p>
          {emptyText ? <span>{emptyText}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

export function BackLink({ onClick, children = "Torna ai risultati" }) {
  return (
    <button type="button" className={styles.backLink} onClick={onClick}>
      <ArrowLeft /> {children}
    </button>
  );
}

// stats: [{ label, value }]
export function DetailHero({ eyebrow, title, subtitle, status, stats = [] }) {
  const visibleStats = stats.filter((s) => !isEmpty(s.value));
  return (
    <div className={styles.hero}>
      <div className={styles.heroTop}>
        <div>
          {eyebrow ? <div className={styles.heroEyebrow}>{eyebrow}</div> : null}
          <h1 className={styles.heroTitle}>{title || "—"}</h1>
          {subtitle ? <p className={styles.heroSubtitle}>{subtitle}</p> : null}
        </div>
        {!isEmpty(status) ? (
          <StatusBadge label={status} className={styles.heroStatus} />
        ) : null}
      </div>
      {visibleStats.length > 0 ? (
        <div className={styles.heroStats}>
          {visibleStats.map((s) => (
            <div key={s.label}>
              <div className={styles.heroStatLabel}>{s.label}</div>
              <div className={styles.heroStatValue}>{s.value}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function ActionBar({ children }) {
  return <div className={styles.actionBar}>{children}</div>;
}

export function EmailPrompt({ children }) {
  return (
    <div className={styles.emailPrompt} role="alert">
      {children}
    </div>
  );
}

export function SectionGrid({ children }) {
  return <div className={styles.sectionGrid}>{children}</div>;
}

export function Section({ icon: Icon, title, count, full, flush, children }) {
  return (
    <section className={cx(styles.card, styles.section, full && styles.full)}>
      <div className={styles.sectionHeader}>
        {Icon ? (
          <span className={styles.sectionIcon}>
            <Icon size={13} />
          </span>
        ) : null}
        <h2 className={styles.sectionTitle}>{title}</h2>
        {count ? <span className={styles.countBadge}>{count}</span> : null}
      </div>
      <div className={flush ? undefined : styles.sectionBody}>
        {children}
      </div>
    </section>
  );
}

export function SubBlock({ title, children }) {
  return (
    <div className={styles.subBlock}>
      {title ? <h3 className={styles.subBlockTitle}>{title}</h3> : null}
      {children}
    </div>
  );
}

// items: [{ label, value, mono?, full? }]
export function InfoGrid({ items }) {
  return (
    <dl className={styles.infoGrid}>
      {items.map((it) => (
        <div
          key={it.label}
          className={cx(styles.infoItem, it.full && styles.infoItemFull)}
        >
          <dt className={styles.infoLabel}>{it.label}</dt>
          <dd
            className={cx(
              styles.infoValue,
              it.mono && styles.cellMono,
              isEmpty(it.value) && styles.infoValueEmpty,
            )}
          >
            {isEmpty(it.value) ? "—" : it.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function EmptyNote({ children }) {
  return (
    <div className={styles.emptyNote}>
      <InfoCircle className="flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/**
 * Tabella compatta per elenchi all'interno di una sezione
 * (pagamenti, notifiche, ricorsi, agenti...).
 */
export function MiniTable({ columns, rows, empty }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    return (
      <div className={styles.sectionBody}>
        <EmptyNote>{empty}</EmptyNote>
      </div>
    );
  }
  return (
    <div className="table-responsive">
      <table className={cx(styles.table, styles.responsiveTable)}>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((c) => {
                const v = c.render ? c.render(row, i) : row[c.key];
                return (
                  <td key={c.key} data-label={c.label} className={c.className}>
                    {isEmpty(v) ? (
                      <span className={styles.infoValueEmpty}>—</span>
                    ) : (
                      v
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// chips: [{ label, value, warn? }]
export function Violation({ index, description, chips = [] }) {
  return (
    <div className={styles.violation}>
      <span className={styles.violationIndex}>{index}</span>
      <div>
        <p className={styles.violationText}>
          {isEmpty(description) ? "Descrizione non disponibile" : description}
        </p>
        <div className={styles.chips}>
          {chips
            .filter((c) => !isEmpty(c.value))
            .map((c) => (
              <span
                key={c.label}
                className={cx(styles.chip, c.warn && styles.chipWarn)}
              >
                <span>{c.label}</span>
                <strong>{c.value}</strong>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

// tiles: [{ label, value, accent? }]
export function Totals({ tiles }) {
  return (
    <div className={styles.totals}>
      {tiles.map((t) => (
        <div
          key={t.label}
          className={cx(styles.totalTile, t.accent && styles.totalTileAccent)}
        >
          <div className={styles.totalLabel}>{t.label}</div>
          <div className={styles.totalValue}>{isEmpty(t.value) ? "—" : t.value}</div>
        </div>
      ))}
    </div>
  );
}

// docs: [{ key, name, onClick }]
export function DocumentList({ docs, icon: Icon, actionIcon: ActionIcon }) {
  return (
    <div className={styles.docList}>
      {docs.map((d) => (
        <button
          key={d.key}
          type="button"
          className={styles.docItem}
          onClick={d.onClick}
          title={`Scarica ${d.name}`}
        >
          {Icon ? <Icon className={styles.docAction} size={14} /> : null}
          <span className={styles.docName}>{d.name}</span>
          {ActionIcon ? <ActionIcon className={styles.docAction} /> : null}
        </button>
      ))}
    </div>
  );
}

// Classi pulsante dell'area verbali: variant "primary" | "danger" | undefined (neutro)
export const btnCls = (variant) =>
  cx(
    styles.btn,
    variant === "primary" && styles.btnPrimary,
    variant === "danger" && styles.btnDanger,
  );

export function FooterActions({ children }) {
  return <div className={styles.footerActions}>{children}</div>;
}

export const verbaliStyles = styles;
