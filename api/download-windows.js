import handler from './download.js';
export default function(req, res) {
  if (!req.query) req.query = {};
  req.query.os = 'windows';
  return handler(req, res);
}
