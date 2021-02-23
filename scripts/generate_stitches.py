from io import BytesIO
from PIL import Image
import numpy
import sys
import stitchcode
from skimage.morphology import skeletonize
from skimage.measure import label
from skimage.measure import find_contours
from skimage import img_as_bool

if __name__ == "__main__":
  image_file = Image.open(sys.stdin.buffer)
  image = numpy.array(image_file)

  image=img_as_bool(image)
  image = skeletonize(image)

  labelImage=label(image)
  Contours=find_contours(labelImage,0.5,'high')
  mat=None
  for i in range(len(Contours)):
      if mat is None:
          mat=Contours[i]
      else:
          mat=numpy.vstack((mat,Contours[i]))

  emb = stitchcode.Embroidery()

  for i in range(len(mat)):
      emb.addStitch(stitchcode.Point(mat[i,0],mat[i,1]))

  print(emb.export_svg())
