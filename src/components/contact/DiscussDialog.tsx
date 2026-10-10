import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useLocation } from 'react-router';
import { Icon } from '../ui/Icon';
import { ContactOptions } from './ContactOptions';
import styles from './DiscussDialog.module.css';

const DiscussContext = createContext<(() => void) | null>(null);

/**
 * Окно «Обсудить проект». Кнопки-ссылки ведут на блок «Контакт» (/#contact) —
 * так они работают и без JavaScript. С JavaScript клик открывает окно с вариантами связи.
 */
export function DiscussProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);

  return (
    <DiscussContext.Provider value={show}>
      {children}
      <DiscussDialog open={open} onClose={() => setOpen(false)} />
    </DiscussContext.Provider>
  );
}

/**
 * Свойства для ссылки «Обсудить проект»: адрес-запасной вариант и обработчик,
 * открывающий окно. Клик с Cmd/Ctrl (новая вкладка) работает как обычная ссылка.
 */
export function useDiscuss(onBeforeOpen?: () => void) {
  const show = useContext(DiscussContext);
  return useMemo(
    () => ({
      to: '/#contact',
      'data-discuss': '',
      onClick: (event: MouseEvent<HTMLAnchorElement>) => {
        if (!show || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        onBeforeOpen?.();
        show();
      },
    }),
    [show, onBeforeOpen],
  );
}

function DiscussDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { pathname } = useLocation();

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  // Переход на другую страницу (например, к анкете) закрывает окно.
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <dialog
      ref={ref}
      className={styles.dialog}
      data-surface="dark"
      aria-labelledby="discuss-title"
      onClose={onClose}
      // Клик по затемнённому фону вокруг окна закрывает его.
      onClick={(event) => {
        if (event.target === ref.current) onClose();
      }}
    >
      <div className={styles.panel}>
        <div className={styles.top}>
          <p className="t-mono t-muted">Обсудить проект</p>
          <button type="button" className={`${styles.close} t-mono`} onClick={onClose}>
            Закрыть
            <Icon name="close" size={20} />
          </button>
        </div>
        <h2 id="discuss-title" className={`t-h2 ${styles.title}`}>
          Как удобнее начать?
        </h2>
        <p className={`t-body ${styles.lead}`}>
          Напишите напрямую или ответьте на&nbsp;несколько вопросов&nbsp;— так я&nbsp;быстрее пойму задачу.
        </p>
        <ContactOptions onChoose={onClose} />
      </div>
    </dialog>
  );
}
