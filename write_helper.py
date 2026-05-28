import sys, os
filepath = sys.argv[1]
content = sys.stdin.read()
os.makedirs(os.path.dirname(filepath), exist_ok=True)
with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
print(f"Wrote {len(content)} bytes to {filepath}")
