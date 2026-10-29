// Native form controls styled as the design's chips, segmented controls, rating scales and switches.
// They post with the surrounding <form>, so server actions receive plain FormData.

type Option = string | { value: string; label: string };
const opt = (o: Option) => (typeof o === "string" ? { value: o, label: o } : o);

export function FieldError({ message }: { message?: string }) {
  return message ? <p className="ui-error" role="alert">{message}</p> : null;
}

export function ChoiceGroup({ legend, name, options, value, multiple, variant = "chips", error, required }: {
  legend: string;
  name: string;
  options: readonly Option[];
  value?: string | readonly string[] | null;
  multiple?: boolean;
  variant?: "chips" | "seg";
  error?: string;
  required?: boolean;
}) {
  const selected = new Set(Array.isArray(value) ? value : value ? [value] : []);
  return (
    <fieldset className={variant === "seg" ? "ui-seg" : "ui-chips"} aria-invalid={error ? true : undefined}>
      <legend>{legend}</legend>
      <div>
        {options.map(opt).map((o) => (
          <label className="ui-choice" key={o.value}>
            <input type={multiple ? "checkbox" : "radio"} name={name} value={o.value} defaultChecked={selected.has(o.value)} required={required && !multiple} />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

export function RatingScale({ legend, name, value, low, high, max = 5, error, required }: {
  legend: string;
  name: string;
  value?: number | null;
  low: string;
  high: string;
  max?: 5 | 10;
  error?: string;
  required?: boolean;
}) {
  return (
    <fieldset className={`ui-scale${max === 10 ? " ui-scale-10" : ""}`}>
      <legend>{legend}</legend>
      <div>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
          <label className="ui-choice" key={n}>
            <input type="radio" name={name} value={n} defaultChecked={value === n} required={required} aria-label={`${legend} ${n} of ${max}`} />
            <span aria-hidden="true">{n}</span>
          </label>
        ))}
      </div>
      <div className="ui-scale-ends"><span>{low}</span><span>{high}</span></div>
      <FieldError message={error} />
    </fieldset>
  );
}

export function Switch({ name, label, hint, defaultChecked }: { name: string; label: string; hint?: string; defaultChecked?: boolean }) {
  return (
    <label className="ui-switch">
      <span>{label}{hint ? <small>{hint}</small> : null}</span>
      <input type="checkbox" role="switch" name={name} defaultChecked={defaultChecked} />
    </label>
  );
}

export function TextField({ label, optional, error, ...input }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; optional?: boolean; error?: string }) {
  return (
    <label className="ui-field">
      <span>{label}{optional ? <small> · optional</small> : null}</span>
      <input className="ui-input" aria-invalid={error ? true : undefined} {...input} />
      <FieldError message={error} />
    </label>
  );
}

export function TextArea({ label, optional, error, ...input }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; optional?: boolean; error?: string }) {
  return (
    <label className="ui-field">
      <span>{label}{optional ? <small> · optional</small> : null}</span>
      <textarea className="ui-input" aria-invalid={error ? true : undefined} {...input} />
      <FieldError message={error} />
    </label>
  );
}
