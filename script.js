const demons = [
  {
    name: "Parallel Theory",
    publisher: "SktLife",
    video: "https://www.youtube.com/embed/3qY9P9XVdls",
    id: "100239627",
    gddltier: "20",
    idstier: "-"
  },
  {
    name: "in canon",
    publisher: "cordeaux",
    video: "https://www.youtube.com/embed/YcPsb0C2sdc",
    id: "80575901",
    gddltier: "20",
    idstier: "Extreme"
  },
  {
    name: "smohcs",
    publisher: "durianhead",
    video: "https://www.youtube.com/embed/pyZQkdCBGzk",
    id: "52448794",
    gddltier: "21",
    idstier: "Extreme"
  },
  {
    name: "teehee colon three",
    publisher: "Wolvyy",
    video: "https://www.youtube.com/embed/NIcEmXpeI68",
    id: "90661998",
    gddltier: "20",
    idstier: "Extreme"
  },
  {
    name: "Hakaitsu",
    publisher: "ImNotCriko",
    video: "https://www.youtube.com/embed/uKUbzE_FcrM",
    id: "118995602",
    gddltier: "21",
    idstier: "Extreme"
  },
  {
    name: "Aurora",
    publisher: "hasuopf",
    video: "https://www.youtube.com/embed/izIanwLeZGk",
    id: "108190614",
    gddltier: "21",
    idstier: "Extreme"
  },
  {
    name: "Dragonlocked",
    publisher: "FrostDragonGD",
    video: "https://www.youtube.com/embed/lSyf-c-7Uyo",
    id: "72211008",
    gddltier: "20",
    idstier: "Extreme"
  },
  {
    name: "Theory of Visible v3",
    publisher: "BlueLite",
    video: "https://www.youtube.com/embed/PmdrpdEo518",
    id: "376609046",
    gddltier: "20",
    idstier: "Extreme"
  },
  {
    name: "Night Life",
    publisher: "para",
    video: "https://www.youtube.com/embed/Rrcb9mYNd6o",
    id: "58620226",
    gddltier: "20",
    idstier: "Extreme"
  },
  {
    name: "Mind Machine",
    publisher: "Aimbotter",
    video: "https://www.youtube.com/embed/Y6mrx-LQWjs",
    id: "78873287",
    gddltier: "20",
    idstier: "Extreme"
  },
  {
    name: "Injection",
    publisher: "Cinemat",
    video: "https://www.youtube.com/embed/6BUEWlNxQJY",
    id: "89039492",
    gddltier: "20",
    idstier: "Extreme"
  },
  {
    name: "Darkest Highway",
    publisher: "bosjoker",
    video: "https://www.youtube.com/embed/D9cmNMbZHqI",
    id: "78397973",
    gddltier: "20",
    idstier: "Extreme"
  },
];

/* ===========================
   changeLog 데이터 (요청한 예시 2개 포함)
   - 'detail' 필드에 단순 텍스트(글)만 들어갑니다.
   - 날짜는 문자열(YYYY-MM-DD 또는 로컬 포맷)로 표기.
   =========================== */
const changeLog = [
  { date: '2026-04-15', detail: 'Parallel Theory has been placed at #1, above in canon.' },
  { date: '2026-04-13', detail: 'Darkest Highway has been placed at #11, below Injection.' },
  { date: '2026-04-13', detail: 'Injection has been placed at #10, below Mind Machine.' },
  { date: '2026-04-13', detail: 'Mind Machine has been placed at #9, below Night Life.' },
  { date: '2026-04-13', detail: 'Night Life has been placed at #8, below Theory of Visible v3.' },
  { date: '2026-04-13', detail: 'Theory of Visible v3 has been placed at #7, below Dragonlocked.' },
  { date: '2026-04-13', detail: 'Dragonlocked has been placed at #6, below Aurora.' },
  { date: '2026-04-13', detail: 'Aurora has been placed at #5, below Hakaitsu.' },
  { date: '2026-03-29', detail: 'Hakaitsu has been placed at #4, below teehee colon three.' },
  { date: '2026-03-29', detail: 'teehee colon three has been placed at #3, below smohcs.' },
  { date: '2026-03-24', detail: 'smohcs has been placed at #2, below in canon.' },
  { date: '2026-03-24', detail: 'in canon has been placed at #1.' },
  { date: '2026-03-24', detail: 'List Created' }
];

/* ===========================
    DOM references (전역 변수로 선언)
    =========================== */
let mapList;
let mapDetailsDiv;
let changeLogDiv;

let btnList;
let btnChangelog;

let mapName;
let mapPublisher;
let mapVideo;
let mapId;
let mapGddltier;
let mapIdstier;

// 💡 검색창 요소 ID: index.html의 'search-input'과 일치하도록 수정되었습니다.
let searchInput; 

function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, function(m) {
        return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m];
    });
}

// ===========================
// 좌측 리스트 생성 (검색 기능, 절대 순위, 자동 선택 기능 포함)
// ===========================
function buildLeftList() {
    if (!mapList) return;

    mapList.innerHTML = '';
    
    const keyword = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const filteredDemons = keyword
        ? demons.filter(d => d.name.toLowerCase().includes(keyword))
        : demons;

    let firstLiElement = null; // 첫 번째 생성된 li 요소를 저장할 변수
    let firstDemonData = null; // 첫 번째 생성된 맵의 데이터를 저장할 변수

    filteredDemons.forEach((d, index) => {
        // ⭐️ 원본 순위 계산: demons 배열에서 원래 위치를 찾아 순위를 계산합니다.
        const originalIndex = demons.findIndex(item => item.name === d.name); 
        const rank = originalIndex !== -1 ? originalIndex + 1 : index + 1;

        let separator = null;
        if (!keyword) { 
            // ⭐️ 구분 라벨 표시: 원래 순위(rank)를 기준으로 구분선을 표시합니다.
            if (rank === 1) separator = "Main List (#1 ~ #75)";
            else if (rank === 76) separator = "Extended List (#76 ~ #150)";
            else if (rank === 151) separator = "Legacy List (#151 ~)";
        }

        if (separator) {
            const sepLi = document.createElement('li');
            sepLi.textContent = separator;
            sepLi.classList.add('separator');
            mapList.appendChild(sepLi);
        }

        const li = document.createElement('li');
        
        const rankSpan = document.createElement('span');
        rankSpan.textContent = `#${rank} `;
        rankSpan.style.fontWeight = 'bold';
        rankSpan.style.marginRight = '6px';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = d.name;
        nameSpan.classList.add('name');
        nameSpan.addEventListener('click', () => selectMap(d, li));

        li.appendChild(rankSpan);
        li.appendChild(nameSpan);
        mapList.appendChild(li);

        // ⭐️ 자동 선택 로직: 리스트를 새로 만들 때 첫 번째 맵을 저장합니다.
        if (!firstLiElement) {
            firstLiElement = li;
            firstDemonData = d;
        }
    });
    
    // ⭐️ 리스트 생성 완료 후, 첫 번째 항목을 자동으로 선택합니다.
    if (firstDemonData && firstLiElement) {
        selectMap(firstDemonData, firstLiElement);
    } else {
        // 검색 결과가 없을 때 상세 정보를 숨깁니다.
        if (mapDetailsDiv) mapDetailsDiv.style.display = 'none';
    }
}

// ===========================
// map 상세 표시 (기존 selectMap 함수 그대로 유지)
// ===========================
function selectMap(demon, liElement) {
    // ⭐️ 상세 패널을 표시하고 Change Log를 숨깁니다.
    if (mapDetailsDiv) mapDetailsDiv.style.display = '';
    if (changeLogDiv) changeLogDiv.style.display = 'none';

    mapName.textContent = demon.name;
    mapPublisher.innerHTML = `<span class="tag">PUBLISHER</span><span class="value">${escapeHtml(demon.publisher)}</span>`;
    mapVideo.innerHTML = `<iframe src="${escapeHtml(demon.video)}" allowfullscreen></iframe>`;
    mapId.innerHTML = `<span class="tag">ID</span><span class="value">${escapeHtml(demon.id)}</span>`;
    mapGddltier.innerHTML = `<span class="tag">GDDL Tier</span><span class="value">${escapeHtml(demon.gddltier)}</span>`;
    mapIdstier.innerHTML = `<span class="tag">IDS Tier</span><span class="value">${escapeHtml(demon.idstier)}</span>`;
  

    document.querySelectorAll('#map-list li').forEach(el => el.classList.remove('active'));
    if (liElement) liElement.classList.add('active');

    btnList.classList.add('active');
    btnChangelog.classList.remove('active');
    btnList.setAttribute('aria-pressed', 'true');
    btnChangelog.setAttribute('aria-pressed', 'false');
}

// ===========================
// changeLog 표시 (기존 renderChangeLog 함수 그대로 유지)
// ===========================
function renderChangeLog() {
    if (!changeLogDiv) return;

    changeLogDiv.innerHTML = '';

    changeLog.forEach((entry) => {
        const row = document.createElement('div');
        row.className = 'change-log-entry';

        const d = document.createElement('div');
        d.className = 'log-date';
        d.textContent = entry.date;

        const detail = document.createElement('div');
        detail.className = 'log-detail';
        detail.textContent = entry.detail;

        row.appendChild(d);
        row.appendChild(detail);
        changeLogDiv.appendChild(row);
    });

    // ⭐️ Change Log를 표시하고 상세 패널을 숨깁니다.
    changeLogDiv.style.display = 'block';
    if (mapDetailsDiv) mapDetailsDiv.style.display = 'none';

    btnChangelog.classList.add('active');
    btnList.classList.remove('active');
    btnChangelog.setAttribute('aria-pressed', 'true');
    btnList.setAttribute('aria-pressed', 'false');
}


// ===========================
// 초기 부트 (최종 정리)
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // 1. 전역 변수에 HTML 요소 할당 (const/let 제거)
    mapList = document.getElementById('map-list');
    mapDetailsDiv = document.getElementById('map-details');
    changeLogDiv = document.getElementById('change-log');

    btnList = document.getElementById('btn-list');
    btnChangelog = document.getElementById('btn-changelog');
    
    mapName = document.getElementById('map-name');
    mapPublisher = document.getElementById('map-publisher');
    mapVideo = document.getElementById('map-video');
    mapId = document.getElementById('map-id');
    mapGddltier = document.getElementById('map-gddltier');
    mapIdstier = document.getElementById('map-idstier');
  
    
    // ⭐️ HTML ID와 일치하도록 수정
    searchInput = document.getElementById('search-input'); 

    if (!mapList) {
        console.error("Error: 'map-list' ID를 가진 HTML 요소를 찾을 수 없습니다. index.html을 확인해주세요.");
        return; 
    }
    
    // 2. 버튼 이벤트 리스너 재정의
    if (btnList) {
        btnList.addEventListener('click', () => {

    // ⭐ 페이지 전환 추가
    mainPage.classList.remove("active");
    listPage.classList.add("active");

    btnList.classList.add('active');
    btnChangelog.classList.remove('active');
    btnMain.classList.remove('active');

    btnList.setAttribute('aria-pressed', 'true');
    btnChangelog.setAttribute('aria-pressed', 'false');
    btnMain.setAttribute('aria-pressed', 'false');

    buildLeftList();
});
    }

    if (btnChangelog) {
        btnChangelog.addEventListener('click', () => {

    mainPage.classList.remove("active");
    listPage.classList.add("active");

    renderChangeLog();
});
    }

    // 3. 초기 맵 리스트 생성 및 첫 번째 항목 자동 선택
    buildLeftList();

    // 4. 검색창 입력 이벤트 리스너 추가
    if (searchInput) {
        searchInput.addEventListener('input', () => buildLeftList());
    }
// ===========================
// Main / List 페이지 전환 추가
// ===========================

const mainPage = document.getElementById("main-page");
const listPage = document.getElementById("list-page");
const btnMain = document.getElementById("btn-main");
const viewListBtn = document.getElementById("view-list-btn");

function showMain() {
    mainPage.classList.add("active");
    listPage.classList.remove("active");

    btnMain.classList.add("active");
    btnList.classList.remove("active");
    btnChangelog.classList.remove("active");

    btnMain.setAttribute('aria-pressed', 'true');
    btnList.setAttribute('aria-pressed', 'false');
    btnChangelog.setAttribute('aria-pressed', 'false');
}

function showList() {
    mainPage.classList.remove("active");
    listPage.classList.add("active");

    btnList.click();
}

if (btnMain) btnMain.addEventListener("click", showMain);
if (viewListBtn) viewListBtn.addEventListener("click", showList);

// ⭐ 시작할 때 Main 강제
showMain();
});
