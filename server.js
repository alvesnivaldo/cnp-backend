const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

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
  }
];

// ===== QUESTÕES =====

app.get("/questions", (req, res) => {
  res.json(questions);
});

// ===== ASSINANTE =====

app.post("/assinante", async (req, res) => {
  try {
    const { email } = req.body;

    const { error } = await supabase
      .from("usuarios")
      .upsert({
        email,
        assinante: 1,
        data_pagamento: new Date().toISOString()
      });

    if (error) {
      return res.status(500).json(error);
    }

    res.json({
      sucesso: true,
      email
    });
  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

app.get("/assinante/:email", async (req, res) => {
  try {
    const { email } = req.params;

    const { data, error } = await supabase
      .from("usuarios")
      .select("*")
      .eq("email", email)
      .single();

    if (error) {
      return res.json({});
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

app.get("/teste", async (req, res) => {
  try {
    const { error } = await supabase
      .from("usuarios")
      .upsert({
        email: "cnp.concursos.planos@gmail.com",
        assinante: 1,
        data_pagamento: new Date().toISOString()
      });

    if (error) {
      return res.status(500).json(error);
    }

    res.json({
      sucesso: true
    });
  } catch (err) {
    res.status(500).json({
      erro: err.message
    });
  }
});

app.get("/hotmart-webhook", (req, res) => {
  res.json({
    webhook: "ok"
  });
});

// ===== HOTMART WEBHOOK =====

app.post("/hotmart-webhook", async (req, res) => {
  try {

    console.log("Webhook Hotmart:", req.body);

    const email =
      req.body?.data?.buyer?.email ||
      req.body?.buyer?.email ||
      req.body?.email;

    if (!email) {
      return res.status(400).json({
        erro: "Email não encontrado"
      });
    }

    const { error } = await supabase
      .from("usuarios")
      .upsert({
        email,
        assinante: 1,
        data_pagamento: new Date().toISOString()
      });

    if (error) {
      console.error(error);

      return res.status(500).json(error);
    }

    res.json({
      sucesso: true,
      email
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      erro: err.message
    });

  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
