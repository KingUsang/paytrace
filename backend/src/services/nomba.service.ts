import * as crypto from 'crypto';

export interface VirtualAccountResponse {
  virtualAccountId: string;
  accountNumber: string;
}

export class NombaService {
  private static accessToken: string | null = null;
  private static tokenExpiresAt: number = 0;

  /**
   * Authenticates with Nomba via Client Credentials to get a Bearer token.
   * Caches the token in memory until it expires.
   */
  private static async getAccessToken(): Promise<string> {
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
    
    return this.accessToken as string;
  }

  /**
   * Provisions a real Nomba Virtual Account for receiving payments.
   */
  static async createVirtualAccount(accountRef: string, accountName: string, bvn?: string): Promise<VirtualAccountResponse> {
    console.log(`[Nomba] Creating real VA for ${accountName} (Ref: ${accountRef})`);
    
    const token = await this.getAccessToken();
    const accountId = process.env.NOMBA_ACCOUNT_ID;

    const body: any = {
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
        'accountId': accountId as string,
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
  static validateWebhookSignature(payload: string, signature: string): boolean {
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
  static async performAttestationDebit(subAccountId: string, targetVaId: string, amount: number): Promise<string> {
    console.log(`[Nomba] Performing attestation debit of ${amount} from ${subAccountId} to ${targetVaId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    return `tx_${crypto.randomUUID().split('-')[0]}`;
  }
}
