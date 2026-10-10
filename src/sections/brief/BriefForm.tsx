import { useEffect, useRef, useState, type FormEvent, type RefObject } from 'react';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { TextLink } from '../../components/ui/TextLink';
import { briefEndpoint, briefQuestions, contactMethods } from '../../content/brief';
import { contacts } from '../../content/site';
import {
  clearDraft,
  contactError,
  emptyAnswer,
  formatBrief,
  initialBrief,
  isAnswered,
  limits,
  loadDraft,
  saveDraft,
  sendBrief,
  type Answer,
  type BriefState,
} from '../../lib/brief';
import styles from './BriefForm.module.css';

const total = briefQuestions.length;
/** Шаги: вопросы 0…total-1, затем контакт и проверка. */
const CONTACT = total;
const REVIEW = total + 1;

type Status = 'idle' | 'sending' | 'error' | 'sent';

const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Анкета по шагам: один вопрос на экране, варианты ответа и поле «своими словами».
 * Ответы сохраняются в браузере посетителя, пока заявка не отправлена.
 */
export function BriefForm() {
  const [state, setState] = useState<BriefState>(initialBrief);
  const [step, setStep] = useState(0);
  // Правка ответа со страницы проверки: после неё возвращаемся к проверке.
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<{ value?: string; consent?: string }>({});
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [copied, setCopied] = useState(false);
  const trap = useRef('');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const valueRef = useRef<HTMLInputElement>(null);
  const consentRef = useRef<HTMLInputElement>(null);
  const restored = useRef(false);
  const moved = useRef(false);

  // Черновик восстанавливаем после «оживления» страницы — готовый HTML всегда начинается с первого шага.
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      // Чтение из хранилища браузера возможно только после «оживления» — отсюда setState в эффекте.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setState(draft.state);
      setStep(Math.min(Math.max(draft.step, 0), REVIEW));
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    if (restored.current && status !== 'sent') saveDraft(state, step);
  }, [state, step, status]);

  // При смене шага фокус переходит на вопрос: экранный диктор прочитает его сразу.
  useEffect(() => {
    if (!moved.current) return;
    const heading = headingRef.current;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({ block: 'start' });
  }, [step, status]);

  const go = (next: number) => {
    moved.current = true;
    setStep(next);
  };

  const setAnswer = (id: string, patch: Partial<Answer>) =>
    setState((s) => ({
      ...s,
      answers: { ...s.answers, [id]: { ...(s.answers[id] ?? emptyAnswer), ...patch } },
    }));

  const setContact = (patch: Partial<BriefState['contact']>) =>
    setState((s) => ({ ...s, contact: { ...s.contact, ...patch } }));

  const text = formatBrief(state);

  const onNext = (event: FormEvent) => {
    event.preventDefault();
    if (step === CONTACT) {
      const next = {
        value: contactError(state.contact.method, state.contact.value),
        consent: consent ? undefined : 'Без согласия я не смогу получить заявку',
      };
      setErrors(next);
      if (next.value) return valueRef.current?.focus();
      if (next.consent) return consentRef.current?.focus();
    }
    if (editing) {
      setEditing(false);
      return go(REVIEW);
    }
    go(step + 1);
  };

  const onBack = () => {
    if (editing) {
      setEditing(false);
      return go(REVIEW);
    }
    go(step - 1);
  };

  const onSend = async () => {
    if (!briefEndpoint) return;
    setStatus('sending');
    try {
      await sendBrief(briefEndpoint, text, trap.current);
      clearDraft();
      moved.current = true;
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const progressLabel =
    step < total ? `Вопрос ${pad(step + 1)} из ${pad(total)}` : step === CONTACT ? 'Контакт' : 'Проверка';

  if (status === 'sent') {
    const method = contactMethods.find((m) => m.id === state.contact.method);
    return (
      <div className={styles.done}>
        <Icon name="check" size={40} className={styles.doneIcon} />
        <h2 ref={headingRef} tabIndex={-1} className="t-h2">
          Спасибо, заявка отправлена
        </h2>
        <p className={`t-body-l ${styles.hint}`}>
          Я изучу ответы и&nbsp;свяжусь с&nbsp;вами: {method?.label}&nbsp;— {state.contact.value.trim()}.
        </p>
        <div className={styles.nav}>
          <Button to="/">На главную</Button>
          <Button to="/#work" variant="secondary" icon={null}>
            Посмотреть работы
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form className={styles.form} onSubmit={onNext} noValidate>
      <div className={styles.progress}>
        <p className="t-mono" aria-live="polite">
          {progressLabel}
        </p>
        <ol role="list" className={styles.bar} aria-hidden="true">
          {Array.from({ length: REVIEW + 1 }, (_, i) => (
            <li key={i} data-state={i < step ? 'done' : i === step ? 'current' : 'todo'} />
          ))}
        </ol>
      </div>

      {step < total && (
        <QuestionStep key={step} index={step} state={state} setAnswer={setAnswer} headingRef={headingRef} />
      )}

      {step === CONTACT && (
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            <h2 ref={headingRef} tabIndex={-1} id="brief-step-title" className="t-h2">
              Как с&nbsp;вами связаться?
            </h2>
          </legend>
          <p className={`t-body-l ${styles.hint}`}>
            Контакт нужен только для ответа на&nbsp;эту заявку. Отвечаю лично.
          </p>

          <div className={styles.fields}>
            <div className={styles.field}>
              <label htmlFor="brief-name" className={styles.label}>
                Как к&nbsp;вам обращаться <span className={styles.optional}>— необязательно</span>
              </label>
              <input
                id="brief-name"
                className={styles.input}
                autoComplete="name"
                maxLength={limits.name}
                value={state.contact.name}
                onChange={(e) => setContact({ name: e.target.value })}
              />
            </div>

            <fieldset className={styles.field}>
              <legend className={styles.label}>Где удобнее получить ответ</legend>
              <div className={styles.chips}>
                {contactMethods.map((m) => (
                  <label key={m.id} className={styles.chip}>
                    <input
                      type="radio"
                      name="brief-method"
                      value={m.id}
                      checked={state.contact.method === m.id}
                      onChange={() => {
                        setContact({ method: m.id });
                        setErrors((e) => ({ ...e, value: undefined }));
                      }}
                    />
                    <span>{m.label}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <ContactValue
              state={state}
              error={errors.value}
              inputRef={valueRef}
              onChange={(value) => {
                setContact({ value });
                if (errors.value) setErrors((e) => ({ ...e, value: undefined }));
              }}
            />

            <div className={styles.field}>
              <label htmlFor="brief-comment" className={styles.label}>
                Что ещё важно знать? <span className={styles.optional}>— необязательно</span>
              </label>
              <textarea
                id="brief-comment"
                className={styles.textarea}
                rows={3}
                maxLength={limits.comment}
                value={state.contact.comment}
                onChange={(e) => setContact({ comment: e.target.value })}
              />
            </div>

            {/* Ловушка для спам-ботов: человек это поле не видит и не заполняет. */}
            <div className={styles.trap} aria-hidden="true">
              <label>
                Сайт
                <input
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  onChange={(e) => (trap.current = e.target.value)}
                />
              </label>
            </div>

            <div className={styles.field}>
              <label className={styles.consent}>
                <input
                  ref={consentRef}
                  type="checkbox"
                  checked={consent}
                  aria-invalid={Boolean(errors.consent)}
                  aria-describedby={errors.consent ? 'brief-consent-error' : undefined}
                  onChange={(e) => {
                    setConsent(e.target.checked);
                    if (e.target.checked) setErrors((er) => ({ ...er, consent: undefined }));
                  }}
                />
                <span className={styles.box} aria-hidden="true">
                  <Icon name="check" size={16} />
                </span>
                <span>
                  Согласен(на) на&nbsp;обработку моих данных для ответа на&nbsp;заявку. Подробнее&nbsp;—
                  в&nbsp;
                  <TextLink href={`${import.meta.env.BASE_URL}privacy/`} external>
                    политике конфиденциальности
                  </TextLink>
                </span>
              </label>
              {errors.consent && (
                <p id="brief-consent-error" className={styles.error}>
                  {errors.consent}
                </p>
              )}
            </div>
          </div>
        </fieldset>
      )}

      {step === REVIEW && (
        <div className={styles.review}>
          <h2 ref={headingRef} tabIndex={-1} id="brief-step-title" className="t-h2">
            Проверьте ответы
          </h2>
          <p className={`t-body-l ${styles.hint}`}>
            {briefEndpoint
              ? 'Если всё верно — отправляйте. Ответ придёт на указанный контакт.'
              : 'Скопируйте ответы и пришлите их любым удобным способом — я отвечу на указанный контакт.'}
          </p>

          <dl className={styles.summary}>
            {briefQuestions.map((q, i) => {
              const a = state.answers[q.id];
              return (
                <div key={q.id} className={styles.summaryRow}>
                  <dt className="t-mono">
                    <span className={styles.summaryIndex}>{pad(i + 1)}</span> {q.short}
                  </dt>
                  <dd>
                    {isAnswered(a) ? (
                      <ul role="list">
                        {a!.choices.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                        {a!.text.trim() && <li className={styles.own}>«{a!.text.trim()}»</li>}
                      </ul>
                    ) : (
                      <span className={styles.skipped}>Пропущено</span>
                    )}
                    <button
                      type="button"
                      className={`t-mono ${styles.edit}`}
                      onClick={() => {
                        setEditing(true);
                        go(i);
                      }}
                    >
                      Изменить<span className="visually-hidden">: {q.short}</span>
                    </button>
                  </dd>
                </div>
              );
            })}
            <div className={styles.summaryRow}>
              <dt className="t-mono">
                <span className={styles.summaryIndex}>→</span> Контакт
              </dt>
              <dd>
                <ul role="list">
                  {state.contact.name.trim() && <li>{state.contact.name.trim()}</li>}
                  <li>
                    {contactMethods.find((m) => m.id === state.contact.method)?.label}:{' '}
                    {state.contact.value.trim()}
                  </li>
                  {state.contact.comment.trim() && (
                    <li className={styles.own}>«{state.contact.comment.trim()}»</li>
                  )}
                </ul>
                <button
                  type="button"
                  className={`t-mono ${styles.edit}`}
                  onClick={() => {
                    setEditing(true);
                    go(CONTACT);
                  }}
                >
                  Изменить<span className="visually-hidden">: контакт</span>
                </button>
              </dd>
            </div>
          </dl>

          {status === 'error' && (
            <p role="alert" className={styles.alert}>
              Не получилось отправить заявку. Попробуйте ещё раз или скопируйте ответы и пришлите их напрямую.
            </p>
          )}

          {!briefEndpoint || status === 'error' ? (
            <CopyFallback text={text} copied={copied} onCopy={onCopy} />
          ) : null}
        </div>
      )}

      <div className={styles.nav}>
        {step > 0 && (
          <Button variant="secondary" icon={null} onClick={onBack} disabled={status === 'sending'}>
            {editing ? 'К проверке' : 'Назад'}
          </Button>
        )}
        {step < REVIEW && (
          <Button type="submit">
            {editing
              ? 'Сохранить'
              : step < total && !isAnswered(state.answers[briefQuestions[step]!.id])
                ? 'Пропустить'
                : 'Далее'}
          </Button>
        )}
        {step === REVIEW && briefEndpoint && (
          <Button onClick={onSend} disabled={status === 'sending'} aria-disabled={status === 'sending'}>
            {status === 'sending' ? 'Отправляю…' : status === 'error' ? 'Отправить ещё раз' : 'Отправить'}
          </Button>
        )}
      </div>
    </form>
  );
}

type QuestionStepProps = {
  index: number;
  state: BriefState;
  setAnswer: (id: string, patch: Partial<Answer>) => void;
  headingRef: RefObject<HTMLHeadingElement | null>;
};

function QuestionStep({ index, state, setAnswer, headingRef }: QuestionStepProps) {
  const q = briefQuestions[index]!;
  const answer = state.answers[q.id] ?? emptyAnswer;
  const many = q.kind === 'many';

  const toggle = (option: string, checked: boolean) => {
    if (!many) return setAnswer(q.id, { choices: [option] });
    const choices = checked ? [...answer.choices, option] : answer.choices.filter((c) => c !== option);
    // Порядок — как в списке вариантов, чтобы сводка читалась ровно.
    setAnswer(q.id, { choices: q.options.filter((o) => choices.includes(o)) });
  };

  return (
    <fieldset className={styles.fieldset} aria-describedby={`hint-${q.id}`}>
      <legend className={styles.legend}>
        <h2 ref={headingRef} tabIndex={-1} id="brief-step-title" className="t-h2">
          {q.title}
        </h2>
      </legend>
      <p id={`hint-${q.id}`} className={`t-body-l ${styles.hint}`}>
        {q.hint}
      </p>

      <p className={`t-mono ${styles.kind}`}>{many ? 'Можно выбрать несколько' : 'Выберите один вариант'}</p>
      <div className={styles.options}>
        {q.options.map((option) => (
          <label key={option} className={styles.option}>
            <input
              type={many ? 'checkbox' : 'radio'}
              name={q.id}
              value={option}
              checked={answer.choices.includes(option)}
              onChange={(e) => toggle(option, e.target.checked)}
            />
            <span className={styles.box} data-kind={q.kind} aria-hidden="true">
              <Icon name="check" size={16} />
            </span>
            <span>{option}</span>
          </label>
        ))}
      </div>

      <div className={styles.field}>
        <label htmlFor={`own-${q.id}`} className={styles.label}>
          {q.own.label}
          {q.options.length > 0 && (
            <span className={styles.optional}> — если ни один вариант не подходит</span>
          )}
        </label>
        <textarea
          id={`own-${q.id}`}
          className={styles.textarea}
          rows={3}
          maxLength={limits.own}
          placeholder={q.own.placeholder}
          value={answer.text}
          onChange={(e) => setAnswer(q.id, { text: e.target.value })}
        />
      </div>
    </fieldset>
  );
}

type ContactValueProps = {
  state: BriefState;
  error?: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
};

function ContactValue({ state, error, inputRef, onChange }: ContactValueProps) {
  const method = contactMethods.find((m) => m.id === state.contact.method) ?? contactMethods[0];
  return (
    <div className={styles.field}>
      <label htmlFor="brief-value" className={styles.label}>
        {method.field}
      </label>
      <input
        ref={inputRef}
        id="brief-value"
        className={styles.input}
        type={method.type}
        inputMode={method.type === 'tel' ? 'tel' : method.type === 'email' ? 'email' : undefined}
        autoComplete={method.type === 'tel' ? 'tel' : method.type === 'email' ? 'email' : 'off'}
        placeholder={method.placeholder}
        maxLength={limits.value}
        required
        aria-invalid={Boolean(error)}
        aria-describedby={error ? 'brief-value-error' : undefined}
        value={state.contact.value}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && (
        <p id="brief-value-error" className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}

/** Запасной путь, пока отправка не подключена или если она не удалась. */
function CopyFallback({ text, copied, onCopy }: { text: string; copied: boolean; onCopy: () => void }) {
  const channels = [
    ...contacts.channels,
    ...(contacts.email ? [{ href: `mailto:${contacts.email}`, label: contacts.email }] : []),
  ];
  return (
    <div className={styles.fallback}>
      <Button variant="secondary" icon={copied ? 'check' : 'copy'} onClick={onCopy}>
        {copied ? 'Ответы скопированы' : 'Скопировать ответы'}
      </Button>
      <p className="visually-hidden" aria-live="polite">
        {copied ? 'Ответы скопированы в буфер обмена' : ''}
      </p>
      {channels.length > 0 ? (
        <p className="t-body">
          Отправить:{' '}
          {channels.map((c, i) => (
            <span key={c.href}>
              {i > 0 && ', '}
              <TextLink href={c.href} external={!c.href.startsWith('mailto:')}>
                {c.label}
              </TextLink>
            </span>
          ))}
        </p>
      ) : (
        <p className={`t-small ${styles.skipped}`}>Прямые контакты появятся здесь совсем скоро.</p>
      )}
      {/* Если буфер обмена недоступен, текст можно выделить и скопировать вручную. */}
      <details className={styles.raw}>
        <summary className="t-mono">Показать текст заявки</summary>
        <pre>{text}</pre>
      </details>
    </div>
  );
}
