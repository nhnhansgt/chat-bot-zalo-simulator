import crypto from 'crypto';

/**
 * Generates SHA256 HMAC signature for Zalo OA webhook
 *
 * Algorithm: sha256(appId + data + timestamp + OASecretKey)
 *
 * @param {string} appId - Application ID
 * @param {string} data - Request body as JSON string
 * @param {string} timestamp - Request timestamp
 * @param {string} secretKey - OA secret key
 * @returns {string} The generated signature in format "sha256(hexDigest)"
 */
export function generateSignature(appId, data, timestamp, secretKey) {
  // Concatenate components according to Zalo OA spec
  const signatureData = appId + data + timestamp + secretKey;

  // Generate SHA256 hash
  const hash = crypto.createHash('sha256').update(signatureData, 'utf8').digest('hex');

  // Return in format "sha256(hexDigest)"
  return `sha256(${hash})`;
}

/**
 * Verifies a signature against expected value
 *
 * @param {string} signature - The signature to verify (e.g., "sha256(abc123...)")
 * @param {string} appId - Application ID
 * @param {string} data - Request body as JSON string
 * @param {string} timestamp - Request timestamp
 * @param {string} secretKey - OA secret key
 * @returns {boolean} True if signature is valid
 */
export function verifySignature(signature, appId, data, timestamp, secretKey) {
  // Generate expected signature
  const expectedSignature = generateSignature(appId, data, timestamp, secretKey);

  // Compare with received signature using constant-time comparison
  // to prevent timing attacks
  try {
    // Extract hash from signature format "sha256(hexDigest)"
    const receivedHash = signature.replace(/^sha256\((.*)\)$/, '$1');
    const expectedHash = expectedSignature.replace(/^sha256\((.*)\)$/, '$1');

    // Use 'hex' encoding since SHA256 hashes are hex-encoded strings
    // Buffer.from with hex encoding will fail if string contains non-hex characters
    const receivedBuffer = Buffer.from(receivedHash, 'hex');
    const expectedBuffer = Buffer.from(expectedHash, 'hex');

    // timingSafeEqual throws if buffers are different lengths
    if (receivedBuffer.length !== expectedBuffer.length) {
      return false;
    }

    return crypto.timingSafeEqual(receivedBuffer, expectedBuffer);
  } catch (error) {
    // If signature format is invalid or contains non-hex characters, return false
    console.error('[verifySignature] Signature verification failed:', error.message);
    return false;
  }
}
