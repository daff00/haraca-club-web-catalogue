import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client-side client (anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side admin client (service role — never expose to client)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

export const STORAGE_BUCKET = "haraca-media";

// Extract storage file path
export function extractStoragePath(url: string): string | null {
    try {
        const maker = `/object/public/${STORAGE_BUCKET}/`;
        const idx = url.indexOf(maker);
        if (idx === -1) return null;
        return url.slice(idx + maker.length);
    } catch {
        return null;
    }
}

// Delete image from supabase storage
export async function deleteFromStorage(url: string): Promise<void> {
    const path = extractStoragePath(url);
    if (!path) return;

    const { error } = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .remove([path]);

    if (error) {
        console.error("Failed to delete from storage: ", error.message);
    }
}

// Delete many file from supabase storage
export async function deleteMultipleFromStorage(urls: string[]): Promise<void> {
    
}