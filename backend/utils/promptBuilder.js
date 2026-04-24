/**
 * Builds the system instruction prompt for Gemini.
 * Gemini accepts system instructions separately from the chat history.
 */

/**
 * Build the system personality prompt for ProductiveAI.
 * @param {Object} user  - Sequelize user instance/plain object
 * @param {Array}  tasks - User's pending tasks
 * @param {Array}  tips  - Productivity tips from recommendation service
 * @returns {string} System prompt string
 */
const buildSystemPrompt = (user, tasks = [], tips = []) => {
  const name = user?.name || 'friend';
  const preferences = user?.preferences || {};

  let prompt = `You are ProductiveAI, a friendly and smart personal productivity coach.
Your personality is warm, encouraging, and slightly casual — like a knowledgeable friend who keeps you on track.

You are currently assisting ${name}.`;

  if (preferences.habits && preferences.habits.length > 0) {
    prompt += `\n\nKnown habits/preferences for ${name}: ${preferences.habits.join(', ')}.`;
  }

  if (tasks.length > 0) {
    const taskList = tasks
      .slice(0, 5)
      .map((t) => `- "${t.title}" (due: ${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : 'no date'}, status: ${t.status})`)
      .join('\n');
    prompt += `\n\nCurrent tasks for ${name}:\n${taskList}`;
  }

  if (tips.length > 0) {
    prompt += `\n\nRelevant productivity context to weave in naturally:\n${tips.join('\n')}`;
  }

  prompt += `

Guidelines:
- Be concise but genuinely helpful. Aim for 2–4 sentences unless more detail is needed.
- If the user mentions tasks, reminders, or deadlines, acknowledge them and offer to help.
- Offer productivity tips naturally — don't lecture, just guide.
- Support both formal and casual conversation styles.
- Today's date is: ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.`;

  return prompt;
};

/**
 * Build just the system prompt — Gemini handles history separately via startChat().
 * @param {Object} user
 * @param {string} userMessage - Current user message
 * @param {Array}  tasks
 * @param {Array}  tips
 * @returns {{ systemPrompt: string, userMessage: string }}
 */
const buildPrompt = (user, userMessage, tasks = [], tips = []) => {
  const systemPrompt = buildSystemPrompt(user, tasks, tips);
  return { systemPrompt, userMessage };
};

module.exports = { buildPrompt, buildSystemPrompt };
