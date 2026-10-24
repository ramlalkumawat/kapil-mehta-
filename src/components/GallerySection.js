/**
 * Photo Gallery Component — Kapil Mehta
 * Showcases authentic photographic milestones:
 * Student rights movements, senior leadership interactions, youth rallies, and public outreach.
 * Includes interactive full-screen Lightbox with keyboard navigation.
 */

import { t, getLocalized } from '../locales/i18n.js';
import activeCandidate from '../../config/active-candidate.js';

export function renderGallerySection() {
  const galleryItems = activeCandidate.gallery || [];

  if (galleryItems.length === 0) {
    return '';
  }

  return `
    <section id="gallery" class="section container">
      <div class="section-header" style="text-align: center; margin-bottom: var(--space-8);">
        <span class="section-tag">${t('gallery.tag')}</span>
        <h2 class="section-title" style="text-align: center;">${t('gallery.title')}</h2>
        <p class="section-subtitle" style="margin-left: auto; margin-right: auto; text-align: center; max-width: 650px;">
          ${t('gallery.subtitle')}
        </p>
      </div>

      <!-- Gallery Grid -->
      <div class="gallery-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: var(--space-6); width: 100%; min-width: 0;">
        ${galleryItems.map((item, index) => {
          const title = getLocalized(item.title);
          const desc = getLocalized(item.description);
          const tag = getLocalized(item.tag);
          const location = getLocalized(item.location);

          return `
            <div class="gallery-card" data-gallery-index="${index}" style="background-color: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-sm); display: flex; flex-direction: column; transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer;">
              <!-- Image Container -->
              <div class="gallery-img-container" style="position: relative; width: 100%; height: 260px; overflow: hidden; background-color: #1f2937;">
                <img 
                  src="${item.image}" 
                  alt="${title}" 
                  loading="lazy" 
                  style="width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 0.4s ease;"
                  class="gallery-thumbnail"
                />
                <div style="position: absolute; top: var(--space-3); left: var(--space-3); display: flex; gap: var(--space-2); flex-wrap: wrap;">
                  ${tag ? `<span class="badge badge-primary" style="box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 0.7rem;">${tag}</span>` : ''}
                  ${location ? `<span class="badge badge-accent" style="box-shadow: 0 2px 6px rgba(0,0,0,0.3); font-size: 0.7rem;">📍 ${location}</span>` : ''}
                </div>

                <!-- Hover Overlay Trigger -->
                <div class="gallery-overlay" style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%); display: flex; align-items: flex-end; justify-content: flex-end; padding: var(--space-3); opacity: 0; transition: opacity 0.25s ease;">
                  <span style="background: rgba(255,255,255,0.9); color: var(--color-primary-dark); font-weight: 700; font-size: 0.75rem; padding: 4px 10px; border-radius: var(--radius-full); display: inline-flex; align-items: center; gap: 4px;">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line><line x1="11" y1="8" x2="11" y2="14"></line><line x1="8" y1="11" x2="14" y2="11"></line></svg>
                    ${t('gallery.viewImage')}
                  </span>
                </div>
              </div>

              <!-- Card Content -->
              <div style="padding: var(--space-4); display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                <div>
                  <h3 style="font-size: var(--font-size-base); font-weight: 700; color: var(--color-primary-dark); margin: 0 0 var(--space-2); line-height: 1.4;">
                    ${title}
                  </h3>
                  <p style="font-size: var(--font-size-xs); color: var(--color-text-muted); line-height: 1.6; margin: 0;">
                    ${desc}
                  </p>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Fullscreen Lightbox Modal -->
      <div id="gallery-lightbox" class="modal-backdrop" role="dialog" aria-modal="true" style="display: none; align-items: center; justify-content: center; z-index: 1000; padding: var(--space-4);">
        <div style="position: relative; max-width: 900px; width: 100%; background: #0f172a; border-radius: var(--radius-xl); overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); display: flex; flex-direction: column;">
          
          <!-- Close button -->
          <button id="btn-close-lightbox" style="position: absolute; top: 12px; right: 12px; z-index: 10; width: 40px; height: 40px; border-radius: 50%; background: rgba(0,0,0,0.6); color: #fff; border: 1px solid rgba(255,255,255,0.2); font-size: 22px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.2s;" aria-label="${t('gallery.closeLightbox')}">&times;</button>

          <!-- Lightbox Image View -->
          <div style="width: 100%; max-height: 70vh; display: flex; align-items: center; justify-content: center; background: #000; overflow: hidden;">
            <img id="lightbox-img" src="" alt="" style="max-width: 100%; max-height: 70vh; object-fit: contain;" />
          </div>

          <!-- Lightbox Details Footer -->
          <div style="padding: var(--space-4) var(--space-5); color: #fff; display: flex; flex-direction: column; gap: var(--space-2); background: #0f172a; border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="display: flex; justify-content: space-between; align-items: center; gap: var(--space-2); flex-wrap: wrap;">
              <span id="lightbox-badge" class="badge badge-accent" style="font-size: 0.72rem;"></span>
              <span id="lightbox-counter" style="color: #94a3b8; font-size: 0.75rem; font-weight: 600;"></span>
            </div>
            <h3 id="lightbox-title" style="color: #f8fafc; font-size: var(--font-size-lg); margin: 0; font-weight: 700;"></h3>
            <p id="lightbox-desc" style="color: #cbd5e1; font-size: var(--font-size-xs); line-height: 1.6; margin: 0;"></p>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initGalleryEvents() {
  const galleryItems = activeCandidate.gallery || [];
  if (galleryItems.length === 0) return;

  const cards = document.querySelectorAll('.gallery-card');
  const lightbox = document.getElementById('gallery-lightbox');
  const closeBtn = document.getElementById('btn-close-lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxBadge = document.getElementById('lightbox-badge');
  const lightboxCounter = document.getElementById('lightbox-counter');

  if (!lightbox) return;

  // Add hover effect style dynamically
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.transform = 'translateY(-4px)';
      card.style.boxShadow = 'var(--shadow-md)';
      const overlay = card.querySelector('.gallery-overlay');
      const thumb = card.querySelector('.gallery-thumbnail');
      if (overlay) overlay.style.opacity = '1';
      if (thumb) thumb.style.transform = 'scale(1.05)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'translateY(0)';
      card.style.boxShadow = 'var(--shadow-sm)';
      const overlay = card.querySelector('.gallery-overlay');
      const thumb = card.querySelector('.gallery-thumbnail');
      if (overlay) overlay.style.opacity = '0';
      if (thumb) thumb.style.transform = 'scale(1)';
    });

    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-gallery-index'), 10);
      openLightbox(idx);
    });
  });

  function openLightbox(index) {
    if (index < 0 || index >= galleryItems.length) return;
    const item = galleryItems[index];

    lightboxImg.src = item.image;
    lightboxImg.alt = getLocalized(item.title);
    lightboxTitle.textContent = getLocalized(item.title);
    lightboxDesc.textContent = getLocalized(item.description);
    
    const tag = getLocalized(item.tag);
    const loc = getLocalized(item.location);
    lightboxBadge.textContent = loc ? `${tag} • 📍 ${loc}` : tag;
    lightboxCounter.textContent = `${index + 1} / ${galleryItems.length}`;

    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
    document.body.style.overflow = '';
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeLightbox);
  }

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.style.display === 'flex') {
      closeLightbox();
    }
  });
}
