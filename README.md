# be-ordering [TODO]

be-ordering is a web component decorator / custom attribute / behavior / directive that allows buttons (typically) to sort a list property of another element (typically).

```html
<my-list-view-model></my-list-view-model>
...
<form be-ordering='{
    "list":{
        "observe": "xtal-vlist",
        "onSet": "list",
        "valFromTarget": "list"
    },
    "ascTransform": {
        "button .dir": ["⬆️"]
    },
    "descTransform": {
        "button .dir": ["⬇️"]
    },
    "eventFilter": {
        "targetMatches": ".sorter"
    }
}'>
    <button class=sorter name=first_name be-ordering='{
        "listProp": "first_name",
    }'>Sort Column A<span class=dir></span></button>
</form>
```

TODO:  Allow sorting on DOM elements.
