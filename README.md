# Danny Sheehan's Personal Website

A modern, responsive personal website showcasing my interests in entrepreneurship, cars, golf, and travel.

## Image Preview Generator

The website includes a Python script to generate optimized image previews for better loading performance. To use it:

1. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Run the preview generator:
   ```bash
   python generate-previews.py images/ previews/ --max-size 800 800 --quality 85
   ```

   This will:
   - Process all images in the `images/` directory
   - Create optimized previews in the `previews/` directory
   - Resize images to a maximum of 800x800 pixels
   - Save previews as JPEG with 85% quality
   - Maintain the original directory structure

### Troubleshooting

- If you get a "directory does not exist" error, make sure the input directory path is correct
- For best results, use quality values between 70-90
- Supported image formats: JPG, JPEG, PNG
- Make sure you have write permissions in the output directory

## Features

- Responsive design
- Image lazy loading with previews
- Music player
- Email subscription system
- Blog functionality
- Golf course reviews
- Travel experiences
