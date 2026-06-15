import { Request } from 'express';

/** Express headers are string | string[] | undefined — normalize to a single value. */
function getHeader(req: Request, name: string): string | null {
  const value = req.headers[name];
  if (!value) return null;

  const header = Array.isArray(value) ? value[0] : value;
  return header.length > 0 ? header : null;
}

export function getClientIp(req: Request): string {
  const forwarded = getHeader(req, 'x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress ?? 'unknown';
}

export function getGeoFromRequest(req: Request): {
  country: string | null;
  city: string | null;
} {
  return {
    country: getHeader(req, 'cf-ipcountry') ?? getHeader(req, 'x-country'),
    city: getHeader(req, 'x-city'),
  };
}

export function getUserAgent(req: Request): string | null {
  return getHeader(req, 'user-agent');
}

export function getDeviceIdFromRequest(req: Request): string | null {
  return getHeader(req, 'x-device-id');
}
