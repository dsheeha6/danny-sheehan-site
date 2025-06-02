from PIL import Image, ImageDraw, ImageFont
import os

def create_favicon():
    # Create a new image with a white background
    size = (32, 32)
    image = Image.new('RGB', size, 'white')
    draw = ImageDraw.Draw(image)
    
    # Try to use a system font, fall back to default if not available
    try:
        font = ImageFont.truetype("Arial", 16)  # Reduced font size for better fit
    except:
        font = ImageFont.load_default()
    
    # Draw the text "[DS]" in black
    text = "[DS]"
    text_bbox = draw.textbbox((0, 0), text, font=font)
    text_width = text_bbox[2] - text_bbox[0]
    text_height = text_bbox[3] - text_bbox[1]
    
    # Center the text
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2
    
    # Draw text with a slight offset for better visibility
    draw.text((x, y), text, fill='black', font=font)
    
    # Save as ICO file with multiple sizes
    image.save('favicon.ico', format='ICO', sizes=[(16, 16), (32, 32)])
    print("Favicon created successfully!")

if __name__ == "__main__":
    create_favicon() 