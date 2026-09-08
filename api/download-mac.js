import handler from './download.js';
export default function(req, res) {
  if (!req.query) req.query = {};
  req.query.os = 'mac';
  return handler(req, res);
}
