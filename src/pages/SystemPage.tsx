import { useState } from 'react';
import { Col, Grid } from '../components/layout/Grid';
import { Section } from '../components/layout/Section';
import { Button } from '../components/ui/Button';
import { SectionLabel } from '../components/ui/SectionLabel';
import { Tag } from '../components/ui/Tag';
import { TextLink } from '../components/ui/TextLink';
import { Rule } from '../components/blueprint/Rule';
import { Stamp } from '../components/blueprint/Stamp';
import styles from './SystemPage.module.css';

/*
 * Служебная страница этапа A: все токены и базовые компоненты на одном листе.
 * Доступна по адресу /system только при разработке (npm run dev).
 */

const colors = [
  {
    token: '--graphite-900',
    hex: '#17191B',
    role: 'Основной тёмный фон; текст на светлом',
    contrast: '15.5:1 с бумагой',
  },
  {
    token: '--graphite-800',
    hex: '#1F2225',
    role: 'Приподнятые тёмные поверхности, подложки превью',
    contrast: '14.0:1 с бумагой',
  },
  { token: '--graphite-700', hex: '#2C3034', role: 'Линии и границы на тёмном', contrast: 'декоративный' },
  {
    token: '--paper-100',
    hex: '#F2F0E9',
    role: 'Основной светлый фон; текст на тёмном',
    contrast: '15.5:1 с графитом',
  },
  { token: '--paper-200', hex: '#E6E3D9', role: 'Вторичная светлая поверхность', contrast: '—' },
  { token: '--paper-300', hex: '#D3CFC2', role: 'Линии и границы на светлом', contrast: 'декоративный' },
  {
    token: '--steel-500',
    hex: '#858B91',
    role: 'Вторичный текст — только на тёмном',
    contrast: '5.1:1 с графитом',
  },
  { token: '--steel-600', hex: '#5C6268', role: 'Вторичный текст на светлом', contrast: '5.4:1 с бумагой' },
  {
    token: '--signal',
    hex: '#B9F66B',
    role: 'Акцент: заливка, фокус, метки на тёмном',
    contrast: '13.8:1 с графитом',
  },
  {
    token: '--signal-ink',
    hex: '#2F4F0C',
    role: 'Акцент в роли текста и фокуса на светлом',
    contrast: '8.2:1 с бумагой',
  },
];

const typeScale = [
  { cls: 't-display', name: 'Display', size: '44 → 116', sample: 'Сетка и код' },
  { cls: 't-h1', name: 'H1', size: '40 → 96', sample: 'Brass Barbershop' },
  { cls: 't-h2', name: 'H2', size: '32 → 64', sample: 'Избранные работы' },
  { cls: 't-h3', name: 'H3', size: '22 → 32', sample: 'Адаптивная вёрстка под каждый экран' },
  {
    cls: 't-body-l',
    name: 'Body L',
    size: '18 → 21',
    sample:
      'Проектирую и разрабатываю сайты для небольшого бизнеса: от структуры и дизайна до вёрстки и запуска.',
  },
  {
    cls: 't-body',
    name: 'Body',
    size: '16 → 18',
    sample:
      'Основной текст. Длина строки ограничена 68 знаками — так глазу проще находить начало следующей строки. Съешь же ещё этих мягких французских булок, да выпей чаю.',
  },
  { cls: 't-mono', name: 'Mono', size: '12 → 13', sample: '01 / Работы · стек: HTML, CSS, JS · 2026' },
];

const headlines = [
  'Сайты для бизнеса\u00A0— продуманные от сетки до\u00A0кода',
  'Проектирую и разрабатываю сайты, которые работают на бизнес',
  'Сайт — это инструмент. Я делаю его точным.',
];

const spacing = [
  ['--space-1', 4],
  ['--space-2', 8],
  ['--space-3', 12],
  ['--space-4', 16],
  ['--space-5', 24],
  ['--space-6', 32],
  ['--space-7', 48],
  ['--space-8', 64],
  ['--space-9', 96],
  ['--space-10', 128],
  ['--space-11', 192],
] as const;

const motion = [
  { token: '--ease-out', name: 'Появление', note: 'быстрый старт, мягкая остановка' },
  { token: '--ease-in-out', name: 'Перемещение', note: 'смена состояний' },
  { token: '--ease-linear', name: 'Прорисовка', note: 'линии «чертежа»' },
];

export function SystemPage() {
  const [played, setPlayed] = useState(false);

  return (
    <>
      <div>
        <Section surface="light" index="A1" label="Варианты заголовка" labelledBy="headlines-title">
          <h2 id="headlines-title" className="visually-hidden">
            Варианты заголовка первого экрана
          </h2>
          <ol className={styles.headlines} role="list">
            {headlines.map((h, i) => (
              <li key={h} className={styles.headline}>
                <span className="t-mono t-muted">Вариант {i + 1}</span>
                <p className="t-h1">{h}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section surface="dark" index="A2" label="Цвет" labelledBy="color-title">
          <h2 id="color-title" className="t-h2">
            Графит, бумага и один сигнальный цвет
          </h2>
          <p className={`t-body-l t-muted t-measure ${styles.intro}`}>
            Салатовый — не украшение, а сигнал: фокус, активное состояние, одна метка на экран. На светлом
            фоне он не используется для текста — для этого есть тёмно-зелёный.
          </p>
          <ul className={styles.swatches} role="list">
            {colors.map((c) => (
              <li key={c.token} className={styles.swatch}>
                <span className={styles.chip} style={{ backgroundColor: c.hex }} />
                <span className="t-mono">{c.hex}</span>
                <span className="t-mono t-muted">{c.token}</span>
                <span className="t-small">{c.role}</span>
                <span className="t-mono t-muted">{c.contrast}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section surface="light" index="A3" label="Типографика" labelledBy="type-title">
          <h2 id="type-title" className="t-h2">
            Geologica и JetBrains Mono
          </h2>
          <p className={`t-body-l t-muted t-measure ${styles.intro}`}>
            Гротеск с осью «остроты» отвечает за уверенность: крупные заголовки получают острые срезы, текст
            остаётся мягким. Моноширинный шрифт — голос чертежа: номера, подписи, характеристики.
          </p>
          <div className={styles.scale}>
            {typeScale.map((t) => (
              <div key={t.name} className={styles.scaleRow}>
                <div className={styles.scaleMeta}>
                  <span className="t-mono">{t.name}</span>
                  <span className="t-mono t-muted">{t.size} px</span>
                </div>
                <p className={`${t.cls} ${t.cls === 't-body' ? 't-measure' : ''}`}>{t.sample}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section surface="dark" index="A4" label="Отступы и сетка" labelledBy="space-title">
          <h2 id="space-title" className="t-h2">
            Шаг 4px и сетка 4 / 8 / 12
          </h2>
          <p className={`t-body-l t-muted t-measure ${styles.intro}`}>
            Нажмите «Разметка» в шапке (или клавишу G), чтобы увидеть колонки поверх страницы.
          </p>
          <ul className={styles.spacing} role="list">
            {spacing.map(([token, px]) => (
              <li key={token} className={styles.space}>
                <span className="t-mono t-muted">{token}</span>
                <span className={styles.spaceBar} style={{ width: `var(${token})` }} />
                <span className="t-mono">{px}</span>
              </li>
            ))}
          </ul>
          <div className={styles.gridDemo}>
            <Grid className={styles.gridRow}>
              <Col span={{ sm: 4, md: 8, lg: 12 }} className={styles.cell}>
                12
              </Col>
            </Grid>
            <Grid className={styles.gridRow}>
              <Col span={{ sm: 4, md: 5, lg: 8 }} className={styles.cell}>
                8
              </Col>
              <Col span={{ sm: 4, md: 3, lg: 4 }} className={styles.cell}>
                4
              </Col>
            </Grid>
            <Grid className={styles.gridRow}>
              <Col span={{ sm: 4, md: 4, lg: 5 }} start={{ lg: 2 }} className={styles.cell}>
                5 со сдвигом
              </Col>
              <Col span={{ sm: 4, md: 4, lg: 5 }} start={{ lg: 8 }} className={styles.cell}>
                5
              </Col>
            </Grid>
          </div>
        </Section>

        <Section id="components" surface="light" index="A5" label="Компоненты" labelledBy="components-title">
          <h2 id="components-title" className="t-h2">
            Кнопки, ссылки, метки, штамп
          </h2>
          <Grid className={styles.components}>
            <Col span={{ sm: 4, md: 8, lg: 6 }} className={styles.demo}>
              <p className="t-mono t-muted">Кнопки на светлом</p>
              <div className={styles.actions}>
                <Button>Смотреть работы</Button>
                <Button variant="secondary">Обсудить проект</Button>
              </div>
              <div className={styles.actions}>
                <Button variant="secondary" icon="copy">
                  Скопировать почту
                </Button>
                <Button disabled>Недоступно</Button>
              </div>
            </Col>
            <Col span={{ sm: 4, md: 8, lg: 6 }} className={styles.demo} data-surface="dark">
              <p className="t-mono t-muted">Кнопки на тёмном</p>
              <div className={styles.actions}>
                <Button>Смотреть работы</Button>
                <Button variant="secondary">Обсудить проект</Button>
              </div>
              <div className={styles.inlineRow}>
                <TextLink href="#components">Внутренняя ссылка</TextLink>
                <TextLink href="https://github.com/tsum323" external>
                  Внешняя ссылка
                </TextLink>
              </div>
            </Col>
            <Col span={{ sm: 4, md: 4, lg: 6 }} className={styles.demo}>
              <p className="t-mono t-muted">Ссылки, метки, подписи</p>
              <div className={styles.inlineRow}>
                <TextLink href="#components">Все проекты</TextLink>
                <TextLink href="https://github.com/tsum323" external>
                  Открыть сайт
                </TextLink>
              </div>
              <div className={styles.inlineRow}>
                <Tag>HTML</Tag>
                <Tag>CSS</Tag>
                <Tag>JavaScript</Tag>
                <Tag>Адаптив</Tag>
              </div>
              <SectionLabel index="03">Процесс</SectionLabel>
              <Rule start="0" end="1600 px" />
            </Col>
            <Col span={{ sm: 4, md: 4, lg: 6 }} className={styles.demo}>
              <p className="t-mono t-muted">Штамп проекта (пример на реальных данных)</p>
              <Stamp
                title="Brass Barbershop"
                rows={[
                  { term: 'Тип', value: 'Шаблон сайта барбершопа' },
                  { term: 'Объём', value: '6 страниц + 404' },
                  { term: 'Стек', value: 'HTML, CSS, JavaScript' },
                  { term: 'Статус', value: 'Демо-шаблон' },
                ]}
              />
            </Col>
          </Grid>
        </Section>

        <Section surface="dark" index="A6" label="Движение" labelledBy="motion-title">
          <h2 id="motion-title" className="t-h2">
            Три характера движения
          </h2>
          <p className={`t-body-l t-muted t-measure ${styles.intro}`}>
            Длительности: 140 мс — отклик, 240 мс — состояния, 560 мс — переходы, 900 мс — появление. При
            включённой настройке «Уменьшить движение» все они становятся мгновенными.
          </p>
          <div className={styles.motion} data-played={played}>
            {motion.map((m) => (
              <div key={m.token} className={styles.track}>
                <div className={styles.trackMeta}>
                  <span className="t-mono">{m.name}</span>
                  <span className="t-mono t-muted">{m.note}</span>
                </div>
                <div className={styles.lane}>
                  <span className={styles.dot} style={{ transitionTimingFunction: `var(${m.token})` }} />
                </div>
              </div>
            ))}
          </div>
          <div className={styles.actions}>
            <Button variant="secondary" icon="arrow-right" onClick={() => setPlayed((p) => !p)}>
              {played ? 'Вернуть' : 'Воспроизвести'}
            </Button>
          </div>
        </Section>
      </div>
    </>
  );
}
