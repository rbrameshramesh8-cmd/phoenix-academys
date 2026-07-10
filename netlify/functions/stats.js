// netlify/functions/stats.js
exports.handler = async () => ({
  statusCode: 200,
  headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
  body: JSON.stringify({
    students: 5000, courses: 6, placementRate: 95,
    companies: 90, highestPackage: '6 LPA', avgPackage: '4.5 LPA', placed: 1200
  })
});
