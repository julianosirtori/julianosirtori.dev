export const LOGO = [
  "     _       _ _                              _       _   _",
  "  __| |_   _| (_) __ _ _ __   ___    ___  ___(_)_ __ | |_(_)",
  " / _` | | | | | |/ _` | '_ \\ / _ \\  / __|/ __| | '__|| __| |",
  "| (_| | |_| | | | (_| | | | | (_) | \\__ \\ (__| | |   | |_| |",
  " \\__,_|\\__,_|_|_|\\__,_|_| |_|\\___/  |___/\\___|_|_|    \\__|_|",
  "                                         .dev playground",
];

export const COFFEE = [
  "        (   )",
  "         ) (",
  "        (   )",
  "       __.....__",
  "      .'  ___  '.",
  "     | .'     '. |",
  "     |.|       |.|",
  "     |.|       |.|___",
  "     |.|       |.|   '.",
  "     |.|       |.|    |",
  "     |.|_______|.|    |",
  "     |._________.|___.'",
  "      '._______.'",
];

export function cowsay(message: string): string[] {
  const width = Math.min(Math.max(message.length, 1), 40);
  const wrapped = wrap(message, width);
  const top = " " + "_".repeat(width + 2);
  const bottom = " " + "-".repeat(width + 2);
  const body = wrapped.map((row, i) => {
    const left =
      wrapped.length === 1
        ? "<"
        : i === 0
          ? "/"
          : i === wrapped.length - 1
            ? "\\"
            : "|";
    const right =
      wrapped.length === 1
        ? ">"
        : i === 0
          ? "\\"
          : i === wrapped.length - 1
            ? "/"
            : "|";
    return `${left} ${row.padEnd(width)} ${right}`;
  });
  return [
    top,
    ...body,
    bottom,
    "        \\   ^__^",
    "         \\  (oo)\\_______",
    "            (__)\\       )\\/\\",
    "                ||----w |",
    "                ||     ||",
  ];
}

function wrap(text: string, width: number): string[] {
  if (text.length <= width) return [text];
  const words = text.split(" ");
  const out: string[] = [];
  let current = "";
  for (const word of words) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= width) {
      current += " " + word;
    } else {
      out.push(current);
      current = word;
    }
  }
  if (current) out.push(current);
  return out;
}
