import openai

def analyze_prompt(prompt: str, rules: list) -> str:
    openai.api_key = "your-openai-api-key"
    analysis = openai.Completion.create(
        model="text-davinci-003",
        prompt=f"Analyze this prompt: {prompt}. Apply the following rules: {rules}",
        max_tokens=150
    )
    return analysis.choices[0].text.strip()