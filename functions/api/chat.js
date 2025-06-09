export async function onRequest(context) {
  const { request, env } = context;
  
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
      const { message } = body;
      
      if (!message) {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders
          }
        });
      }

      // Use the Gemini API key from environment variables
      const apiKey = env.GEMINI_API_KEY || 'AIzaSyA2tEzdpBIp9DEH1z5HCO1-dfS95gFUwY0';
      
      const prompt = `You are a helpful food ordering assistant for ReactFood restaurant. 
      The user asked: "${message}"
      
      Please provide a helpful, friendly response. If they ask about food recommendations, 
      suggest items from our menu which includes pasta, pizza, salads, burgers, desserts, seafood, and breakfast items.
      Keep responses concise and engaging.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Gemini API request failed');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      return new Response(JSON.stringify({ 
        response: text,
        timestamp: new Date().toISOString() 
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    } catch (error) {
      console.error('Gemini API Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Sorry, I am having trouble connecting right now. Please try again later.' 
      }), {
        status: 500,
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