
import { readFile } from "node:fs/promises";
import path from "node:path";

async function loadEnvFile(
  filePath: string,
): Promise<Record<string, string>> {
  try {
    const file = await readFile(filePath, "utf8");

    return Object.fromEntries(
      file
        .split(/\r?\n/)
        .map((line) => line.trim())
        .filter((line) => line.length > 0 && !line.startsWith("#"))
        .map((line) => {
          const idx = line.indexOf("=");
          if (idx === -1) return ["", ""];

          const key = line.slice(0, idx).trim();
          let value = line.slice(idx + 1).trim();

          if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
          ) {
            value = value.slice(1, -1);
          }

          return [key, value];
        })
        .filter(([key]) => key.length > 0),
    );
  } catch {
    return {};
  }
}

function getEnvValue(
  name: string,
  env: Record<string, string>,
): string | undefined {
  return process.env[name] ?? env[name];
}

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

async function main(): Promise<number> {
  const fileEnv = await loadEnvFile(
    path.join(process.cwd(), ".env.local"),
  );

  const supabaseUrl =
    getEnvValue("NEXT_PUBLIC_SUPABASE_URL", fileEnv) ||
    getEnvValue("SUPABASE_URL", fileEnv);

  if (!supabaseUrl) {
    console.error("Missing Supabase URL.");
    return 1;
  }

  let healthUrl: string;

  try {
    const parsedUrl = new URL(supabaseUrl);

    if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
      throw new Error("Invalid URL protocol");
    }

    healthUrl = `${supabaseUrl.replace(/\/+$/, "")}/health`;
  } catch {
    console.error("Invalid Supabase URL.");
    return 1;
  }

  const supabaseAnonKey =
    getEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", fileEnv) ||
    getEnvValue("SUPABASE_ANON_KEY", fileEnv);

  const headers: Record<string, string> = {};

  if (supabaseAnonKey) {
    headers.apikey = supabaseAnonKey;
  }

  console.log("Pinging Supabase health endpoint:", healthUrl);

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    try {
      console.log(`Attempt ${attempt}/${maxRetries}`);

      const response = await fetch(healthUrl, {
        method: "GET",
        headers,
        signal: controller.signal,
      });

      const text = await response.text();

      if (response.ok) {
        console.log(
          `Supabase keep-alive succeeded (${response.status}).`,
        );

        if (text) {
          console.log("Response:", text);
        }

        return 0;
      }

      console.error(
        `Supabase returned HTTP ${response.status}:`,
        text,
      );

      if (response.status >= 400 && response.status < 500) {
        return 1;
      }
    } catch (error) {
      console.error(
        `Attempt ${attempt} failed:`,
        error instanceof Error ? error.message : error,
      );
    } finally {
      clearTimeout(timeout);
    }

    if (attempt < maxRetries) {
      console.log("Retrying in 10 seconds...");
      await sleep(10000);
    }
  }

  console.error("Supabase keep-alive failed after all retries.");
  return 1;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error("Unexpected error:", error);
    process.exitCode = 1;
  });
