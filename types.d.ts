import {IObserve} from 'be-observant/types';
export interface BeOrderingVirtualProps{
    list: IObserve;
    sortOn: string;
    toggleEvent: string;
    initialOrder: string;
    listVal: any[];
}

export interface BeOrderingProps extends BeOrderingVirtualProps{
    proxy: Element & BeOrderingVirtualProps;
}

export interface BeOrderingActions{
    onList(self: this): void;
    beOrdered(self: this): void;
}