import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadEnvFile(filePath: string): Promise<Record<string, string>> {
  try {
    const file = await readFile(filePath, "utf8");
    return Object.fromEntries(
      file
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
        .map((line) => {
          const idx = line.indexOf("=");
          const key = line.slice(0, idx).trim();
          let value = line.slice(idx + 1).trim();
          if (value.startsWith("\"") && value.endsWith("\"")) {
            value = value.slice(1, -1);
          }
          return [key, value];
        }),
    );
  } catch {
    return {};
  }
}

function getEnvValue(name: string, env: Record<string, string>): string | undefined {
  return env[name] ?? process.env[name];
}

async function main() {
  const fileEnv = await loadEnvFile(path.join(process.cwd(), ".env.local"));
  const supabaseUrl =
    getEnvValue("NEXT_PUBLIC_SUPABASE_URL", fileEnv) || getEnvValue("SUPABASE_URL", fileEnv);

  if (!supabaseUrl) {
    console.error("Missing Supabase URL. Set NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL.");
    process.exit(1);
  }

  const supabaseAnonKey = getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", fileEnv) ||
    getEnvValue("SUPABASE_ANON_KEY", fileEnv);

  const healthUrl = `${supabaseUrl.replace(/\/$/, "")}/health`;
  const headers: Record<string, string> = {};
  if (supabaseAnonKey) {
    headers["apikey"] = supabaseAnonKey;
  }

  console.log(`Pinging Supabase health endpoint: ${healthUrl}`);

  try {
    const response = await fetch(healthUrl, { method: "GET", headers });
    const text = await response.text();

    if (response.ok) {
      console.log(`Supabase keep-alive succeeded (${response.status}).`);
      if (text.length > 0) {
        console.log(`Response: ${text}`);
      }
      return 0;
    }

    console.error(`Supabase keep-alive failed (${response.status}).`);
    console.error(text);
    process.exitCode = 1;
    return 1;
  } catch (error) {
    console.error("Supabase keep-alive request failed:", error);
    process.exitCode = 1;
    return 1;
  }
}

main().catch((error) => {
  console.error("Unexpected error:", error);
  process.exitCode = 1;
});
