import { useState } from "react";
import Simulado from "./Simulado";

function App() {

  const [screen, setScreen] = useState("home");
  const [menuAberto, setMenuAberto] = useState(false);
  const [emailCadastro, setEmailCadastro] = useState("");
  const [senhaCadastro, setSenhaCadastro] = useState("");
  const [filtros, setFiltros] = useState({});
  const [busca, setBusca] = useState("");

  const [questoesRespondidas, setQuestoesRespondidas] = useState(0);
  const LIMITE_TESTE = 20;

  // 🔐 LOGIN
  async function fazerLogin() {
    const usuarios =
      JSON.parse(localStorage.getItem("usuarios")) || [];

    const emailDigitado =
      document.querySelectorAll("input")[0]?.value;

   const senhaDigitada =
     document.querySelectorAll("input")[1]?.value;

   const usuarioEncontrado = usuarios.find(
     (usuario) =>
       usuario.email === emailDigitado &&
       usuario.senha === senhaDigitada
   );

   if (usuarioEncontrado) {

  localStorage.setItem("logado", "true");

  localStorage.setItem(
    "usuarioLogado",
    usuarioEncontrado.email
  );

  try {

    const resposta = await fetch(
      `https://cnp-backend.vercel.app/assinante/${usuarioEncontrado.email}`
    );

    const dados = await resposta.json();

    if (dados.assinante === 1) {
      localStorage.setItem("assinanteAtivo", "true");
    } else {
      localStorage.setItem("assinanteAtivo", "false");
    }

  } catch (erro) {
    console.error(erro);
  }

  alert("✅ Login realizado com sucesso!");
  setScreen("home");
}
     else {
     alert("❌ E-mail ou senha incorretos");
   }
 }
  
  const loginBtn = {
    padding: "14px 28px",
    fontSize: "20px",
    fontWeight: "700",
    backgroundColor: "#fff",
    color: "#0b3ea9",
    border: "none",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
    cursor: "pointer"
  };

  // 🔥 VALIDAR E ABRIR SIMULADO

  function responderQuestao() {
    const logado = localStorage.getItem("logado");
    const assinante = localStorage.getItem("assinanteAtivo");

    if (!logado && questoesRespondidas >= LIMITE_TESTE) {
      alert("🎁 Você atingiu seu limite gratuito de 20 questões. Assine para continuar.");
      setScreen("login");
      return false;
  }

  if (logado && assinante !== "true" && questoesRespondidas >= LIMITE_TESTE) {
    alert("🔒 Seu teste grátis terminou. Assine o plano para continuar.");
    window.open("https://go.hotmart.com/E105983044C", "_blank");
    return false;
  }

  setQuestoesRespondidas((prev) => prev + 1);
  return true;
  }
  function validarEabrir() {

    if (!responderQuestao()) return;

    const selects = document.querySelectorAll("select");

    const quantidade = document.querySelector(
      'input[type="number"]'
    );

    const dados = {

      disciplina: document.getElementById("disciplina").value,

      assunto: document.getElementById("assunto").value,

      cargo: document.getElementById("cargo").value,

      nivel: document.getElementById("nivel").value,

      ano: document.getElementById("ano").value,

      quantidade: Number(quantidade.value)

    };

    console.log("FILTROS:", dados);

    if (
      !dados.disciplina ||
      !dados.assunto ||
      !dados.cargo ||
      !dados.nivel ||
      !dados.ano
    ) {
      alert("Preencha todos os campos!");
      return;
    }

    const logado = localStorage.getItem("logado");
    const assinante = localStorage.getItem("assinanteAtivo");

    if (dados.quantidade > 20 && assinante !== "true") {
      alert("🔒 Apenas assinantes podem acessar mais de 20 questões.");
      window.open("https://go.hotmart.com/E105983044C", "_blank");
      return;
    }

    setFiltros(dados);

    setScreen("simulado");

  }

  // 🔥 SIMULADO
  if (screen === "simulado") {

    return (
      <Simulado
        filtros={filtros}
        voltar={() => setScreen("home")}
      />
    );
  
  }

  // 🔐 LOGIN
  if (screen === "login") {
    return (
      <div style={page}>
        <h2
          onClick={() => setScreen("cadastro")}
          style={{ cursor: "pointer" }}
        >
          📝 Cadastre-se
        </h2>

        <input
          placeholder="Seu e-mail"
          style={input}
        />

        <input
          type="password"
          placeholder="Sua senha"
          style={input}
        />

        <p
          onClick={fazerLogin}
          style={{
            fontSize: "20px",
            fontWeight: "700",
            color: "#0b3ea9",
            cursor: "pointer",
            marginBottom: "8px"
          }}
        >
          🔐 Fazer login
        </p>

        <p
          onClick={() => {
            const email = prompt("Digite seu e-mail cadastrado:");

            if (email === localStorage.getItem("emailCadastro")) {
              alert(
                "Sua senha é: " +
                localStorage.getItem("senhaCadastro")
              );
            } else {
              alert("E-mail não encontrado.");
            }
          }}
          style={{
            fontSize: "14px",
            color: "#0b3ea9",
            cursor: "pointer",
            marginTop: "8px",
            marginBottom: "18px"
          }}
         >
            Esqueci minha senha
         </p>

        <br /><br />

       <button onClick={() => setScreen("home")}>
         ← Voltar
       </button>

      </div>
    );
  }

  if (screen === "cadastro") {
  return (
    <div style={page}>
      <h2>📝 Criar cadastro</h2>

      <input
        
        placeholder="Seu e-mail"
        style={input}
        value={emailCadastro}
        onChange={(e) => setEmailCadastro(e.target.value)}
        autoComplete="email"
      />

      <input
        type="password"
        placeholder="Crie uma senha"
        style={input}
        value={senhaCadastro}
        onChange={(e) => setSenhaCadastro(e.target.value)}
      />

      <button
        style={primaryBtn}
        onClick={() => {
        
          if (!emailCadastro || !senhaCadastro) {
            alert("⚠️ Preencha e-mail e senha antes de cadastrar.");
            return;
          }

        const usuarios =
          JSON.parse(localStorage.getItem("usuarios")) || [];

        usuarios.push({
          email: emailCadastro,
          senha: senhaCadastro
        });

        localStorage.setItem(
          "usuarios",
          JSON.stringify(usuarios)
        );

        alert("✅ Cadastro realizado com sucesso!");
        setScreen("home");
      }}

      >
        Cadastrar
      </button>

      <br /><br />

      <button onClick={() => setScreen("login")}>
        ← Voltar para login
      </button>
    </div>
  );
}

  return (
    <div>

      {/* HEADER */}
      <div style={header}>

        <div>

          <h1 style={{ margin: 0, fontSize: "22px", }}>
            TESTE 123 APP FUNCIONANDO ✅
          </h1>

            <p
              style={{
                color: "#ffd700",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              ⭐ O PORTAL DAS ESPECÍFICAS
            </p>

          <p style={{ margin: "5px 0", fontSize: "20px", marginTop: 10, }}>
            Prepare-se com simulados reais e saia na frente da concorrência
          </p>

          <p style={{ fontWeight: "bold", color: "#ffd700", fontSize: "20px", marginTop: 10, }}>
            Mais de 2.000 Questões Comentadas de Técnico de Enfermagem.
          </p>

        </div>

        <div style={rightHeader}>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>

            <button
              onClick={() => setScreen("login")}
              style={loginBtn}
            >
              🔐 Entrar
            </button> 

          {localStorage.getItem("logado") === "true" && (
            <div
              style={{
                ...avatarLogin,
               position: "relative"
             }}
             onClick={() => setMenuAberto(!menuAberto)}
           >
             {localStorage
               .getItem("usuarioLogado")
               ?.split("@")[0]
               ?.substring(0, 2)
               .toUpperCase()}
            </div>
          )}

          </div>

            {menuAberto && (
              <div
                onClick={() => {
                  localStorage.setItem("logado", "false");
           
                  document.querySelectorAll("input").forEach((input) => {
                    input.value = "";
                  });


                  setMenuAberto(false);
                  setScreen("home");
                }}                              
                style={{
                  position: "absolute",
                  top: "200px", 
                  left: "1800px",              
                  background: "#fff",
                  color: "#333",
                  padding: "8px 12px",
                  borderRadius: "8px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                  zIndex: 9999,
                  cursor: "pointer"
                }}              
      
              >               
                🚪 Sair
              </div>
             
            )}
      
          <img
            src="/logo.png"
            alt="logo"
            style={{ height: 200,  transform: "translateX(-5px)" }}
          />

        </div>

      </div>

      {/* FILTROS */}
      <div style={centerWrap}>

        <div style={box}>

          <div style={row}>

            {/* DISCIPLINA */}
            <select
              id="disciplina"
              style={{
                borderRadius: 8,
                border: "1px solid #ccc",
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
              }}
            >

              <option value="">Disciplina</option>

              <option value="Enfermagem">Enfermagem</option>


            </select>

            {/* ASSUNTO */}

             <select
               id="assunto"
               style={{ width: "100%", maxWidth: 1000, fontSize: 14, padding: "10px",borderRadius: 8, border: "1px solid #ccc",boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
               }}

              >

               <option>Selecione um assunto</option>

               <option>Administração de medicamentos por diferentes vias</option>
               <option>Aferição e monitorização de sinais vitais</option>
               <option>Assistência de enfermagem ao paciente com diabetes mellitus</option>
               <option>Assistência de enfermagem ao paciente com hipertensão arterial</option>
               <option>Assistência de enfermagem ao paciente com doenças respiratórias</option>
               <option>Assistência de enfermagem ao paciente em situação de urgência e emergência</option>
               <option>Assistência de enfermagem ao recém-nascido</option>
               <option>Assistência de enfermagem à criança e ao adolescente</option>
               <option>Assistência de enfermagem à mulher no pré-natal e puerpério</option>
               <option>Assistência de enfermagem ao idoso. Atendimento e acolhimento de pacientes em serviços de saúde</option>
               <option>Biossegurança em serviços de saúde</option>
               <option>Coleta de materiais para exames laboratoriais</option>
               <option>Controle e prevenção de infecções em serviços de saúde</option>
               <option>Cuidados de enfermagem com pacientes acamados</option>
               <option>Cuidados de enfermagem em imunização</option>
               <option>Cuidados de enfermagem em saúde mental</option>
               <option>Curativos e cuidados com feridas</option>
               <option>Desinfecção e esterilização de materiais hospitalares</option>
               <option>Higiene e conforto do paciente</option>
               <option>Monitoramento do estado clínico do paciente</option>
               <option>Orientação básica de saúde aos pacientes</option>
               <option>Preparo e administração de soluções intravenosas</option>
               <option>Prevenção de úlceras por pressão</option>
               <option>Registro e anotação de enfermagem em prontuário</option>
               <option>Segurança do paciente na assistência de enfermagem</option>
               <option>Suporte básico de vida</option>
               <option>Técnicas de oxigenoterapia</option>
               <option>Transporte seguro de pacientes</option>
               <option>Verificação de glicemia capilar</option>
               <option>Humanização do atendimento no SUS (Política Nacional de Humanização): cuidado centrado no usuário e acolhimento</option>
               <option>Planejamento em saúde: Plano Municipal de Saúde</option>
               <option>PAS e RAG: metas, indicadores e estratégias municipais</option>
               <option>Planejamento e gestão integrada das ações de saúde: articulação entre planejamento, indicadores e recursos</option>
               <option>Política Nacional de Atenção Básica (PNAB): diretrizes para atenção primária e coordenação do cuidado</option>
               <option>Políticas nacionais de saúde prioritárias: áreas estratégicas: saúde mental, mulher, criança e idoso</option>
               <option>Rede de Atenção à Saúde (RAS) e regionalização: integração de serviços por complexidade e região</option>
               <option>Sistema Único de Saúde (SUS): princípios, diretrizes e organização: universalidade, equidade, integralidade e descentralização</option>
               <option>Vigilância em saúde: epidemiológica, sanitária, ambiental e saúde do trabalhador: monitoramento e prevenção de riscos</option>
               <option>Código de Ética em Enfermagem</option>
               <option>Enfermagem no centro cirúrgico</option>
               <option>Decreto (94406) de 8 de junho de 1987</option>
               <option>Lei (7498) de 25 de junho de 1986</option>
               <option>Recuperação da anestesia</option>
               <option>Central de material e esterilização</option>
               <option>Atuação nos períodos pré-operatório, trans-operatório e pós-operatório</option>
               <option>Atuação durante os procedimentos cirúrgico-anestésicos</option>
               <option>Materiais e equipamentos básicos que compõem as salas de cirurgia e recuperação anestésica</option>
               <option>Rotinas de limpeza da sala de cirurgia</option>
               <option>Uso de material estéril</option>
               <option>Manuseio de equipamentos: autoclaves; seladora térmica e lavadora automática ultrassônica</option>
               <option>Noções de controle de infecção hospitalar</option>
               <option>Verificação de sinais vitais, oxigenoterapia, aerossolterapia e curativos</option>
               <option>Administração de medicamentos</option>
               <option>Coleta de materiais para exames</option>
               <option>Enfermagem nas situações de urgência e emergência</option>
               <option>Conceitos de emergência e urgência</option>
               <option>Estrutura e organização do pronto socorro</option>
               <option>Atuação do técnico de enfermagem em situações de choque, parada cardio-respiratória, politrauma, afogamento, queimadura, intoxicação, envenenamento e picada de animais peçonhentos</option>
               <option>Enfermagem em saúde pública</option>
               <option>Política Nacional de Imunização</option>
               <option>Controle de doenças transmissíveis, não transmissíveis e sexualmente transmissíveis</option>
               <option>Atendimento aos pacientes com hipertensão arterial, diabetes, doenças cardiovasculares, obesidade, doença renal crônica, hanseníase, tuberculose, dengue e doenças de notificações compulsórias</option>
               <option>Princípios gerais de segurança no trabalho</option>
               <option>Programa de assistência integrada à saúde da criança, mulher, homem, adolescente e idoso</option>
               <option>Conduta ética dos profissionais da área de saúde</option>
               <option>Prevenção e causas dos acidentes do trabalho</option>
               <option>Princípios de ergonomia no trabalho</option>
               <option>Códigos e símbolos específicos de Saúde e Segurança no Trabalho</option> 
               <option>Fundamentos de enfermagem</option> 
               <option>Assistência de enfermagem em clínica médica, clínica cirúrgica, doenças crônicas degenerativas, doenças transmissíveis, saúde mental, urgência e emergência</option>
               <option>Saúde da Pessoa Idosa</option>
               <option>Saúde da mulher</option>
               <option>Saúde da criança e do adolescente</option>
               <option>Saúde da família</option>
               <option>Doentes crônicos degenerativos</option>
               <option>Vigilância epidemiológica e sanitária</option>
               <option>Procedimentos de enfermagem</option>
               <option>Enfermagem na administração de medicamentos</option>
               <option>Técnicas básicas de enfermagem</option>
               <option>Programa Nacional de Imunização (Lei nº 6.259/1975)</option>
               <option>Calendário de vacinação para o Estado de São Paulo</option>
               <option>Assistência de Enfermagem em Primeiros Socorros</option>
               <option>Enfermagem em Saúde Pública</option>
               <option>Saneamento do meio ambiente</option>
               <option>Imunizações</option>
               <option>Doenças de notificação compulsória (dengue, leishmaniose, sífilis, tuberculose, covid-19, HIV/AIDS etc.)</option>
               <option>Enfermagem em saúde do trabalhador</option>
               <option>Promoção e Prevenção em Saúde</option>
               <option>Aplicação de medidas de biossegurança</option>
               <option>Medidas de controle de infecção, de esterilização e desinfecção</option>
               <option>Classificação de artigos e superfícies a partir de conhecimentos de desinfecção, limpeza, preparo e esterilização de material</option>
               <option>Precauções-padrão</option>
               <option>Trabalho em equipe</option>
               <option>Atuação na atenção básica (Estratégia Saúde da Família)</option>
               <option>Atribuições comuns e específicas (acolhimento, imunizações)</option>
               <option>Atuação em grupos por patologias</option>
               <option>Legislação: Constituição Federal de 1988 (artigos 196 a 200)</option>
               <option>Princípios e diretrizes do Sistema Único de Saúde (Lei nº 8.080/1990)</option>
               <option>Princípios e diretrizes da Política Nacional de Humanização</option>
               <option>Princípios e diretrizes da Política Nacional da Atenção Básica</option>
               <option>Lei do exercício profissional</option>
               <option>Legislação Profissional COFEN/COREN</option>
                    
             </select>


            {/* CARGO */}
            <select
              id="cargo"
              style={{
                borderRadius: 8,
                border: "1px solid #ccc",
                padding: "10px",
                boxShadow: "0 2px 5px rgba(0,0,0,0.1)"
             }}
            >

              <option value="">Cargo</option>

              <option value="Técnico de Enfermagem">
                Técnico de Enfermagem
              </option>


            </select>

            {/* NÍVEL */}
            <select
              id="nivel"
              style={{
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
            >

              <option value="">Nível</option>

              <option value="Médio">
                Médio
              </option>

            </select>

            {/* ANO */}
            <select
              id="ano"
              style={{
                borderRadius: 8,
                border: "1px solid #ccc"
              }}
             >

              <option value="">Ano</option>

              <option value="2026">2026</option>

            </select>

            {/* QUANTIDADE */}
            <input
              type="number"
              min="1"
              max="20"
              defaultValue="20"
              style={{ width: 60, borderRadius: 8, border: "1px solid #ccc"}}
              onInput={(e) => {
                if (e.target.value > 20) {
                  e.target.value = 20;
                }

                if (e.target.value < 1) {
                  e.target.value = 1;
                }
              }}

            />

          </div>

          <button
            style={mainBtn}
            onClick={validarEabrir}
          >
            ABRIR SIMULADO
          </button>

          <p style={{ textAlign: "center" }}>
            🎁 Teste grátis com até 20 questões
          </p>

        </div>

      </div>

      {/* PLANOS */}
      <div style={section}>

        <h2>🔥 TESTE NIVALDO 123 🔥</h2>

        <h3>60 dias de acesso</h3>

        <div style={plans}>

          <div style={cardPrimary}>

            <p style={{ fontSize: 20, fontWeight: "bold" }}>
           👉 Acesso completo por 60 dias
            </p>

            <p style={{ fontSize: 30, fontWeight: "bold" }}>
              R$19,90
            </p>

            <button
              style={{
                ...btn,
                fontSize: 20,
                fontWeight: "bold"
              }}
              onClick={() => window.open("https://go.hotmart.com/E105983044C", "_blank")}
            >
              Assinar
            </button>

          </div>

        </div>

      </div>

      {/* FOOTER */}
      <div style={footer}>

        <div style={footerGrid}>

          <div>
            <h3>🔐 Privacidade</h3>
            <p>
              Seus dados são usados apenas para acesso e pagamento.
            </p>
          </div>

          <div>
            <h3
              onClick={() => {
                const usuarioLogado =
                  localStorage.getItem("usuarioLogado");

                const usuarios =
                  JSON.parse(localStorage.getItem("usuarios")) || [];

                const usuariosAtualizados = usuarios.filter(
                  (usuario) => usuario.email !== usuarioLogado
                );

                localStorage.setItem(
                  "usuarios",
                  JSON.stringify(usuariosAtualizados)
                );

                localStorage.removeItem("usuarioLogado");
                localStorage.removeItem("logado");

                alert("✅ Conta cancelada com sucesso.");

                setScreen("home");
              }}
              style={{ cursor: "pointer" }}
            >
              💸 Cancelamento
            </h3>
            <p>Cancelamento a qualquer momento.</p>
          </div>

          <div>
            <h3> Suporte</h3>
            <p>Email: cnp.concursos.suporte@gmail.com</p>
            <p>📞(88)98825-5597</p> 

            <p>Atendimento em horário comercial</p>
          </div>

          <div>
            <h3>📚 Sobre</h3>
            <p>
              Plataforma de simulados para concursos públicos.
            </p>
          </div>

        </div>

        <div
          style={{
            marginTop: 30,
            textAlign: "center",
            fontSize: "14px"
          }}
        >
          © 2026 CNP Concursos — Todos os direitos reservados
        </div>

      </div>

    </div>
  );
}

/* 🎨 ESTILOS */
const footer = {
  marginTop: "80px",
  padding: "30px",
  background: "#222",
  color: "#fff"
};

const footerGrid = {
  display: "flex",
  justifyContent: "space-between",
  gap: "40px",
  flexWrap: "wrap"
};

const header = {
  background: "#3b63c6",
  color: "#fff",
  padding: "20px 40px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
};

const rightHeader = {
  display: "flex",
  alignItems: "center",
  gap: "20px"
};

const loginBtn = {
  background: "#fff",
  color: "#3b63c6",
  padding: "10px",
  borderRadius: 8
};

const avatarLogin = {
  width: "42px",
  height: "42px",
  borderRadius: "50%",
  backgroundColor:  "#facc15",
  color: "#0b3ea9",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "700",
  fontSize: "16px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.20)"
};

const subscribeBtn = {
  background: "#ff9800",
  color: "#fff",
  padding: "10px",
  borderRadius: 8
};

const centerWrap = {
  display: "flex",
  justifyContent: "center",
  marginTop: 40
};

const box = {

  width: "100%", maxWidth: 900,
  background: "#dfe3e8",

  borderRadius: 20,

  padding: 30

};

const row = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  marginBottom: 10
};

const mainBtn = {
  width: "100%",
  background: "#3b63c6",
  color: "#fff",
  padding: 10,
  border: "none",
  borderRadius: 6
};

const section = {
  textAlign: "center",
  marginTop: 40,
  paddingBottom: "200px"
};

const plans = {
  display: "flex",
  justifyContent: "center",
  gap: 20,
  flexWrap: "wrap",
  marginTop: 20
};

const baseCard = {
  background: "#fff",
  padding: 20,
  borderRadius: 10,
  width: "100%", maxWidth: 220,
};

const cardPrimary = {

  ...baseCard,

  borderTop: "5px solid #3b63c6",

  background: "#fff",

  border: "1px solid #eee",

  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",

  padding: 30

};

const btn = {
  background: "#ff9800",
  color: "#fff",
  padding: 10,
  border: "none",
  borderRadius: 8,
  width: "100%"
};

const input = {
  display: "block",
  marginBottom: 10,
  padding: 8
};

const primaryBtn = {
  padding: "14px 32px",
  background: "#ffffff",
  color: "#0d47c9",
  border: "none",
  borderRadius: "12px",
  fontSize: "22px",
  fontWeight: "700",
  cursor: "pointer",
  boxShadow: "0 4px 12px rgba(0,0,0,0.25)"
};

const page = {
  padding: 40
};

export default App;
