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


/* =========================
   LOGIN
   ========================= */

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


/* =========================
   LOAD CANDIDATES
   ========================= */

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


/* =========================
   CANDIDATE DETAIL
   ========================= */

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

    <h3>Multiple Choice Questions</h3>
  `;


  /* =========================
     MULTIPLE CHOICE QUESTIONS
     ========================= */

  const mcQuestions = [
    {
      id: "Q01",
      max: 3,
      options: [
        "INNER JOIN",
        "LEFT JOIN",
        "CROSS JOIN",
        "SELF JOIN"
      ],
      correct: 1
    },

    {
      id: "Q02",
      max: 3,
      options: [
        "ADD INDEX",
        "BUILD INDEX",
        "CREATE INDEX",
        "NEW INDEX"
      ],
      correct: 2
    },

    {
      id: "Q03",
      max: 3,
      options: [
        "Encrypt data",
        "Reduce database size",
        "Improve query performance",
        "Delete duplicate data"
      ],
      correct: 2
    },

    {
      id: "Q04",
      max: 3,
      options: [
        "GROUP BY",
        "UNIQUE",
        "DISTINCT",
        "DIFFERENT"
      ],
      correct: 2
    },

    {
      id: "Q07",
      max: 2,
      options: [
        "TOTAL",
        "SUM",
        "COUNT",
        "RECORDS"
      ],
      correct: 2
    },

    {
      id: "Q09",
      max: 3,
      options: [
        "A variable",
        "A blueprint for creating objects",
        "A database table",
        "A namespace"
      ],
      correct: 1
    },

    {
      id: "Q11",
      max: 3,
      options: [
        "IMPLEMENT",
        "EXTEND",
        "INHERIT",
        ":"
      ],
      correct: 3
    },

    {
      id: "Q12",
      max: 3,
      options: [
        "Improving network speed",
        "Handling runtime errors",
        "Creating reports",
        "Managing memory"
      ],
      correct: 1
    },

    {
      id: "Q13",
      max: 3,
      options: [
        "IF ELSE",
        "TRY CATCH",
        "SWITCH",
        "FOREACH"
      ],
      correct: 1
    },

    {
      id: "Q21",
      max: 3,
      options: [
        "A100=1, A200=1",
        "A100=3, A200=1",
        "A100=4",
        "Error"
      ],
      correct: 1
    },

    {
      id: "Q22",
      max: 4,
      options: [
        "A100, A300",
        "A200 only",
        "A200, A400",
        "All records"
      ],
      correct: 2
    },

    {
      id: "Q23",
      max: 4,
      options: [
        "Material was scanned correctly at UNLOAD",
        "Material was generated correctly",
        "Material was not scanned at UNLOAD",
        "ERP confirmation was successful"
      ],
      correct: 2
    },

    {
      id: "Q24",
      max: 4,
      options: [
        "User Master",
        "Production Log / Scan History",
        "Printer Configuration",
        "Work Schedule"
      ],
      correct: 1
    },

    {
      id: "Q25",
      max: 3,
      options: [
        "Barcode was duplicated",
        "Barcode was deleted by SQL Server",
        "Material was not processed or scanned at UNLOAD",
        "Network cable is disconnected"
      ],
      correct: 2
    },

    {
      id: "Q26",
      max: 3,
      options: [
        "WHERE ScanDate = CAST(GETDATE() AS DATE)",
        "WHERE ScanDate >= CAST(GETDATE() AS DATE) AND ScanDate < DATEADD(DAY,1,CAST(GETDATE() AS DATE))",
        "WHERE ScanDate = GETDATE()",
        "WHERE ScanDate LIKE '%TODAY%'"
      ],
      correct: 1
    },

    {
      id: "Q27",
      max: 3,
      options: [
        "Display the oldest successful transactions",
        "Display the latest interface errors",
        "Delete failed transactions",
        "Generate new interface records"
      ],
      correct: 1
    }
  ];


  mcQuestions.forEach(q => {

    const selectedAnswer =
      Number(data.answers?.[q.id]);

    const isCorrect =
      selectedAnswer === q.correct;

    const points =
      isCorrect ? q.max : 0;

    const selectedText =
      q.options[selectedAnswer] ??
      "[No answer]";

    const correctText =
      q.options[q.correct];

    h += `
      <div class="review">

        <h3>
          ${q.id} —
          ${points}/${q.max}
          —
          <strong>
            ${isCorrect ? "CORRECT" : "INCORRECT"}
          </strong>
        </h3>

        <p>
          <strong>Your answer:</strong>
          ${esc(selectedText)}
        </p>

        <p>
          <strong>Correct answer:</strong>
          ${esc(correctText)}
        </p>

      </div>
    `;
  });


  /* =========================
     OPEN QUESTIONS
     ========================= */

  h += `
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
          ${q} —
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
      Open questions were evaluated automatically
      using bilingual technical concepts and the
      predefined technical rubric.
    </p>
  `;


  detailEl.innerHTML = h;
  detailEl.classList.remove("hidden");
}


const detailEl =
  document.getElementById("detail");
