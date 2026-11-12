<li>
  <button class="service-row flex align-center" type="button" data-service="[+id+]" data-service-number="[+card_number+]" data-image="[+card_image_path+]" aria-pressed="false" aria-controls="service-preview">
    <span class="data service-index" aria-hidden="true">[+card_number+].</span>
    <span class="heading service-name flex-grow">[+card_pagetitle+]</span>
    <svg class="icon" aria-hidden="true"><use href="/assets/svg/sprite.svg#service-plus"></use></svg>
  </button>
  <div class="service-details" id="service-details-[+id+]" hidden>
    <div class="service-detail-copy flex flex-column">
      <p class="body medium">[+card_description+]</p>
      <a class="button button-outline label button-caption-md" href="[~3~]#service-[+id+]"><span class="button-text">Подробнее</span><span class="button-icon"><svg class="icon" aria-hidden="true"><use href="/assets/svg/sprite.svg#mobile-arrow"></use></svg></span></a>
    </div>
  </div>
</li>