/* ============================================================
   Casa Nordestina Paranoá — comportamento da página
   (os dados ficam em config.js e ofertas.js)
   ============================================================ */
(function () {
  const C = window.CONFIG;
  const OFERTAS = window.OFERTAS || {};
  const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
  const ABREV = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const TONS = ["#7f423a", "#915249", "#6d332b", "#a36258", "#5b231c"]; // fundos dos placeholders

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

  /* ---------- Foto com placeholder (bloco de barro + inicial) enquanto não houver imagem ---------- */
  function foto(arquivo, alt, indice) {
    const ph = document.createElement("div");
    ph.className = "ph";
    ph.style.setProperty("--tom", TONS[(indice || 0) % TONS.length]);
    ph.textContent = (alt || "").trim().charAt(0);
    ph.setAttribute("aria-hidden", "true");
    if (!arquivo) return ph;
    const img = new Image();
    img.src = "img/" + arquivo;
    img.alt = alt;
    img.loading = "lazy";
    img.decoding = "async";
    img.className = "ph__img";
    // a imagem fica dentro do placeholder (para o lazy-loading funcionar) e o substitui ao carregar
    img.onload = () => { img.className = ""; ph.replaceWith(img); };
    img.onerror = () => img.remove();
    ph.appendChild(img);
    return ph;
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
        : "Aberto agora · até às " + fmtHora(hoje.fecha);
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

  /* ---------- Lista de horários (dia de hoje destacado) ---------- */
  function montarHorarios() {
    const ul = document.getElementById("horarios");
    const { dia } = agoraBrasilia();
    [1, 2, 3, 4, 5, 6, 0].forEach((d) => {
      const h = C.horarios[d];
      const li = document.createElement("li");
      if (d === dia) li.className = "hoje";
      li.innerHTML =
        '<span class="h__dia">' + DIAS[d] + "</span>" +
        '<span class="h__hora">' + (h ? fmtHora(h.abre) + " – " + fmtHora(h.fecha) : "Fechado") + "</span>";
      ul.appendChild(li);
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
      b.setAttribute("aria-label", DIAS[d] + ": " + o.tema);
      b.innerHTML =
        '<span class="dia__abrev">' + ABREV[d] + "</span>" +
        '<span class="dia__tema">' + o.tema + "</span>" +
        (d === hoje ? '<span class="dia__hoje">HOJE</span>' : "");
      b.addEventListener("click", () => mostrar(d));
      diasEl.appendChild(b);
      botoes[d] = b;
    });

    function mostrar(d) {
      Object.entries(botoes).forEach(([k, b]) => b.setAttribute("aria-selected", String(+k === d)));
      const o = OFERTAS[d];
      lista.innerHTML = "";

      // Cartaz do dia (com a arte do Instagram, se houver)
      const carimbo = o.desconto
        ? '<div class="carimbo"><div><strong>' + o.desconto + "</strong><span>de desconto</span></div></div>"
        : "";
      const cartaz = document.createElement("div");
      cartaz.className = "cartaz cartaz--" + (o.cor || "creme");
      cartaz.innerHTML =
        '<svg class="cartaz__sol" aria-hidden="true"><use href="#i-sol"/></svg>' +
        "<div>" +
          '<span class="cartaz__dia">' + (d === hoje ? "Oferta de hoje" : "Oferta de " + DIAS[d].toLowerCase()) + "</span>" +
          '<h3 class="cartaz__tema">' + DIAS[d] + " " + o.titulo + "</h3>" +
          (o.chamada ? '<p class="cartaz__chamada">' + o.chamada + "</p>" : "") +
        "</div>" +
        (o.arte
          ? '<figure class="cartaz__arte"><img src="img/' + o.arte + '" alt="Arte da promoção de ' + DIAS[d].toLowerCase() + ' no Instagram" loading="lazy" onerror="this.remove()">' + carimbo + "</figure>"
          : carimbo);
      lista.appendChild(cartaz);

      if (!o.produtos.length) {
        lista.insertAdjacentHTML("beforeend",
          '<div class="vazio">As ofertas deste dia saem no nosso Instagram. ' +
          '<a href="' + C.instagram + '" target="_blank" rel="noopener">Confira lá</a> ou chame no WhatsApp!</div>');
        return;
      }

      const grid = document.createElement("div");
      grid.className = "ofertas__grid";
      o.produtos.forEach((p, i) => {
        const card = document.createElement("article");
        card.className = "produto";
        const f = document.createElement("div");
        f.className = "produto__foto";
        f.appendChild(foto(p.foto, p.nome, i + d));
        if (o.desconto) f.insertAdjacentHTML("beforeend", '<span class="produto__selo">-' + o.desconto + "</span>");
        card.appendChild(f);

        const preco = p.preco
          ? '<span class="etiqueta">R$ ' + p.preco + (p.unidade ? " <small>/ " + p.unidade + "</small>" : "") + "</span>"
          : '<span class="etiqueta etiqueta--consulte">Preço no WhatsApp</span>';
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
    if (botoes[inicial]) diasEl.scrollLeft = botoes[inicial].offsetLeft - 16;
  }

  /* ---------- Categorias de produtos (grade "bento") ----------
     tamanho: "grande" (2x2), "larga" (2x1) ou "" (1x1) */
  const CATEGORIAS = [
    { nome: "Castanhas e frutas secas", desc: "Caju, pará, nozes, damasco, uva-passa — tudo a granel, no peso que você quiser.", foto: "castanhas.jpg", tamanho: "grande" },
    { nome: "Temperos e especiarias", desc: "Colorau, cominho, pimentas e temperos prontos.", foto: "temperos.jpg", tamanho: "" },
    { nome: "Doces a granel", desc: "Cocada, rapadura, doce de leite e goiabada.", foto: "doces.jpg", tamanho: "" },
    { nome: "Queijos e laticínios", desc: "Queijo coalho, queijo minas, manteiga de garrafa e leite.", foto: "queijos.jpg", tamanho: "larga" },
    { nome: "Produtos regionais", desc: "Farinha d'água, feijão-verde, carne de sol e o sabor do Nordeste.", foto: "regionais.jpg", tamanho: "" },
    { nome: "Polpas de frutas", desc: "Abacaxi, cajá, acerola, cupuaçu e frutas do Cerrado.", foto: "polpas.jpg", tamanho: "" },
    { nome: "Saudável e suplementos", desc: "Grãos, sementes, encapsulados e creatina.", foto: "saudavel.jpg", tamanho: "" },
    { nome: "Mercearia e frios", desc: "Tudo o que falta na sua despensa.", foto: "mercearia.jpg", tamanho: "" }
  ];

  function montarCategorias() {
    const el = document.getElementById("categorias");
    CATEGORIAS.forEach((c, i) => {
      const card = document.createElement("article");
      card.className = "categoria revela" + (c.tamanho ? " categoria--" + c.tamanho : "");
      const f = document.createElement("div");
      f.className = "categoria__foto";
      f.appendChild(foto(c.foto, c.nome, i));
      card.appendChild(f);
      const info = document.createElement("div");
      info.className = "categoria__info";
      info.innerHTML =
        "<h3>" + c.nome + "</h3><p>" + c.desc + "</p>" +
        '<a class="link-seta" target="_blank" rel="noopener" href="' +
        linkWa("Olá! Vi no site e queria saber sobre *" + c.nome + "*.") +
        '">Perguntar no WhatsApp →</a>';
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
      const ph = foto("insta-" + i + ".jpg", "Post do Instagram da Casa Nordestina", i);
      ph.firstChild.textContent = "✺";
      a.appendChild(ph);
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

  /* ---------- Cabeçalho ganha borda ao rolar ---------- */
  function cabecalho() {
    const h = document.getElementById("topo");
    const at = () => h.classList.toggle("rolou", window.scrollY > 8);
    window.addEventListener("scroll", at, { passive: true });
    at();
  }

  /* ---------- Animação de entrada ao rolar ---------- */
  function revelar() {
    document.querySelectorAll(".secao__topo, .cartao, .depo, .passos li").forEach((el) => el.classList.add("revela"));
    const itens = document.querySelectorAll(".revela");
    if (!("IntersectionObserver" in window)) { itens.forEach((el) => el.classList.add("visivel")); return; }
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visivel"); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    itens.forEach((el) => obs.observe(el));
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
        toast("Endereço copiado!");
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
  cabecalho();
  copiar();
  revelar();
  document.getElementById("ano").textContent = new Date().getFullYear();
})();
