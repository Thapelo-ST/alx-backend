#!/usr/bin/env python3
''' first helper of the project just returns a rutple '''

def index_range(page: int, page_size: int) -> tuple:
    """
    takes page number and multiplies it by page size to get actual
    page number

    Args:
        page (int): number of the page
        page_size (int): size of the data that will be in the page

    Returns:
        tuple: the page number and the data in the page
    """
    start_index = (page - 1) * page_size
    end_index = page * page_size
    return (start_index, end_index)