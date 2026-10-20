export function deriveHomeInsight(overallFeelValues: number[]) {
  if (overallFeelValues.length < 3) return {
    title: "More logging needed",
    body: "Keep logging dives and training sessions to unlock descriptive patterns.",
  };
  const latest = overallFeelValues.slice(-3);
  const average = latest.reduce((sum, value) => sum + value, 0) / latest.length;
  return {
    title: "A first pattern is becoming visible",
    body: `Your latest ${latest.length} recorded overall-feel ratings average ${average.toFixed(1)}/5. This describes your entries; it does not explain what caused them.`,
  };
}
