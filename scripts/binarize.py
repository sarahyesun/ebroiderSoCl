from PIL import Image
import numpy
import sys
from skimage.filters import threshold_mean

def binarize_array(numpy_array, threshold=200):
    """Binarize a numpy array."""
    backgroundNum=numpy.where(numpy_array<threshold)
    foregroundNum=numpy.where(numpy_array>threshold)
    if len(foregroundNum[1])<len(backgroundNum[1]):
        for i in range(len(numpy_array)):
            for j in range(len(numpy_array[0])):
                if numpy_array[i][j] > threshold:
                    numpy_array[i][j] = 255
                else:
                    numpy_array[i][j] = 0
        return numpy_array
    else:
        for i in range(len(numpy_array)):
            for j in range(len(numpy_array[0])):
                if numpy_array[i][j] > threshold:
                    numpy_array[i][j] = 0
                else:
                    numpy_array[i][j] = 255
        return numpy_array

if __name__ == "__main__":
    image_file = Image.open(sys.stdin.buffer)
    image = image_file.convert('L')  # convert image to monochrome
    image = numpy.array(image)
    threshold = threshold_mean(image)
    image = binarize_array(image, threshold)

    Image.fromarray(image).save(sys.stdout.buffer, 'PNG')
