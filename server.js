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

app.post("/hotmart-webhook", async (req, res) => {
  try {
    const evento = req.body.event;
    const email = req.body?.data?.buyer?.email;

    console.log("Evento:", evento);
    console.log("Email:", email);

    if (!email) {
      return res.status(400).json({
        erro: "Email não encontrado"
      });
    }

    // Compra aprovada ou completa
    if (
      evento === "PURCHASE_APPROVED" ||
      evento === "PURCHASE_COMPLETE"
    ) {
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
    }

    // Compra reembolsada
    if (evento === "PURCHASE_REFUNDED") {
      const { error } = await supabase
        .from("usuarios")
        .update({
          assinante: 0
        })
        .eq("email", email);

      if (error) {
        return res.status(500).json(error);
      }
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

    
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
