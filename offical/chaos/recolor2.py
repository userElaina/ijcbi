import cv2

in_path = 'ijcbi-w.png'
out_path = 'ijcbi-b.png'

c0 = (204, 143, 58)
c1 = (255, 255, 255)
c2 = (92, 95, 81)

# y = (x - c0) / (c1 - c0) * (c2 - c0) + c0

c_rate = (
    (c2[0] - c0[0]) / (c1[0] - c0[0]),
    (c2[1] - c0[1]) / (c1[1] - c0[1]),
    (c2[2] - c0[2]) / (c1[2] - c0[2])
)

def recolor_1pixel(pixel):
    return (
        min(max(int((pixel[0] - c0[0]) * c_rate[0] + c0[0] + 0.5), 0), 255),
        min(max(int((pixel[1] - c0[1]) * c_rate[1] + c0[1] + 0.5), 0), 255),
        min(max(int((pixel[2] - c0[2]) * c_rate[2] + c0[2] + 0.5), 0), 255),
    )

in_img = cv2.imread(in_path)
out_img = in_img.copy()
for i in range(in_img.shape[0]):
    for j in range(in_img.shape[1]):
        out_img[i, j] = recolor_1pixel(in_img[i, j])

cv2.imwrite(out_path, out_img)
