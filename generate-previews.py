#!/usr/bin/env python3
import os
from PIL import Image
import argparse
from pathlib import Path

def create_preview(input_path, output_path, max_size=(800, 800), quality=85):
    """
    Create a preview image from the input image.
    
    Args:
        input_path (str): Path to the input image
        output_path (str): Path to save the preview image
        max_size (tuple): Maximum width and height of the preview
        quality (int): JPEG quality (1-100)
    """
    try:
        # Open the image
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'P'):
                img = img.convert('RGB')
            
            # Calculate new dimensions while maintaining aspect ratio
            ratio = min(max_size[0] / img.width, max_size[1] / img.height)
            new_size = (int(img.width * ratio), int(img.height * ratio))
            
            # Resize the image
            preview = img.resize(new_size, Image.Resampling.LANCZOS)
            
            # Create output directory if it doesn't exist
            os.makedirs(os.path.dirname(output_path), exist_ok=True)
            
            # Save the preview
            preview.save(output_path, 'JPEG', quality=quality, optimize=True)
            print(f"Created preview: {output_path}")
            
    except Exception as e:
        print(f"Error processing {input_path}: {str(e)}")

def process_directory(input_dir, output_dir, extensions=('.jpg', '.jpeg', '.png')):
    """
    Process all images in a directory and create previews.
    
    Args:
        input_dir (str): Input directory containing original images
        output_dir (str): Output directory for preview images
        extensions (tuple): File extensions to process
    """
    # Create output directory if it doesn't exist
    os.makedirs(output_dir, exist_ok=True)
    
    # Process each file in the input directory
    for root, _, files in os.walk(input_dir):
        for file in files:
            if file.lower().endswith(extensions):
                input_path = os.path.join(root, file)
                # Create relative path structure in output directory
                rel_path = os.path.relpath(input_path, input_dir)
                output_path = os.path.join(output_dir, rel_path)
                
                # Create preview
                create_preview(input_path, output_path)

def main():
    parser = argparse.ArgumentParser(description='Generate image previews for website')
    parser.add_argument('input_dir', help='Input directory containing original images')
    parser.add_argument('output_dir', help='Output directory for preview images')
    parser.add_argument('--max-size', type=int, nargs=2, default=[800, 800],
                      help='Maximum width and height of preview images')
    parser.add_argument('--quality', type=int, default=85,
                      help='JPEG quality (1-100)')
    
    args = parser.parse_args()
    
    print(f"Processing images from {args.input_dir}")
    print(f"Generating previews in {args.output_dir}")
    print(f"Max size: {args.max_size[0]}x{args.max_size[1]}")
    print(f"Quality: {args.quality}")
    
    process_directory(args.input_dir, args.output_dir)

if __name__ == '__main__':
    main() 