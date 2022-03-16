# be-ordering

be-orderinig is a web component decorator / custom attribute / behavior / directive that allows a button (typically) to sort a list property of another element (typically).

```html
<my-list-view-model></my-list-view-model>
...
<button be-ordering='{
    "observe": "my-list-view-model",
    "
    "onSet": "list",
    "on
}'>Sort Column A</button>
```