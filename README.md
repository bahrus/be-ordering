# be-ordering

be-ordering is a web component decorator / custom attribute / behavior / directive that allows a button (typically) to sort a list property of another element (typically).

```html
<my-list-view-model></my-list-view-model>
...
    <button be-ordering='{
        "list": {
            "observe": "xtal-vlist",
            "onSet": "list",
            "vft": "list"
        },
        "listProp": "first_name",
        "ascTransform": {
            ".dir": ["⬆️"]
        },
        "descTransform": {
            ".dir": ["⬇️"]
        }
    }'>Sort Column A<span class=dir></span></button>
```

TODO:  Allow sorting on DOM elements.
