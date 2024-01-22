## Draw and guess

### Description

This project is intend to learn Machine Learning. You can follow <ins>__[@Radu](https://www.youtube.com/playlist?list=PLB0Tybl0UNfYe9aJXfWw-Dw_4VnFrqRC4)__</ins> on youtube and code step by step.

### Knowledge Required

- HTML, CSS and Vanilla JS
- JavaScript Canvas API
- Basic NodeJS API
- Vector 2D Math

### TODO

- [x] Instead of redrawing everything on the canvas when emphasis a sample,
use a transparency canvas to only redraw the sample.

- [x] Best K value

- [x] Using an overlay canvas to optimise performance when hovering and drawing

- [ ] Long list rendering perf

- [x] Calculate the sample's width and height in a more reasonable way. 
  - using something called **Convex Hull**
  - the bound is called **Minimum Bounding box**
  - the algorithm is __Graham Scan Algorithm__

- [x] Calculate a probability for the classification to be correct, based on the 
number of neighbors of the predicted class.


### Tips
- JS files in `node` folder need to be run in the same directory, not the root
