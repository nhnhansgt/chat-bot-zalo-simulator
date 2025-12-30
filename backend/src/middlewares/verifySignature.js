import { verifySignature } from '../utils/signature.js';

/**
 * Express middleware for verifying Zalo OA webhook signature
 *
 * Checks the X-ZEvent-Signature header against the computed signature
 * from the request body. Returns 401 if signature is missing, 403 if invalid.
 *
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @param {import('express').NextFunction} next - Express next function
 */
export function verifySignatureMiddleware(req, res, next) {
  try {
    // Extract signature from header
    const signature = req.headers['x-zevent-signature'];

    // Check if signature header exists
    if (!signature) {
      return res.status(401).json({
        success: false,
        error: 'MISSING_SIGNATURE',
        message: 'X-ZEvent-Signature header is required',
      });
    }

    // Extract required fields from body
    const { app_id, timestamp } = req.body;

    // Validate required fields for signature verification
    if (!app_id) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required field: app_id',
      });
    }

    if (!timestamp) {
      return res.status(400).json({
        success: false,
        error: 'VALIDATION_ERROR',
        message: 'Missing required field: timestamp',
      });
    }

    // Get secret key from environment
    const secretKey = process.env.OA_SECRET_KEY;

    if (!secretKey) {
      console.error('[verifySignature] OA_SECRET_KEY not configured');
      return res.status(500).json({
        success: false,
        error: 'CONFIGURATION_ERROR',
        message: 'Server configuration error',
      });
    }

    // Convert body to JSON string for signature verification
    const data = JSON.stringify(req.body);

    // Verify signature
    const isValid = verifySignature(signature, app_id, data, timestamp, secretKey);

    if (!isValid) {
      console.warn('[verifySignature] Invalid signature received', {
        app_id,
        timestamp,
        signature: signature.substring(0, 20) + '...',
      });
      return res.status(403).json({
        success: false,
        error: 'INVALID_SIGNATURE',
        message: 'Signature verification failed',
      });
    }

    // Signature is valid, proceed to next middleware
    next();
  } catch (error) {
    console.error('[verifySignature] Verification error:', error);
    return res.status(500).json({
      success: false,
      error: 'VERIFICATION_ERROR',
      message: 'Signature verification failed',
    });
  }
}
