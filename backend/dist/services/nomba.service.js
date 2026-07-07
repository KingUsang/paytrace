"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.NombaService = void 0;
const crypto = __importStar(require("crypto"));
class NombaService {
    /**
     * Authenticates with Nomba via Client Credentials to get a Bearer token.
     * Caches the token in memory until it expires.
     */
    static async getAccessToken() {
        if (this.accessToken && Date.now() < this.tokenExpiresAt) {
            return this.accessToken;
        }
        const clientId = process.env.NOMBA_CLIENT_ID;
        const clientSecret = process.env.NOMBA_CLIENT_SECRET;
        const accountId = process.env.NOMBA_ACCOUNT_ID;
        if (!clientId || !clientSecret || !accountId) {
            throw new Error("Nomba credentials not found in environment variables");
        }
        // Nomba uses v1/auth/token/3 for OAuth Client Credentials
        const response = await fetch('https://api.nomba.com/v1/auth/token/3', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accountId': accountId
            },
            body: JSON.stringify({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret
            })
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed to authenticate with Nomba: ${err}`);
        }
        const data = await response.json();
        this.accessToken = data.data.access_token;
        // Assume token is valid for the provided seconds, subtract 5 mins (300000ms) for safe buffer
        this.tokenExpiresAt = Date.now() + (data.data.expires_in * 1000) - 300000;
        return this.accessToken;
    }
    /**
     * Provisions a real Nomba Virtual Account for receiving payments.
     */
    static async createVirtualAccount(accountRef, accountName, bvn) {
        console.log(`[Nomba] Creating real VA for ${accountName} (Ref: ${accountRef})`);
        const token = await this.getAccessToken();
        const accountId = process.env.NOMBA_ACCOUNT_ID;
        const body = {
            accountRef,
            accountName,
            currency: "NGN"
        };
        // If a BVN is provided, it can be passed for higher KYC limits
        if (bvn) {
            body.bvn = bvn;
        }
        const response = await fetch('https://api.nomba.com/v1/accounts/virtual', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'accountId': accountId,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!response.ok) {
            const err = await response.text();
            throw new Error(`Failed to create Nomba virtual account: ${err}`);
        }
        const data = await response.json();
        return {
            virtualAccountId: data.data.accountId,
            accountNumber: data.data.accountNumber
        };
    }
    /**
     * Validates a webhook signature from Nomba using HMAC SHA512.
     * Nomba sends a "nomba-signature" header which is an HMAC of the raw payload using your Client Secret.
     */
    static validateWebhookSignature(payload, signature) {
        const clientSecret = process.env.NOMBA_CLIENT_SECRET;
        if (!clientSecret) {
            console.warn("[Nomba] Warning: NOMBA_CLIENT_SECRET is missing, cannot validate webhook securely.");
            return false;
        }
        const hash = crypto.createHmac('sha512', clientSecret).update(payload).digest('hex');
        // In production, we should use timingSafeEqual, but strict equality is fine for hackathon
        return hash === signature;
    }
    /**
     * Performs an attestation debit (Simulated for Hackathon scope).
     */
    static async performAttestationDebit(subAccountId, targetVaId, amount) {
        console.log(`[Nomba] Performing attestation debit of ${amount} from ${subAccountId} to ${targetVaId}`);
        await new Promise(resolve => setTimeout(resolve, 500));
        return `tx_${crypto.randomUUID().split('-')[0]}`;
    }
}
exports.NombaService = NombaService;
NombaService.accessToken = null;
NombaService.tokenExpiresAt = 0;
