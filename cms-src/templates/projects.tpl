<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  [!DocLister? &documents=`[*id*]` &idType=`documents` &tvList=`meta_title,meta_description,meta_robots` &tpl=`@FILE:metatrest/seo-head` !]
  <link rel="stylesheet" href="/assets/css/global.css">
  <link rel="stylesheet" href="/assets/css/adaptives.css">
  <link rel="stylesheet" href="/assets/css/mobile.css">
  <script src="/assets/js/main.js" defer></script>
</head>
<body class="catalog-page projects-page frontend-page">
{{Header}}
  
  <main>
<div class="catalog-heading wrap flex align-end"><h1 class="display page">[!DocLister? &documents=`[*id*]` &idType=`documents` &tvList=`meta_title,meta_description,meta_robots` &tpl=`@FILE:metatrest/seo-h1` !]</h1></div>
<div class="project-filters wrap flex label filter" role="group" aria-label="Категории проектов — фильтрация пока не подключена" title="Фильтрация пока не подключена">
<span class="project-filter is-current" aria-current="true">Все</span>
<span class="project-filter" aria-disabled="true">Металлоконструкции</span>
<span class="project-filter" aria-disabled="true">Шпунтовые работы</span>
<span class="project-filter" aria-disabled="true">Кровля</span>
<span class="project-filter" aria-disabled="true">КМД / Проектирование</span>
<span class="project-filter" aria-disabled="true">Монолитные работы</span>
<span class="project-filter" aria-disabled="true">Область применения<svg class="icon" aria-hidden="true"><use href="/assets/svg/sprite.svg#chevron"></use></svg></span>
</div>
<section class="catalog-projects wrap" aria-label="Список проектов">
[!DocLister? &parents=`2` &depth=`1` &orderBy=`c.menuindex ASC,c.id ASC` &showNoPublish=`0` &display=`0` &tvList=`card_image,project_gallery,project_location,project_customer,project_period,project_tags` &prepare=`MetaTrestCardData` &tpl=`ProjectCatalogCard` !]
</section>
<!-- shared:request -->
<section class="request-section wrap grid" aria-labelledby="request-title">
  <div class="request-intro flex flex-column">
    <h2 class="heading request" id="request-title">Обсудим ваш объект</h2>
    <p class="body request-intro-text">Прикрепите ТЗ, проект или ведомость объёмов — это поможет нам определить состав работ.</p>
  </div>
  <form class="request-form flex flex-column" aria-label="Запрос расчёта">
    <div class="request-fields grid">
      <label class="request-field flex flex-column"><span class="label field">Компания <span class="required">*</span></span><input class="body field" type="text" name="organization" autocomplete="organization" placeholder="Название организации" required></label>
      <label class="request-field flex flex-column"><span class="label field">Имя <span class="required">*</span></span><input class="body field" type="text" name="name" autocomplete="name" placeholder="Как к вам обращаться" required></label>
      <label class="request-field flex flex-column"><span class="label field">Телефон <span class="required">*</span></span><input class="body field" type="tel" name="tel" autocomplete="tel" placeholder="+7 (___) ___-__-__" required></label>
      <label class="request-field flex flex-column"><span class="label field">Тип объекта</span><span class="request-select-value flex align-center"><select class="body field" name="object"><option value="">Выберите</option></select><svg class="icon" aria-hidden="true"><use href="/assets/svg/sprite.svg#chevron"></use></svg></span></label>
      <label class="request-field request-field-wide flex flex-column"><span class="label field">Вид работ</span><span class="request-select-value flex align-center"><select class="body field" name="work"><option value="">Выберите вид работ</option><option>Металлоконструкции</option><option>Шпунтовые работы</option><option>Монолитные работы</option><option>Кровельные работы</option><option>Разработка КМД</option><option>Проектирование</option><option>Авторский контроль</option></select><svg class="icon" aria-hidden="true"><use href="/assets/svg/sprite.svg#chevron"></use></svg></span></label>
      <label class="request-field request-field-wide flex flex-column"><span class="label field">Комментарий</span><input class="body field" name="comment" placeholder="Необязательно"></label>
    </div>
    <label class="request-upload flex flex-column align-center justify-center">
      <span class="body field">Прикрепить ТЗ или проект</span>
      <span class="body file-hint">PDF, DOC, DOCX, XLS, XLSX, ZIP · до 20 МБ</span>
      <input type="file" name="attachment" accept=".pdf,.doc,.docx,.xls,.xlsx,.zip" aria-label="Прикрепить ТЗ или проект">
    </label>
    <div class="request-submit flex flex-column">
      <label class="request-consent flex"><input type="checkbox" name="consent" required><span class="body small consent">Даю согласие на обработку персональных данных в соответствии с <span class="request-policy">Политикой конфиденциальности</span></span></label>
      <button class="button button-primary label button-caption-lg" type="button" disabled title="Отправка заявки ещё не подключена"><span class="button-text">Запросить расчёт</span><span class="button-icon"><svg class="icon" aria-hidden="true"><use href="/assets/svg/sprite.svg#arrow-link"></use></svg></span></button>
    </div>
  </form>
</section>
<!-- /shared:request -->
  </main>
{{Footer}}
</body>
</html>
