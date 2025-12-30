/**
 * Signature utilities for Zalo OA webhook
 *
 * Generates SHA256 HMAC signature for webhook requests.
 * This is the client-side version used by the frontend.
 */

/**
 * Generates SHA256 signature for Zalo OA webhook
 *
 * Algorithm: sha256(appId + data + timestamp + secretKey)
 * Note: Using Web Crypto API for browser compatibility
 *
 * @param {string} appId - Application ID
 * @param {string} data - Request body as JSON string
 * @param {string} timestamp - Request timestamp as string
 * @param {string} secretKey - OA secret key
 * @returns {Promise<string>} The generated signature in format "sha256(hexDigest)"
 */
export async function generateSignature(appId, data, timestamp, secretKey) {
  // Concatenate components according to Zalo OA spec
  const signatureData = appId + data + timestamp + secretKey;

  // Encode the data as UTF-8 bytes
  const encoder = new TextEncoder();
  const dataBytes = encoder.encode(signatureData);

  // Generate SHA-256 hash using Web Crypto API
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBytes);

  // Convert buffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

  // Return in format "sha256(hexDigest)"
  return `sha256(${hashHex})`;
}

/**
 * Simple synchronous version using Node.js crypto
 * For use in backend or testing environments
 *
 * @param {string} appId - Application ID
 * @param {string} data - Request body as JSON string
 * @param {string} timestamp - Request timestamp as string
 * @param {string} secretKey - OA secret key
 * @returns {string} The generated signature in format "sha256(hexDigest)"
 */
export function generateSignatureSync(appId, data, timestamp, secretKey) {
  // This is for Node.js environments only
  // In browser, use the async version above
  const crypto = require('crypto');
  const signatureData = appId + data + timestamp + secretKey;
  const hash = crypto.createHash('sha256').update(signatureData, 'utf8').digest('hex');
  return `sha256(${hash})`;
}
