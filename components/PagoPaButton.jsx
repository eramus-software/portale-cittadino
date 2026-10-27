import Image from "next/image";
import styles from "../styles/PagoPaButton.module.css";

// Bottone di pagamento con il solo logo pagoPA (il testo resta per gli screen reader)
export default function PagoPaButton({ onClick, disabled, loading, small, className = "" }) {
  const altezza = small ? 17 : 26;
  return (
    <button
      type="button"
      className={`${styles.btn} ${small ? styles.small : ""} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
    >
      {loading ? (
        <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      ) : (
        <Image src="/pagoPA.png" alt="" width={Math.round((altezza * 700) / 460)} height={altezza} />
      )}
      <span className="sr-only">{loading ? "Attendere…" : "Paga con pagoPA"}</span>
    </button>
  );
}
