const DEFAULT_BASE = "https://back.music-shop.uz";

function getFileUrl(req, pathOrFilename) {
  if (!pathOrFilename) return "";

  // If the value is already an absolute URL, return it unchanged
  if (
    typeof pathOrFilename === "string" &&
    /^https?:\/\//i.test(pathOrFilename)
  ) {
    return pathOrFilename;
  }

  // Prefer building URL from the incoming request (works for local dev and proxied setups)
  let base;
  try {
    if (req && typeof req.get === "function") {
      const proto =
        req.protocol ||
        (req.headers && req.headers["x-forwarded-proto"]) ||
        "http";
      const host = req.get("host");
      if (host) {
        base = `${proto.replace(/,.*/, "").replace(/\s+/g, "")}://${host}`;
      }
    }
  } catch (e) {
    base = undefined;
  }

  if (!base) {
    base = (process.env.BASE_URL || DEFAULT_BASE).replace(/\/$/, "");
  }

  let filename = pathOrFilename;
  if (typeof filename !== "string") return "";

  // normalize cases:
  // '/uploads/xyz.jpg' -> 'xyz.jpg'
  // 'uploads/xyz.jpg' -> 'xyz.jpg'
  // 'some/prefix/uploads/xyz.jpg' -> 'xyz.jpg'
  const uploadsIndex = filename.indexOf("/uploads/");
  if (uploadsIndex >= 0) {
    filename = filename.slice(uploadsIndex + "/uploads/".length);
  } else if (filename.startsWith("uploads/")) {
    filename = filename.slice("uploads/".length);
  }

  // strip leading slashes
  filename = filename.replace(/^\/+/, "");

  return `${base}/uploads/${encodeURIComponent(filename)}`;
}

module.exports = { getFileUrl };
