#!/usr/bin/env python3
"""
Deletion-resilient hypermedia pagination
"""
import csv
from typing import List


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None
        self.__indexed_dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def indexed_dataset(self) -> dict[int, List]:
        """Dataset indexed by sorting position, starting at 0
        """
        if self.__indexed_dataset is None:
            dataset = self.dataset()
            truncated_dataset = dataset[:1000]
            self.__indexed_dataset = {
                i: dataset[i] for i in range(len(dataset))
            }
        return self.__indexed_dataset

    def get_hyper_index(self, index: int = None, page_size: int = 10) -> dict:
        """gets index and manages to automate the next page

        Args:
            index (int, optional): index to get. Defaults to None.
            page_size (int, optional): data to print. Defaults to 10.

        Returns:
            dict: data returned
        """
        assert index is None or isinstance(index, int)
        assert page_size > 0

        data_length = len(self.dataset())

        if index is None:
            index = 0
        else:
            assert 0 <= index < data_length

        next_idx = min(index + page_size, data_length)
        data_page = self.dataset()[index:next_idx]

        dictionary = {
            "index": index,
            "data": data_page,
            "page_size": page_size,
            "next_index": next_idx
        }
        return dictionary
