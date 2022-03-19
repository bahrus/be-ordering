import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
export class BeOrdering {
    #ignoreNextUpdate = false;
    #previousSortElements = {};
    async onList({ list, proxy }) {
        const { hookUp } = await import('be-observant/hookUp.js');
        const { element } = await hookUp(list, proxy, 'listVal');
        if (element != undefined) {
            proxy.observedElement = new WeakRef(element);
        }
    }
    beOrdered({ listVal, direction, listProp, list, observedElement }) {
        console.log('beOrdered');
        if (this.#ignoreNextUpdate) {
            this.#ignoreNextUpdate = false;
            return;
        }
        const element = observedElement.deref();
        const propName = list.onSet || list.vft;
        if (element === undefined || propName === undefined)
            return;
        listVal.sort((a, b) => {
            const multiplier = direction === 'asc' ? 1 : -1;
            let aVal = a[listProp];
            let bVal = b[listProp];
            if (aVal < bVal) {
                return -1 * multiplier;
            }
            else if (aVal > bVal) {
                return 1 * multiplier;
            }
            else {
                return 0;
            }
        });
        this.#ignoreNextUpdate = true;
        element[propName] = [...listVal];
    }
    onToggleEvent({ proxy, toggleEvent, ascTransform, descTransform, eventFilter, neutralTransform }) {
        proxy.addEventListener(toggleEvent, async (e) => {
            const target = e.target;
            if (!target.matches(eventFilter.targetMatches))
                return;
            proxy.direction = proxy.direction === 'asc' ? 'desc' : 'asc';
            proxy.listProp = target.name;
            if (ascTransform || descTransform || neutralTransform) {
                const { DTR } = await import('trans-render/lib/DTR.js');
                const ctx = {
                    host: proxy,
                };
                if (neutralTransform !== undefined) {
                    ctx.match = neutralTransform;
                    for (const key in this.#previousSortElements) {
                        const previousElement = this.#previousSortElements[key].deref();
                        if (previousElement !== undefined) {
                            DTR.transform(previousElement, ctx);
                        }
                    }
                    this.#previousSortElements = {};
                }
                switch (proxy.direction) {
                    case 'asc':
                        if (ascTransform !== undefined) {
                            ctx.match = ascTransform;
                            DTR.transform(target, ctx);
                        }
                        break;
                    case 'desc':
                        if (descTransform !== undefined) {
                            ctx.match = descTransform;
                            DTR.transform(target, ctx);
                        }
                        break;
                }
                this.#previousSortElements[target.name] = new WeakRef(target);
            }
        });
    }
}
const tagName = 'be-ordering';
const ifWantsToBe = 'ordering';
const upgrade = 'form';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['direction', 'listProp', 'toggleEvent', 'list', 'listVal', 'observedElement', 'ascTransform', 'descTransform', 'eventFilter', 'neutralTransform'],
            actions: {
                onList: 'list',
                beOrdered: {
                    ifAllOf: ['listVal', 'direction', 'listProp', 'observedElement'],
                },
                onToggleEvent: 'toggleEvent',
            },
            proxyPropDefaults: {
                toggleEvent: 'click',
                eventFilter: {
                    "targetMatches": ".sorter"
                }
            }
        }
    },
    complexPropDefaults: {
        controller: BeOrdering
    }
});
register(ifWantsToBe, upgrade, tagName);
