<?php
/** DocLister prepare: plain fields, optional card metadata and resource-stable IDs. */
if (!defined('MODX_BASE_PATH')) { return []; }
$data = $data ?? [];
$escape = static fn($value) => str_replace(['[', ']', '`'], ['&#91;', '&#93;', '&#96;'], htmlspecialchars((string)$value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
$path = static function ($value) {
    $value = trim((string)$value);
    if (str_starts_with($value, 'assets/')) { $value = '/' . $value; }
    return preg_match('~^/assets/[\p{L}\p{N}_./% ()+@-]+$~uD', $value) && !str_contains(rawurldecode($value), '..') ? $value : '';
};
$lines = static fn($value) => array_values(array_filter(array_map('trim', preg_split('/\R/u', (string)$value)), static fn($line) => $line !== ''));
foreach (['pagetitle', 'longtitle', 'description'] as $field) { $data['card_' . $field] = $escape($data[$field] ?? ''); }
$id = (int)($data['id'] ?? 0);
$data['card_number'] = str_pad((string)($data['iteration'] ?? 1), 2, '0', STR_PAD_LEFT);
$data['card_image_path'] = $escape($path($data['tv.card_image'] ?? ''));
$data['card_image_html'] = $data['card_image_path'] !== '' ? '<img class="project-photo cover" src="'.$data['card_image_path'].'" alt="">' : '';
$data['card_cover_html'] = $data['card_image_path'] !== '' ? '<img class="cover" src="'.$data['card_image_path'].'" alt="">' : '';
$data['project_photos'] = '';
$photos = array_unique(array_merge([$path($data['tv.card_image'] ?? '')], array_map($path, $lines($data['tv.project_gallery'] ?? ''))));
foreach (array_filter($photos) as $photo) { $data['project_photos'] .= '<img class="cover" src="'.$escape($photo).'" alt="">'; }
$data['project_metadata'] = '';
foreach (['project_location' => 'meta-pin', 'project_customer' => 'meta-building', 'project_period' => 'meta-calendar'] as $field => $icon) {
    $value = trim((string)($data['tv.'.$field] ?? ''));
    if ($value !== '') { $data['project_metadata'] .= '<li class="flex align-center"><svg class="icon" aria-hidden="true"><use href="/assets/svg/sprite.svg#'.$icon.'"></use></svg><span>'.$escape($value).'</span></li>'; }
}
$data['project_tags_html'] = '';
foreach ($lines($data['tv.project_tags'] ?? '') as $tag) { $data['project_tags_html'] .= '<li>'.$escape($tag).'</li>'; }
$data['project_years'] = '';
preg_match_all('/\b(?:19|20)\d{2}\b/u', (string)($data['tv.project_period'] ?? ''), $years);
$years = array_values(array_unique($years[0]));
if ($years) {
    $first = reset($years); $last = end($years);
    $data['project_years'] = '<div class="project-years flex flex-column align-center label ui" aria-label="'.$first.($first !== $last ? 'вЂ“'.$last : '').'"><time datetime="'.$first.'">'.$first.'</time>'.($first !== $last ? '<span aria-hidden="true"></span><time datetime="'.$last.'">'.$last.'</time>' : '').'</div>';
}
$data['project_button_class'] = ($data['iteration'] ?? 1) == 1 ? 'button-caption-md catalog-first-button' : 'button-caption-sm catalog-more';
return $data;
