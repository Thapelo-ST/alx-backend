# Python Pagination

Python Pagination is a simple utility for managing and displaying paginated data in your Python applications. Pagination is commonly used when working with large datasets, allowing users to navigate through data in smaller, more manageable chunks.

## Features

- **Easy Integration:** Quickly integrate pagination into your Python projects with minimal code.
  
- **Customizable:** Adjust the pagination settings such as the number of items per page to suit your application's needs.

- **User-Friendly Navigation:** Provide a seamless experience for users to navigate through pages of data.

## Installation

```bash
pip install python-pagination

## Usage

```python 
from pagination import Paginator

# Your data to be paginated
data = [...]

# Initialize the paginator
paginator = Paginator(data, items_per_page=10)

# Get the current page data
current_page_data = paginator.get_current_page()

# Get total number of pages
total_pages = paginator.get_total_pages()

# Display pagination information
print(f"Page {paginator.get_current_page_number()} of {total_pages}")

# Iterate over the current page data
for item in current_page_data:
    print(item)

