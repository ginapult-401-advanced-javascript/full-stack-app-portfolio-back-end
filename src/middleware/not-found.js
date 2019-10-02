module.exports = (request, response) => {
  response.status(404);
  response.statusMessage = 'Resource Not Found';
  response.json({ error: 'Not Found' });
};