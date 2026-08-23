import re

with open('src/components/genaidol/game/bandoGameEngine.js', 'r') as f:
    content = f.read()

# 1. Constructor
content = content.replace(
    'this._isApplyingRemoteSync = false;',
    'this._isApplyingRemoteSync = false;\n    this.cellRenderQueue = [];\n    this.reservedCellIds = new Set();\n    this.queueTimer = null;'
)

# 2. ResetRound
content = content.replace(
    'this.state.cellsById = {};',
    'this.state.cellsById = {};\n    this.cellRenderQueue = [];\n    this.reservedCellIds.clear();\n    if (this.queueTimer) {\n      clearInterval(this.queueTimer);\n      this.queueTimer = null;\n    }'
)

# 3. Fix cells logic
content = content.replace(
    'cells: 1, // Sửa lỗi: Quà chưa cấu hình chỉ tính 1 ô, không lấy theo giá xu',
    'cells: diamondCountInput || 1, // Cập nhật: Tính số ô theo số xu đối với quà lạ'
)

# 4. Filter reserved cells
content = content.replace(
    'const unallocated = allCells.filter(c => !this.state.cellsById[c.id]);',
    'const unallocated = allCells.filter(c => !this.state.cellsById[c.id] && !this.reservedCellIds.has(c.id));'
)

# 5. ProcessGift block replacement
start_idx = content.find('    const placedColor = this.state.settings.claimedCellColor || \'#DA251D\';')
end_marker = "    if (this.state.remainingCells <= 0) {\n      this.triggerVictory(user);\n    }\n\n    this.notify({ type: 'GIFT_PROCESSED', giftId, count, user });\n  }"
end_idx = content.find(end_marker) + len(end_marker)

if start_idx == -1 or end_idx == -1:
    print("Could not find markers for block replacement")
    exit(1)

new_block = """    const placedColor = this.state.settings.claimedCellColor || '#DA251D';
    toClaim.forEach(cell => this.reservedCellIds.add(cell.id));
    
    this.cellRenderQueue.push({
      user,
      giftDef,
      count,
      placedColor,
      cellsToClaim: toClaim,
      regionTarget,
      totalCellsAssigned: toClaim.length,
      started: false
    });
    
    this.startRenderQueue();
  }

  startRenderQueue() {
    if (this.queueTimer) return;

    this.queueTimer = setInterval(() => {
      if (this.cellRenderQueue.length === 0) {
        clearInterval(this.queueTimer);
        this.queueTimer = null;
        return;
      }

      const currentTask = this.cellRenderQueue[0];
      const now = Date.now();
      
      if (currentTask.cellsToClaim.length === 0) {
        // Complete this gift task
        const focalCell = currentTask.lastCell;
        if (focalCell) {
          const wx = (focalCell.x - (this.maskData.gridCols || 300) / 2) * 1.0;
          const wz = (focalCell.y - (this.maskData.gridRows || 389) / 2) * 1.0;
          this.state.lastFocalTarget = {
            x: focalCell.x,
            y: focalCell.y,
            wx,
            wz,
            username: currentTask.user.username,
            giftName: currentTask.giftDef.name,
            count: currentTask.totalCellsAssigned,
            regionTarget: currentTask.regionTarget,
            seq: now,
          };

          if (!this.state.activeFlagPoles) this.state.activeFlagPoles = [];
          this.state.activeFlagPoles.push({
            id: `pole_${now}_${Math.random().toString(36).substr(2, 5)}`,
            wx,
            wz,
            userId: currentTask.user.id || '',
            username: currentTask.user.username,
            avatar: currentTask.user.avatar || '',
            giftName: currentTask.giftDef.name,
            giftIcon: currentTask.giftDef.icon,
            count: currentTask.totalCellsAssigned,
            regionTarget: currentTask.regionTarget,
            claimedAt: now,
          });
          if (this.state.activeFlagPoles.length > 100) {
            this.state.activeFlagPoles.shift();
          }
        }
        
        this.cellRenderQueue.shift();
        
        if (this.state.remainingCells <= 0 && this.state.status === 'playing') {
          this.triggerVictory(currentTask.user);
        }
        return;
      }

      // Process a chunk of cells
      let batchSize = 1;
      const totalPending = this.cellRenderQueue.reduce((sum, g) => sum + g.cellsToClaim.length, 0);
      if (totalPending > 200) batchSize = 5;
      if (totalPending > 1000) batchSize = 30;
      if (totalPending > 5000) batchSize = 150;
      if (totalPending > 15000) batchSize = 500;

      const chunk = currentTask.cellsToClaim.splice(0, batchSize);
      const provinceUpdated = new Set();
      const { user, giftDef, placedColor } = currentTask;

      chunk.forEach(cell => {
        this.state.cellsById[cell.id] = {
          id: cell.id,
          x: cell.x,
          y: cell.y,
          provinceId: cell.provinceId,
          user: { id: user.id, username: user.username },
          color: placedColor,
          placedAt: now,
        };
        this.reservedCellIds.delete(cell.id);
        currentTask.lastCell = cell;

        if (this.state.provincesStatus[cell.provinceId]) {
          this.state.provincesStatus[cell.provinceId].claimedCount += 1;
          provinceUpdated.add(cell.provinceId);
        }
      });

      this.state.claimedCount = Object.keys(this.state.cellsById).length;
      this.state.remainingCells = Math.max(0, this.state.totalCells - this.state.claimedCount);
      this.state.percent = Math.min(100, Math.round((this.state.claimedCount / this.state.totalCells) * 1000) / 10);

      this.bannerEngine.syncWithMapPercent(this.state.percent);
      this.state.bannerCells = [...this.bannerEngine.cells];
      this.state.bannerClaimedCount = this.bannerEngine.claimedCount;

      let userEntry = this.state.leaderboard.find(l => l.userId === user.id);
      if (!userEntry) {
        userEntry = {
          userId: user.id,
          username: user.username,
          avatar: user.avatar || '',
          totalCells: 0,
          totalGifts: 0,
          tier: 'Đồng 🟤'
        };
        this.state.leaderboard.push(userEntry);
      }
      userEntry.totalCells += chunk.length;
      
      if (!currentTask.started) {
        currentTask.started = true;
        userEntry.totalGifts += currentTask.count;
        const regionNameVi = currentTask.regionTarget === 'north' ? 'Miền Bắc 🏔️' : currentTask.regionTarget === 'central' ? 'Miền Trung 🌊' : currentTask.regionTarget === 'south' ? 'Miền Nam 🌴' : '';
        const regionText = regionNameVi ? ` [Khu vực ${regionNameVi}]` : '';
        this.addFeedItem('GIFT', `${user.username} đã gửi [${giftDef.icon} ${giftDef.name} x${currentTask.count}]${regionText} → Cắm +${currentTask.totalCellsAssigned} Ô Cờ!`);
        console.log(`%c[BANDO ENGINE] 🎁 Cắm từ từ: ${user.username} tặng "${giftDef.name}" x${currentTask.count} → Tổng ${currentTask.totalCellsAssigned} ô cờ`, 'color: #22c55e; font-weight: bold; font-size: 13px;');
      }
      
      const getHonorTierLocal = (cells) => {
        if (cells >= 100000) return 'Kim Cương 💎';
        if (cells >= 50000) return 'Bạch Kim 💍';
        if (cells >= 10000) return 'Vàng 🥇';
        if (cells >= 2000) return 'Bạc 🥈';
        return 'Đồng 🟤';
      };
      userEntry.tier = getHonorTierLocal(userEntry.totalCells);
      this.state.leaderboard.sort((a, b) => b.totalCells - a.totalCells);

      if (Math.random() < 0.1 || chunk.length > 50) {
        if (giftDef.tier === 'mythic' || giftDef.tier === 'divine') {
          bandoAudio.playThunderStrike();
        } else if (giftDef.tier === 'legendary') {
          bandoAudio.playWarHorn();
        } else if (giftDef.tier === 'epic') {
          bandoAudio.playWarDrums(1);
        } else {
          bandoAudio.playCellPop();
        }
      }

      provinceUpdated.forEach(pid => {
        const p = this.state.provincesStatus[pid];
        if (p && !p.isCompleted && p.claimedCount >= p.totalCells) {
          p.isCompleted = true;
          p.leader = user.username;
          bandoAudio.playProvinceComplete(p.name);
          this.addFeedItem('PROVINCE_COMPLETE', `⭐ Vùng/Tỉnh [${p.name}] đã hoàn thành 100% cắm cờ bởi ${user.username}!`);
        }
      });

      this.notify({ type: 'GIFT_PROCESSED_GRADUAL', batchSize: chunk.length });

      if (this.state.remainingCells <= 0 && this.state.status === 'playing') {
        this.triggerVictory(user);
      }

    }, 30);
  }"""

# Correct backticks in python block string
new_block = new_block.replace("`pole_${now}_${Math.random().toString(36).substr(2, 5)}`", "`pole_${now}_${Math.random().toString(36).substr(2, 5)}`")
new_block = new_block.replace("`${user.username} đã gửi [${giftDef.icon} ${giftDef.name} x${currentTask.count}]${regionText} → Cắm +${currentTask.totalCellsAssigned} Ô Cờ!`", "`\\${user.username} đã gửi [\\${giftDef.icon} \\${giftDef.name} x\\${currentTask.count}]\\${regionText} → Cắm +\\${currentTask.totalCellsAssigned} Ô Cờ!`")
new_block = new_block.replace("` [Khu vực ${regionNameVi}]`", "` [Khu vực \\${regionNameVi}]`")
new_block = new_block.replace("`%c[BANDO ENGINE] 🎁 Cắm từ từ: ${user.username} tặng \"${giftDef.name}\" x${currentTask.count} → Tổng ${currentTask.totalCellsAssigned} ô cờ`", "`%c[BANDO ENGINE] 🎁 Cắm từ từ: \\${user.username} tặng \\\"\\${giftDef.name}\\\" x\\${currentTask.count} → Tổng \\${currentTask.totalCellsAssigned} ô cờ`")
new_block = new_block.replace("`⭐ Vùng/Tỉnh [${p.name}] đã hoàn thành 100% cắm cờ bởi ${user.username}!`", "`⭐ Vùng/Tỉnh [\\${p.name}] đã hoàn thành 100% cắm cờ bởi \\${user.username}!`")
new_block = new_block.replace("`pole_${now}_${Math.random().toString(36).substr(2, 5)}`", "`pole_\\${now}_\\${Math.random().toString(36).substr(2, 5)}`")


content = content[:start_idx] + new_block + content[end_idx:]

with open('src/components/genaidol/game/bandoGameEngine.js', 'w') as f:
    f.write(content)

print("Update completed successfully")
