import re

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_pin = """                              onClick={() => {
                                autoPinProductService.pinProduct({
                                  id: prod.id,
                                  name: prod.productName || `Mã #${prod.id}`,
                                  productName: prod.productName,
                                  price: prod.priceInfo || 'Giá Sốc',
                                  priceInfo: prod.priceInfo,
                                  keywords: prod.keywords,
                                  videoFolder: prod.videoFolder,
                                  videoFileName: prod.videoFileName,
                                  videoFile: prod.videoFile,
                                  badge: 'HOT DEAL 🔥'
                                }, 'manual_workspace');
                                toast.success(`📌 Đã ghim sản phẩm "${prod.productName || `Mã #${prod.id}`}" lên màn hình Live!`);
                              }}"""

new_pin = """                              onClick={() => {
                                autoPinProductService.pinProduct({
                                  id: prod.id,
                                  name: prod.productName || `Mã #${prod.id}`,
                                  productName: prod.productName,
                                  price: prod.priceInfo || 'Giá Sốc',
                                  priceInfo: prod.priceInfo,
                                  oldPrice: prod.oldPrice || '',
                                  buyUrl: prod.buyUrl || '',
                                  imageUrl: prod.imageUrl || '',
                                  keywords: prod.keywords,
                                  videoFolder: prod.videoFolder,
                                  videoFileName: prod.videoFileName,
                                  videoFile: prod.videoFile,
                                  badge: 'HOT DEAL 🔥'
                                }, 'manual_workspace');
                                toast.success(`📌 Đã ghim sản phẩm "${prod.productName || `Mã #${prod.id}`}" lên màn hình Live!`);
                              }}"""

content = content.replace(old_pin, new_pin)

with open('src/components/genaidol/WorkspaceTacVu.jsx', 'w', encoding='utf-8') as f:
    f.write(content)
