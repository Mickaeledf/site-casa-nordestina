# Casa Nordestina Paranoá — Site

Site oficial da **Casa Nordestina Paranoá**, empório de produtos nordestinos e a granel no Paranoá, Brasília-DF.
Hoje quem clica em "site" no Google cai no Instagram. Este site resolve isso: em poucos segundos o cliente vê **se a loja está aberta, como chegar, o que ela vende e como pedir pelo WhatsApp**.

🔗 **Site no ar:** <https://mickaeledf.github.io/site-casa-nordestina/>
📸 **Instagram:** [@casanordestinaparanoa](https://www.instagram.com/casanordestinaparanoa/)

---

## Sumário

- [Funcionalidades](#funcionalidades)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Como editar o conteúdo](#como-editar-o-conteúdo)
- [Rodar no computador](#rodar-no-computador)
- [Publicação (GitHub Pages)](#publicação-github-pages)
- [Identidade visual](#identidade-visual)
- [SEO local](#seo-local)
- [Pendências](#pendências)

---

## Funcionalidades

- **Selo "Aberto agora / Fechado"** calculado pelo horário de Brasília (`America/Sao_Paulo`), atualizado a cada minuto.
- **Ações a um toque** em qualquer ponto da página: barra fixa no celular (WhatsApp · Ligar · Rota) e botão flutuante de WhatsApp no computador.
- **Ofertas da Semana — "Cada dia, um tema"**: selos redondos como os destaques do Instagram, com o dia de hoje marcado automaticamente e um cartaz no estilo das artes da loja (ex.: *Terça dos Temperos*, *Sexta da Polpa*).
- **Categorias de produtos** com botão "Perguntar no WhatsApp" que já abre a conversa com a mensagem pronta.
- **Como chegar**: mapa do Google, botões para Google Maps e Waze, "Copiar endereço" e tabela de horários com o dia atual destacado.
- **Fotos com placeholder**: enquanto uma foto não existir, aparece um quadro com emoji — nada quebra.
- Mobile-first, acessível (contraste, foco visível, `prefers-reduced-motion`) e sem bibliotecas pesadas.

## Estrutura do projeto

```
site-casa-nordestina/
├── docs/                      ← tudo que vai para o ar (o GitHub Pages publica esta pasta)
│   ├── index.html             página única (one-page)
│   ├── css/style.css          cores, fontes e layout
│   ├── js/config.js           ✏️ telefone, WhatsApp, endereço, horários
│   ├── js/ofertas.js          ✏️ temas e produtos de cada dia
│   ├── js/main.js             comportamento da página
│   └── img/                   ✏️ fotos (veja img/LEIA-ME.txt)
├── prompt-site-casa-nordestina.md  briefing/prompt original do projeto
└── README.md
```

Os arquivos marcados com ✏️ são os únicos que precisam ser alterados no dia a dia.

## Como editar o conteúdo

### Telefone, WhatsApp, endereço e horários
Edite [`docs/js/config.js`](docs/js/config.js). Os horários usam `0 = domingo ... 6 = sábado`; para um dia fechado, use `null`.

### Ofertas do dia
Edite [`docs/js/ofertas.js`](docs/js/ofertas.js). Para cada dia:

| Campo      | Exemplo                               | O que faz                                   |
|------------|---------------------------------------|---------------------------------------------|
| `titulo`   | `"dos Temperos"`                      | Texto grande do cartaz ("Terça **dos Temperos**") |
| `tema`     | `"Temperos"`                          | Texto do selo redondo                       |
| `desconto` | `"15%"` ou `""`                       | Mostra o bloco "15% de desconto"            |
| `chamada`  | `"Sabor que transforma..."`           | Frase do cartaz                             |
| `cor`      | `"creme"`, `"mostarda"`, `"laranja"`  | Cor de fundo do cartaz                      |
| `produtos` | `{ nome, preco, unidade, foto }`      | `preco: ""` mostra "Consulte o preço"       |

### Fotos
Coloque as imagens em `docs/img/` com os nomes listados em [`docs/img/LEIA-ME.txt`](docs/img/LEIA-ME.txt) (logo, fachada, categorias, Instagram e produtos). Dica: fotos com até ~200 KB (dá para comprimir em [squoosh.app](https://squoosh.app)).

### Depoimentos
No `index.html`, procure por `TROQUE pelos depoimentos reais do Google` e substitua os 3 textos.

## Rodar no computador

Abrir `docs/index.html` com dois cliques já funciona. Para simular um servidor de verdade:

```bash
python -m http.server 5173 --directory docs
```

Depois acesse <http://localhost:5173>.

## Publicação (GitHub Pages)

O site é publicado **automaticamente** pelo GitHub Pages a partir da pasta `docs/` da branch `main`
(Settings → Pages → *Deploy from a branch* → `main` / `/docs`). Cada `push` atualiza o site em 1–2 minutos.

Endereço: <https://mickaeledf.github.io/site-casa-nordestina/>

Fluxo de atualização:

```bash
git add .
git commit -m "Atualiza ofertas da semana"
git push
```

O arquivo `docs/.nojekyll` desliga o processamento Jekyll do GitHub, servindo os arquivos exatamente como estão.

### Domínio próprio (opcional)
Para usar algo como `casanordestinaparanoa.com.br`: registre o domínio (ex.: Registro.br), em Settings → Pages → **Custom domain** informe o domínio e crie no DNS um registro `CNAME` para `<usuario>.github.io`. Depois troque o endereço `mickaeledf.github.io/site-casa-nordestina` pelo novo domínio no `index.html` (`canonical`, `og:url`, `og:image` e JSON-LD).

## Identidade visual

Tirada das artes de campanha do Instagram (estilo empório rústico/artesanal).

| Uso                                   | Cor        |
|---------------------------------------|------------|
| Verde dos títulos                     | `#1E5B32`  |
| Verde profundo (rodapé)               | `#143D22`  |
| Verde do logo / WhatsApp              | `#138A3E`  |
| Laranja terracota (faixas, CTA)       | `#D2601A`  |
| Amarelo-mostarda (selos dos dias)     | `#F2B705`  |
| Etiqueta de preço neon                | `#EEF23B`  |
| Fundos creme / kraft                  | `#FAF4E6` / `#EFE3C8` |

**Fontes (Google Fonts):** *Anton* (títulos em caixa alta), *Kaushan Script* (nome do dia, em cursiva de pincel), *Nunito* (textos).

## SEO local

- `<title>` e meta description com bairro, cidade e produtos.
- Dados estruturados **JSON-LD** (`GroceryStore`) com endereço, telefone, horários, coordenadas, nota 4,5 (1.595 avaliações) e Instagram.
- Open Graph para prévia bonita ao compartilhar no WhatsApp.
- Depois de publicar, cadastre o link do site no **Perfil da Empresa no Google** (campo "Site"), substituindo o Instagram.

## Pendências

- [ ] Fotos reais (logo, fachada, categorias, Instagram, produtos)
- [ ] Tema de **quinta-feira**
- [ ] Confirmar se os descontos de 15% (segunda, terça e sexta) continuam valendo
- [ ] Preços reais em `ofertas.js`
- [ ] 3 depoimentos reais do Google
- [ ] Colocar o link do site no Perfil da Empresa no Google

