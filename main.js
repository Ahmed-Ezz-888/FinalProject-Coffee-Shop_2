
const menuIcon = document.getElementById("menuIcon");
const mobileNav = document.getElementById("mobileNav");

if (menuIcon && mobileNav) {
  menuIcon.addEventListener("click", function () {
    mobileNav.classList.toggle("open");
  });
}


const brewGroup = document.getElementById("brewGroup");

if (brewGroup) {

  const state = {
    brew: null, // Capsule / Filter / Espresso
    bean: null, // Single Origin / Decaf / Blended
    qty: null, // 250g / 500g / 1000g
    grind: null, // Wholebean / Filter / Cafetiére
    freq: null, // Every Week / Every 2 Weeks / Every Month
  };

  const allQuestions = document.querySelectorAll(".q");

  allQuestions.forEach(function (question) {
    const head = question.querySelector(".qHead");
    head.addEventListener("click", function () {
      question.classList.toggle("open");
    });
  });

  const allGroups = document.querySelectorAll(".optGrid");

  allGroups.forEach(function (group) {
    const cards = group.querySelectorAll(".optCard");

    cards.forEach(function (card) {
      card.addEventListener("click", function () {
        if (card.classList.contains("disabled")) return;

        cards.forEach(function (c) {
          c.classList.remove("selected");
        });
        card.classList.add("selected");

      
        saveSelection(group.id, card);

        
        if (group.id === "brewGroup") {
          handleGrindAvailability(card.dataset.value);
        }

        updateSidebar();
        updateSummary();
        updateSubmitButton();
      });
    });
  });

  function saveSelection(groupId, card) {
    const label = card.dataset.label;
    if (groupId === "brewGroup") state.brew = label;
    if (groupId === "beanGroup") state.bean = label;
    if (groupId === "qtyGroup") state.qty = label;
    if (groupId === "grindGroup") state.grind = label;
    if (groupId === "freqGroup") state.freq = label;
  }


  function handleGrindAvailability(brewValue) {
    const grindCards = document.querySelectorAll("#grindGroup .optCard");
    const isCapsule = brewValue === "Capsule";

    grindCards.forEach(function (card) {
      card.classList.toggle("disabled", isCapsule);
      if (isCapsule) {
        card.classList.remove("selected");
      }
    });

    if (isCapsule) {
      state.grind = null;
    }
  }

  function updateSidebar() {
    const grindDone = state.grind !== null || state.brew === "Capsule";

    setActive("sideStep1", state.brew);
    setActive("sideStep2", state.bean);
    setActive("sideStep3", state.qty);
    setActive("sideStep4", grindDone);
    setActive("sideStep5", state.freq);
  }

  function setActive(id, value) {
    const el = document.getElementById(id);
    if (!el) return;
    if (value) {
      el.classList.add("active");
    } else {
      el.classList.remove("active");
    }
  }

  function fillBlank(id, value) {
    const span = document.getElementById(id);
    if (value) {
      span.textContent = value;
      span.classList.remove("blank");
      span.classList.add("filled");
    } else {
      span.textContent = "____";
      span.classList.remove("filled");
      span.classList.add("blank");
    }
  }

  function updateSummary() {
    const brewText = state.brew
      ? state.brew + (state.brew === "Capsule" ? "s" : "")
      : null;

    fillBlank("qBrew", brewText);
    fillBlank("qBean", state.bean);
    fillBlank("qQty", state.qty);
    fillBlank("qFreq", state.freq);

    const grindWrap = document.getElementById("qGrindWrap");
    if (state.brew && state.brew !== "Capsule") {
      const grindClass = state.grind ? "filled" : "blank";
      const grindText = state.grind ? state.grind : "____";
      grindWrap.innerHTML =
        ' ground ala <span class="' +
        grindClass +
        '" id="qGrind">' +
        grindText +
        "</span>";
    } else {
      grindWrap.innerHTML = "";
    }

    
    const verb =
      state.brew === "Filter" || state.brew === "Espresso" ? "as" : "using";

    const quote = document.getElementById("orderQuote");
    quote.childNodes[0].textContent = '\n              "I drink my coffee ' + verb + " ";
  }

  const submitBtn = document.getElementById("submitBtn");

  function updateSubmitButton() {
    const grindOk = state.brew === "Capsule" ? true : state.grind !== null;
    const allDone =
      state.brew && state.bean && state.qty && state.freq && grindOk;

    submitBtn.disabled = !allDone;

    if (allDone) {
      submitBtn.classList.remove("btnDisabled");
      submitBtn.classList.add("btnPrime");
    } else {
      submitBtn.classList.remove("btnPrime");
      submitBtn.classList.add("btnDisabled");
    }
  }

  const modalOverlay = document.getElementById("modalOverlay");
  const modalQuote = document.getElementById("modalQuote");
  const modalClose = document.getElementById("modalClose");

  submitBtn.addEventListener("click", function () {
    if (submitBtn.disabled) return;

    const verb =
      state.brew === "Filter" || state.brew === "Espresso" ? "as" : "using";
    const brewLabel = state.brew === "Capsule" ? "Capsules" : state.brew;

    let sentence =
      '&ldquo;I drink my coffee ' +
      verb +
      " <b>" +
      brewLabel +
      "</b>, with a <b>" +
      state.bean +
      "</b> type of bean. <b>" +
      state.qty +
      "</b>";

    if (state.brew !== "Capsule") {
      sentence += " ground ala <b>" + state.grind + "</b>";
    }

    sentence += ", sent to me <b>" + state.freq + "</b>.&rdquo;";

    modalQuote.innerHTML = sentence;
    modalOverlay.classList.add("open");
  });

  modalClose.addEventListener("click", function () {
    modalOverlay.classList.remove("open");
  });

  modalOverlay.addEventListener("click", function (event) {
    if (event.target === modalOverlay) {
      modalOverlay.classList.remove("open");
    }
  });
}
