"use client";

import { useState } from "react";

// The design's gear chips (fins / wetsuit / weight) plus free text, stored in the dive's
// single `equipment` text column as "Fins: … · Wetsuit: … · Weight: … · other".
const GROUPS = [
  { key: "Fins", options: ["Carbon longblades", "Trainer bifins", "Monofin", "No fins"] },
  { key: "Wetsuit", options: ["3 mm open-cell", "5 mm two-piece", "Skin / none"] },
  { key: "Weight", options: ["2 kg", "4 kg", "6 kg", "8 kg"] },
] as const;
type GroupKey = (typeof GROUPS)[number]["key"];

function parse(value: string | null) {
  const picked: Partial<Record<GroupKey, string>> = {};
  const other: string[] = [];
  for (const part of (value ?? "").split(" · ").map((p) => p.trim()).filter(Boolean)) {
    const match = /^(Fins|Wetsuit|Weight): (.+)$/.exec(part);
    if (match) picked[match[1] as GroupKey] = match[2];
    else other.push(part);
  }
  return { picked, other: other.join(" · ") };
}

export default function EquipmentPicker({ defaultValue, error }: { defaultValue: string | null; error?: string }) {
  const initial = parse(defaultValue);
  const [picked, setPicked] = useState(initial.picked);
  const [other, setOther] = useState(initial.other);
  const value = [...GROUPS.flatMap((g) => (picked[g.key] ? [`${g.key}: ${picked[g.key]}`] : [])), other.trim()].filter(Boolean).join(" · ");

  return (
    <div className="ui-stack">
      <input type="hidden" name="equipment" value={value} />
      {GROUPS.map((group) => {
        // keep a previously saved value selectable even if it isn't a preset
        const options = picked[group.key] && !(group.options as readonly string[]).includes(picked[group.key]!) ? [...group.options, picked[group.key]!] : group.options;
        return (
          <fieldset className="ui-chips" key={group.key}>
            <legend>{group.key} <small className="ui-muted">· optional</small></legend>
            <div>
              {options.map((option) => (
                <label className="ui-choice" key={option}>
                  <input
                    type="checkbox"
                    checked={picked[group.key] === option}
                    onChange={(event) => setPicked((p) => ({ ...p, [group.key]: event.target.checked ? option : undefined }))}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </fieldset>
        );
      })}
      <label className="ui-field">
        <span>Other gear <small>· optional</small></span>
        <input className="ui-input" value={other} maxLength={300} onChange={(event) => setOther(event.target.value)} placeholder="e.g. lanyard, nose clip" />
      </label>
      {error ? <p className="ui-error" role="alert">{error}</p> : null}
    </div>
  );
}
