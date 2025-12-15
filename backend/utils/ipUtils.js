
export const normalizeIp = (ip) => {
  if (!ip) return '';
  if (ip.startsWith('::ffff:')) return ip.replace('::ffff:', '');
  if (ip === '::1') return '127.0.0.1';
  return ip;
};

export const getClientIpFromReq = (req) => {

  
  if (!req || !req.headers) {
    console.warn('getClientIpFromReq called without a valid req object');
    return '';
  }
  
  const xff = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'];
  let ip = '';
  if (xff) {
    ip = String(xff).split(',')[0].trim();
  } else if (req.ip) {
    ip = req.ip;
  } else if (req.socket?.remoteAddress) {
    ip = req.socket.remoteAddress;
  }
  return normalizeIp(ip);
};




// 1. How X-Forwarded-For works behind reverse proxies

// When your app is running behind a reverse proxy (Nginx, Cloudflare, AWS ALB, Azure Front Door), the client does not connect to your server directly.

// Instead:

// Client → Reverse Proxy → Your Server

// Problem

// Your server sees only the proxy’s IP, not the real client IP.

// Solution

// Reverse proxies add a special header:

// X-Forwarded-For: <client-ip>, <proxy-ip>, <another-proxy-ip>...


// The first IP in the list is the real user IP.

// Example:

// X-Forwarded-For: 106.78.99.66, 172.68.22.11


// 106.78.99.66 → real client (your hotspot)

// 172.68.22.11 → Cloudflare edge proxy

// Your backend should extract the first IP.

// That is exactly what your function does:

// String(xff).split(',')[0].trim()





// 3. So why not use the reverse-proxy IP?

// Because the reverse-proxy IP belongs to the proxy, not to the user.

// Reverse proxy = middleman
// Client IP = actual person

// The reverse proxy behaves like a “mask”.
// If you only use the mask, your application:

// ❌ loses security
// ❌ loses logging
// ❌ loses geo-location
// ❌ cannot rate-limit
// ❌ cannot detect attackers
// ❌ cannot track unique users

// That's why every web server behind a reverse proxy must extract:

// X-Forwarded-For → first IP = real client

// 4. So what does your code achieve?

// Your code ensures:

// ✔ You get the actual user IP, not Cloudflare/Nginx/AWS IP
// ✔ Correct IP for logging
// ✔ Correct IP for rate limiting
// ✔ Correct IP for geo-location
// ✔ Correct IP for security checks
// ✔ Correct IP even if IPv6-mapped (::ffff:)

// This is the standard way all modern apps handle client IPs.