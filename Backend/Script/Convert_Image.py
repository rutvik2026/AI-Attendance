import bson.binary
import os
import sys

def convert_image_to_binary(image_path):
    # Check if file exists
    if not os.path.exists(image_path):
        print("Error: File does not exist.")
        return
    try:
        with open(image_path, "rb") as image_file:
            binary_data = bson.binary.Binary(image_file.read())
            print(binary_data)  # Print the complete binary data
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python Convert_Image.py <image_path>")
    else:
        convert_image_to_binary(sys.argv[1])
