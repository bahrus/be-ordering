import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
import { hookUp } from 'be-observant/hookUp.js';
export class BeOrdering {
    #ref;
    async onList({ list, proxy }) {
        const { element } = await hookUp(list, proxy, 'listVal');
        if (element != undefined) {
            this.#ref = new WeakRef(element);
        }
    }
    beOrdered({ listVal, initialOrder, sortOn, list }) {
        const element = this.#ref?.deref();
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
            virtualProps: ['initialOrder', 'sortOn', 'toggleEvent', 'list', 'listVal'],
            actions: {
                onList: 'list'
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
