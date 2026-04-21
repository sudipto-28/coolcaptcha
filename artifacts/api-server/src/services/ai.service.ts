// AI Service for content classification and rewriting using OpenAI
import OpenAI from 'openai';

export interface ActiveCategory {
  id: string;
  name: string;
  slug: string;
}

export interface AiClassificationResult {
  categoryId: string | null;
  categoryName: string | null;
  rewrittenTitle: string;
  description: string;
  summaryPoints: string[];
  shortDescription: string | null;
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Rewrite the following article into clear, natural-sounding bullet points.

Your goal is to make the content easy to understand for an intelligent reader who is not an expert in the topic.

Instructions:
* Review the provided article title, description, and list of categories.
* Decide whether the article clearly belongs to one of the provided categories.
   - If it does not strongly fit any category, return null values.
* If it matches a category, rewrite the article in a natural, human-written editorial style suitable for publishing on a professional business news website.

* Do not just summarize — rewrite the ideas so they are clearer and easier to follow
* Focus on the most important points and insights
* Combine related ideas instead of listing everything separately
* Remove repetition and unnecessary details

Style:

* Write in a natural, human tone
* Avoid sounding robotic, overly formal, or generic
* Do not sound childish or overly simplified
* Vary sentence structure and phrasing naturally

Bullet points (IMPORTANT - Keep them concise):

* Each bullet point must be concise and to the point
* Provide only the essential information for each point
* Focus on key insights without excessive details or examples
* Aim for 1-2 sentences per bullet point, maximum 3 sentences
* Keep each point brief and direct
* Be concise — don't over-explain
* Capture the main idea quickly and clearly

Avoid AI-like writing:

* No filler phrases like "In conclusion", "Overall", etc.
* Avoid repeating the same sentence structure
* Mix short and longer sentences naturally
* Let the writing feel slightly imperfect in a human way

Final refinement (important):
After writing the bullet points, review each one to ensure it's concise and to the point. If a point is too long or exceeds 2-3 sentences, condense it to be more direct and brief.

Important:
- categoryName must exactly match one of the provided categories
- If no category clearly matches, all fields must be null
- Respond ONLY with valid JSON
- No markdown
- No explanations
- No extra text

Response format:
{
  "categoryName": "<exact category name from the list, or null>",
  "rewrittenTitle": "<humanized rewritten title, or null>",
  "summaryPoints": "<detailed, comprehensive bullet points with full explanation and context, or null>",
  "shortDescription": "<concise summary of the article, or null>"
}`;

function buildUserPrompt(title: string, description: string, categories: ActiveCategory[]): string {
  const categoryList = categories.map((c) => `- ${c.name}`).join('\n');
  return `Categories:\n${categoryList}\n\nArticle title: ${title}\nArticle description: ${description}`;
}

export async function classifyAndRewriteContent(
  title: string,
  description: string,
  categories: ActiveCategory[]
): Promise<AiClassificationResult> {
  if (!categories.length) {
    return {
      categoryId: null,
      categoryName: null,
      rewrittenTitle: title,
      description: description || '',
      summaryPoints: [],
      shortDescription: null,
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.3,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(title, description, categories) },
      ],
    });

    const raw = response.choices[0]?.message?.content?.trim();
    if (!raw) {
      throw new Error('AI returned empty response');
    }

    let parsed: {
      categoryName: string | null;
      rewrittenTitle: string | null;
      summaryPoints: string[] | null;
      shortDescription: string | null;
    };

    try {
      parsed = JSON.parse(raw);
    } catch {
      throw new Error(`AI returned invalid JSON: ${raw}`);
    }

    if (!parsed.categoryName || !parsed.rewrittenTitle || !parsed.summaryPoints || !parsed.shortDescription) {
      return {
        categoryId: null,
        categoryName: null,
        rewrittenTitle: title,
        description: description || '',
        summaryPoints: [],
        shortDescription: null,
      };
    }

    const matched = categories.find((c) => c.name.toLowerCase() === parsed.categoryName!.toLowerCase());
    if (!matched) {
      return {
        categoryId: null,
        categoryName: null,
        rewrittenTitle: title,
        description: description || '',
        summaryPoints: [],
        shortDescription: null,
      };
    }

    return {
      categoryId: matched.id,
      categoryName: matched.name,
      rewrittenTitle: parsed.rewrittenTitle,
      description: parsed.summaryPoints.join('\n\n'),
      summaryPoints: parsed.summaryPoints,
      shortDescription: parsed.shortDescription,
    };
  } catch (error) {
    console.error('AI classification error:', error);
    // Fallback to original values on error
    return {
      categoryId: null,
      categoryName: null,
      rewrittenTitle: title,
      description: description || '',
      summaryPoints: [],
      shortDescription: null,
    };
  }
}
