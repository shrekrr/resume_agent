import subprocess

def ask_ollama(prompt: str) -> str:
    result = subprocess.run(
    ["ollama", "run", "phi3:mini"],
    input=prompt,
    capture_output=True,
    encoding="utf-8",
    errors="ignore"
)

    return result.stdout.strip()

