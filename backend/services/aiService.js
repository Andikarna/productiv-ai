const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

let _genAI = null;
const getGenAI = () => {
  if (!_genAI) {
    _genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return _genAI;
};

/**
 * Send a message to Gemini with conversation history.
 * @param {string} systemPrompt - System instruction for Gemini
 * @param {Array}  history      - Array of { role, content } from DB (oldest first)
 * @param {string} userMessage  - Current user message
 * @param {Object} image        - Optional image object { data: base64String, mimeType: string }
 * @returns {Promise<{ content: string, model: string, tokens: number }>}
 */
const chat = async (systemPrompt, history = [], userMessage, image = null) => {
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  try {
    const genAI = getGenAI();

    const model = genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: systemPrompt,
      generationConfig: {
        temperature: 0.75,
        maxOutputTokens: 600,
      },
    });

    // Convert stored messages to Gemini format
    // Gemini uses 'user' and 'model' (not 'assistant')
    let geminiHistory = history.map((msg) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content || ' ' }],
    }));

    // Ensure history starts with 'user' to satisfy Gemini constraints
    while (geminiHistory.length > 0 && geminiHistory[0].role !== 'user') {
      geminiHistory.shift();
    }

    // Merge consecutive messages to ensure strict alternation
    const validHistory = [];
    for (const msg of geminiHistory) {
      if (validHistory.length === 0) {
        validHistory.push(msg);
      } else {
        const lastMsg = validHistory[validHistory.length - 1];
        if (lastMsg.role === msg.role) {
          lastMsg.parts[0].text += '\n\n' + msg.parts[0].text;
        } else {
          validHistory.push(msg);
        }
      }
    }

    // The history passed to startChat before calling sendMessage() (which acts as 'user')
    // must end with 'model' to maintain the alternation.
    if (validHistory.length > 0 && validHistory[validHistory.length - 1].role === 'user') {
      validHistory.pop();
    }

    const chatSession = model.startChat({ history: validHistory });
    
    let messageContent = userMessage;
    if (image && image.data && image.mimeType) {
      messageContent = [
        userMessage,
        { inlineData: { data: image.data, mimeType: image.mimeType } }
      ];
    }
    
    const result = await chatSession.sendMessage(messageContent);
    const content = result.response.text()?.trim() ||
      "I'm sorry, I couldn't generate a response right now. Please try again.";

    // Gemini API v1 doesn't always expose token counts in all responses
    const tokens = result.response.usageMetadata?.totalTokenCount || 0;

    logger.debug(`Gemini response: model=${modelName}, tokens=${tokens}`);

    return { content, model: modelName, tokens };
  } catch (error) {
    logger.error(`Gemini API error: ${error.message}`);

    // User-friendly error messages
    if (error.message?.includes('API_KEY')) {
      throw new Error('Invalid Gemini API key. Please check your configuration.');
    }
    if (error.message?.includes('quota') || error.status === 429) {
      throw new Error('AI service quota exceeded. Please try again in a moment.');
    }
    if (error.message?.includes('SAFETY')) {
      throw new Error('Your message was flagged by the safety filter. Please rephrase and try again.');
    }

    throw new Error('Failed to get AI response. Please try again.');
  }
};

module.exports = { chat };
