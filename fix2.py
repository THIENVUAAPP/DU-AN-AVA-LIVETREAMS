lines = open('src/components/LivestreamClonerStudio.jsx').read().splitlines()

# find the index of "{/* HISTORY MODAL */}"
idx = -1
for i, l in enumerate(lines):
    if '{/* HISTORY MODAL */}' in l:
        idx = i
        break

if idx != -1:
    # remove the </div> above it
    if '</div>' in lines[idx-1]:
        lines.pop(idx-1)
    elif '</div>' in lines[idx-2]:
        lines.pop(idx-2)

open('src/components/LivestreamClonerStudio.jsx', 'w').write('\n'.join(lines) + '\n')
