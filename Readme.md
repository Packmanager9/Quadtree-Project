Project data structure implemented: A quadtree structure.

short explanation of the data structure:
A quad tree is a way to divide a two dimensional plane into quadrants and continue to subdivide the quadrants thusly as a fractal of rectangles. This can be used to sort the plane into buckets of sorts.
these buckets can be used to contain the data across the plane and compare data positions more efficiently by precalculating their positional boxes and therefore enabling the skipping of some checks.

If your project is something I can run, please give instructions on how to do that:
Please download the HTML file named clips.html and the Javascript file named clip.js, then from the same folder, run the HTML file in a browser. This will open a program on the screen where you can interface with an automatic partitioning
this quad tree is also color coded by quadrant of separation. The quad tree splits all inputs into buckets which are then used to draw the partition that contains them, as well as the input. The code uses recursion but is limited
by a single variable called 'quadDepth' which limits the depth of recursion, and is set to 10.
