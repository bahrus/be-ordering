# be-ordering

be-ordering is a web component decorator / custom attribute / behavior / directive that allows a button (typically) to sort a list property of another element (typically).

```html
<my-list-view-model></my-list-view-model>
...
<button be-ordering='{
    "list":{
        "observe": "my-list-view-model",
        "onSet": "list"
    },
    "sortOn": "columnA",
    "toggleEvent":"click", //default
    "initialOrder":"desc",
}'>Sort Column A</button>
```
