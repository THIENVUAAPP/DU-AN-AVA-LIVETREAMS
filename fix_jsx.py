lines = open('src/components/LivestreamClonerStudio.jsx').read().splitlines()
out = []
for i, line in enumerate(lines):
    if line.strip() == '{/* HISTORY MODAL */}':
        # Remove the preceding </div>
        if out[-1].strip() == '</div>':
            out.pop()
    out.append(line)

open('src/components/LivestreamClonerStudio.jsx', 'w').write('\n'.join(out) + '\n')
