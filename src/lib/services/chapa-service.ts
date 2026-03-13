/**
 * Service to handle Chapa payment integration.
 */
export class ChapaService {
    private static baseUrl = 'https://api.chapa.co/v1';
    private static secretKey = process.env.CHAPA_SECRET_KEY;

    /**
     * Initialize a transaction with Chapa.
     */
    static async initializeTransaction(data: {
        amount: number;
        currency: string;
        email: string;
        first_name: string;
        last_name: string;
        tx_ref: string;
        callback_url: string;
        return_url: string;
        customization?: {
            title?: string;
            description?: string;
        }
    }) {
        if (!this.secretKey) {
            console.error('CHAPA_SECRET_KEY is NOT set in environment variables');
            // Mock response for development if key is missing
            return {
                status: 'success',
                message: 'Mock initialization',
                data: {
                    checkout_url: data.return_url + '?tx_ref=' + data.tx_ref
                }
            };
        }

        const response = await fetch(`${this.baseUrl}/transaction/initialize`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.secretKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        return await response.json();
    }

    /**
     * Verify a transaction status.
     */
    static async verifyTransaction(txRef: string) {
        if (!this.secretKey) {
            console.warn('CHAPA_SECRET_KEY is NOT set. Returning mock verification.');
            return {
                status: 'success',
                message: 'Mock verification successful',
                data: {
                    status: 'success',
                    currency: 'ETB',
                    tx_ref: txRef
                }
            };
        }

        const response = await fetch(`${this.baseUrl}/transaction/verify/${txRef}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${this.secretKey}`
            }
        });

        return await response.json();
    }
}
