import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from 'be-observant/hookUp.js';
export class BeOrdering {
    #ignoreNextUpdate = false;
    async onList({ list, proxy }) {
        const { element } = await hookUp(list, proxy, 'listVal');
        if (element != undefined) {
            proxy.observedElement = new WeakRef(element);
        }
    }
    beOrdered({ listVal, initialOrder, sortOn, list, observedElement }) {
        if (this.#ignoreNextUpdate) {
            this.#ignoreNextUpdate = false;
            return;
        }
        const element = observedElement.deref();
        const propName = list.onSet || list.vft;
        if (element === undefined || propName === undefined)
            return;
        listVal.sort((a, b) => {
            let aVal = a[sortOn];
            let bVal = b[sortOn];
            if (aVal < bVal) {
                return -1;
            }
            else if (aVal > bVal) {
                return 1;
            }
            else {
                return 0;
            }
        });
        this.#ignoreNextUpdate = true;
        element[propName] = [...listVal];
    }
}
const tagName = 'be-ordering';
const ifWantsToBe = 'ordering';
const upgrade = '*';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['initialOrder', 'sortOn', 'toggleEvent', 'list', 'listVal', 'observedElement'],
            actions: {
                onList: 'list',
                beOrdered: {
                    ifAllOf: ['listVal', 'initialOrder', 'sortOn', 'observedElement'],
                }
            },
            proxyPropDefaults: {
                toggleEvent: 'click',
                initialOrder: 'asc',
            }
        }
    },
    complexPropDefaults: {
        controller: BeOrdering
    }
});
register(ifWantsToBe, upgrade, tagName);
