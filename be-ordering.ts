import {BeOrderingActions, BeOrderingProps, BeOrderingVirtualProps} from './types';
import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import { RenderContext } from 'trans-render/lib/types';

export class BeOrdering implements BeOrderingActions{
    #ignoreNextUpdate = false;
    async onList({list, proxy}: this){
        const {hookUp} = await import('be-observant/hookUp.js');
        const {element} = await hookUp(list, proxy, 'listVal');
        if(element != undefined){
            proxy.observedElement = new WeakRef(element);
        }
    }
    beOrdered({listVal, direction, listProp, list, observedElement}: this): void {
        console.log('beOrdered');
        if(this.#ignoreNextUpdate){
            this.#ignoreNextUpdate = false;
            return;
        }
        const element = observedElement.deref();
        const propName = list.onSet || list.vft;
        if(element === undefined || propName === undefined) return;
        listVal.sort((a, b) => {
            const multiplier = direction === 'asc' ? 1 : -1;
            let aVal = a[listProp];
            let bVal = b[listProp];
            if (aVal < bVal) {
                return -1 * multiplier;
            } else if (aVal > bVal) {
                return 1 * multiplier;
            } else {
                return 0;
            }
        });
        this.#ignoreNextUpdate = true;
        (<any>element)[propName] = [...listVal]; 
    }
    onToggleEvent({proxy, toggleEvent, ascTransform, descTransform, eventFilter}: this){
        proxy.addEventListener(toggleEvent, async (e) => {
            const target = e.target as HTMLButtonElement;
            if(!target.matches(eventFilter.targetMatches)) return;
            proxy.direction = proxy.direction === 'asc' ? 'desc' : 'asc';
            proxy.listProp = target.name;
            if(ascTransform || descTransform){
                const {DTR} = await import('trans-render/lib/DTR.js');
                const ctx: RenderContext = {
                    host: proxy as any as HTMLElement,

                };
                switch(proxy.direction){
                    case 'asc':
                        if(ascTransform !== undefined){
                            ctx.match = ascTransform;
                            DTR.transform(target, ctx);
                        }
                        break;
                    case 'desc':
                        if(descTransform !== undefined){
                            ctx.match = descTransform;
                            DTR.transform(target, ctx);
                        }
                        break;
                }
            }
        });
    }
}

export interface BeOrdering extends BeOrderingProps{}

const tagName = 'be-ordering';

const ifWantsToBe = 'ordering';

const upgrade = 'form';

define<BeOrderingProps & BeDecoratedProps<BeOrderingProps, BeOrderingActions>, BeOrderingActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: ['direction', 'listProp', 'toggleEvent', 'list', 'listVal', 'observedElement', 'ascTransform', 'descTransform', 'eventFilter'],
            actions:{
                onList: 'list',
                beOrdered: {
                    ifAllOf: ['listVal', 'direction', 'listProp', 'observedElement'],
                },
                onToggleEvent: 'toggleEvent',
            },
            proxyPropDefaults:{
                toggleEvent: 'click',
                eventFilter: {
                    "targetMatches": ".sorter"
                }
            }
        }
    },
    complexPropDefaults:{
        controller: BeOrdering
    }
});
register(ifWantsToBe, upgrade, tagName);

