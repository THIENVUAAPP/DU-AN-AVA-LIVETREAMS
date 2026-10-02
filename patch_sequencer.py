import re
with open('src/components/genaidol/LivestreamFlowSequencer.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Just replace "syncMasterLiveState({" with "if (isMasterSynced) syncMasterLiveState({"
content = content.replace("syncMasterLiveState({", "if (isMasterSynced) syncMasterLiveState({")

with open('src/components/genaidol/LivestreamFlowSequencer.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Patched LivestreamFlowSequencer")
