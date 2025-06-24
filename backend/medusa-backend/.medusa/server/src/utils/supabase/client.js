"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabaseAdmin = exports.supabase = void 0;
exports.verifySupabaseToken = verifySupabaseToken;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
    console.warn('Supabase environment variables not configured');
}
// Public client for frontend operations
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl || '', supabaseAnonKey || '', {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});
// Admin client for backend operations
exports.supabaseAdmin = (0, supabase_js_1.createClient)(supabaseUrl || '', supabaseServiceKey || '', {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
// Helper to verify JWT tokens
async function verifySupabaseToken(token) {
    try {
        const { data: { user }, error } = await exports.supabaseAdmin.auth.getUser(token);
        if (error)
            throw error;
        return user;
    }
    catch (error) {
        console.error('Failed to verify Supabase token:', error);
        return null;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL3V0aWxzL3N1cGFiYXNlL2NsaWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFvQ0Esa0RBU0M7QUE3Q0QsdURBQW9EO0FBRXBELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFBO0FBQzVDLE1BQU0sZUFBZSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUE7QUFDckQsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLG9CQUFvQixDQUFBO0FBRTNELElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxlQUFlLElBQUksQ0FBQyxrQkFBa0IsRUFBRSxDQUFDO0lBQzVELE9BQU8sQ0FBQyxJQUFJLENBQUMsK0NBQStDLENBQUMsQ0FBQTtBQUMvRCxDQUFDO0FBRUQsd0NBQXdDO0FBQzNCLFFBQUEsUUFBUSxHQUFHLElBQUEsMEJBQVksRUFDbEMsV0FBVyxJQUFJLEVBQUUsRUFDakIsZUFBZSxJQUFJLEVBQUUsRUFDckI7SUFDRSxJQUFJLEVBQUU7UUFDSixnQkFBZ0IsRUFBRSxJQUFJO1FBQ3RCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLGtCQUFrQixFQUFFLElBQUk7S0FDekI7Q0FDRixDQUNGLENBQUE7QUFFRCxzQ0FBc0M7QUFDekIsUUFBQSxhQUFhLEdBQUcsSUFBQSwwQkFBWSxFQUN2QyxXQUFXLElBQUksRUFBRSxFQUNqQixrQkFBa0IsSUFBSSxFQUFFLEVBQ3hCO0lBQ0UsSUFBSSxFQUFFO1FBQ0osZ0JBQWdCLEVBQUUsS0FBSztRQUN2QixjQUFjLEVBQUUsS0FBSztLQUN0QjtDQUNGLENBQ0YsQ0FBQTtBQUVELDhCQUE4QjtBQUN2QixLQUFLLFVBQVUsbUJBQW1CLENBQUMsS0FBYTtJQUNyRCxJQUFJLENBQUM7UUFDSCxNQUFNLEVBQUUsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQUUsS0FBSyxFQUFFLEdBQUcsTUFBTSxxQkFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDekUsSUFBSSxLQUFLO1lBQUUsTUFBTSxLQUFLLENBQUE7UUFDdEIsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDeEQsT0FBTyxJQUFJLENBQUE7SUFDYixDQUFDO0FBQ0gsQ0FBQyJ9