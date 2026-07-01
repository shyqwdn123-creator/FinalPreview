<template>
  <div class="resources-view">
    <h1 class="page-title">学习资源</h1>
    <p class="text-muted text-sm" style="margin-bottom:1.25rem">
      这里汇集了课程相关的辅助资源，点击卡片即可查看或在新窗口中打开。
    </p>

    <div class="resources-grid">
      <div class="resource-card card" @click="openResource('disk-scheduling')">
        <div class="resource-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <circle cx="12" cy="12" r="10"/>
            <path d="M12 2a10 10 0 0 1 0 20"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>磁盘调度算法动画演示</h3>
          <p class="text-muted text-sm">FCFS、SSTF、SCAN、CSCAN、FSCAN 五种磁盘调度算法的可视化动画演示。</p>
          <div class="resource-tags">
            <span class="tag">HTML 演示</span>
            <span class="tag">交互式</span>
          </div>
        </div>
      </div>

      <div class="resource-card card" @click="openResource('tcp-congestion')">
        <div class="resource-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>TCP 拥塞控制分析讲解</h3>
          <p class="text-muted text-sm">通过典型例题，动画演示 TCP Reno 慢启动、拥塞避免、快速恢复等拥塞控制机制。</p>
          <div class="resource-tags">
            <span class="tag">HTML 演示</span>
            <span class="tag">交互式</span>
            <span class="tag">计算机网络</span>
          </div>
        </div>
      </div>

      <div class="resource-card card" @click="openResource('ip-fragmentation')">
        <div class="resource-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M8 8h8M8 12h4M8 16h6"/>
            <path d="M16 16l2 2"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>IP 分片与 TCP 报文动画演示</h3>
          <p class="text-muted text-sm">通过两道典型例题，动画演示 IP 数据报分片原理与 TCP 报文封装分片过程。</p>
          <div class="resource-tags">
            <span class="tag">HTML 演示</span>
            <span class="tag">交互式</span>
            <span class="tag">计算机网络</span>
          </div>
        </div>
      </div>

      <div class="resource-card card" @click="openResource('arp-protocol')">
        <div class="resource-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M7 8h10M7 12h10M7 16h6"/>
            <circle cx="17" cy="16" r="2"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>ARP 协议工作过程动画演示</h3>
          <p class="text-muted text-sm">同一子网内主机1→主机2发送数据时，ARP 协议将 IP 地址解析为 MAC 地址的完整动画演示。</p>
          <div class="resource-tags">
            <span class="tag">HTML 演示</span>
            <span class="tag">交互式</span>
            <span class="tag">计算机网络</span>
          </div>
        </div>
      </div>

      <div class="resource-card card" @click="openResource('memory-management')">
        <div class="resource-icon" style="background: rgba(59, 130, 246, 0.1); color: #60a5fa;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
            <line x1="2" y1="16" x2="22" y2="16"/>
            <polygon points="17,7 20,4 23,7"/>
            <line x1="20" y1="4" x2="20" y2="11"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>存储管理原理动画讲解</h3>
          <p class="text-muted text-sm">以动画形式逐步讲解分页、分段、段页式存储管理原理，辅以文字讲解，重点剖析地址翻译过程。</p>
          <div class="resource-tags">
            <span class="tag">HTML 演示</span>
            <span class="tag">动画讲解</span>
            <span class="tag">操作系统</span>
          </div>
        </div>
      </div>

      <div class="resource-card card" @click="openResource('memory-recycle')">
        <div class="resource-icon" style="background: rgba(244, 63, 94, 0.1); color: #f87171;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <line x1="2" y1="8" x2="22" y2="8"/>
            <line x1="2" y1="14" x2="22" y2="14"/>
            <line x1="8" y1="8" x2="8" y2="22"/>
            <line x1="16" y1="8" x2="16" y2="22"/>
            <path d="M9 11l2 2 4-4"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>内存回收四种相邻情况精讲</h3>
          <p class="text-muted text-sm">动画演示释放区与空闲分区 F1/F2 的四种相邻关系及对应分区表操作，含分步讲解与总结对比。</p>
          <div class="resource-tags">
            <span class="tag">HTML 演示</span>
            <span class="tag">动画讲解</span>
            <span class="tag">操作系统</span>
          </div>
        </div>
      </div>

      <div class="resource-card card" @click="openResource('leaders')">
        <div class="resource-icon" style="background: rgba(220, 38, 38, 0.1); color: #f87171;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 21h18M3 7h18M3 14h18M5 7v10M9 7v10M13 7v10M17 7v10M19 7v10"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>党和国家领导人任期对照表</h3>
          <p class="text-muted text-sm">邓小平至习近平，历届党代会（5年一届）与全国人大（每年例会）完整对照，含任期年份与重要节点说明。</p>
          <div class="resource-tags">
            <span class="tag">政治常识</span>
            <span class="tag">历史政治</span>
          </div>
        </div>
      </div>

      <div class="resource-card card" @click="openResource('2026-06-28-qa')">
        <div class="resource-icon" style="background: rgba(34, 197, 94, 0.1); color: #22c55e;">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
        </div>
        <div class="resource-info">
          <h3>复习笔记 · 虚拟内存 & 计算机网络</h3>
          <p class="text-muted text-sm">2026.06.28 下午问答精编，涵盖虚拟内存、TLB、计算机网络分类、IP首部、交换机原理等 14 个问答。</p>
          <div class="resource-tags">
            <span class="tag">问答速记</span>
            <span class="tag">操作系统</span>
            <span class="tag">计算机网络</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
function openResource(name) {
  const url = `${import.meta.env.BASE_URL}resources/${name}.html`
  window.open(url, '_blank', 'width=1280,height=800,noopener,noreferrer')
}
</script>

<style scoped>
.resources-view {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.resources-grid {
  display: grid;
  grid-template-columns: repeat(4, 280px);
  gap: 1rem;
  align-items: stretch;
  justify-content: center;
}

@media (max-width: 1200px) {
  .resources-grid {
    grid-template-columns: repeat(3, 260px);
  }
}

@media (max-width: 900px) {
  .resources-grid {
    grid-template-columns: repeat(2, 240px);
  }
}

@media (max-width: 600px) {
  .resources-grid {
    grid-template-columns: 1fr;
  }
}

.resource-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.resource-card:hover {
  border-color: var(--accent-border);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.resource-card.placeholder {
  cursor: default;
  opacity: 0.7;
}

.resource-card.placeholder:hover {
  transform: none;
  border-color: var(--border-color);
  box-shadow: none;
}

.resource-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--accent-soft);
  color: var(--accent-primary);
  border-radius: var(--radius-md);
}

.resource-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.resource-info h3 {
  font-size: 0.95rem;
  font-weight: 600;
}

.resource-tags {
  display: flex;
  gap: 0.4rem;
  margin-top: 0.5rem;
}

.tag {
  font-size: 0.7rem;
  padding: 0.15rem 0.5rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-color);
  border-radius: 999px;
  color: var(--text-muted);
}
</style>
