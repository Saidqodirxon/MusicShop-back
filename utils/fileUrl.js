const DEFAULT_BASE = 'https://back.music-shop.uz';

function getFileUrl(_req, pathOrFilename) {
  if (!pathOrFilename) return '';
  const base = (process.env.BASE_URL || DEFAULT_BASE).replace(/\/$/, '');

  let filename = pathOrFilename;
  if (typeof filename !== 'string') return '';

  // normalize cases:
  // '/uploads/xyz.jpg' -> 'xyz.jpg'
  // 'uploads/xyz.jpg' -> 'xyz.jpg'
  // 'some/prefix/uploads/xyz.jpg' -> 'xyz.jpg'
  const uploadsIndex = filename.indexOf('/uploads/');
  if (uploadsIndex >= 0) {
    filename = filename.slice(uploadsIndex + '/uploads/'.length);
  } else if (filename.startsWith('uploads/')) {
    filename = filename.slice('uploads/'.length);
  }

  // strip leading slashes
  filename = filename.replace(/^\/+/, '');

  return `${base}/uploads/${encodeURIComponent(filename)}`;
}

module.exports = { getFileUrl };
