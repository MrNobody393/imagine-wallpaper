import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // Helper to safely get Gemini client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  };

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 1. Expand / Refine Prompt API
  app.post('/api/gemini/expand-prompt', async (req, res) => {
    try {
      const { prompt, styleLabel, colorKeywords } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();
      if (!ai) {
        // Fallback intelligent enhancement if key not present
        const fallbackEnhanced = `High detail 8k resolution phone wallpaper of ${prompt}, ${styleLabel || 'modern abstract art'}, featuring ${colorKeywords || 'vibrant colors'}, crystal clear lighting, pristine composition, masterpiece aesthetic.`;
        return res.json({ enhancedPrompt: fallbackEnhanced });
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: `You are an expert AI digital wallpaper prompt artist. Expand and enhance the following user prompt into a rich, vivid, highly detailed prompt suitable for high-resolution mobile wallpaper generation. Keep it under 70 words, focused on visual lighting, texture, composition, and mood. Avoid adding technical jargon or quality buzzwords like 4k/8k unless relevant.
        
User Input: "${prompt}"
Desired Style: "${styleLabel || 'Modern Visual Art'}"
Color Vibe: "${colorKeywords || 'Vibrant'}"

Return ONLY the enhanced prompt string without commentary.`,
      });

      const enhancedText = response.text ? response.text.trim() : prompt;
      return res.json({ enhancedPrompt: enhancedText });
    } catch (error: any) {
      console.error('Error in expand-prompt:', error);
      return res.json({
        enhancedPrompt: `${req.body.prompt}, highly detailed digital wallpaper art, 8k render, breathtaking visual aesthetic.`,
      });
    }
  });

  // 2. Generate Wallpaper Image API
  app.post('/api/gemini/generate-wallpaper', async (req, res) => {
    try {
      const { prompt, enhancedPrompt, aspectRatio = '9:16', styleId = 'reality-8k', styleModifier: inlineModifier, colorKeywords } = req.body;
      const userRawPrompt = prompt || enhancedPrompt;

      if (!userRawPrompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = getGeminiClient();
      let expandedPrompt = enhancedPrompt || userRawPrompt;

      // 1. If Gemini AI is available, expand and optimize the prompt for maximum image fidelity
      if (ai && !enhancedPrompt) {
        try {
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

Output ONLY the expanded prompt text. Do NOT use bullet points or extra commentary. Keep under 80 words.`,
          });
          if (geminiRes.text) {
            expandedPrompt = geminiRes.text.trim();
          }
        } catch (e) {
          console.warn('Gemini prompt expansion fallback notice:', e);
        }
      }

      // 2. Map Style ID to prompt directives and model presets
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

      let generatedImageUrl: string | null = null;

      // 3. Attempt Gemini Imagen generation if available
      if (ai) {
        try {
          let supportedAspectRatio = '9:16';
          if (aspectRatio.includes('1:1')) supportedAspectRatio = '1:1';
          else if (aspectRatio.includes('3:4')) supportedAspectRatio = '3:4';
          else if (aspectRatio.includes('4:3')) supportedAspectRatio = '4:3';
          else if (aspectRatio.includes('16:9')) supportedAspectRatio = '16:9';

          // Try Imagen generateImages method
          if ((ai.models as any).generateImages) {
            const imgRes = await (ai.models as any).generateImages({
              model: 'imagen-3.0-generate-002',
              prompt: finalImagePrompt,
              config: {
                numberOfImages: 1,
                aspectRatio: supportedAspectRatio,
                outputMimeType: 'image/jpeg',
              },
            });

            if (imgRes?.generatedImages?.[0]?.image?.imageBytes) {
              generatedImageUrl = `data:image/jpeg;base64,${imgRes.generatedImages[0].image.imageBytes}`;
            }
          }
        } catch (genError: any) {
          console.warn('Gemini Imagen attempt notice:', genError.message || genError);
        }
      }

      // 4. High-Resolution Pollinations FLUX Engine Fallback (8K Mobile Wallpaper Dimensions)
      if (!generatedImageUrl) {
        const seed = Math.floor(Math.random() * 8999999) + 1000000;
        
        let width = 1080;
        let height = 1920;
        if (aspectRatio.includes('1:1')) { width = 1080; height = 1080; }
        else if (aspectRatio.includes('3:4')) { width = 1080; height = 1440; }
        else if (aspectRatio.includes('4:3')) { width = 1440; height = 1080; }
        else if (aspectRatio.includes('19.5:9') || aspectRatio.includes('20:9')) { width = 1080; height = 2340; }

        const encodedPrompt = encodeURIComponent(finalImagePrompt);
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}&enhance=true&model=${modelPreset}`;
        generatedImageUrl = pollinationsUrl;
      }

      return res.json({
        success: true,
        imageUrl: generatedImageUrl,
        prompt: userRawPrompt,
        enhancedPrompt: expandedPrompt,
        styleId: styleId,
      });
    } catch (error: any) {
      console.error('Error generating wallpaper:', error);
      res.status(500).json({ error: error.message || 'Failed to generate wallpaper' });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
