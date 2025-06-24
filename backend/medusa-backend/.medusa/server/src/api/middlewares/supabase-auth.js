"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateSupabaseUser = authenticateSupabaseUser;
exports.optionalSupabaseAuth = optionalSupabaseAuth;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("../../utils/supabase/client");
// Helper function to extract bearer token
function extractBearerToken(authorization) {
    if (!authorization)
        return null;
    const parts = authorization.split(' ');
    if (parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
        return parts[1];
    }
    return null;
}
// Middleware to verify Supabase JWT tokens
async function authenticateSupabaseUser(req, res, next) {
    try {
        const token = extractBearerToken(req.headers.authorization);
        if (!token) {
            return res.status(401).json({ error: 'No authorization token provided' });
        }
        // Verify JWT signature
        const jwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!jwtSecret) {
            console.error('SUPABASE_JWT_SECRET not configured');
            return res.status(500).json({ error: 'Authentication not configured' });
        }
        // Decode and verify the JWT
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        // Get user from Supabase to ensure they still exist
        const { data: { user }, error } = await client_1.supabaseAdmin.auth.admin.getUserById(decoded.sub);
        if (error || !user) {
            return res.status(401).json({ error: 'Invalid or expired token' });
        }
        // Attach user to request
        req.supabaseUser = {
            id: user.id,
            email: user.email,
            user_metadata: user.user_metadata
        };
        // Try to link with Medusa customer if email matches
        if (user.email) {
            const customerService = req.scope.resolve("customer");
            try {
                const customer = await customerService.retrieveByEmail(user.email);
                if (customer) {
                    req.customer = customer(req).customer_id = customer.id;
                }
            }
            catch (e) {
                // Customer doesn't exist yet, that's ok
            }
        }
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}
// Optional authentication - doesn't fail if no token
async function optionalSupabaseAuth(req, res, next) {
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
        return next();
    }
    try {
        const jwtSecret = process.env.SUPABASE_JWT_SECRET;
        if (!jwtSecret) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        const { data: { user } } = await client_1.supabaseAdmin.auth.admin.getUserById(decoded.sub);
        if (user) {
            req.supabaseUser = {
                id: user.id,
                email: user.email,
                user_metadata: user.user_metadata
            };
            // Try to link with Medusa customer
            if (user.email) {
                const customerService = req.scope.resolve("customer");
                try {
                    const customer = await customerService.retrieveByEmail(user.email);
                    if (customer) {
                        req.customer = customer(req).customer_id = customer.id;
                    }
                }
                catch (e) {
                    // Ignore
                }
            }
        }
    }
    catch (error) {
        // Ignore errors in optional auth
    }
    next();
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VwYWJhc2UtYXV0aC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9hcGkvbWlkZGxld2FyZXMvc3VwYWJhc2UtYXV0aC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQTBCQSw0REF1REM7QUFHRCxvREE4Q0M7QUFoSUQsZ0VBQThCO0FBQzlCLHdEQUEyRDtBQVkzRCwwQ0FBMEM7QUFDMUMsU0FBUyxrQkFBa0IsQ0FBQyxhQUFzQjtJQUNoRCxJQUFJLENBQUMsYUFBYTtRQUFFLE9BQU8sSUFBSSxDQUFBO0lBQy9CLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDdEMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssUUFBUSxFQUFFLENBQUM7UUFDOUQsT0FBTyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDakIsQ0FBQztJQUNELE9BQU8sSUFBSSxDQUFBO0FBQ2IsQ0FBQztBQUVELDJDQUEyQztBQUNwQyxLQUFLLFVBQVUsd0JBQXdCLENBQzVDLEdBQWtCLEVBQ2xCLEdBQW1CLEVBQ25CLElBQWtCO0lBRWxCLElBQUksQ0FBQztRQUNILE1BQU0sS0FBSyxHQUFHLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7UUFFM0QsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1gsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLEtBQUssRUFBRSxpQ0FBaUMsRUFBRSxDQUFDLENBQUE7UUFDM0UsQ0FBQztRQUVELHVCQUF1QjtRQUN2QixNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQixDQUFBO1FBQ2pELElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztZQUNm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