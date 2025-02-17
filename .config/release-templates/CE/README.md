WebExcel is an open source JavaScript/HTML5 data grid component with spreadsheet look & feel. It easily integrates with any data source and comes with a variety of useful features like data binding, validation, sorting or powerful context menu.

WebExcel is a fork of [Handsontable](https://handsontable.com/) 6

---

<br/>

## Table of contents

1. [Installation](#installation)
2. [Basic usage](#basic-usage)
4. [Features](#features)
6. [Resources](#resources)
11. [License](#license)

<br/>

### Installation
TODO

<br/>

### Basic usage
Create an empty `<div>` element that will be turned into a spreadsheet:

```html
<div id="example"></div>
```
In the next step, pass a reference to that `<div>` element into the WebExcel constructor and fill the instance with sample data:
```javascript
const data = [
  ["", "Tesla", "Volvo", "Toyota", "Honda"],
  ["2017", 10, 11, 12, 13],
  ["2018", 20, 11, 14, 13],
  ["2019", 30, 15, 12, 13]
];

const container = document.getElementById('example');
const hot = new Handsontable(container, {
  data: data,
  rowHeaders: true,
  colHeaders: true
});
```

<br/>

### Features

**Some of the most popular features include:**

- Sorting data
- Data validation
- Conditional formatting
- Freezing rows/columns
- Merging cells
- Defining custom cell types
- Moving rows/columns
- Resizing rows/columns
- Context menu
- Adding comments to cells
- Dragging fill handle to populate data
- Internationalization
- Non-contiguous selection

<br/>

### Resources
TODO:
- API Reference
- Compatibility
- Change log

<br/>

### License
WebExcel is licensed under the MIT license available in the "/licenses/CE/LICENSE.txt" file in the main project repository.
