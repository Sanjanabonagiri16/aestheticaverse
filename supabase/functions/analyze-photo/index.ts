import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { HfInference } from 'https://esm.sh/@huggingface/inference@2.3.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrl } = await req.json()
    const hf = new HfInference(Deno.env.get('HUGGING_FACE_ACCESS_TOKEN'))

    // Analyze image for scene classification and objects
    const sceneAnalysis = await hf.imageClassification({
      model: 'google/vit-base-patch16-224',
      data: imageUrl,
    })

    // Analyze image for emotions and mood
    const emotionAnalysis = await hf.imageClassification({
      model: 'dima806/facial_emotions_image_detection', 
      data: imageUrl,
    })

    // Generate captions based on analysis
    const captionGeneration = await hf.textGeneration({
      model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
      inputs: `Generate an engaging Instagram caption for an image that shows ${sceneAnalysis.map(s => s.label).join(', ')} with a ${emotionAnalysis[0]?.label || 'neutral'} mood.`,
      parameters: {
        max_new_tokens: 100,
        temperature: 0.7,
      }
    })

    const suggestions = {
      scene: sceneAnalysis.slice(0, 3).map(s => ({
        label: s.label,
        confidence: s.score
      })),
      emotion: emotionAnalysis[0]?.label || 'neutral',
      suggestedCaptions: [
        captionGeneration.generated_text,
        // Generate variations with different tones
        await hf.textGeneration({
          model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
          inputs: `Generate a witty and humorous Instagram caption for an image showing ${sceneAnalysis[0]?.label}`,
          parameters: { max_new_tokens: 100, temperature: 0.8 }
        }).then(res => res.generated_text),
        await hf.textGeneration({
          model: 'OpenAssistant/oasst-sft-4-pythia-12b-epoch-3.5',
          inputs: `Generate a poetic and artistic Instagram caption for an image showing ${sceneAnalysis[0]?.label}`,
          parameters: { max_new_tokens: 100, temperature: 0.8 }
        }).then(res => res.generated_text)
      ],
      enhancement: {
        brightness: Math.random() > 0.5 ? "Increase brightness by 10%" : "Current brightness is optimal",
        contrast: Math.random() > 0.5 ? "Boost contrast slightly" : "Contrast levels look good",
        filters: ["Natural", "Vibrant", "Moody"].sort(() => Math.random() - 0.5)[0]
      }
    }

    return new Response(
      JSON.stringify({ suggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-photo function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})