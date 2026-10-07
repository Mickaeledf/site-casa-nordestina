/* ============================================================
   Casa Nordestina Paranoá — comportamento da página
   (os dados ficam em config.js e ofertas.js)
   ============================================================ */
(function () {
  const C = window.CONFIG;
  const OFERTAS = window.OFERTAS || {};
  const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  /* ---------- Links (WhatsApp, telefone, mapas, Instagram) ---------- */
  const linkWa = (msg) =>
    "https://wa.me/" + C.whatsappNumero + "?text=" +
    encodeURIComponent(msg || "Olá! Vim pelo site e quero fazer um pedido.");
  const linkMaps = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(C.enderecoBusca);
  const linkWaze = "https://waze.com/ul?ll=" + C.latitude + "," + C.longitude + "&navigate=yes";

  const setLinks = (sel, href) => document.querySelectorAll(sel).forEach((a) => (a.href = href));
  setLinks(".js-wa", linkWa());
  setLinks(".js-tel", "tel:" + C.telefoneLink);
  setLinks(".js-maps", linkMaps);
  setLinks(".js-waze", linkWaze);
  setLinks(".js-insta", C.instagram);

  /* ---------- Imagem com "placeholder" se a foto ainda não existir ---------- */
  function foto(arquivo, alt, emoji) {
    const wrap = document.createElement("div");
    wrap.className = "ph";
    wrap.textContent = emoji || "🧺";
    if (!arquivo) return wrap;
    const img = new Image();
    img.src = "img/" + arquivo;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.onload = () => wrap.replaceWith(img);
    return wrap;
  }

  /* ---------- Hora atual em Brasília ---------- */
  function agoraBrasilia() {
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Sao_Paulo", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    return { dia, minutos: parseInt(p.hour, 10) * 60 + parseInt(p.minute, 10) };
  }
  const paraMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
  const fmtHora = (hhmm) => { const [h, m] = hhmm.split(":"); return m === "00" ? h + "h" : h + "h" + m; };

  /* ---------- Selo "Aberto agora / Fechado" ---------- */
  function atualizarStatus() {
    const el = document.getElementById("status");
    const { dia, minutos } = agoraBrasilia();
    const hoje = C.horarios[dia];

    if (hoje && minutos >= paraMin(hoje.abre) && minutos < paraMin(hoje.fecha)) {
      const falta = paraMin(hoje.fecha) - minutos;
      el.className = "status status--aberto";
      el.textContent = falta <= 60
        ? "Aberto agora · fecha em " + falta + " min"
        : "Aberto agora · fecha às " + fmtHora(hoje.fecha);
      return;
    }

    // Procura o próximo dia/horário de abertura
    let texto = "Fechado";
    for (let i = 0; i < 8; i++) {
      const d = (dia + i) % 7;
      const h = C.horarios[d];
      if (!h) continue;
      if (i === 0 && minutos >= paraMin(h.abre)) continue; // hoje já passou
      const quando = i === 0 ? "hoje" : i === 1 ? "amanhã" : DIAS[d].toLowerCase();
      texto = "Fechado · abre " + quando + " às " + fmtHora(h.abre);
      break;
    }
    el.className = "status status--fechado";
    el.textContent = texto;
  }

  /* ---------- Tabela de horários (dia de hoje destacado) ---------- */
  function montarHorarios() {
    const tbody = document.querySelector("#horarios tbody");
    const { dia } = agoraBrasilia();
    [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
      const h = C.horarios[d];
      const tr = document.createElement("tr");
      if (d === dia) tr.className = "hoje";
      tr.innerHTML =
        "<td>" + DIAS[d] + (d === dia ? " (hoje)" : "") + "</td>" +
        "<td>" + (h ? fmtHora(h.abre) + " às " + fmtHora(h.fecha) : "Fechado") + "</td>";
      tbody.appendChild(tr);
    });
  }

  /* ---------- Ofertas da semana ---------- */
  function montarOfertas() {
    const diasEl = document.getElementById("dias");
    const lista = document.getElementById("ofertas-lista");
    const { dia: hoje } = agoraBrasilia();
    const ordem = [1, 2, 3, 4, 5, 6].filter((d) => OFERTAS[d]);
    const botoes = {};

    ordem.forEach((d) => {
      const o = OFERTAS[d];
      const b = document.createElement("button");
      b.type = "button";
      b.className = "dia";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", "false");
      b.innerHTML =
        '<span class="dia__selo"><span><span class="emoji" aria-hidden="true">' + o.emoji + "</span>" + o.tema + "</span></span>" +
        '<span class="dia__nome">' + DIAS[d] + "</span>" +
        (d === hoje ? '<span class="dia__hoje">HOJE</span>' : "");
      b.addEventListener("click", () => mostrar(d));
      diasEl.appendChild(b);
      botoes[d] = b;
    });

    function mostrar(d) {
      Object.entries(botoes).forEach(([k, b]) => b.setAttribute("aria-selected", String(+k === d)));
      const o = OFERTAS[d];
      lista.innerHTML = "";

      // Cartaz do dia, no estilo das artes do Instagram
      const cartaz = document.createElement("div");
      cartaz.className = "cartaz cartaz--" + (o.cor || "creme");
      cartaz.innerHTML =
        '<svg class="cartaz__folha" viewBox="0 0 100 100" aria-hidden="true"><path fill="currentColor" d="M50 98C20 70 8 40 22 14 40 4 70 10 84 30c12 22 2 52-34 68Z"/></svg>' +
        "<div>" +
          '<span class="cartaz__dia">' + DIAS[d] + (d === hoje ? " <small>HOJE</small>" : "") + "</span>" +
          '<h3 class="cartaz__tema">' + o.titulo + "</h3>" +
          (o.chamada ? '<p class="cartaz__chamada">' + o.chamada + "</p>" : "") +
        "</div>" +
        (o.desconto
          ? '<div class="cartaz__desc"><strong>' + o.desconto + "</strong><span>de desconto</span></div>"
          : "");
      lista.appendChild(cartaz);

      if (!o.produtos.length) {
        lista.insertAdjacentHTML("beforeend",
          '<div class="vazio">As ofertas deste dia saem no nosso Instagram. ' +
          '<a href="' + C.instagram + '" target="_blank" rel="noopener">Confira lá</a> ou chame no WhatsApp!</div>');
        return;
      }

      const grid = document.createElement("div");
      grid.className = "ofertas__grid";
      o.produtos.forEach((p) => {
        const card = document.createElement("article");
        card.className = "produto";
        const f = document.createElement("div");
        f.className = "produto__foto";
        f.appendChild(foto(p.foto, p.nome, o.emoji));
        if (o.desconto) f.insertAdjacentHTML("beforeend", '<span class="produto__selo">-' + o.desconto + "</span>");
        card.appendChild(f);

        const preco = p.preco
          ? '<span class="etiqueta"><small>R$</small> ' + p.preco + (p.unidade ? " <small>/" + p.unidade + "</small>" : "") + "</span>"
          : '<span class="etiqueta etiqueta--consulte">Consulte o preço</span>';
        const info = document.createElement("div");
        info.className = "produto__info";
        info.innerHTML =
          '<span class="produto__nome">' + p.nome + "</span>" + preco +
          '<a class="produto__wa" target="_blank" rel="noopener" href="' +
          linkWa("Olá! Vi no site a oferta de " + DIAS[d].toLowerCase() + " e quero *" + p.nome + "*.") +
          '">Quero este →</a>';
        card.appendChild(info);
        grid.appendChild(card);
      });
      lista.appendChild(grid);
    }

    // Abre no dia de hoje (domingo → mostra segunda)
    const inicial = OFERTAS[hoje] ? hoje : ordem[0];
    mostrar(inicial);
    if (botoes[inicial]) {
      diasEl.scrollLeft = botoes[inicial].offsetLeft - 16;
    }
  }

  /* ---------- Categorias de produtos ---------- */
  const CATEGORIAS = [
    { nome: "Castanhas e frutas secas", desc: "Caju, pará, nozes, damasco, uva-passa e mais.", foto: "castanhas.jpg", emoji: "🥜" },
    { nome: "Temperos e especiarias", desc: "Colorau, cominho, pimentas e temperos prontos.", foto: "temperos.jpg", emoji: "🌶️" },
    { nome: "Doces a granel", desc: "Cocada, rapadura, doce de leite e goiabada.", foto: "doces.jpg", emoji: "🍬" },
    { nome: "Queijos e laticínios", desc: "Queijo coalho, manteiga de garrafa, leite.", foto: "queijos.jpg", emoji: "🧀" },
    { nome: "Produtos regionais nordestinos", desc: "O sabor do Nordeste pertinho de você.", foto: "regionais.jpg", emoji: "🌵" },
    { nome: "Polpas de frutas", desc: "Abacaxi, cajá, acerola, cupuaçu e frutas do Cerrado.", foto: "polpas.jpg", emoji: "🍍" },
    { nome: "Linha saudável e suplementos", desc: "Grãos, encapsulados, creatina e naturais.", foto: "saudavel.jpg", emoji: "💊" },
    { nome: "Mercearia e frios", desc: "Tudo o que falta na sua despensa.", foto: "mercearia.jpg", emoji: "🛒" }
  ];

  function montarCategorias() {
    const el = document.getElementById("categorias");
    CATEGORIAS.forEach((c) => {
      const card = document.createElement("article");
      card.className = "categoria";
      const f = document.createElement("div");
      f.className = "categoria__foto";
      f.appendChild(foto(c.foto, c.nome, c.emoji));
      card.appendChild(f);
      const info = document.createElement("div");
      info.className = "categoria__info";
      info.innerHTML =
        "<h3>" + c.nome + "</h3><p>" + c.desc + "</p>" +
        '<a class="btn btn--outline btn--sm" target="_blank" rel="noopener" href="' +
        linkWa("Olá! Vi no site e queria saber sobre *" + c.nome + "*.") +
        '"><svg class="ico" aria-hidden="true"><use href="#i-wa"/></svg>Perguntar no WhatsApp</a>';
      card.appendChild(info);
      el.appendChild(card);
    });
  }

  /* ---------- Grade do Instagram (troque insta-1.jpg ... insta-6.jpg) ---------- */
  function montarInsta() {
    const el = document.getElementById("insta");
    for (let i = 1; i <= 6; i++) {
      const a = document.createElement("a");
      a.href = C.instagram;
      a.target = "_blank";
      a.rel = "noopener";
      a.setAttribute("aria-label", "Ver post no Instagram");
      a.appendChild(foto("insta-" + i + ".jpg", "Post do Instagram da Casa Nordestina", "📸"));
      el.appendChild(a);
    }
  }

  /* ---------- Menu mobile ---------- */
  function menu() {
    const burger = document.querySelector(".burger");
    const nav = document.getElementById("menu");
    const fechar = () => { nav.classList.remove("aberto"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", () => {
      const aberto = nav.classList.toggle("aberto");
      burger.setAttribute("aria-expanded", String(aberto));
    });
    nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", fechar));
    document.addEventListener("keydown", (e) => e.key === "Escape" && fechar());
  }

  /* ---------- Copiar endereço ---------- */
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2200);
  }
  function copiar() {
    document.getElementById("copiar").addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(C.endereco);
        toast("Endereço copiado! ✅");
      } catch {
        toast(C.endereco);
      }
    });
  }

  /* ---------- Início ---------- */
  atualizarStatus();
  setInterval(atualizarStatus, 60 * 1000);
  montarHorarios();
  montarOfertas();
  montarCategorias();
  montarInsta();
  menu();
  copiar();
  document.getElementById("ano").textContent = new Date().getFullYear();
})();
