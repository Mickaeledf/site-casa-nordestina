/* ============================================================
   OFERTAS DA SEMANA — "Cada dia, um tema"
   Para cada dia (1 = segunda ... 6 = sábado):
   - titulo:   como aparece no cartaz, ex. "Terça" + "dos Temperos"
   - tema:     texto curto do selo redondo
   - desconto: ex. "15%" (deixe "" se não houver)
   - chamada:  frase de efeito do cartaz
   - cor:      "creme", "mostarda" ou "laranja" (tom do cartaz)
   - arte:     imagem da promoção (pasta img/), ex. "oferta-segunda.jpg"
   - produtos: nome, preco ("31,99" ou "" para "Consulte"), unidade, foto
   Os produtos abaixo são EXEMPLOS: troque pelos reais.
   ============================================================ */
window.OFERTAS = {
  1: {
    titulo: "das Castanhas e Frutas Secas",
    tema: "Castanhas & Frutas Secas",
    emoji: "🥜",
    desconto: "10%",
    chamada: "Toda segunda-feira, nossas castanhas e frutas secas estão com desconto!",
    cor: "laranja",
    arte: "oferta-segunda.jpg",
    produtos: [
      { nome: "Castanha de caju", preco: "", unidade: "kg", foto: "castanha-caju.jpg" },
      { nome: "Castanha-do-pará", preco: "", unidade: "kg", foto: "castanha-para.jpg" },
      { nome: "Damasco seco", preco: "", unidade: "kg", foto: "damasco.jpg" },
      { nome: "Uva-passa", preco: "", unidade: "kg", foto: "uva-passa.jpg" }
    ]
  },
  2: {
    titulo: "dos Temperos",
    tema: "Temperos",
    emoji: "🌶️",
    desconto: "15%",
    chamada: "Sabor que transforma, qualidade que você confia! Desconto em todos os temperos.",
    cor: "creme",
    arte: "oferta-terca.jpg",
    produtos: [
      { nome: "Colorau", preco: "", unidade: "100g", foto: "colorau.jpg" },
      { nome: "Cominho", preco: "", unidade: "100g", foto: "cominho.jpg" },
      { nome: "Pimenta-do-reino", preco: "", unidade: "100g", foto: "pimenta.jpg" },
      { nome: "Tempero baiano", preco: "", unidade: "100g", foto: "tempero-baiano.jpg" }
    ]
  },
  3: {
    titulo: "dos Produtos Naturais",
    tema: "Produtos Naturais",
    emoji: "🌾",
    desconto: "15%",
    chamada: "Toda quarta-feira é dia de cuidar da saúde e economizar: produtos naturais a granel com desconto.",
    cor: "mostarda",
    arte: "oferta-quarta.jpg",
    produtos: [
      { nome: "Linhaça dourada", preco: "", unidade: "kg", foto: "linhaca.jpg" },
      { nome: "Granola", preco: "", unidade: "kg", foto: "granola.jpg" },
      { nome: "Chia", preco: "", unidade: "kg", foto: "chia.jpg" },
      { nome: "Aveia em flocos", preco: "", unidade: "kg", foto: "aveia.jpg" }
    ]
  },
  4: {
    titulo: "— tema a definir",       // ← definir
    tema: "Quinta",
    emoji: "⭐",
    desconto: "",
    chamada: "",
    cor: "creme",
    produtos: []
  },
  5: {
    titulo: "da Polpa",
    tema: "Polpas de Suco",
    emoji: "🍍",
    desconto: "15%",
    chamada: "Sextou! Todas as polpas de frutas estão com desconto.",
    cor: "laranja",
    arte: "oferta-sexta.jpg",
    produtos: [
      { nome: "Polpa de abacaxi", preco: "", unidade: "un", foto: "polpa-abacaxi.jpg" },
      { nome: "Polpa de cajá", preco: "", unidade: "un", foto: "polpa-caja.jpg" },
      { nome: "Polpa de acerola", preco: "", unidade: "un", foto: "polpa-acerola.jpg" },
      { nome: "Polpa de cupuaçu", preco: "", unidade: "un", foto: "polpa-cupuacu.jpg" }
    ]
  },
  6: {
    titulo: "dos Queijos e Doces",
    tema: "Queijos & Doces",
    emoji: "🍬",
    desconto: "10%",
    chamada: "Todo sábado, queijos e doces com desconto pra adoçar o fim de semana.",
    cor: "creme",
    produtos: [
      { nome: "Queijo coalho", preco: "", unidade: "kg", foto: "queijo-coalho.jpg" },
      { nome: "Queijo minas", preco: "", unidade: "kg", foto: "queijo-minas.jpg" },
      { nome: "Doce de leite", preco: "", unidade: "kg", foto: "doce-leite.jpg" },
      { nome: "Rapadura", preco: "", unidade: "un", foto: "rapadura.jpg" }
    ]
  }
};
