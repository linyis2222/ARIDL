let demons = [];
let changeLog = [];

const API_URL = "https://aridl-database.onrender.com";

async function loadLevels() {
  try {
    const response = await fetch(`${API_URL}/api/levels`);

    if (!response.ok) {
      throw new Error("Failed to load levels");
    }

    demons = await response.json();

    buildLeftList();
  } catch (error) {
    console.error(error);

    alert("레벨 데이터를 불러오지 못했습니다.");
  }
}

async function loadChangeLog() {
  try {
    const response = await fetch(`${API_URL}/api/changelog`);

    if (!response.ok) {
      throw new Error("Failed to load changelog");
    }

    changeLog = await response.json();

    renderChangeLog();
  } catch (error) {
    console.error(error);

    alert("Change Log를 불러오지 못했습니다.");
  }
}

/* ===========================
    DOM references (전역 변수로 선언)
    =========================== */
let mapList;
let mapDetailsDiv;
let changeLogDiv;

let btnList;
let btnChangelog;

let mapRank;
let mapName;
let mapPublisher;
let mapVideo;
let mapId;
let mapGddltier;
let mapIdstier;

// 💡 검색창 요소 ID: index.html의 'search-input'과 일치하도록 수정되었습니다.
let searchInput;

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, function (m) {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m];
  });
}

// ===========================
// 좌측 리스트 생성 (검색 기능, 절대 순위, 자동 선택 기능 포함)
// ===========================
function buildLeftList() {
  if (!mapList) return;

  mapList.innerHTML = "";

  const keyword = searchInput ? searchInput.value.trim().toLowerCase() : "";
  const filteredDemons = keyword
    ? demons.filter((d) => d.name.toLowerCase().includes(keyword))
    : demons;

  let firstLiElement = null; // 첫 번째 생성된 li 요소를 저장할 변수
  let firstDemonData = null; // 첫 번째 생성된 맵의 데이터를 저장할 변수

  filteredDemons.forEach((d, index) => {
    const rank = d.rank;

    let separator = null;
    if (!keyword) {
      // ⭐️ 구분 라벨 표시: 원래 순위(rank)를 기준으로 구분선을 표시합니다.
      if (rank === 1) separator = "Main List (#1 ~ #75)";
      else if (rank === 76) separator = "Extended List (#76 ~ #150)";
      else if (rank === 151) separator = "Legacy List (#151 ~)";
    }

    if (separator) {
      const sepLi = document.createElement("li");
      sepLi.textContent = separator;
      sepLi.classList.add("separator");
      mapList.appendChild(sepLi);
    }

    const li = document.createElement("li");

    const rankSpan = document.createElement("span");
    rankSpan.textContent = `#${rank} `;
    rankSpan.style.fontWeight = "bold";
    rankSpan.style.marginRight = "6px";

    const nameSpan = document.createElement("span");
    nameSpan.textContent = d.name;
    nameSpan.classList.add("name");
    nameSpan.addEventListener("click", () => selectMap(d, li));

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
    if (mapDetailsDiv) mapDetailsDiv.style.display = "none";
  }
}

// ===========================
// map 상세 표시 (기존 selectMap 함수 그대로 유지)
// ===========================
function selectMap(demon, liElement) {
  // ⭐️ 상세 패널을 표시하고 Change Log를 숨깁니다.
  if (mapDetailsDiv) mapDetailsDiv.style.display = "";
  if (changeLogDiv) changeLogDiv.style.display = "none";

  mapRank.textContent = "#" + demon.rank;
  mapName.textContent = demon.name;
  mapPublisher.innerHTML = `<span class="tag">PUBLISHER</span><span class="value">${escapeHtml(demon.publisher)}</span>`;
  mapVideo.innerHTML = `<iframe src="${escapeHtml(demon.video)}" allowfullscreen></iframe>`;
  mapId.innerHTML = `<span class="tag">ID</span><span class="value">${escapeHtml(demon.id)}</span>`;
  mapGddltier.innerHTML = `<span class="tag">GDDL Tier</span><span class="value">${escapeHtml(demon.gddltier)}</span>`;
  mapIdstier.innerHTML = `<span class="tag">IDS Tier</span><span class="value">${escapeHtml(demon.idstier)}</span>`;

  document
    .querySelectorAll("#map-list li")
    .forEach((el) => el.classList.remove("active"));
  if (liElement) liElement.classList.add("active");

  btnList.classList.add("active");
  btnChangelog.classList.remove("active");
  btnList.setAttribute("aria-pressed", "true");
  btnChangelog.setAttribute("aria-pressed", "false");
}

// ===========================
// changeLog 표시 (기존 renderChangeLog 함수 그대로 유지)
// ===========================
function renderChangeLog() {
  if (!changeLogDiv) return;

  changeLogDiv.innerHTML = "";

  changeLog.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "change-log-entry";

    const d = document.createElement("div");
    d.className = "log-date";
    d.textContent = entry.date;

    const detail = document.createElement("div");
    detail.className = "log-detail";
    detail.textContent = entry.detail;

    row.appendChild(d);
    row.appendChild(detail);

    changeLogDiv.appendChild(row);
  });

  changeLogDiv.style.display = "block";

  if (mapDetailsDiv) {
    mapDetailsDiv.style.display = "none";
  }

  btnChangelog.classList.add("active");
  btnList.classList.remove("active");

  btnChangelog.setAttribute("aria-pressed", "true");
  btnList.setAttribute("aria-pressed", "false");
}

// ===========================
// 초기 부트 (최종 정리)
// ===========================

document.addEventListener("DOMContentLoaded", () => {
  // 1. 전역 변수에 HTML 요소 할당 (const/let 제거)
  mapList = document.getElementById("map-list");
  mapDetailsDiv = document.getElementById("map-details");
  changeLogDiv = document.getElementById("change-log");

  btnList = document.getElementById("btn-list");
  btnChangelog = document.getElementById("btn-changelog");

  mapRank = document.getElementById("map-rank");
  mapName = document.getElementById("map-name");
  mapPublisher = document.getElementById("map-publisher");
  mapVideo = document.getElementById("map-video");
  mapId = document.getElementById("map-id");
  mapGddltier = document.getElementById("map-gddltier");
  mapIdstier = document.getElementById("map-idstier");

  // ⭐️ HTML ID와 일치하도록 수정
  searchInput = document.getElementById("search-input");

  if (!mapList) {
    console.error(
      "Error: 'map-list' ID를 가진 HTML 요소를 찾을 수 없습니다. index.html을 확인해주세요.",
    );
    return;
  }

  // 2. 버튼 이벤트 리스너 재정의
  if (btnList) {
    btnList.addEventListener("click", () => {
      // ⭐ 페이지 전환 추가
      mainPage.classList.remove("active");
      listPage.classList.add("active");

      btnList.classList.add("active");
      btnChangelog.classList.remove("active");
      btnMain.classList.remove("active");

      btnList.setAttribute("aria-pressed", "true");
      btnChangelog.setAttribute("aria-pressed", "false");
      btnMain.setAttribute("aria-pressed", "false");

      buildLeftList();
    });
  }

  if (btnChangelog) {
    btnChangelog.addEventListener("click", () => {
      mainPage.classList.remove("active");
      listPage.classList.add("active");

      loadChangeLog();
    });
  }

  // 3. 초기 맵 리스트 생성 및 첫 번째 항목 자동 선택
  loadLevels();

  // 4. 검색창 입력 이벤트 리스너 추가
  if (searchInput) {
    searchInput.addEventListener("input", () => buildLeftList());
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

    btnMain.setAttribute("aria-pressed", "true");
    btnList.setAttribute("aria-pressed", "false");
    btnChangelog.setAttribute("aria-pressed", "false");
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

let developerToken = null;

const developerButton = document.getElementById("developer-button");

const developerLogin = document.getElementById("developer-login");

const developerPassword = document.getElementById("developer-password");

const developerLoginButton = document.getElementById("developer-login-button");

const developerLoginClose = document.getElementById("developer-login-close");

const developerLoginError = document.getElementById("developer-login-error");

const developerPage = document.getElementById("developer-page");

developerButton.addEventListener("click", () => {
  developerLogin.style.display = "flex";

  developerPassword.focus();
});

developerLoginClose.addEventListener("click", () => {
  developerLogin.style.display = "none";

  developerPassword.value = "";
});

developerLoginButton.addEventListener("click", async () => {
  const password = developerPassword.value;

  try {
    const response = await fetch(`${API_URL}/api/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      developerLoginError.textContent = "잘못된 비번이다 바부야.";

      return;
    }

    developerToken = data.token;

    developerLogin.style.display = "none";

    developerPage.style.display = "block";

    mainPage.classList.remove("active");
    listPage.classList.remove("active");
  } catch (error) {
    console.error(error);

    developerLoginError.textContent = "Server error.";
  }
});

document
  .getElementById("add-level-button")
  .addEventListener("click", async () => {
    const rank = Number(document.getElementById("add-rank").value);

    const level = {
      rank: rank,
      name: document.getElementById("add-name").value,
      publisher: document.getElementById("add-publisher").value,
      video: document.getElementById("add-video").value,
      id: document.getElementById("add-id").value,
      gddltier: document.getElementById("add-gddltier").value,
      idstier: document.getElementById("add-idstier").value,
    };

    // 현재 레벨 목록 저장
    const oldLevels = [...demons];

    const response = await fetch(`${API_URL}/api/levels`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${developerToken}`,
      },

      body: JSON.stringify(level),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert("Level added!");

    // 새 레벨을 포함한 목록
    await loadLevels();

    // 현재 demons를 rank 순서로 정렬
    const sortedLevels = [...demons].sort(
      (a, b) => Number(a.rank) - Number(b.rank)
    );

    const newLevel = sortedLevels.find(
      (l) => String(l.id) === String(level.id)
    );

    if (!newLevel) {
      return;
    }

    const newRank = Number(newLevel.rank);

    const aboveLevel = sortedLevels.find(
      (l) => Number(l.rank) === newRank - 1
    );

    const belowLevel = sortedLevels.find(
      (l) => Number(l.rank) === newRank + 1
    );

    let logText = "";

    // 1위
    if (newRank === 1) {
      if (belowLevel) {
        logText =
          `${newLevel.name} has been placed at #${newRank}, ` +
          `below ${belowLevel.name}.`;
      }
    }

    // 마지막 순위
    else if (!aboveLevel) {
      if (belowLevel) {
        logText =
          `${newLevel.name} has been placed at #${newRank}, ` +
          `above ${belowLevel.name}.`;
      }
    }

    // 중간
    else if (aboveLevel && belowLevel) {
      logText =
        `${newLevel.name} has been placed at #${newRank}, ` +
        `above ${aboveLevel.name} and below ${belowLevel.name}.`;
    }

    if (logText) {
      setChangeLog(logText);
    }
  });

document
  .getElementById("load-edit-level")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit-id").value;

    if (!id) {
      alert("Level ID를 입력하세요.");
      return;
    }

    const response = await fetch(`${API_URL}/api/levels/${id}`);

    if (!response.ok) {
      alert("Level not found.");

      return;
    }

    const level = await response.json();

    document.getElementById("edit-name").value = level.name;

    document.getElementById("edit-publisher").value = level.publisher;

    document.getElementById("edit-video").value = level.video;

    document.getElementById("edit-gddltier").value = level.gddltier;

    document.getElementById("edit-idstier").value = level.idstier;
  });

document
  .getElementById("edit-level-button")
  .addEventListener("click", async () => {
    const id = document.getElementById("edit-id").value;

    // 수정 전 레벨 찾기
    const oldLevel = demons.find(
      (l) => String(l.id) === String(id)
    );

    if (!oldLevel) {
      alert("수정할 레벨을 찾을 수 없습니다.");
      return;
    }

    const oldRank = Number(oldLevel.rank);

    const level = {
      name: document.getElementById("edit-name").value,
      publisher: document.getElementById("edit-publisher").value,
      video: document.getElementById("edit-video").value,
      gddltier: document.getElementById("edit-gddltier").value,
      idstier: document.getElementById("edit-idstier").value,
      rank: Number(document.getElementById("editRank").value),
    };

    const newRank = level.rank;

    const response = await fetch(`${API_URL}/api/levels/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${developerToken}`,
      },

      body: JSON.stringify(level),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);
      return;
    }

    alert("Level updated!");

    await loadLevels();

    // demons 사용
    const sortedLevels = [...demons].sort(
      (a, b) => Number(a.rank) - Number(b.rank)
    );

    const updatedLevel = sortedLevels.find(
      (l) => String(l.id) === String(id)
    );

    if (!updatedLevel) return;

    // 순위가 바뀐 경우에만 Change Log 자동 생성
    if (oldRank !== newRank) {
      const aboveLevel = sortedLevels.find(
        (l) => Number(l.rank) === newRank - 1
      );

      const belowLevel = sortedLevels.find(
        (l) => Number(l.rank) === newRank + 1
      );

      let logText = "";

      if (newRank === 1) {
        if (belowLevel) {
          logText =
            `${updatedLevel.name} has been placed at #${newRank}, ` +
            `below ${belowLevel.name}.`;
        }
      } else if (!belowLevel) {
        if (aboveLevel) {
          logText =
            `${updatedLevel.name} has been placed at #${newRank}, ` +
            `above ${aboveLevel.name}.`;
        }
      } else if (aboveLevel && belowLevel) {
        logText =
          `${updatedLevel.name} has been placed at #${newRank}, ` +
          `above ${aboveLevel.name} and below ${belowLevel.name}.`;
      }

      if (logText) {
        setChangeLog(logText);
      }
    }
  });

document
  .getElementById("add-log-button")
  .addEventListener("click", async () => {
    const log = {
      date: document.getElementById("log-date").value,

      detail: document.getElementById("log-detail").value,
    };

    const response = await fetch(`${API_URL}/api/changelog`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${developerToken}`,
      },

      body: JSON.stringify(log),
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error);

      return;
    }

    alert("Change Log added!");

    document.getElementById("log-date").value = "";

    document.getElementById("log-detail").value = "";
  });

document.getElementById("developer-logout").addEventListener("click", () => {
  developerToken = null;

  developerPage.style.display = "none";

  showMain();
});

const deleteIdInput = document.getElementById("delete-id");
const deleteLevelButton = document.getElementById("delete-level-button");

if (deleteLevelButton) {
  deleteLevelButton.addEventListener("click", async () => {
    const id = deleteIdInput.value.trim();

    if (!id) {
      alert("Level ID를 입력해주세요.");
      return;
    }

    const targetLevel = demons.find(
      (l) => String(l.id) === String(id)
    );

    if (!targetLevel) {
      alert("해당 레벨을 찾을 수 없습니다.");
      return;
    }

    const confirmed = confirm(
      `정말 ID ${id} 레벨을 삭제하시겠습니까?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/api/levels/${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${developerToken}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "레벨 삭제에 실패했습니다.");
        return;
      }

      alert(`"${data.level.name}" 레벨이 삭제되었습니다.`);

      const deletedName = targetLevel.name;
      const deletedRank = Number(targetLevel.rank);

      deleteIdInput.value = "";

      await loadLevels();

      // 삭제 후 남은 레벨 정렬
      const sortedLevels = [...levels].sort(
        (a, b) => Number(a.rank) - Number(b.rank)
      );

      // 삭제된 자리에 있던 다음 레벨
      const nextLevel = sortedLevels.find(
        (l) => Number(l.rank) === deletedRank
      );

      let logText =
        `${deletedName} has been removed from the list at #${deletedRank}.`;

      if (logText) {
        setChangeLog(logText);
      }

    } catch (error) {
      console.error(error);
      alert("서버와 통신할 수 없습니다. \n (아마도 괜찮을겁니다.)");
    }
  });
}

// 로그 템플릿

const logDetail = document.getElementById("log-detail");

document.querySelectorAll(".log-template").forEach((button) => {
  button.addEventListener("click", () => {
    logDetail.value = button.dataset.template;

    // 텍스트를 넣은 뒤 textarea에 포커스
    logDetail.focus();

    // 커서를 맨 뒤로 이동
    logDetail.setSelectionRange(
      logDetail.value.length,
      logDetail.value.length
    );
  });
});


// 리스트 숨기기
const toggleListBtn = document.getElementById("toggle-list-btn");
const leftPanel = document.getElementById("left-panel");

function updateToggleButtonPosition() {
  if (leftPanel.classList.contains("list-hidden")) {
    toggleListBtn.style.left = "0px";
    return;
  }

  const rect = leftPanel.getBoundingClientRect();

  toggleListBtn.style.left = `${rect.right}px`;
}

toggleListBtn.addEventListener("click", () => {
  const hidden = leftPanel.classList.toggle("list-hidden");

  if (hidden) {
    toggleListBtn.textContent = "›";
    toggleListBtn.setAttribute("aria-label", "Show List");
  } else {
    toggleListBtn.textContent = "‹";
    toggleListBtn.setAttribute("aria-label", "Hide List");
  }

  // 리스트가 나타난 다음 위치 계산
  requestAnimationFrame(updateToggleButtonPosition);
});


// 화면 크기 변경
window.addEventListener("resize", updateToggleButtonPosition);


// 리스트 크기가 변경될 때마다 자동으로 위치 갱신
const resizeObserver = new ResizeObserver(() => {
  updateToggleButtonPosition();
});

resizeObserver.observe(leftPanel);


// 페이지가 완전히 로드된 후 계산
window.addEventListener("load", () => {
  requestAnimationFrame(updateToggleButtonPosition);
});

// 초기 계산
requestAnimationFrame(updateToggleButtonPosition);


// 로그 입력칸 자동 변경

function getLevelName(level) {
  return level?.name || "";
}

function setChangeLog(text) {
  const logDetail = document.getElementById("log-detail");

  if (logDetail) {
    logDetail.value = text;
    logDetail.focus();

    logDetail.setSelectionRange(
      logDetail.value.length,
      logDetail.value.length
    );
  }
}