import { describe, expect, it } from 'vitest';
import {
  buildAuthorizeUrl,
  buildDiscoveryUrl,
  buildEndSessionUrl,
  generatePkcePair,
  generateState,
} from '../oidcClient';

describe('oidcClient', () => {
  it('buildDiscoveryUrl: issuer -> well-known url', () => {
    expect(buildDiscoveryUrl('https://idp.example.com')).toBe(
      'https://idp.example.com/.well-known/openid-configuration',
    );
    expect(buildDiscoveryUrl('https://idp.example.com/')).toBe(
      'https://idp.example.com/.well-known/openid-configuration',
    );
  });

  it('buildDiscoveryUrl: keep discovery url intact', () => {
    expect(buildDiscoveryUrl('https://idp.example.com/.well-known/openid-configuration')).toBe(
      'https://idp.example.com/.well-known/openid-configuration',
    );
  });

  it('generateState returns base64url-ish string', () => {
    const s = generateState();
    expect(s).toBeTypeOf('string');
    expect(s.length).toBeGreaterThan(10);
    expect(s).not.toMatch(/[=]/);
  });

  it('generatePkcePair returns verifier/challenge/method', async () => {
    const pkce = await generatePkcePair();
    expect(pkce.verifier).toBeTypeOf('string');
    expect(pkce.challenge).toBeTypeOf('string');
    expect(pkce.method === 'S256' || pkce.method === 'plain').toBe(true);
    expect(pkce.verifier.length).toBeGreaterThanOrEqual(20);
    expect(pkce.challenge.length).toBeGreaterThanOrEqual(20);

    if (pkce.method === 'S256') {
      expect(pkce.challenge).not.toBe(pkce.verifier);
    }
  });

  it('buildAuthorizeUrl encodes params', () => {
    const url = buildAuthorizeUrl('https://idp.example.com/authorize', {
      response_type: 'code',
      client_id: 'my client',
        redirect_uri: 'https://app.example.com/login',
      scope: 'openid profile',
      state: 'abc',
    });

    expect(url).toContain('https://idp.example.com/authorize?');
    expect(url).toContain('response_type=code');
    expect(url).toContain('client_id=my+client');
    expect(url).toContain('scope=openid+profile');
  });

  it('buildEndSessionUrl encodes params', () => {
    const url = buildEndSessionUrl('https://idp.example.com/logout', {
      post_logout_redirect_uri: 'https://app.example.com/login?x=1',
      id_token_hint: 'a b',
    });

    expect(url).toContain('https://idp.example.com/logout?');
    expect(url).toContain('post_logout_redirect_uri=https%3A%2F%2Fapp.example.com%2Flogin%3Fx%3D1');
    expect(url).toContain('id_token_hint=a+b');
  });
});
