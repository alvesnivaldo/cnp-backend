import { useState, useEffect } from "react";
import questoes from "./questoes";
console.log("QUESTOES:", questoes);

function Simulado({ filtros, voltar }) {

  // 🔥 FILTRAR QUESTÕES
  const questoesFiltradas = questoes.filter((q) => {

    return (

      q.disciplina === filtros.disciplina &&

      q.assunto === filtros.assunto &&

      q.cargos?.includes(filtros.cargo) &&

      q.nivel === filtros.nivel &&

      q.ano === filtros.ano

    );

  }).slice(0, filtros.quantidade);

  console.log("QUESTOES FILTRADAS:", questoesFiltradas);
    
  // 🔥 RESPOSTAS
  const [respostas, setRespostas] = useState({});

  // 🔥 RESULTADO
  const [resultado, setResultado] = useState(null);

  // ⏰ TEMPO
  const [tempo, setTempo] = useState(60 * 60);

  // ⏰ CONTADOR
  useEffect(() => {

    if (resultado) return;

    const intervalo = setInterval(() => {

      setTempo((tempoAtual) => {

        if (tempoAtual <= 1) {
          clearInterval(intervalo);

          if (!resultado) {
            finalizarSimulado();
          }

          return 0;

        }

        return tempoAtual - 1;

      });

    }, 1000);

    return () => clearInterval(intervalo);

  }, [resultado]);

  // 🔥 MARCAR RESPOSTA
  function marcarResposta(indiceQuestao, indiceResposta) {

    setRespostas({

      ...respostas,

      [indiceQuestao]: indiceResposta

    });

  }

  // 🔥 FINALIZAR
  function finalizarSimulado() {

    let acertos = 0;

    questoesFiltradas.forEach((q, i) => {

      if (respostas[i] === q.correta) {

        acertos++;

      }

    });

    const porcentagem = Math.round(
      (acertos / questoesFiltradas.length) * 100
    );

    setResultado({

      acertos,

      total: questoesFiltradas.length,

      porcentagem

    });

  }

  return (

    <div
      style={{
        maxWidth: 900,
        margin: "auto",
        padding: 30
      }}
    >

      <h1>📘 SIMULADO</h1>

      {/* ⏰ CONTADOR */}
      <div
        style={{
          textAlign: "center",
          fontSize: 40,
          fontWeight: "bold",
          marginBottom: 40,
          color: tempo <= 300 ? "#f44336" : "#000"
        }}
      >

        ⏰ {String(Math.floor(tempo / 60)).padStart(2, "0")}:
        {String(tempo % 60).padStart(2, "0")}

      </div>

      {/* 🔥 QUESTÕES */}
      {questoesFiltradas?.map((q, i) => (

        <div
          key={i}
          style={{
            marginBottom: 40
          }}
        >

          <p
            style={{
              fontWeight: "bold",
              fontSize: 22
            }}
          >
            {i + 1}. {q.pergunta}
          </p>

          {q.alternativas?.map((op, j) => { 

            const marcada = respostas[i] === j;

            const correta = q.correta === j;

            let background = "transparent";

            let color = "#000";

            // 🔥 APÓS FINALIZAR
            if (resultado) {

              // ✅ CORRETA
              if (correta) {

                background = "#4caf50";
                color = "#fff";

              }

              // ❌ ERRADA
              if (marcada && !correta) {

                background = "#f44336";
                color = "#fff";

              }

            }

            return (

              <label
                key={j}
                style={{
                  display: "block",
                  marginBottom: 12,
                  padding: 15,
                  borderRadius: 8,
                  background,
                  color,
                  cursor: "pointer",
                  fontSize: 18
                }}
              >

                <input
                  type="radio"
                  name={`q${i}`}
                  value={j}
                  checked={respostas[i] === j}
                  onChange={() =>
                    marcarResposta(i, j)
                  }
                  disabled={resultado}
                />

                {" "}

                {["A", "B", "C", "D", "E"][j]}) {op}

              </label>

            );

          })}
 

          {/* ✅ GABARITO COMENTADO */}
          {resultado && (

            <div
              style={{
                marginTop: 20,
                background: "#f5f5f5",
                padding: 20,
                borderRadius: 10,
                borderLeft: "6px solid #4caf50"
              }}
            >

              <strong>
                ✅ Gabarito Comentado
              </strong>

              <p
                style={{
                  marginTop: 10,
                  lineHeight: 1.6
                }}
              >

                {q.comentario}

              </p>

            </div>

          )}

        </div>

      ))}

      {/* ✅ RESULTADO */}
      {resultado && (

        <div
          style={{
            background: "#fff",
            padding: 25,
            borderRadius: 10,
            marginBottom: 20
          }}
        >

          <h2>
            ✅ Resultado Final
          </h2>

          <p>
            Acertos: {resultado.acertos}
          </p>

          <p>
            Total: {resultado.total}
          </p>

          <p>
            Aproveitamento:
            {" "}
            {resultado.porcentagem}%
          </p>

        </div>

      )}

      {/* ✅ FINALIZAR */}
      {!resultado && (

        <button
          onClick={finalizarSimulado}
          style={{
            padding: 14,
            width: "100%",
            background: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            marginTop: 20,
            cursor: "pointer",
            fontSize: 18
          }}
        >
          ✅ FINALIZAR SIMULADO
        </button>

      )}

      {/* 🔥 VOLTAR */}
      <button
        onClick={voltar}
        style={{
          padding: 14,
          width: "100%",
          background: "#3b63c6",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          marginTop: 20,
          cursor: "pointer",
          fontSize: 18
        }}
      >
        ⬅ Voltar
      </button>

    </div>

  );

}

export default Simulado;