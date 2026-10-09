// FloraBotany AI - Main Application Controller

document.addEventListener('DOMContentLoaded', () => {
  // Application State
  const state = {
    currentImageBase64: null,
    currentResult: null,
    currentPresetHint: null,
    collection: loadCollection(),
    isScanning: false,
    soundEnabled: true,
    cameraStream: null
  };

  // DOM Elements
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  const cameraBtn = document.getElementById('camera-btn');
  const cameraModal = document.getElementById('camera-modal');
  const cameraVideo = document.getElementById('camera-video');
  const captureBtn = document.getElementById('capture-btn');
  const closeCameraBtn = document.getElementById('close-camera-btn');
  const cameraCanvas = document.getElementById('camera-canvas');

  // Preview & Scan
  const previewContainer = document.getElementById('preview-container');
  const previewImg = document.getElementById('preview-img');
  const scanOverlay = document.getElementById('scan-overlay');
  const scanStatusText = document.getElementById('scan-status-text');
  const reuploadBtn = document.getElementById('reupload-btn');
  const analyzeBtn = document.getElementById('analyze-btn');

  // Results
  const resultSection = document.getElementById('result-section');
  const addToCollectionBtn = document.getElementById('add-to-collection-btn');
  const scanAnotherBtn = document.getElementById('scan-another-btn');

  // Herbarium & Stats
  const herbariumGrid = document.getElementById('herbarium-grid');
  const emptyHerbarium = document.getElementById('empty-herbarium');
  const totalWageStat = document.getElementById('stat-total-wage');
  const totalFlowersStat = document.getElementById('stat-total-flowers');
  const highestRankStat = document.getElementById('stat-highest-rank');
  const rareCountStat = document.getElementById('stat-rare-count');
  const searchInput = document.getElementById('search-collection');
  const rankFilter = document.getElementById('rank-filter');
  const exportBtn = document.getElementById('export-collection-btn');
  const clearCollectionBtn = document.getElementById('clear-collection-btn');

  // Presets Container
  const presetPills = document.getElementById('preset-pills');

  // Audio Control in Navbar
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');

  // Specimen Detail Modal
  const detailModal = document.getElementById('detail-modal');
  const closeDetailBtn = document.getElementById('close-detail-btn');
  const detailModalBody = document.getElementById('detail-modal-body');

  // Notification Toast
  const toast = document.getElementById('toast');

  // ==========================================
  // INITIALIZATION
  // ==========================================
  initPresets();
  updateStats();
  renderHerbarium();
  initSoundButton();

  // ==========================================
  // PRESET SHOWCASE INITIALIZATION
  // ==========================================
  function initPresets() {
    if (!presetPills || !window.FLOWER_SAMPLE_PRESETS) return;
    presetPills.innerHTML = '';

    window.FLOWER_SAMPLE_PRESETS.forEach(preset => {
      const pill = document.createElement('button');
      pill.type = 'button';
      pill.className = 'preset-pill';
      pill.innerHTML = `
        <span class="preset-img-thumb" style="background-image: url('${preset.imageUrl}')"></span>
        <div class="preset-pill-info">
          <span class="preset-name">${preset.name}</span>
          <span class="preset-badge badge-${preset.badge.toLowerCase()}">${preset.rank}</span>
        </div>
      `;
      pill.addEventListener('click', () => loadSamplePreset(preset));
      presetPills.appendChild(pill);
    });
  }

  async function loadSamplePreset(preset) {
    showToast(`Loading specimen: ${preset.name}...`);
    try {
      state.currentPresetHint = preset;
      const base64 = await imageUrlToBase64(preset.imageUrl);
      state.currentImageBase64 = base64;
      displayImagePreview(base64);
      startAnalysis();
    } catch (err) {
      console.error('Failed to load sample preset:', err);
      state.currentImageBase64 = preset.imageUrl;
      displayImagePreview(preset.imageUrl);
      startAnalysis();
    }
  }

  function imageUrlToBase64(url) {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        try {
          const dataURL = canvas.toDataURL('image/jpeg', 0.85);
          resolve(dataURL);
        } catch (e) {
          resolve(url);
        }
      };
      img.onerror = () => resolve(url);
      img.src = url;
    });
  }

  // ==========================================
  // IMAGE DRAG & DROP & UPLOAD
  // ==========================================
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-active');
    }, false);
  });

  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-active');
    }, false);
  });

  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      handleFileSelected(files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileSelected(e.target.files[0]);
    }
  });

  function handleFileSelected(file) {
    if (!file.type.startsWith('image/')) {
      showToast('Please upload an image file (JPG, PNG, WEBP).', 'error');
      return;
    }

    state.currentPresetHint = null;
    const reader = new FileReader();
    reader.onload = (e) => {
      state.currentImageBase64 = e.target.result;
      displayImagePreview(e.target.result);
    };
    reader.readAsDataURL(file);
  }

  function displayImagePreview(src) {
    previewImg.src = src;
    dropZone.classList.add('hidden');
    previewContainer.classList.remove('hidden');
    resultSection.classList.add('hidden');
    analyzeBtn.disabled = false;
  }

  reuploadBtn.addEventListener('click', () => {
    state.currentImageBase64 = null;
    state.currentPresetHint = null;
    previewImg.src = '';
    previewContainer.classList.add('hidden');
    dropZone.classList.remove('hidden');
    resultSection.classList.add('hidden');
    fileInput.value = '';
  });

  // ==========================================
  // WEBCAM CAMERA CAPTURE
  // ==========================================
  cameraBtn.addEventListener('click', async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        state.cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        cameraVideo.srcObject = state.cameraStream;
        cameraModal.classList.remove('hidden');
      } catch (err) {
        showToast('Camera access denied or unavailable: ' + err.message, 'error');
      }
    } else {
      showToast('Camera not supported in this browser.', 'error');
    }
  });

  closeCameraBtn.addEventListener('click', closeCamera);

  function closeCamera() {
    if (state.cameraStream) {
      state.cameraStream.getTracks().forEach(track => track.stop());
      state.cameraStream = null;
    }
    cameraModal.classList.add('hidden');
  }

  captureBtn.addEventListener('click', () => {
    if (!cameraVideo.videoWidth) return;
    cameraCanvas.width = cameraVideo.videoWidth;
    cameraCanvas.height = cameraVideo.videoHeight;
    const ctx = cameraCanvas.getContext('2d');
    ctx.drawImage(cameraVideo, 0, 0);
    const dataUrl = cameraCanvas.toDataURL('image/jpeg', 0.9);
    closeCamera();

    state.currentPresetHint = null;
    state.currentImageBase64 = dataUrl;
    displayImagePreview(dataUrl);
    playAudioTone('click');
  });

  // ==========================================
  // AI ANALYSIS & SCANNING FLOW (Backend API)
  // ==========================================
  analyzeBtn.addEventListener('click', startAnalysis);

  async function startAnalysis() {
    if (!state.currentImageBase64 || state.isScanning) return;

    state.isScanning = true;
    scanOverlay.classList.remove('hidden');
    analyzeBtn.disabled = true;
    reuploadBtn.disabled = true;
    resultSection.classList.add('hidden');

    playAudioTone('scanStart');

    // Progressive status updates
    const statusSequence = [
      'Sending to Gemini Vision Backend...',
      'Analyzing Petal Morphology & Stamen Density...',
      'Cross-referencing Global Botanical Taxonomies...',
      'Appraising Rarity Tier & Calculating Collector Wage...'
    ];

    let step = 0;
    scanStatusText.innerText = statusSequence[step];
    const statusInterval = setInterval(() => {
      step = (step + 1) % statusSequence.length;
      scanStatusText.innerText = statusSequence[step];
    }, 900);

    try {
      // Call backend API (/api/identify)
      const result = await window.botanyApiClient.identifyFlower(
        state.currentImageBase64,
        state.currentPresetHint
      );

      clearInterval(statusInterval);
      state.currentResult = result;
      displayResults(result);

      // Play victory sound according to rank
      playAudioTone(result.rank.toLowerCase().replace(' ', ''));

      // Confetti celebration if high rank
      if (['Rank SSS', 'Rank S', 'Rank A'].includes(result.rank)) {
        fireConfetti();
      }

      showToast(`Specimen Identified: ${result.commonName} (${result.rank})`, 'success');
    } catch (err) {
      clearInterval(statusInterval);
      showToast('Error during flower appraisal: ' + err.message, 'error');
      console.error(err);
    } finally {
      state.isScanning = false;
      scanOverlay.classList.add('hidden');
      analyzeBtn.disabled = false;
      reuploadBtn.disabled = false;
    }
  }

  function displayResults(data) {
    resultSection.classList.remove('hidden');
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Populate Rank Badge
    const rankBadgeEl = document.getElementById('res-rank-badge');
    rankBadgeEl.innerText = `${data.rank} • ${data.rankLabel}`;
    rankBadgeEl.style.background = data.rankGradient;
    rankBadgeEl.className = `res-rank-pill ${data.rank.toLowerCase().replace(' ', '-')}`;

    // Populate Wage Display
    document.getElementById('res-wage-value').innerText = `$${Number(data.totalWage).toFixed(2)}`;
    document.getElementById('breakdown-base').innerText = `$${Number(data.wageBreakdown.baseRate).toFixed(2)}`;
    document.getElementById('breakdown-rarity').innerText = `+$${Number(data.wageBreakdown.rarityBonus).toFixed(2)}`;
    document.getElementById('breakdown-freshness').innerText = `+$${Number(data.wageBreakdown.freshnessBonus).toFixed(2)}`;

    // Botanical Taxonomy
    document.getElementById('res-common-name').innerText = data.commonName;
    document.getElementById('res-scientific-name').innerText = data.scientificName;
    document.getElementById('res-family').innerText = data.family;
    document.getElementById('res-origin').innerText = data.origin;
    document.getElementById('res-rarity-score').innerText = `${data.rarityScore}/100`;
    document.getElementById('res-freshness-grade').innerText = data.freshnessGrade;
    document.getElementById('res-blooming-condition').innerText = data.bloomingCondition;

    // Lore & Foraging
    document.getElementById('res-medicinal-uses').innerText = data.medicinalOrCulinaryUses;
    document.getElementById('res-foraging-tips').innerText = data.foragingTips;
    document.getElementById('res-quote').innerText = `"${data.collectorQuote}"`;

    // Data Source Notice
    const noticeEl = document.getElementById('res-source-notice');
    noticeEl.innerText = `⚡ Verified via Google Gemini Vision Backend (${data.dataSource})`;
    noticeEl.classList.remove('hidden');

    // Check if already in collection
    const alreadySaved = state.collection.some(item => 
      item.scientificName.toLowerCase() === data.scientificName.toLowerCase()
    );
    if (alreadySaved) {
      addToCollectionBtn.innerText = '✅ In Collection (Claimed)';
      addToCollectionBtn.disabled = true;
    } else {
      addToCollectionBtn.innerText = `🌿 Claim $${Number(data.totalWage).toFixed(2)} Wage & Add to Herbarium`;
      addToCollectionBtn.disabled = false;
    }
  }

  // ==========================================
  // CLAIM WAGE & ADD TO HERBARIUM
  // ==========================================
  addToCollectionBtn.addEventListener('click', () => {
    if (!state.currentResult) return;

    const itemToSave = {
      ...state.currentResult,
      imageThumbnail: state.currentImageBase64,
      collectedAt: new Date().toISOString()
    };

    state.collection.unshift(itemToSave);
    saveCollection(state.collection);

    addToCollectionBtn.innerText = '✅ Wage Claimed & Saved to Herbarium!';
    addToCollectionBtn.disabled = true;

    playAudioTone('cashRegister');
    fireConfetti();
    showToast(`Claimed $${Number(itemToSave.totalWage).toFixed(2)} wage! Added to your collection.`, 'success');

    updateStats();
    renderHerbarium();
  });

  scanAnotherBtn.addEventListener('click', () => {
    reuploadBtn.click();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ==========================================
  // HERBARIUM MANAGEMENT & RENDERING
  // ==========================================
  function loadCollection() {
    try {
      const stored = localStorage.getItem('florabotany_collection') || localStorage.getItem('florabounty_collection');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn('Could not read collection from localStorage:', e);
      return [];
    }
  }

  function saveCollection(list) {
    try {
      localStorage.setItem('florabotany_collection', JSON.stringify(list));
    } catch (e) {
      console.warn('Could not save collection to localStorage:', e);
    }
  }

  function updateStats() {
    const list = state.collection;
    const totalWage = list.reduce((acc, curr) => acc + (Number(curr.totalWage) || 0), 0);
    const rareCount = list.filter(item => ['Rank SSS', 'Rank S', 'Rank A'].includes(item.rank)).length;

    totalWageStat.innerText = `$${totalWage.toFixed(2)}`;
    totalFlowersStat.innerText = list.length.toString();
    rareCountStat.innerText = rareCount.toString();

    // Determine highest rank
    const rankPriority = ['Rank SSS', 'Rank S', 'Rank A', 'Rank B', 'Rank C', 'Rank D'];
    let best = 'None';
    for (const r of rankPriority) {
      if (list.some(item => item.rank === r)) {
        best = r.replace('Rank ', '');
        break;
      }
    }
    highestRankStat.innerText = best;
  }

  function renderHerbarium() {
    const query = (searchInput.value || '').toLowerCase().trim();
    const filter = rankFilter.value;

    let filtered = state.collection.filter(item => {
      const matchesQuery = !query || 
        item.commonName.toLowerCase().includes(query) ||
        item.scientificName.toLowerCase().includes(query) ||
        item.family.toLowerCase().includes(query);

      const matchesRank = filter === 'ALL' || item.rank === filter;
      return matchesQuery && matchesRank;
    });

    if (filtered.length === 0) {
      herbariumGrid.innerHTML = '';
      emptyHerbarium.classList.remove('hidden');
      return;
    }

    emptyHerbarium.classList.add('hidden');
    herbariumGrid.innerHTML = '';

    filtered.forEach(flower => {
      const card = document.createElement('div');
      card.className = `herbarium-card rank-border-${flower.rank.toLowerCase().replace(' ', '-')}`;
      
      const dateStr = new Date(flower.collectedAt || flower.timestamp).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      card.innerHTML = `
        <div class="card-thumb-wrapper">
          <img src="${flower.imageThumbnail || 'https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=600&q=80'}" alt="${flower.commonName}" class="card-thumb" />
          <span class="card-rank-tag" style="background:${flower.rankGradient || '#34d399'}">${flower.rank}</span>
          <span class="card-wage-badge">$${Number(flower.totalWage).toFixed(2)}</span>
        </div>
        <div class="card-content">
          <h3 class="card-title">${flower.commonName}</h3>
          <p class="card-latin"><em>${flower.scientificName}</em></p>
          <div class="card-meta">
            <span>🏛️ ${flower.family}</span>
            <span>📅 ${dateStr}</span>
          </div>
          <div class="card-actions">
            <button class="view-specimen-btn" data-id="${flower.id}">View Certificate</button>
            <button class="delete-specimen-btn" data-id="${flower.id}" title="Remove specimen">🗑️</button>
          </div>
        </div>
      `;

      card.querySelector('.view-specimen-btn').addEventListener('click', () => openDetailModal(flower));
      card.querySelector('.delete-specimen-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        deleteSpecimen(flower.id);
      });

      herbariumGrid.appendChild(card);
    });
  }

  function deleteSpecimen(id) {
    if (confirm('Are you sure you want to remove this specimen from your Herbarium?')) {
      state.collection = state.collection.filter(item => item.id !== id);
      saveCollection(state.collection);
      updateStats();
      renderHerbarium();
      showToast('Specimen removed from collection.');
    }
  }

  searchInput.addEventListener('input', renderHerbarium);
  rankFilter.addEventListener('change', renderHerbarium);

  exportBtn.addEventListener('click', () => {
    if (state.collection.length === 0) {
      showToast('No specimens in Herbarium to export.', 'error');
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.collection, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `florabotany_herbarium_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Herbarium exported successfully!');
  });

  clearCollectionBtn.addEventListener('click', () => {
    if (state.collection.length === 0) return;
    if (confirm('Reset entire Herbarium collection? This cannot be undone.')) {
      state.collection = [];
      saveCollection([]);
      updateStats();
      renderHerbarium();
      showToast('Herbarium reset.');
    }
  });

  // ==========================================
  // SPECIMEN DETAIL MODAL
  // ==========================================
  function openDetailModal(flower) {
    detailModalBody.innerHTML = `
      <div class="modal-specimen-view">
        <div class="modal-specimen-img-col">
          <img src="${flower.imageThumbnail || ''}" class="modal-specimen-img" alt="${flower.commonName}" />
          <div class="modal-badge-group">
            <span class="res-rank-pill" style="background:${flower.rankGradient || '#38bdf8'}">${flower.rank} • ${flower.rankLabel}</span>
            <span class="modal-wage-tag">Valuation: $${Number(flower.totalWage).toFixed(2)}</span>
          </div>
        </div>
        <div class="modal-specimen-details-col">
          <h2>${flower.commonName}</h2>
          <p class="modal-latin"><em>${flower.scientificName}</em></p>
          <div class="detail-props-grid">
            <div><strong>Family:</strong> ${flower.family}</div>
            <div><strong>Origin:</strong> ${flower.origin}</div>
            <div><strong>Rarity:</strong> ${flower.rarityScore}/100</div>
            <div><strong>Freshness:</strong> ${flower.freshnessGrade}</div>
            <div><strong>Blooming:</strong> ${flower.bloomingCondition}</div>
            <div><strong>Appraised:</strong> ${new Date(flower.collectedAt || flower.timestamp).toLocaleString()}</div>
          </div>
          <div class="modal-section-block">
            <h4>🌿 Medicinal & Botanical Applications</h4>
            <p>${flower.medicinalOrCulinaryUses}</p>
          </div>
          <div class="modal-section-block">
            <h4>🌾 Foraging & Preservation Protocol</h4>
            <p>${flower.foragingTips}</p>
          </div>
          <div class="modal-section-block quote-block">
            <p><em>"${flower.collectorQuote}"</em></p>
          </div>
          <button class="cert-print-btn" onclick="window.print()">🖨️ Print Royal Botanical Certificate</button>
        </div>
      </div>
    `;
    detailModal.classList.remove('hidden');
  }

  closeDetailBtn.addEventListener('click', () => {
    detailModal.classList.add('hidden');
  });

  // ==========================================
  // SOUND CONTROL
  // ==========================================
  function initSoundButton() {
    if (!soundBtn) return;
    soundBtn.addEventListener('click', () => {
      state.soundEnabled = !state.soundEnabled;
      soundIcon.innerText = state.soundEnabled ? '🔊 Audio ON' : '🔇 Audio OFF';
      showToast(state.soundEnabled ? 'Audio sound effects enabled.' : 'Audio muted.');
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === cameraModal) closeCamera();
    if (e.target === detailModal) detailModal.classList.add('hidden');
  });

  // ==========================================
  // SOUND EFFECTS (Web Audio API Synthesizer)
  // ==========================================
  function playAudioTone(type) {
    if (!state.soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const now = ctx.currentTime;

      if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'scanStart') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.4);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.linearRampToValueAtTime(0.01, now + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === 'cashRegister') {
        [659, 880, 1174, 1760].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.07);
          gain.gain.setValueAtTime(0.2, now + idx * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.25);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.07);
          osc.stop(now + idx * 0.07 + 0.25);
        });
      } else if (['ranksss', 'ranks', 'mythic', 'legendary'].includes(type)) {
        [523.25, 659.25, 783.99, 1046.50, 1318.51].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.18, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.4);
        });
      } else {
        [440, 554.37, 659.25].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.15, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.3);
        });
      }
    } catch (e) {
      // Audio autoplay policy
    }
  }

  // ==========================================
  // CONFETTI CELEBRATION (Lightweight Canvas Engine)
  // ==========================================
  function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#10b981', '#34d399', '#f59e0b', '#ec4899', '#38bdf8', '#8b5cf6', '#fbbf24'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.9) * 16,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let animationFrame;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let active = 0;

      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.35;
        p.rotation += p.rotationSpeed;
        p.alpha -= 0.012;

        if (p.alpha > 0) {
          active++;
          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
          ctx.restore();
        }
      });

      if (active > 0) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        cancelAnimationFrame(animationFrame);
      }
    }

    animate();
  }

  // ==========================================
  // TOAST NOTIFICATIONS
  // ==========================================
  let toastTimeout;
  function showToast(message, type = 'info') {
    if (!toast) return;
    clearTimeout(toastTimeout);
    toast.innerText = message;
    toast.className = `toast toast-${type} show`;
    toastTimeout = setTimeout(() => {
      toast.className = 'toast';
    }, 3800);
  }
});
