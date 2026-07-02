import * as crypto from 'crypto';

export interface VirtualAccountResponse {
  virtualAccountId: string;
  accountNumber: string;
}

export class NombaService {
  /**
   * Mocks provisioning a Virtual Account.
   * In 3 days, replace this with the real Nomba POST /v1/virtual-accounts endpoint.
   */
  static async createVirtualAccount(accountRef: string, accountName: string, bvn?: string): Promise<VirtualAccountResponse> {
    console.log(`[Mock Nomba] Creating VA for ${accountName} (Ref: ${accountRef}, BVN: ${bvn || 'N/A'})`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));

    return {
      virtualAccountId: `va_${crypto.randomUUID().split('-')[0]}`,
      accountNumber: `9${Math.floor(100000000 + Math.random() * 900000000)}` // Random 10 digit starting with 9
    };
  }

  /**
   * Mocks validating a webhook signature.
   */
  static validateWebhookSignature(payload: string, signature: string): boolean {
    console.log(`[Mock Nomba] Validating signature: ${signature}`);
    return true; // Always valid for mock
  }

  /**
   * Mocks a custody attestation debit transfer
   */
  static async performAttestationDebit(subAccountId: string, targetVaId: string, amount: number): Promise<string> {
    console.log(`[Mock Nomba] Performing attestation debit of ${amount} from ${subAccountId} to ${targetVaId}`);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return `tx_${crypto.randomUUID().split('-')[0]}`;
  }
}
