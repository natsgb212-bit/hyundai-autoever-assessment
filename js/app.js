let idx = 0;
let answers = {};
let candidate = {};
let seconds = 2700;
let timer = null;
let started = null;
let submitting = false;

const $ = (id) => document.getElementById(id);

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));


/* =========================================================
   START ASSESSMENT
   ========================================================= */

$("form").onsubmit = (e) => {
  e.preventDefault();

  candidate = {
    name: $("name").value.trim(),
    email: $("email").value.trim(),
    experience: Number($("exp").value)
  };

  if (!candidate.name || !candidate.email) {
    alert("Please complete your name and email.");
    return;
  }

  started = new Date().toISOString();

  $("intro").classList.add("hidden");
  $("exam").classList.remove("hidden");

  render();

  timer = setInterval(() => {
    seconds--;
    clock();

    if (seconds <= 0) {
      clearInterval(timer);
      submit();
    }
  }, 1000);
};


/* =========================================================
   TIMER
   ========================================================= */

function clock() {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;

  $("clock").textContent =
    `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}


/* =========================================================
   RENDER QUESTION
   ========================================================= */

function render() {
  const q = QUESTIONS[idx];

  $("section").textContent = q.s;

  $("count").textContent =
    `Question ${idx + 1} of ${QUESTIONS.length}`;

  $("bar").style.width =
    ((idx + 1) / QUESTIONS.length * 100) + "%";

  let html = `
    <small>QUESTION ${idx + 1}</small>
    <h2>${esc(q.t)}</h2>
  `;

  if (q.type === "mc") {

    q.o.forEach((option, number) => {

      html += `
        <label class="option">
          <input
            type="radio"
            name="a"
            value="${number}"
            ${answers[q.id] === number ? "checked" : ""}
          >
          ${esc(option)}
        </label>
      `;

    });

  } else {

    html += `
      <label>
        Your answer
        <textarea
          id="openAnswer"
          maxlength="5000"
          placeholder="Explain your approach clearly and include relevant technical details."
        >${esc(answers[q.id] || "")}</textarea>
      </label>
    `;

  }

  $("q").innerHTML = html;


  /* Save multiple-choice answer */

  if (q.type === "mc") {

    document
      .querySelectorAll('input[name="a"]')
      .forEach((input) => {

        input.onchange = () => {
          answers[q.id] = Number(input.value);
        };

      });

  }


  /* Save open answer */

  else {

    $("openAnswer").oninput = (e) => {
      answers[q.id] = e.target.value;
    };

  }


  $("prev").disabled = idx === 0;

  $("next").textContent =
    idx === QUESTIONS.length - 1
      ? "Submit assessment"
      : "Next";

  clock();
}


/* =========================================================
   NAVIGATION
   ========================================================= */

$("prev").onclick = () => {

  if (idx > 0) {
    idx--;
    render();
  }

};


$("next").onclick = () => {

  if (idx < QUESTIONS.length - 1) {

    idx++;
    render();

  } else {

    submit();

  }

};


/* =========================================================
   SUBMIT TO SUPABASE
   ========================================================= */

async function submit() {

  if (submitting) return;

  submitting = true;

  if (timer) {
    clearInterval(timer);
    timer = null;
  }


  const payload = {

    candidate_name: candidate.name,

    candidate_email: candidate.email,

    experience_years: candidate.experience,

    started_at: started,

    finished_at: new Date().toISOString(),

    time_remaining_seconds: seconds,

    answers: answers

  };


  console.log("Submitting assessment:", payload);


  try {

    const response = await fetch(
      SUPABASE_URL + "/rest/v1/rpc/submit_assessment",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY
        },

        body: JSON.stringify({
          p_submission: payload
        })
      }
    );


    const responseText = await response.text();


    console.log(
      "Supabase response:",
      response.status,
      responseText
    );


    if (!response.ok) {

      throw new Error(
        responseText ||
        `Supabase returned HTTP ${response.status}`
      );

    }


    let result = null;

    if (responseText) {
      try {
        result = JSON.parse(responseText);
      } catch {
        result = responseText;
      }
    }


    console.log("Assessment saved:", result);


    /* Only show success AFTER Supabase confirms */

    $("exam").classList.add("hidden");

    $("done").classList.remove("hidden");


  } catch (error) {

    console.error(
      "Could not save assessment:",
      error
    );

    submitting = false;


    alert(
      "The assessment could not be saved.\n\n" +
      "Please check your internet connection and try again."
    );

  }

}
