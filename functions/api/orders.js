export async function onRequest(context) {
  const { request } = context;
  
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (request.method === 'POST') {
    try {
      const body = await request.json();
      const orderData = body.order;
      
      // Log the order (in production, you'd save this to a database)
      console.log('Order received:', orderData);
      
      return new Response(JSON.stringify({ message: 'Order received!' }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid request body' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }

  return new Response('Method not allowed', { 
    status: 405,
    headers: corsHeaders 
  });
} 