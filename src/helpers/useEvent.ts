import { useEffect } from 'react';

type EventListenable = {
  addEventListener: any;
  removeEventListener: any;
};

/**
 * Add event listener to html element or elemnts.
 * Example: useEvent(elements, "scroll", onScroll);
 * options:
 * * capture:  Boolean указывает, что события этого типа будут отправлены зарегистрированному слушателю listener перед отправкой на EventTarget, расположенный ниже в дереве DOM.
 * * once: Boolean указывает, что слушатель должен быть вызван не более одного раза после добавления. Если true, слушатель автоматически удаляется при вызове.
 * * passive:  Boolean указывает, что слушатель никогда не вызовет preventDefault(). Если все же вызов будет произведен, браузер должен игнорировать его и генерировать консольное предупреждение. Пример Улучшение производительности прокрутки с помощью passive true
 * * mozSystemGroup: Boolean указывает, что слушатель должен быть добавлен в системную группу. Доступно только в коде, запущенном в XBL или в расширении Chrome.
 * @param {any} element
 * @param {string} event
 * @param {function} callback function
 * @param {boolean} enabled state
 * @param {object} options {capture: true, once: true, passive: true, mozSystemGroup: true}
 * @returns {function} addEventListener hook
 */

const useEvent = <T extends EventListener>(
  element: EventListenable | EventListenable[] | null,
  event: string | string[],
  callback: T,
  enabled = true,
  options: any = false,
  elementRef?: any,
) => {
  return useEffect(() => {
    if (!enabled || !element) {
      return;
    }

    const cb = callback;
    const el = Array.isArray(element) ? element : [element];
    const ev = Array.isArray(event) ? event : [event];

    el.forEach((e) => {
      ev.forEach((event) => {
        e.addEventListener(event as any, cb, options);
      });
    });

    return () => {
      el.forEach((e) => {
        ev.forEach((event) => {
          e.removeEventListener(event as any, cb, options);
        });
      });
    };
  }, [callback, element, enabled, event, options, elementRef]);
};

export default useEvent;
