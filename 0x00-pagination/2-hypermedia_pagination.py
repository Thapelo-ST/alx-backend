#!/usr/bin/env python3
import csv
from typing import List
"""Server class to paginate a database of popular baby names.
"""


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def index_range(self, page: int, page_size: int) -> tuple:
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

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """gets the page data that in the inserted arguments

        Args:
            page (int, optional): page number. Defaults to 1.
            page_size (int, optional): data size to be prited. Defaults to 10.

        Raises:
            AssertionError: prints an error incases of an invalid argument

        Returns:
            List[List]: data that is needed to print
        """
        if not isinstance(page, int) or page <= 0 or not isinstance(
                page_size, int):
            raise AssertionError

        page_number, data_to_print = self.index_range(page, page_size)

        data_in_page = self.dataset()[page_number:data_to_print]

        return data_in_page

    def get_hyper(self, page: int = 1, page_size: int = 10) -> dict:
        """takes arguments turns them into a dictionary for pages

        Args:
            page (int, optional): page number. Defaults to 1.
            page_size (int, optional): page size as in data of a page. Def 10

        Raises:
            AssertionError: provides error  message when inputs are invalid

        Returns:
            dict: dictionary of the inserted data
        """
        if not isinstance(page, int) or page <= 0 or not isinstance(
                page_size, int):
            raise AssertionError

        data_page = self.get_page(page, page_size)

        total_pages = len(self.dataset()) // page_size + 1
        previous_page = max(1, page - 1) if page > 1 else None
        next_page = page + 1 if page < total_pages else None

        dictionary = {
            "page_size": len(data_page),
            "page": page,
            "data": self.get_page(page, page_size),
            "prev_page": previous_page,
            "next_page": next_page,
            "total_pages": total_pages
        }

        return dictionary
