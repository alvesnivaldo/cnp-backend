const sqlite3 = require("sqlite3").verbose();
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error("Erro ao abrir banco:", err.message);
  } else {
    console.log("Banco SQLite conectado.");
  }
});

// ===== BASE DE QUESTÕES =====
const questions = [
  {
    id: 1,
    subject: "Matemática",
    topic: "Básico",
    organization: "FGV",
    year: "2026",
    question: "Quanto é 2 + 2?",
    options: ["1", "2", "3", "4", "5"],
    answer: "D",
    comment: "2 + 2 = 4"
  },
  {
    id: 2,
    subject: "Português",
    topic: "Crase",
    organization: "FCC",
    year: "2026",
    question: "Assinale a alternativa correta:",
    options: [
      "Vou a praia",
      "Vou à praia",
      "Vou a uma praia",
      "Vou à uma praia"
    ],
    answer: "B",
    comment: "Crase ocorre antes de palavras femininas com artigo"
  },
  {
    id: 3,
    subject: "Raciocínio Lógico",
    topic: "Lógica",
    organization: "CESPE",
    year: "2026",
    question: "Se p então q. p é verdadeiro. Logo:",
    options: [
      "q é falso",
      "q é verdadeiro",
      "p é falso",
      "não é possível afirmar"
    ],
    answer: "B",
    comment: "Modus ponens"
  },
  {
    id: 4,
    subject: "Informática",
    topic: "Hardware",
    organization: "IDECAN",
    year: "2026",
    question: "O que é CPU?",
    options: [
      "Memória",
      "Processador",
      "Monitor",
      "Teclado",
      "Mouse"
    ],
    answer: "B",
    comment: "CPU é o processador"
  },
  {
    id: 5,
    subject: "Direito Constitucional",
    topic: "Direitos Fundamentais",
    organization: "FCC",
    year: "2026",
    question: "Os direitos fundamentais estão previstos em:",
    options: [
      "Art. 1º",
      "Art. 5º",
      "Art. 37",
      "Art. 60"
    ],
    answer: "B",
    comment: "Art. 5º da Constituição Federal"
  },
  {
    id: 6,
    subject: "Direito Administrativo",
    topic: "Atos Administrativos",
    organization: "IADES",
    year: "2026",
    question: "Ato vinculado ocorre quando:",
    options: [
      "Há liberdade total",
      "A lei define todos os elementos",
      "Depende do gestor",
      "É opcional"
    ],
    answer: "B",
    comment: "No ato vinculado a lei determina tudo"
  },
  {
    id: 7,
    subject: "Administração Pública",
    topic: "Administração",
    organization: "INSTITUTO AOCP",
    year: "2026",
    question: "Administração pública direta é:",
    options: [
      "Empresas privadas",
      "Órgãos do governo",
      "ONGs",
      "Fundações privadas"
    ],
    answer: "B",
    comment: "São órgãos do Estado"
  },
  {
    id: 8,
    subject: "Legislação",
    topic: "Lei",
    organization: "IBFC",
    year: "2026",
    question: "Lei é:",
    options: [
      "Regra jurídica",
      "Opinião",
      "Costume",
      "Doutrina"
    ],
    answer: "A",
    comment: "Lei é norma jurídica"
  },
  {
    id: 9,
    subject: "Português",
    topic: "Gramática",
    organization: "CONSULPLAN",
    year: "2026",
    question: "Plural de cidadão:",
    options: [
      "cidadões",
      "cidadãos",
      "cidadães",
      "cidadõeses"
    ],
    answer: "B",
    comment: "Plural correto: cidadãos"
  },
  {
    id: 10,
    subject: "Matemática",
    topic: "Porcentagem",
    organization: "CONSULPLAN",
    year: "2026",
    question: "10% de 200 é:",
    options: ["10", "15", "20", "25", "30"],
    answer: "C",
    comment: "10% de 200 = 20"
  }
];

// ===== ROTA =====

app.get("/questions", (req, res) => {
  res.json(questions);
});

app.post("/assinante", (req, res) => {
  const { email } = req.body;

  db.run(
    `
    INSERT OR REPLACE INTO usuarios
    (email, assinante, data_pagamento)
    VALUES (?, 1, datetime('now'))
    `,
    [email],
    function (err) {
      if (err) {
        return res.status(500).json({
          erro: err.message
        });
      }

      res.json({
        sucesso: true,
        email
      });
    }
  );
});

app.get("/assinante/:email", (req, res) => {
  const email = req.params.email;

  db.get(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, row) => {
      if (err) {
        return res.status(500).json({
          erro: err.message
        });
      }

      res.json(row || {});
    }
  );
});

app.get("/teste", (req, res) => {
  db.run(
    `
    INSERT OR REPLACE INTO usuarios
    (email, assinante, data_pagamento)
    VALUES (
      'cnp.concursos.planos@gmail.com',
      1,
      datetime('now')
    )
    `,
    (err) => {
      if (err) {
        return res.json({
          erro: err.message
        });
      }

      res.json({
        sucesso: true
      });
    }
  );
});

db.run(`
CREATE TABLE IF NOT EXISTS usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  assinante INTEGER DEFAULT 0,
  data_pagamento TEXT
)
`);

// ===== START =====
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});