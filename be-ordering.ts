import {BeOrderingActions, BeOrderingProps, BeOrderingVirtualProps} from './types';
import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {hookUp} from 'be-observant/hookUp.js';

export class BeOrdering implements BeOrderingActions{
    #ref: WeakRef<Element> | undefined;
    async onList({list, proxy}: this){
        const {element} = await hookUp(list, proxy, 'listVal');
        if(element != undefined){
            this.#ref = new WeakRef(element);
        }
    }
    beOrdered({listVal, initialOrder, sortOn, list}: this): void {
        const element = this.#ref?.deref();
        const propName = list.onSet || list.vft;
        if(element === undefined || propName === undefined) return;
        listVal.sort((a, b) => {
            let aVal = a[sortOn];
            let bVal = b[sortOn];
            if (aVal < bVal) {
                return -1;
            } else if (aVal > bVal) {
                return 1;
            } else {
                return 0;
            }
        });
        (<any>element)[propName] = [...listVal]; 
    }
}

export interface BeOrdering extends BeOrderingProps{}

const tagName = 'be-ordering';

const ifWantsToBe = 'ordering';

const upgrade = '*';

define<BeOrderingProps & BeDecoratedProps<BeOrderingProps, BeOrderingActions>, BeOrderingActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: ['initialOrder', 'sortOn', 'toggleEvent', 'list', 'listVal'],
            actions:{
                onList: 'list'
            },
            proxyPropDefaults:{
                toggleEvent: 'click',
                initialOrder: 'asc',
            }
        }
    },
    complexPropDefaults:{
        controller: BeOrdering
    }
});
register(ifWantsToBe, upgrade, tagName);

