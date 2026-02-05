/**
 * Vercel Serverless Function: Create ChatKit Session
 * 
 * Exchanges a workflow ID for a ChatKit client secret by calling the OpenAI API.
 * This is a Node.js replacement of the Python FastAPI backend to work with Vercel.
 */

const CHATKIT_API_BASE = process.env.CHATKIT_API_BASE || 'https://api.openai.com';
const SESSION_COOKIE_NAME = 'chatkit_session_id';
const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

/**
 * Serverless function handler
 */
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight OPTIONS request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only accept POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Missing OPENAI_API_KEY environment variable' });
    }

    // Get workflow ID from request body or environment
    const workflowId = resolveWorkflowId(req.body);
    if (!workflowId) {
        return res.status(400).json({ error: 'Missing workflow ID' });
    }

    // Resolve or create user ID from cookies
    const { userId, cookieValue } = resolveUser(req.cookies);

    try {
        // Call OpenAI ChatKit API to create session
        const response = await fetch(`${CHATKIT_API_BASE}/v1/chatkit/sessions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'OpenAI-Beta': 'chatkit_beta=v1',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                workflow: { id: workflowId },
                user: userId,
            }),
        });

        const payload = await response.json().catch(() => ({}));

        // Handle non-success responses
        if (!response.ok) {
            const message = payload.error || 'Failed to create session';
            respondWithCookie(res, { error: message }, response.status, cookieValue);
            return;
        }

        // Extract client secret
        const clientSecret = payload.client_secret;
        const expiresAfter = payload.expires_after;

        if (!clientSecret) {
            respondWithCookie(res, { error: 'Missing client secret in response' }, 502, cookieValue);
            return;
        }

        // Return successful response with cookie
        respondWithCookie(
            res,
            { client_secret: clientSecret, expires_after: expiresAfter },
            200,
            cookieValue
        );
    } catch (error) {
        console.error('ChatKit API Error:', error);
        respondWithCookie(
            res,
            { error: `Failed to reach ChatKit API: ${error.message}` },
            502,
            cookieValue
        );
    }
}

/**
 * Resolve workflow ID from request body or environment variables
 */
function resolveWorkflowId(body) {
    if (!body) return getEnvWorkflowId();

    // Check body.workflow.id
    if (body.workflow && typeof body.workflow === 'object' && body.workflow.id) {
        return body.workflow.id.trim();
    }

    // Check body.workflowId
    if (body.workflowId && typeof body.workflowId === 'string') {
        return body.workflowId.trim();
    }

    // Fallback to environment variable
    return getEnvWorkflowId();
}

/**
 * Get workflow ID from environment variables
 */
function getEnvWorkflowId() {
    const envWorkflow =
        process.env.CHATKIT_WORKFLOW_ID ||
        process.env.VITE_CHATKIT_WORKFLOW_ID ||
        '';

    return envWorkflow.trim() || null;
}

/**
 * Resolve user ID from cookies or generate a new one
 */
function resolveUser(cookies = {}) {
    const existing = cookies[SESSION_COOKIE_NAME];

    if (existing) {
        return { userId: existing, cookieValue: null };
    }

    // Generate new user ID
    const userId = generateUUID();
    return { userId, cookieValue: userId };
}

/**
 * Send response with optional cookie
 */
function respondWithCookie(res, payload, statusCode, cookieValue) {
    if (cookieValue) {
        const isProduction = process.env.NODE_ENV === 'production' || process.env.ENVIRONMENT === 'production';

        res.setHeader(
            'Set-Cookie',
            `${SESSION_COOKIE_NAME}=${cookieValue}; Max-Age=${SESSION_COOKIE_MAX_AGE_SECONDS}; Path=/; HttpOnly; SameSite=Lax${isProduction ? '; Secure' : ''}`
        );
    }

    res.status(statusCode).json(payload);
}

/**
 * Generate a UUID v4
 */
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
