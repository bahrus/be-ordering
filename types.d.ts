import {IObserve} from 'be-observant/types';
export interface BeOrderingVirtualProps{
    list: IObserve;
    sortOn: string;
    toggleEvent: string;
    direction: string;
    listVal: any[];
    observedElement: WeakRef<Element>;
    ascTransform: any;
    descTransform: any;
}

export interface BeOrderingProps extends BeOrderingVirtualProps{
    proxy: Element & BeOrderingVirtualProps;
}

export interface BeOrderingActions{
    onList(self: this): Promise<void>;
    beOrdered(self: this): void;
    onToggleEvent(self: this): void;
}