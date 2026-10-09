export function analyzePrompt(syllabus: string, examDate: string): string {
  return `You are a study planning assistant. Analyze this syllabus and create a structured study plan.

SYLLABUS:
${syllabus}

EXAM DATE: ${examDate}
TODAY: ${new Date().toISOString().split("T")[0]}

Return a JSON object with this exact structure (no markdown, no code fences, just raw JSON):
{
  "subjects": ["Subject 1", "Subject 2"],
  "topics": [
    {
      "id": "topic-1",
      "name": "Topic Name",
      "subject": "Subject Name",
      "difficulty": "easy|medium|hard",
      "estimatedHours": 2,
      "completed": false
    }
  ],
  "dailySchedule": [
    {
      "date": "YYYY-MM-DD",
      "topics": ["Topic Name 1", "Topic Name 2"],
      "hours": 3
    }
  ]
}

Rules:
- Extract all distinct topics from the syllabus
- Assign realistic difficulty and time estimates
- Spread topics across available days until the exam date
- Harder topics get more time and appear earlier
- Keep daily study hours between 2-5
- Include revision days before the exam
- Return ONLY valid JSON, nothing else`;
}

export function flashcardPrompt(topic: string, subject: string): string {
  return `Generate 6 flashcards for studying "${topic}" (subject: ${subject}).

Return a JSON array (no markdown, no code fences, just raw JSON):
[
  {
    "front": "Question or concept prompt",
    "back": "Clear, concise answer or explanation"
  }
]

Make the flashcards progressively harder. Front should be a question or key term. Back should be a clear explanation under 50 words. Return ONLY the JSON array.`;
}

export function quizPrompt(topic: string, subject: string): string {
  return `Generate 5 multiple-choice questions about "${topic}" (subject: ${subject}).

Return a JSON array (no markdown, no code fences, just raw JSON):
[
  {
    "question": "The question text",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctIndex": 0,
    "explanation": "Brief explanation of why the correct answer is right"
  }
]

Rules:
- 4 options each, exactly one correct
- Mix difficulty levels
- Explanations under 40 words
- Return ONLY the JSON array`;
}

export function chatSystemPrompt(subjects: string[], topics: string[]): string {
  return `You are a knowledgeable study tutor helping a student prepare for exams. The student is studying: ${subjects.join(", ")}. Topics include: ${topics.slice(0, 20).join(", ")}.

Be concise and helpful. Explain concepts clearly with examples. Keep responses under 200 words unless a detailed explanation is needed.`;
}
