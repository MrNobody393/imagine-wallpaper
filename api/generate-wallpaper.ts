import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  // Support CORS headers if called cross-origin
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    const { prompt, enhancedPrompt, aspectRatio = '9:16', styleId = 'reality-8k', colorKeywords } = body;
    const userRawPrompt = prompt || enhancedPrompt;

    if (!userRawPrompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    let expandedPrompt = enhancedPrompt || userRawPrompt;

    if (apiKey && !enhancedPrompt) {
      try {
        const ai = new GoogleGenAI({ apiKey });
        const isRealityStyle = styleId === 'reality-8k';
        const systemInstruction = isRealityStyle
          ? `You are an expert prompt engineer for photorealistic AI photography. Convert the user's request into an authentic, ultra-detailed 8K photograph prompt. Focus strictly on real-life camera optics, natural lighting, physical textures, precise environment, and true-to-life subject details. Do NOT include words like render, 3D, digital art, illustration, or CGI.`
          : `You are an expert prompt engineer for high-end AI image generation. Expand the user's brief wallpaper description into an ultra-detailed, evocative 8K image prompt. Maintain full subject accuracy while adding specific details about lighting, texture, camera framing, atmosphere, and visual style.`;

        const geminiRes = await ai.models.generateContent({
          model: 'gemini-3.6-flash',
          contents: `${systemInstruction}

User Description: "${userRawPrompt}"
Target Style ID: "${styleId}"
Color Mood: "${colorKeywords || 'Vibrant'}"

Output ONLY the expanded prompt text. Keep under 80 words.`,
        });

        if (geminiRes.text) {
          expandedPrompt = geminiRes.text.trim();
        }
      } catch (e) {
        console.warn('Gemini prompt expansion notice on Vercel:', e);
      }
    }

    let styleDescriptor = 'award-winning 8k photograph, photorealistic 85mm DSLR lens f/1.4 camera shot, realistic lighting, fine raw photo texture, sharp focus';
    let modelPreset = 'flux-realism';

    if (styleId === 'cartoon-anime') {
      styleDescriptor = 'vivid anime cartoon digital illustration style, Studio Ghibli and Makoto Shinkai aesthetic, hand-painted artwork, vibrant color palette, crisp lines, 8k digital wallpaper';
      modelPreset = 'flux-anime';
    } else if (styleId === 'ai-art-3d') {
      styleDescriptor = 'hyperdetailed 3D AI artwork, translucent liquid glass ribbons, rainbow light caustics, Octane Render 8k, raytraced reflection, glossy crystalline depth';
      modelPreset = 'flux-3d';
    } else if (styleId === 'cyberpunk-neon') {
      styleDescriptor = 'cyberpunk synthwave aesthetic, glowing cyan and magenta neon light trails, rain soaked reflective pavement, futuristic city night, ultra detailed cinematic 8k';
      modelPreset = 'flux';
    } else if (styleId === 'deep-amoled-dark') {
      styleDescriptor = 'deep dark OLED background, pitch black obsidian texture (#000000) with glowing electric luminous geometry, minimal high contrast, crisp clean 8K';
      modelPreset = 'flux';
    }

    let finalImagePrompt = `${expandedPrompt}. Style: ${styleDescriptor}. ${colorKeywords ? 'Color scheme: ' + colorKeywords + '.' : ''} 8k resolution wallpaper.`;
    if (styleId === 'reality-8k') {
      finalImagePrompt = `A real life photograph of ${expandedPrompt}. Shot on 85mm DSLR camera, natural realistic lighting, hyper-detailed texture, award-winning 8k photo, sharp focus. ${colorKeywords ? 'Color atmosphere: ' + colorKeywords + '.' : ''}`;
    }

    const seed = Math.floor(Math.random() * 8999999) + 1000000;
    let width = 1080;
    let height = 1920;
    if (aspectRatio.includes('1:1')) { width = 1080; height = 1080; }
    else if (aspectRatio.includes('3:4')) { width = 1080; height = 1440; }
    else if (aspectRatio.includes('4:3')) { width = 1440; height = 1080; }
    else if (aspectRatio.includes('19.5:9') || aspectRatio.includes('20:9')) { width = 1080; height = 2340; }

    const encodedPrompt = encodeURIComponent(finalImagePrompt);
    const generatedImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}&enhance=true&model=${modelPreset}`;

    return res.status(200).json({
      success: true,
      imageUrl: generatedImageUrl,
      prompt: userRawPrompt,
      enhancedPrompt: expandedPrompt,
      styleId: styleId,
    });
  } catch (error: any) {
    console.error('Vercel API error:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate wallpaper' });
  }
}
