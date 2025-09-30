// Crisis keyword detection utility
const CRISIS_KEYWORDS = [
  // Suicide-related
  'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
  'suicidal', 'take my own life', 'end it all', 'not worth living',
  
  // Self-harm related
  'self harm', 'self-harm', 'cut myself', 'hurt myself', 'harm myself',
  'cutting', 'burning myself', 'self injury', 'self-injury',
  
  // Crisis expressions
  'can\'t go on', 'give up', 'no point', 'hopeless', 'worthless',
  'everyone would be better without me', 'burden to everyone',
  'nothing matters', 'can\'t take it anymore', 'want it to stop'
];

export const detectCrisisKeywords = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword.toLowerCase()));
};

export const triggerCrisisWebhook = async (userId: string, content: string, type: 'chat' | 'journal') => {
  try {
    const response = await fetch('/webhook/crisis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        content: content,
        type: type,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.warn('Crisis webhook failed:', response.status);
    }
  } catch (error) {
    console.warn('Crisis webhook error:', error);
  }
};