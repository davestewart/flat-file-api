module.exports = (req, res) => {
  res.set('Content-Type', 'text/json');
  return { data: req.originalUrl }
}
