/**
 * Controlled search input.
 * @param {string}   value       - Current search string
 * @param {function} onChange    - Called with new string value on every keystroke
 * @param {string}   [placeholder]
 */
export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="input-group">
      <span className="input-group-text bg-white border-end-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search text-muted"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.156a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11" />
        </svg>
      </span>
      <input
        type="search"
        className="form-control border-start-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
      />
    </div>
  );
}
