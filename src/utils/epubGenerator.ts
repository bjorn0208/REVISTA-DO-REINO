import JSZip from 'jszip';
import { MagazineEdition, MagazinePage } from '../types/magazine';

// Helper to escape XML/HTML characters
function escapeXml(unsafe: string = ''): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// Helper to resolve an image URL to ArrayBuffer for embedding in EPUB
async function fetchImageBuffer(url: string): Promise<{ data: Uint8Array; mimeType: string } | null> {
  try {
    if (!url) return null;

    if (url.startsWith('data:')) {
      const parts = url.split(';base64,');
      const mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      const binaryString = atob(parts[1]);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return { data: bytes, mimeType };
    }

    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    const response = await fetch(fullUrl);
    if (!response.ok) return null;
    const blob = await response.blob();
    const arrayBuffer = await blob.arrayBuffer();
    return { data: new Uint8Array(arrayBuffer), mimeType: blob.type || 'image/jpeg' };
  } catch (err) {
    console.warn('Could not fetch image for EPUB:', err);
    return null;
  }
}

// Generate XHTML for each individual page
function generatePageXhtml(page: MagazinePage, edition: MagazineEdition, hasCoverImage: boolean): string {
  const pNum = page.pageNumber;
  let bodyContent = '';

  switch (page.pageType) {
    case 'cover':
      bodyContent = `
        <section class="page page-cover" epub:type="cover">
          <header class="cover-coordinates">
            <span class="category">${escapeXml(edition.category)}</span>
            <span class="meta">${escapeXml(edition.date)} · ${escapeXml(edition.issueNumber)}</span>
          </header>

          <h1 class="cover-masthead">${escapeXml(edition.name)}</h1>
          <p class="cover-kicker">${escapeXml(page.kicker || 'EDIÇÃO EXCLUSIVA')}</p>

          ${
            hasCoverImage
              ? `<div class="cover-image-wrap"><img src="../images/cover.jpg" alt="Foto de Capa" class="cover-image" /></div>`
              : ''
          }

          <div class="cover-headline-box">
            <p class="lead-label">MATÉRIA PRINCIPAL</p>
            <h2 class="cover-headline">${escapeXml(page.title || edition.headline)}</h2>
            ${page.subtitle ? `<p class="cover-subtitle">${escapeXml(page.subtitle)}</p>` : ''}
            ${page.deck ? `<p class="cover-deck">${escapeXml(page.deck)}</p>` : ''}
          </div>

          ${
            page.secondaryStories && page.secondaryStories.length > 0
              ? `
              <div class="cover-stories-box">
                <h3 class="box-title">NESTA EDIÇÃO:</h3>
                <ul>
                  ${page.secondaryStories
                    .map(
                      (s, i) => `
                    <li>
                      <strong>DESTAQUE ${i + 1} (${escapeXml(s.pageRef)}):</strong> ${escapeXml(s.title)}
                      <span class="story-desc">${escapeXml(s.summary)}</span>
                    </li>
                  `
                    )
                    .join('')}
                </ul>
              </div>`
              : ''
          }

          <footer class="cover-footer">
            <span>${escapeXml(edition.name)} EDITORIAL PRESS · ISSN 2984-1184</span>
          </footer>
        </section>
      `;
      break;

    case 'editorial':
      bodyContent = `
        <section class="page page-editorial">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'CARTA DO EDITOR')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          <h1 class="page-title">${escapeXml(page.title)}</h1>
          ${page.subtitle ? `<p class="deck">${escapeXml(page.subtitle)}</p>` : ''}

          <div class="prose">
            ${page.paragraphs.map((p, idx) => `<p class="${idx === 0 ? 'drop-cap' : ''}">${escapeXml(p)}</p>`).join('')}
          </div>

          <div class="editorial-signoff">
            <p><strong>A Redação Editorial</strong><br />${escapeXml(edition.name)} Magazine</p>
          </div>
        </section>
      `;
      break;

    case 'feature_story_part1':
    case 'feature_story_part2':
      bodyContent = `
        <section class="page page-story">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'GRANDE REPORTAGEM')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          <h1 class="page-title">${escapeXml(page.title)}</h1>
          ${page.subtitle ? `<p class="deck">${escapeXml(page.subtitle)}</p>` : ''}

          ${
            page.pullQuote
              ? `
            <blockquote class="pull-quote">
              <p>“${escapeXml(page.pullQuote.text)}”</p>
              ${page.pullQuote.attribution ? `<cite>— ${escapeXml(page.pullQuote.attribution)}</cite>` : ''}
            </blockquote>
          `
              : ''
          }

          <div class="prose">
            ${page.paragraphs.map((p, idx) => `<p class="${idx === 0 && page.pageType === 'feature_story_part1' ? 'drop-cap' : ''}">${escapeXml(p)}</p>`).join('')}
          </div>

          ${
            page.sidebarBox
              ? `
            <aside class="sidebar-box">
              <h3>${escapeXml(page.sidebarBox.title)}</h3>
              <ul>
                ${page.sidebarBox.items.map((item) => `<li>${escapeXml(item)}</li>`).join('')}
              </ul>
              ${page.sidebarBox.note ? `<p class="sidebar-note">${escapeXml(page.sidebarBox.note)}</p>` : ''}
            </aside>
          `
              : ''
          }
        </section>
      `;
      break;

    case 'profile':
      bodyContent = `
        <section class="page page-profile">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'PERFIL & ANÁLISE')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          <h1 class="page-title">${escapeXml(page.title)}</h1>
          ${page.subtitle ? `<p class="deck">${escapeXml(page.subtitle)}</p>` : ''}

          ${
            hasCoverImage
              ? `<div class="profile-photo-wrap"><img src="../images/cover.jpg" alt="Retrato Editorial" class="profile-photo" /></div>`
              : ''
          }

          <div class="prose">
            ${page.paragraphs.map((p, idx) => `<p class="${idx === 0 ? 'drop-cap' : ''}">${escapeXml(p)}</p>`).join('')}
          </div>

          ${
            page.pullQuote
              ? `
            <blockquote class="pull-quote">
              <p>“${escapeXml(page.pullQuote.text)}”</p>
              ${page.pullQuote.attribution ? `<cite>— ${escapeXml(page.pullQuote.attribution)}</cite>` : ''}
            </blockquote>
          `
              : ''
          }
        </section>
      `;
      break;

    case 'insights':
      bodyContent = `
        <section class="page page-insights">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'DESTAQUES & EIXOS')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          <h1 class="page-title">${escapeXml(page.title)}</h1>
          ${page.subtitle ? `<p class="deck">${escapeXml(page.subtitle)}</p>` : ''}

          <div class="pillars-list">
            ${
              page.statsOrPillars
                ? page.statsOrPillars
                    .map(
                      (p) => `
                  <article class="pillar-card">
                    <span class="pillar-number">${escapeXml(p.value)}</span>
                    <h3 class="pillar-label">${escapeXml(p.label)}</h3>
                    <p class="pillar-desc">${escapeXml(p.description)}</p>
                  </article>
                `
                    )
                    .join('')
                : ''
            }
          </div>

          <div class="prose">
            ${page.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join('')}
          </div>
        </section>
      `;
      break;

    case 'deep_dive':
    case 'dialogue':
      bodyContent = `
        <section class="page page-deepdive">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'ANÁLISE ESTRATÉGICA')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          <h1 class="page-title">${escapeXml(page.title)}</h1>
          ${page.subtitle ? `<p class="deck">${escapeXml(page.subtitle)}</p>` : ''}

          <div class="prose">
            ${page.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join('')}
          </div>

          ${
            page.sidebarBox
              ? `
            <aside class="sidebar-box">
              <h3>${escapeXml(page.sidebarBox.title)}</h3>
              <ul>
                ${page.sidebarBox.items.map((item) => `<li>${escapeXml(item)}</li>`).join('')}
              </ul>
            </aside>
          `
              : ''
          }
        </section>
      `;
      break;

    case 'infographic_timeline':
      bodyContent = `
        <section class="page page-timeline">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'INFOGRAFIA')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          <h1 class="page-title">${escapeXml(page.title)}</h1>
          ${page.subtitle ? `<p class="deck">${escapeXml(page.subtitle)}</p>` : ''}

          <div class="timeline-list">
            ${
              page.timelineMilestones
                ? page.timelineMilestones
                    .map(
                      (m) => `
                  <div class="milestone-item">
                    <span class="milestone-phase">${escapeXml(m.phase)}</span>
                    <h3 class="milestone-title">${escapeXml(m.title)}</h3>
                    <p class="milestone-detail">${escapeXml(m.detail)}</p>
                  </div>
                `
                    )
                    .join('')
                : ''
            }
          </div>

          <div class="prose">
            ${page.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join('')}
          </div>
        </section>
      `;
      break;

    case 'manifesto_quote':
      bodyContent = `
        <section class="page page-manifesto">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'MANIFESTO')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          ${
            page.pullQuote
              ? `
            <div class="manifesto-display">
              <blockquote>“${escapeXml(page.pullQuote.text)}”</blockquote>
              ${page.pullQuote.attribution ? `<cite>— ${escapeXml(page.pullQuote.attribution)}</cite>` : ''}
            </div>
          `
              : `<h1 class="manifesto-title">${escapeXml(page.title)}</h1>`
          }

          <div class="prose">
            ${page.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join('')}
          </div>
        </section>
      `;
      break;

    case 'colophon':
      bodyContent = `
        <section class="page page-colophon">
          <header class="page-header">
            <span class="kicker">${escapeXml(page.kicker || 'EXPEDIENTE & FICHA')}</span>
            <span class="page-num">PÁG. ${pNum.toString().padStart(2, '0')}</span>
          </header>

          <h1 class="page-title">${escapeXml(page.title)}</h1>
          ${page.subtitle ? `<p class="deck">${escapeXml(page.subtitle)}</p>` : ''}

          <div class="colophon-grid">
            <div class="colophon-staff">
              <h3>CORPO EDITORIAL</h3>
              <ul>
                ${
                  page.colophonStaff
                    ? page.colophonStaff.map((s) => `<li><strong>${escapeXml(s.role)}:</strong> ${escapeXml(s.name)}</li>`).join('')
                    : `
                    <li><strong>Direção Geral & Curadoria:</strong> ${escapeXml(edition.name)} Studio</li>
                    <li><strong>Edição-Chefe:</strong> Magazine Architect</li>
                    <li><strong>Direção de Arte:</strong> Atelier Gráfico Autônomo</li>
                  `
                }
              </ul>
            </div>

            <div class="colophon-tech">
              <h3>DADOS TÉCNICOS & AUDITORIA</h3>
              <p><strong>Edição:</strong> ${escapeXml(edition.issueNumber)}</p>
              <p><strong>Data:</strong> ${escapeXml(edition.date)}</p>
              <p><strong>Registro ISSN:</strong> 2984-1184</p>
              <p><strong>Status de Auditoria:</strong> Certificada 100% de Preservação e Fidedignidade</p>
            </div>
          </div>

          <div class="prose">
            ${page.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join('')}
          </div>
        </section>
      `;
      break;

    case 'back_cover':
      bodyContent = `
        <section class="page page-backcover">
          <h1 class="backcover-brand">${escapeXml(edition.name)}</h1>
          <p class="backcover-tagline">AUTONOMOUS EDITORIAL ARCHITECTURE</p>

          <blockquote class="backcover-quote">
            <p>“${escapeXml(page.title || 'A clareza do pensamento é a forma mais refinada de elegância.')}”</p>
          </blockquote>

          <footer class="backcover-footer">
            <p>${escapeXml(edition.issueNumber)} · ${escapeXml(edition.date)}</p>
            <p class="barcode">||||| | ||||| |||| | ||| 2984-1184</p>
            <p>© ${new Date().getFullYear()} ${escapeXml(edition.name)} Publishing House. Todos os direitos reservados.</p>
          </footer>
        </section>
      `;
      break;

    default:
      bodyContent = `
        <section class="page">
          <h1>${escapeXml(page.title)}</h1>
          ${page.paragraphs.map((p) => `<p>${escapeXml(p)}</p>`).join('')}
        </section>
      `;
      break;
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>${escapeXml(page.title || edition.name)} - Pág ${pNum}</title>
  <link rel="stylesheet" type="text/css" href="../styles/style.css" />
</head>
<body>
  ${bodyContent}
</body>
</html>`;
}

// Generate CSS for the EPUB publication
function generateEpubCss(edition: MagazineEdition): string {
  const accent = edition.colorPalette.accent || '#8C2B1D';

  return `
/* EPUB Digital Reader Editorial Styling */
@charset "utf-8";

body {
  margin: 1.5em;
  padding: 0;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 1em;
  line-height: 1.6;
  color: #1a1917;
  background-color: #ffffff;
}

h1, h2, h3, h4 {
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 700;
  line-height: 1.2;
  margin-top: 1em;
  margin-bottom: 0.5em;
  color: #111110;
}

p {
  margin: 0 0 1em 0;
  text-align: justify;
  text-justify: inter-word;
}

.drop-cap:first-letter {
  font-family: 'Cinzel', Georgia, serif;
  font-size: 3.2em;
  float: left;
  line-height: 0.8;
  margin-right: 0.12em;
  margin-top: 0.05em;
  color: ${accent};
  font-weight: bold;
}

.page-header {
  border-bottom: 1px solid #dcd7ce;
  padding-bottom: 0.4em;
  margin-bottom: 1.5em;
  display: flex;
  justify-content: space-between;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #7d776f;
  font-family: sans-serif;
}

.kicker {
  color: ${accent};
  font-weight: 600;
}

.page-title {
  font-size: 1.8em;
  margin-top: 0.2em;
  margin-bottom: 0.4em;
  letter-spacing: -0.02em;
}

.deck {
  font-family: Georgia, serif;
  font-style: italic;
  font-size: 1.1em;
  color: #555047;
  line-height: 1.5;
  margin-bottom: 1.6em;
  border-left: 2px solid ${accent};
  padding-left: 0.8em;
}

/* Pull Quotes */
.pull-quote {
  margin: 1.8em 0;
  padding: 1.2em;
  background-color: #fbf9f5;
  border-top: 2px solid ${accent};
  border-bottom: 1px solid #e4ded5;
  text-align: center;
}

.pull-quote p {
  font-size: 1.25em;
  font-style: italic;
  font-family: 'Playfair Display', Georgia, serif;
  color: #1c1a17;
  margin-bottom: 0.4em;
  line-height: 1.4;
}

.pull-quote cite {
  font-size: 0.8em;
  font-family: sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #8c857b;
  display: block;
}

/* Sidebar Boxes */
.sidebar-box {
  margin: 1.8em 0;
  padding: 1.2em;
  background-color: #f7f4ee;
  border: 1px solid #e2ddd3;
  border-radius: 4px;
}

.sidebar-box h3 {
  font-size: 0.9em;
  font-family: sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${accent};
  margin-top: 0;
  margin-bottom: 0.6em;
}

.sidebar-box ul {
  margin: 0;
  padding-left: 1.2em;
  font-size: 0.9em;
}

.sidebar-box li {
  margin-bottom: 0.4em;
}

.sidebar-note {
  font-size: 0.8em;
  color: #736d65;
  margin-top: 0.8em;
  font-style: italic;
}

/* Cover Styling */
.page-cover {
  text-align: center;
  padding: 1em 0;
}

.cover-coordinates {
  font-family: sans-serif;
  font-size: 0.75em;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: #736d65;
  border-bottom: 1px solid #d1cac0;
  padding-bottom: 0.5em;
  margin-bottom: 1.2em;
}

.cover-masthead {
  font-size: 2.8em;
  font-weight: 900;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0.2em 0;
  color: #111;
}

.cover-kicker {
  font-style: italic;
  font-size: 0.95em;
  color: ${accent};
  margin-bottom: 1.5em;
}

.cover-image-wrap {
  margin: 1em 0;
  text-align: center;
}

.cover-image {
  max-width: 100%;
  height: auto;
  max-height: 480px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.cover-headline-box {
  margin: 1.8em 0 1.2em 0;
  padding: 1em;
  border-top: 2px solid ${accent};
  border-bottom: 1px solid #dcd7ce;
}

.lead-label {
  font-family: sans-serif;
  font-size: 0.7em;
  font-weight: 700;
  letter-spacing: 0.15em;
  color: ${accent};
  margin-bottom: 0.2em;
}

.cover-headline {
  font-size: 1.6em;
  line-height: 1.2;
  margin: 0.2em 0;
}

.cover-subtitle {
  font-style: italic;
  color: #444;
  margin-top: 0.4em;
}

.cover-stories-box {
  text-align: left;
  margin: 1.5em 0;
  padding: 1em;
  background-color: #fcfbf9;
  border: 1px solid #e8e3da;
  font-size: 0.85em;
}

.cover-stories-box .box-title {
  font-size: 0.8em;
  font-family: sans-serif;
  letter-spacing: 0.1em;
  margin-top: 0;
  color: #6b655c;
}

.cover-stories-box ul {
  padding-left: 1.2em;
  margin: 0;
}

.cover-stories-box li {
  margin-bottom: 0.5em;
}

.story-desc {
  display: block;
  color: #666;
  font-size: 0.9em;
}

.cover-footer {
  font-family: sans-serif;
  font-size: 0.7em;
  letter-spacing: 0.1em;
  color: #999;
  margin-top: 2em;
}

/* Strategic Pillars */
.pillar-card {
  margin: 1.2em 0;
  padding: 1em;
  background-color: #faf8f5;
  border-left: 3px solid ${accent};
}

.pillar-number {
  font-size: 1.6em;
  font-weight: bold;
  font-family: 'Playfair Display', serif;
  color: ${accent};
  display: block;
}

.pillar-label {
  font-size: 1.1em;
  margin: 0.2em 0;
}

.pillar-desc {
  font-size: 0.9em;
  color: #4a453e;
  margin: 0;
}

/* Timeline */
.milestone-item {
  margin: 1.2em 0;
  padding-left: 1em;
  border-left: 2px solid ${accent};
}

.milestone-phase {
  font-family: sans-serif;
  font-size: 0.75em;
  text-transform: uppercase;
  color: ${accent};
  font-weight: bold;
}

.milestone-title {
  font-size: 1.1em;
  margin: 0.2em 0;
}

.milestone-detail {
  font-size: 0.9em;
  color: #4a453e;
}

/* Colophon */
.colophon-grid {
  margin: 1.5em 0;
  padding: 1em;
  background-color: #f7f4ee;
  border: 1px solid #e2ddd3;
  font-size: 0.85em;
}

.colophon-grid h3 {
  font-size: 0.8em;
  font-family: sans-serif;
  letter-spacing: 0.1em;
  color: ${accent};
}

.colophon-grid ul {
  padding-left: 1em;
  margin: 0.5em 0;
}

/* Back Cover */
.page-backcover {
  text-align: center;
  padding: 3em 1em;
}

.backcover-brand {
  font-size: 2.2em;
  letter-spacing: 0.1em;
  margin-bottom: 0.1em;
}

.backcover-tagline {
  font-family: sans-serif;
  font-size: 0.7em;
  letter-spacing: 0.2em;
  color: #736d65;
  margin-bottom: 3em;
}

.backcover-quote blockquote {
  font-size: 1.3em;
  font-style: italic;
  font-family: 'Playfair Display', serif;
  color: #222;
  margin: 2em 0;
}

.backcover-footer {
  margin-top: 4em;
  font-size: 0.75em;
  color: #8a857b;
  font-family: sans-serif;
}

.barcode {
  font-family: monospace;
  letter-spacing: 0.1em;
  font-size: 1em;
  margin: 0.8em 0;
}
`;
}

// Master function to generate and download the EPUB
export async function exportMagazineAsEpub(
  edition: MagazineEdition,
  onProgress?: (status: string) => void
): Promise<Blob> {
  onProgress?.('Iniciando empacotamento EPUB...');

  const zip = new JSZip();

  // 1. mimetype (MUST be the first file and completely UNCOMPRESSED per EPUB 3 spec)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.file('META-INF/container.xml', containerXml);

  // 3. Prepare Image (cover image)
  onProgress?.('Processando fotografia de capa...');
  const coverPhotoUrl =
    edition.pages.find((p) => p.pageNumber === 1)?.imageSlot?.customImageUrl || edition.primaryPhotoUrl;
  const imageResult = await fetchImageBuffer(coverPhotoUrl);
  const hasCoverImage = !!imageResult;

  if (imageResult) {
    zip.file('OEBPS/images/cover.jpg', imageResult.data);
  }

  // 4. Stylesheet
  onProgress?.('Gerando tipografia e folhas de estilo...');
  const cssContent = generateEpubCss(edition);
  zip.file('OEBPS/styles/style.css', cssContent);

  // 5. Generate Pages (XHTML)
  onProgress?.('Diagramando as 12 páginas em XHTML editorial...');
  const pageFiles: { filename: string; id: string; title: string }[] = [];

  for (const page of edition.pages) {
    const filename = `page_${page.pageNumber}.xhtml`;
    const id = `page_${page.pageNumber}`;
    const xhtml = generatePageXhtml(page, edition, hasCoverImage);
    zip.file(`OEBPS/pages/${filename}`, xhtml);
    pageFiles.push({
      filename,
      id,
      title: page.title || `Página ${page.pageNumber}`,
    });
  }

  // 6. Navigation Document (EPUB 3: nav.xhtml)
  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Sumário - ${escapeXml(edition.name)}</title>
  <link rel="stylesheet" type="text/css" href="styles/style.css" />
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>Sumário da Edição</h1>
    <ol>
      ${pageFiles
        .map(
          (p, idx) => `
        <li><a href="pages/${p.filename}">Pág ${idx + 1}: ${escapeXml(p.title)}</a></li>
      `
        )
        .join('')}
    </ol>
  </nav>
</body>
</html>`;
  zip.file('OEBPS/nav.xhtml', navXhtml);

  // 7. NCX Document (EPUB 2 compatibility for Kindle / e-readers)
  const uuid = `urn:uuid:${edition.id || 'mag-edition-042'}`;
  const tocNcx = `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="${uuid}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="${pageFiles.length}"/>
    <meta name="dtb:maxPageNumber" content="${pageFiles.length}"/>
  </head>
  <docTitle>
    <text>${escapeXml(edition.name)} - ${escapeXml(edition.headline)}</text>
  </docTitle>
  <navMap>
    ${pageFiles
      .map(
        (p, idx) => `
      <navPoint id="navPoint-${idx + 1}" playOrder="${idx + 1}">
        <navLabel>
          <text>${idx + 1}. ${escapeXml(p.title)}</text>
        </navLabel>
        <content src="pages/${p.filename}"/>
      </navPoint>
    `
      )
      .join('')}
  </navMap>
</ncx>`;
  zip.file('OEBPS/toc.ncx', tocNcx);

  // 8. Package Document (OEBPS/content.opf)
  const dateIso = new Date().toISOString().split('T')[0];
  const contentOpf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="BookID">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="BookID">${uuid}</dc:identifier>
    <dc:title>${escapeXml(edition.name)}: ${escapeXml(edition.headline)}</dc:title>
    <dc:creator>MAGAZINE ARCHITECT</dc:creator>
    <dc:language>pt-BR</dc:language>
    <dc:date>${dateIso}</dc:date>
    <dc:publisher>${escapeXml(edition.name)} Editorial Press</dc:publisher>
    <dc:description>${escapeXml(edition.editorialSummary)}</dc:description>
    <dc:subject>${escapeXml(edition.category)}</dc:subject>
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.[0-9]+Z$/, 'Z')}</meta>
    ${hasCoverImage ? '<meta name="cover" content="cover-image"/>' : ''}
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="css" href="styles/style.css" media-type="text/css"/>
    ${hasCoverImage ? '<item id="cover-image" href="images/cover.jpg" media-type="image/jpeg" properties="cover-image"/>' : ''}
    ${pageFiles
      .map(
        (p) => `<item id="${p.id}" href="pages/${p.filename}" media-type="application/xhtml+xml"/>`
      )
      .join('\n    ')}
  </manifest>
  <spine toc="ncx">
    ${pageFiles.map((p) => `<itemref idref="${p.id}"/>`).join('\n    ')}
  </spine>
</package>`;
  zip.file('OEBPS/content.opf', contentOpf);

  // 9. Compress and return Blob
  onProgress?.('Compilando arquivo .epub final...');
  const epubBlob = await zip.generateAsync({
    type: 'blob',
    mimeType: 'application/epub+zip',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 },
  });

  return epubBlob;
}

// Download helper to trigger browser save dialog
export function downloadEpubFile(blob: Blob, edition: MagazineEdition) {
  const safeName = edition.name.replace(/[^a-zA-Z0-9]/g, '_');
  const safeIssue = edition.issueNumber.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `Revista_${safeName}_${safeIssue}.epub`;

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
