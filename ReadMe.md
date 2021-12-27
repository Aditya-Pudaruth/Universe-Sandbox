Project: A moving blob with a galazy texture in the middle of a warped space 
Contains a dmatrix of fixed stars and moving stars that goes right into the blob
!Important-Controls: zoom in and out, pan control

Implementation:
-Used Icocahedron primitive for the blob. Mapped the texture of a galaxy on it (Would just be a sphere without the blob animation code)
-Used texture mapping to map the star texture into a sphere (used sphere as square was not working, as described in piazza)
-Used transparency to make stars look more realistic
-Used transformation for both movement of big sphere and blob
-Used transformation to move stars towards the blob in the middle (challanging part)
-Made the radius of each vertices of the icocahedron morph in real time (line 152, the biggest challenge)
-used both ambient and directional lights to light up the scene
-used frame by frame animation to animate both moving stars and blob
-used Simplex Noise library for the random change in the radius of blob's vertices

Difficulties : both blob animation and stars movement. Trial and error on the numbers and deep search in Three.js library solved it

reflection mapping tutorial: https://www.youtube.com/watch?v=aJun0Q0CG_A
warp effect: https://www.youtube.com/watch?v=Bed1z7f1EI4

Posting: I don't know if this is good enough to post yet