const sb = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

const esc = s =>
  String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

let selected = null;

document.getElementById("loginForm").onsubmit = async e => {
  e.preventDefault();

  const { error } = await sb.auth.signInWithPassword({
    email: hrEmail.value,
    password: hrPassword.value
  });

  if (error) {
    loginMsg.textContent = error.message;
    return;
  }

  login.classList.add("hidden");
  dash.classList.remove("hidden");

  load();
};


async function signout() {
  await sb.auth.signOut();
  location.reload();
}


async function load() {

  const {
    data,
    error
  } = await sb
    .from("assessment_submissions")
    .select("*")
    .order("finished_at", { ascending: false });

  if (error) {
    table.innerHTML =
      `<p class="error">${esc(error.message)}</p>`;
    return;
  }

  let h = `
    <table class="table">
      <tr>
        <th>Candidate</th>
        <th>Date</th>
        <th>Auto</th>
        <th>Open</th>
        <th>Final</th>
        <th>Status</th>
      </tr>
  `;

  (data || []).forEach(x => {

    const b = x.breakdown || {};

    const auto =
      Number(b.automatic_total ?? 0);

    const open =
      Number(b.open_total ?? 0);

    const final =
      Number(b.final_score ?? x.score ?? 0);

    const passed =
      Boolean(x.passed);

    h += `
      <tr>
        <td>
          <button
            class="candidateBtn"
            onclick="detail('${x.id}')">
            ${esc(x.candidate_name)}
          </button>
        </td>

        <td>
          ${new Date(x.finished_at).toLocaleString()}
        </td>

        <td>
          ${auto}/50
        </td>

        <td>
          ${open}/50
        </td>

        <td>
          <b>${final}/100</b>
        </td>

        <td>
          <span class="status ${passed ? "pass" : "fail"}">
            ${passed ? "PASS" : "FAIL"}
          </span>
        </td>
      </tr>
    `;
  });

  h += `</table>`;

  table.innerHTML = h;
}


async function detail(id) {

  const {
    data,
    error
  } = await sb
    .from("assessment_submissions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert(error.message);
    return;
  }

  selected = data;

  const b = data.breakdown || {};

  const auto =
    Number(b.automatic_total ?? 0);

  const open =
    Number(b.open_total ?? 0);

  const final =
    Number(b.final_score ?? data.score ?? 0);

  const passed =
    Boolean(data.passed);

  const openBreakdown =
    b.open_breakdown || {};

  let h = `
    <small>CANDIDATE DETAIL</small>

    <h2>
      ${esc(data.candidate_name)}
    </h2>

    <p>
      ${esc(data.candidate_email)}
      · ${data.experience_years ?? 0} years
      · ${new Date(data.finished_at).toLocaleString()}
    </p>

    <div class="score">
      Auto: ${auto}/50
    </div>

    <div class="score">
      Open: ${open}/50
    </div>

    <div class="score">
      Final: <strong>${final}/100</strong>
    </div>

    <div class="score">
      Status:
      <strong>
        ${passed ? "PASS" : "FAIL"}
      </strong>
    </div>

    <hr>

    <h3>Open Question Scores</h3>
  `;


  const openQuestions = [
    ["Q05", 5],
    ["Q06", 5],
    ["Q08", 6],
    ["Q10", 5],
    ["Q14", 5],
    ["Q15", 6],
    ["Q16", 3],
    ["Q17", 3],
    ["Q18", 3],
    ["Q19", 3],
    ["Q20", 3],
    ["Q28", 1],
    ["Q29", 2]
  ];


  openQuestions.forEach(([q, max]) => {

    const result =
      openBreakdown[q]?.score ?? 0;

    const answer =
      data.answers?.[q] || "[No answer]";

    h += `
      <div class="review">

        <h3>
          ${q}
          —
          ${result}/${max}
        </h3>

        <div class="answerbox">
          ${esc(answer)}
        </div>

      </div>
    `;
  });


  h += `
    <hr>

    <h3>
      Automatic Evaluation
    </h3>

    <p>
      The open questions were evaluated
      automatically using bilingual
      technical concepts and the predefined rubric.
    </p>
  `;

  detailEl.innerHTML = h;
  detailEl.classList.remove("hidden");
}


const detailEl =
  document.getElementById("detail");
