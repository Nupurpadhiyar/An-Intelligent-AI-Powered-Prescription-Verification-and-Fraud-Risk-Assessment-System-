from PIL import Image, ImageEnhance, ImageFilter
import os

img_path = r"C:\Users\Archi Thakkar\.gemini\antigravity-ide\brain\82ffcbb4-4938-4b83-a01c-ed18e0a846ff\.user_uploaded\media_1792703054590.png"
img = Image.open(img_path)

# 1. Grayscale
gray = img.convert('L')

# 2. Increase contrast
enhancer = ImageEnhance.Contrast(gray)
high_contrast = enhancer.enhance(2.0)

# 3. Sharpen
sharp = high_contrast.filter(ImageFilter.SHARPEN)

# Save preprocessed
out_path = r"C:\Users\Archi Thakkar\.gemini\antigravity-ide\scratch\An-Intelligent-AI-Powered-Prescription-Verification-and-Fraud-Risk-Assessment-System-\preprocessed_user.png"
sharp.save(out_path)

# Also test adaptive thresholding
import numpy as np
arr = np.array(gray)
# Otsu or simple threshold
thresh = np.mean(arr) - 20
binary = (arr > thresh) * 255
Image.fromarray(binary.astype('uint8')).save(r"C:\Users\Archi Thakkar\.gemini\antigravity-ide\scratch\An-Intelligent-AI-Powered-Prescription-Verification-and-Fraud-Risk-Assessment-System-\preprocessed_bin.png")

print("Preprocessed images saved successfully!")
