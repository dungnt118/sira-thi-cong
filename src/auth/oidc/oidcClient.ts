/**
 * Một bản giả lập đơn giản cho oidcClient để tương thích với elsagaService logout.
 */
export async function fetchDiscovery(issuer: string): Promise<any> {
    try {
        const response = await fetch(`${issuer.replace(/\/$/, '')}/.well-known/openid-configuration`);
        if (!response.ok) {
            throw new Error(`Failed to fetch discovery from ${issuer}`);
        }
        return await response.json();
    } catch (error) {
        console.error('[oidcClient] fetchDiscovery error:', error);
        return {};
    }
}
