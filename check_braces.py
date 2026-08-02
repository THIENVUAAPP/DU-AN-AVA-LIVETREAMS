with open('vite.config.js', 'r') as f:
    content = f.read()

opens = []
for i, char in enumerate(content):
    if char in "({[":
        opens.append((char, i))
    elif char in ")}]":
        if not opens:
            print(f"Extra closing {char} at index {i}")
            break
        last_char, last_i = opens.pop()
        expected = {'(': ')', '{': '}', '[': ']'}[last_char]
        if char != expected:
            print(f"Mismatch at index {i}: expected {expected} for {last_char} at {last_i}, got {char}")
            break
else:
    if opens:
        print(f"Unclosed {opens[-1]}")
    else:
        print("All balanced")
