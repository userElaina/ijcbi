import cv2

in_path = '26-b.png'
out_path = '26-br.png'

c1 = (32, 32, 32)
c2 = (0, 56, 189)

c_sum = (c1[0] + c2[0], c1[1] + c2[1], c1[2] + c2[2])

def recolor_1pixel(pixel):
    return (c_sum[0] - pixel[0], c_sum[1] - pixel[1], c_sum[2] - pixel[2])

in_img = cv2.imread(in_path)
out_img = in_img.copy()
for i in range(in_img.shape[0]):
    for j in range(in_img.shape[1]):
        out_img[i, j] = recolor_1pixel(in_img[i, j])

cv2.imwrite(out_path, out_img)
